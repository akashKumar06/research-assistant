from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class ChatCreate(BaseModel):
    pdf_id: Optional[UUID] = None
    message: str
    response: Optional[str] = None
    role: str 


class ChatBase(BaseModel):
    id: int
    pdf_id: Optional[UUID]
    user_id: int
    role: str
    message: str
    response: Optional[str]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
