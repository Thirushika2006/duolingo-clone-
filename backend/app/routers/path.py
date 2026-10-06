"""GET the learning path with the user's progress baked in."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import PathOut
from ..services import progress as progress_svc

router = APIRouter(prefix="/api", tags=["path"])


@router.get("/path", response_model=PathOut)
def get_path(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return progress_svc.build_path(db, user)
