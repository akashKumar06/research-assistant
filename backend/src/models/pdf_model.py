from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.config.db import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class PDF(Base):
    __tablename__ = "pdfs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    file_name = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    vector_namespace = Column(UUID(as_uuid=True), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owner = relationship("User", back_populates="pdfs")
    chats = relationship("Chat", back_populates="pdf", cascade="all, delete-orphan")
