"""Shared FastAPI dependencies."""
from __future__ import annotations

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from .config import DEFAULT_USER_ID
from .database import get_db
from .models import User


def get_current_user(db: Session = Depends(get_db)) -> User:
    """No real auth: always resolve the single default learner."""
    user = db.get(User, DEFAULT_USER_ID)
    if user is None:
        raise HTTPException(status_code=404, detail="Default learner not found. Run seed.py.")
    return user
