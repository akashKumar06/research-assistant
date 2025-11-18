import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    """
    Creates a new database session for a request and closes it automatically after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()