# src/routes/research_chat.py

import json
import threading
import traceback
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse

from src.schemas.research_chat_schema import (
    ResearchChatRequest,
    ResearchSessionCreate,
    ResearchSessionResponse,
    ResearchSessionListResponse,
    ResearchMessageListResponse,
)

from src.services.research_session import ResearchSessionService
from src.services.research_message import ResearchMessageService
from src.services.tool_agent import ToolAgent

from src.config.db import get_db, SessionLocal
from src.routes.user_routes import get_current_user
from src.models.user_model import User

from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

router = APIRouter(prefix="/research", tags=["research"])


def convert_history_for_agent(messages):
    history = []
    for m in messages:
        if m.role == "user":
            history.append(HumanMessage(m.content))
        elif m.role == "assistant":
            history.append(AIMessage(m.content))
        elif m.role == "tool":
            history.append(SystemMessage(f"[Tool Output]\n{m.content}"))
    return history


def _generate_and_save_title(model, session_id: int, user_query: str, ai_output: str):
    """
    Runs on a background thread, off the request/response cycle, so it never
    delays the chat stream. Reuses the already-initialized chat model instead
    of spinning up a new ToolAgent (with tools) just for a short title.
    """
    try:
        prompt = (
            "Summarize the topic of the exchange below as a short title of "
            "3 to 6 words. Respond with the title only — no quotes, no "
            "trailing punctuation, no prefix like 'Title:'.\n\n"
            f"User: {user_query}\nAssistant: {ai_output[:600]}"
        )
        result = model.invoke(prompt)
        title = (getattr(result, "content", "") or "").strip().strip('"').strip("'")
        title = title.splitlines()[0][:80] if title else ""

        if title:
            save_db = SessionLocal()
            try:
                ResearchSessionService.update_title(save_db, session_id, title)
            finally:
                save_db.close()
    except Exception:
        traceback.print_exc()

# Create a research session (sync)
@router.post("/sessions", response_model=ResearchSessionResponse)
def create_research_session(
    payload: ResearchSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    session = ResearchSessionService.create_session(
        db=db,
        user_id=current_user.id,
        title=payload.title,
    )
    return session


# Get all sessions for user
@router.get("/sessions", response_model=ResearchSessionListResponse)
def list_user_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sessions = ResearchSessionService.get_user_sessions(db, current_user.id)
    return {"sessions": sessions}


# Get messages inside a session
@router.get("/sessions/{session_id}/messages", response_model=ResearchMessageListResponse)
def list_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ResearchSessionService.get_session(db, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")

    # `get_messages` also returns role="tool" rows (raw JSON tool-call output,
    # e.g. arXiv search results) — those are saved so the agent has them as
    # context on the next turn, but they were never meant to be shown in the
    # chat UI. Returning them made reloaded conversations render a garbled
    # JSON blob wherever a tool was used.
    messages = ResearchMessageService.get_messages(db, session_id)
    visible_messages = [m for m in messages if m.role in ("user", "assistant")]
    return {"messages": visible_messages}


# Delete session
@router.delete("/sessions/{session_id}", status_code=204)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ResearchSessionService.get_session(db, session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Not found")

    ResearchSessionService.delete_session(db, session_id)
    return None


# MAIN CHAT ENDPOINT (SYNC)
@router.post("/chat")
def research_chat(
    req: ResearchChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = current_user.id

    # Create new session if not provided
    session_id = req.session_id
    if not session_id:
        new_session = ResearchSessionService.create_session(
            db=db, user_id=user_id, title=None
        )
        session_id = new_session.id

    # Check ownership
    session = ResearchSessionService.get_session(db, session_id)
    if not session or session.user_id != user_id:
        raise HTTPException(status_code=404, detail="Session not found")

    # Save user message
    ResearchMessageService.add_message(db, session_id, "user", req.query)

    # Load history for agent
    history_rows = ResearchMessageService.get_messages(db, session_id)
    history_for_agent = convert_history_for_agent(history_rows)

    # Only the very first turn in a session (just the user message we saved
    # above, nothing else yet) should trigger auto-titling.
    is_first_message = len(history_rows) == 1

    agent = ToolAgent()
    if hasattr(agent, "load_history"):
        agent.load_history(history_for_agent)

    # Tool calling step (sync)
    context_result = agent.get_research_context(req.query)

    # Save tool output
    if isinstance(context_result, dict) and context_result.get("tool_result"):
        ResearchMessageService.add_message(
            db, session_id, "tool", json.dumps(context_result["tool_result"])
        )

    # Build final prompt
    agent.chat_history.append(
        HumanMessage(f"Context: {context_result}\nQuestion: {req.query}")
    )
    prompt = agent.chat_template.invoke({"chat_history": agent.chat_history})

    model = agent.chat_model

    # StreamingResponse (sync generator)
    def stream():
        ai_output = ""

        for chunk in model.stream(prompt):
            if chunk.content:
                ai_output += chunk.content
                yield chunk.content

        # NOTE: FastAPI tears down `Depends(get_db)` (i.e. calls db.close())
        # as soon as this endpoint function returns the StreamingResponse
        # object, which happens *before* this generator body ever runs —
        # the request-scoped `db` above is already closed by this point.
        # A fresh session is required to persist the finished reply,
        # otherwise the assistant's answer silently fails to save and the
        # conversation looks incomplete/vanished the next time it loads.
        if ai_output:
            save_db = SessionLocal()
            try:
                ResearchMessageService.add_message(
                    save_db, session_id, "assistant", ai_output
                )
            except Exception:
                traceback.print_exc()
            finally:
                save_db.close()

            # Fire-and-forget: generate a proper title from the first
            # exchange instead of leaving it as the raw first message.
            # Runs on its own thread so it can't add latency to this
            # response — the stream has already fully sent by this point.
            if is_first_message:
                threading.Thread(
                    target=_generate_and_save_title,
                    args=(model, session_id, req.query, ai_output),
                    daemon=True,
                ).start()

    return StreamingResponse(stream(), media_type="text/event-stream")
