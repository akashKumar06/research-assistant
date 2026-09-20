from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.config.db import Base

class ResearchMessage(Base):
    __tablename__ = "research_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("research_sessions.id"), nullable=False)

    role = Column(String, nullable=False)   # "user" | "assistant" | "tool"
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    session = relationship("ResearchSession", back_populates="messages")
