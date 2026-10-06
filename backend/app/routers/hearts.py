"""Hearts: read current hearts, or refill via the mocked practice/refill."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..config import MAX_HEARTS
from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import HeartsResponse
from ..services import hearts as hearts_svc

router = APIRouter(prefix="/api/hearts", tags=["hearts"])


@router.get("", response_model=HeartsResponse)
def get_hearts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    hearts_svc.apply_regen(user)
    db.commit()
    return HeartsResponse(hearts=user.hearts, max_hearts=MAX_HEARTS,
                          minutes_to_next_heart=hearts_svc.minutes_to_next_heart(user))


@router.post("/refill", response_model=HeartsResponse)
def refill(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    hearts_svc.refill_hearts(user)
    db.commit()
    return HeartsResponse(hearts=user.hearts, max_hearts=MAX_HEARTS,
                          minutes_to_next_heart=0)
