from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# ---------- Input Schemas ----------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------- Output Schemas ----------

class UserBase(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# ---------- Nested Relations ----------

class UserWithPDFs(UserBase):
    pdfs: Optional[List["PDFBase"]] = []


class UserWithChats(UserBase):
    chats: Optional[List["ChatBase"]] = []
