from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime


class ResearchSessionCreate(BaseModel):
    user_id: int
    title: Optional[str] = None


class ResearchSessionResponse(BaseModel):
    id: int
    user_id: int
    title: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {
        "from_attributes": True
    }


class ResearchMessageCreate(BaseModel):
    session_id: int
    role: Literal["user", "assistant", "tool"]
    content: str


class ResearchMessageResponse(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    timestamp: datetime

    model_config = {
        "from_attributes": True
    }


class ResearchChatRequest(BaseModel):
    user_id: int
    session_id: Optional[int] = None
    query: str


class ResearchChatResponse(BaseModel):
    session_id: int
    response: str


class ResearchSessionListResponse(BaseModel):
    sessions: List[ResearchSessionResponse]


class ResearchMessageListResponse(BaseModel):
    messages: List[ResearchMessageResponse]
