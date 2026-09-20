import os
import time
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=180,
    pool_size=5,
    max_overflow=5,
    connect_args={
        "connect_timeout": 10,
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    },
)


@event.listens_for(engine, "do_connect")
def _connect_with_retry(dialect, conn_rec, cargs, cparams):
    """
    Neon's free-tier compute auto-suspends after a few minutes of inactivity.
    The first physical connection after a cold start frequently has its TLS
    handshake dropped mid-negotiation while Neon wakes the compute back up
    ("SSL SYSCALL error: EOF detected"). pool_pre_ping can't help here since
    that only re-validates already-pooled connections, not a brand-new one.
    Retrying the raw connect a couple of times with a short backoff rides
    out the wake-up window instead of surfacing a 500 to the user.
    """
    last_exc = None
    for attempt in range(3):
        try:
            return dialect.dbapi.connect(*cargs, **cparams)
        except Exception as e:
            last_exc = e
            if attempt < 2:
                time.sleep(1.5 * (attempt + 1))
    raise last_exc
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