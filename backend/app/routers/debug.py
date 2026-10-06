"""Debug/testing helpers. The brief asks for simulatable day logic for streaks.

POST /api/debug/advance-day shifts the learner's activity + heart timer back by
one day, which makes "today" effectively move forward — so you can watch streaks
increment and hearts regenerate without waiting real time.
"""
from __future__ import annotations

import datetime as dt

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import DailyActivity, User
from ..schemas import AdvanceDayResponse
from ..services import progress as progress_svc

router = APIRouter(prefix="/api/debug", tags=["debug"])


@router.post("/advance-day", response_model=AdvanceDayResponse)
def advance_day(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Shift all activity one day into the past. Process oldest-first and flush
    # each row so the UNIQUE(user_id, date) target is always already vacated.
    rows = db.scalars(
        select(DailyActivity)
        .where(DailyActivity.user_id == user.id)
        .order_by(DailyActivity.date.asc())
    ).all()
    for row in rows:
        row.date = row.date - dt.timedelta(days=1)
        db.flush()

    # Also age the heart timer so regeneration advances by a day.
    user.hearts_updated_at = user.hearts_updated_at - dt.timedelta(days=1)
    db.commit()

    stats = progress_svc.build_user_stats(db, user)
    return AdvanceDayResponse(
        message="Advanced one day. Practice today to extend your streak.",
        streak=stats["streak"],
    )
