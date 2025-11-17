from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class PDFCreate(BaseModel):
    file_name: str
    file_url: str
    vector_namespace: Optional[str] = None


class PDFBase(BaseModel):
    id: UUID
    file_name: str
    file_url: str
    vector_namespace: Optional[str]
    uploaded_at: datetime
    user_id: int

    model_config = {
        "from_attributes": True
    }

class PDFWithChats(PDFBase):
    chats: Optional[List["ChatBase"]] = []
