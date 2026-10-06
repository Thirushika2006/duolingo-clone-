"""Leaderboard: a ranking query over all seeded users (no table of its own)."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import LeaderboardEntry

router = APIRouter(prefix="/api", tags=["leaderboard"])


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    users = db.scalars(select(User).order_by(User.total_xp.desc())).all()
    return [
        LeaderboardEntry(
            rank=i + 1,
            user_id=u.id,
            display_name=u.display_name,
            avatar_color=u.avatar_color,
            total_xp=u.total_xp,
            is_current_user=(u.id == user.id),
        )
        for i, u in enumerate(users)
    ]
