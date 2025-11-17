from sqlalchemy.orm import Session
from typing import List

from src.models.research_message import ResearchMessage


class ResearchMessageService:

    @staticmethod
    def add_message(
        db: Session,
        session_id: int,
        role: str,
        content: str
    ) -> ResearchMessage:
        msg = ResearchMessage(
            session_id=session_id,
            role=role,
            content=content
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)
        return msg

    @staticmethod
    def get_messages(
        db: Session,
        session_id: int
    ) -> List[ResearchMessage]:
        return db.query(ResearchMessage)\
                 .filter(ResearchMessage.session_id == session_id)\
                 .order_by(ResearchMessage.timestamp.asc())\
                 .all()

    @staticmethod
    def delete_messages(
        db: Session,
        session_id: int
    ):
        db.query(ResearchMessage)\
          .filter(ResearchMessage.session_id == session_id)\
          .delete()
        db.commit()
