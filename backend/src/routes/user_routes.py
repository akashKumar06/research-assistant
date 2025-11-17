from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
import bcrypt
from typing import List
from src.models.user_model import User
from src.schemas.user_schema import UserCreate, UserLogin, UserBase
from src.config.db import get_db
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer


load_dotenv()

router = APIRouter(prefix="/users", tags=["Users"])

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Create a JWT token for authentication."""
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_password_hash(password: str) -> str:
    """Hash a plain password."""
    password = password.encode()
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    plain_password = plain_password.encode()
    hashed_password = hashed_password.encode()
    return bcrypt.checkpw(plain_password, hashed_password)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Decode JWT and get the current logged-in user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=UserBase)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = User(name=user.name, email=user.email, password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user and return a JWT token."""
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"user_id": db_user.id, "email": db_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": db_user.id, "name": db_user.name, "email": db_user.email}
    }

@router.get("/me", response_model=UserBase)
def get_me(current_user: User = Depends(get_current_user)):
    """Fetch details of the logged-in user."""
    return current_user