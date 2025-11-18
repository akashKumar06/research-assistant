# src/routes/research_chat.py

import json
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

from src.config.db import get_db
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

    messages = ResearchMessageService.get_messages(db, session_id)
    return {"messages": messages}


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

        # Save assistant output
        if ai_output:
            ResearchMessageService.add_message(
                db, session_id, "assistant", ai_output
            )

    return StreamingResponse(stream(), media_type="text/event-stream")
