from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional, List

from src.models.research_session import ResearchSession


class ResearchSessionService:

    @staticmethod
    def create_session(
        db: Session,
        user_id: int,
        title: Optional[str] = None
    ) -> ResearchSession:
        session = ResearchSession(user_id=user_id, title=title)
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_session(
        db: Session,
        session_id: int
    ) -> Optional[ResearchSession]:
        return db.query(ResearchSession)\
                 .filter(ResearchSession.id == session_id)\
                 .first()

    @staticmethod
    def get_user_sessions(
        db: Session,
        user_id: int
    ) -> List[ResearchSession]:
        return db.query(ResearchSession)\
                 .filter(ResearchSession.user_id == user_id)\
                 .order_by(ResearchSession.created_at.desc())\
                 .all()

    @staticmethod
    def update_title(
        db: Session,
        session_id: int,
        new_title: str
    ):
        session = db.query(ResearchSession).filter_by(id=session_id).first()
        if session:
            session.title = new_title
            db.commit()

    @staticmethod
    def delete_session(
        db: Session,
        session_id: int
    ):
        session = db.query(ResearchSession).filter_by(id=session_id).first()
        if session:
            db.delete(session)
            db.commit()
