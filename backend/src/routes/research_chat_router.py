from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from src.services.tool_agent import ToolAgent
import asyncio

router = APIRouter()

class Query(BaseModel):
    query: str

@router.post("")
async def research_chat(req: Query):
    """Endpoint that will avail tools for the agent"""
    try:
        agent = ToolAgent()
        prompt = agent.invoke(req.query)
        model = agent.chat_model
        async def generate():
            ai_response = ""
            async for chunk in model.astream(prompt):
                if chunk.content:
                    ai_response += chunk.content
                    yield chunk.content
                await asyncio.sleep(0.01)

            agent.add_AIMessage(ai_response)
        # response = agent.chat_model.invoke(prompt)
        # agent.add_AIMessage(response.content)
        # return {"response": response}  
        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

