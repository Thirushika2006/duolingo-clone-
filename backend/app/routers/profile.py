"""Profile page data: stats, totals, achievements."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import (
    Achievement,
    LessonAttempt,
    User,
    UserAchievement,
    UserSkillProgress,
)
from ..schemas import AchievementOut, ProfileOut
from ..services import progress as progress_svc

router = APIRouter(prefix="/api", tags=["profile"])


@router.get("/profile", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Keep achievement progress fresh on view.
    progress_svc.check_achievements(db, user)
    db.commit()

    skills_completed = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == user.id, UserSkillProgress.crown_level >= 1
    ).count()
    lessons_completed = db.query(LessonAttempt).filter(
        LessonAttempt.user_id == user.id
    ).count()

    achievements = db.scalars(select(Achievement).order_by(Achievement.id)).all()
    user_ach = {
        ua.achievement_id: ua
        for ua in db.scalars(
            select(UserAchievement).where(UserAchievement.user_id == user.id)
        ).all()
    }
    ach_out = []
    for ach in achievements:
        ua = user_ach.get(ach.id)
        ach_out.append(AchievementOut(
            code=ach.code, title=ach.title, description=ach.description,
            icon=ach.icon, threshold=ach.threshold,
            progress=ua.progress if ua else 0,
            unlocked=bool(ua and ua.unlocked_at is not None),
        ))

    return ProfileOut(
        user=progress_svc.build_user_stats(db, user),
        created_at=user.created_at,
        skills_completed=skills_completed,
        lessons_completed=lessons_completed,
        achievements=ach_out,
    )
