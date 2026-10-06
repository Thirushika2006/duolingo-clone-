"""Progress logic: path/unlock state, user stats, lesson completion, achievements."""
from __future__ import annotations

import datetime as dt

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..clock import utcnow
from ..config import MAX_HEARTS
from ..models import (
    Achievement,
    Course,
    DailyActivity,
    Lesson,
    Skill,
    Unit,
    User,
    UserAchievement,
    UserSkillProgress,
)
from . import hearts as hearts_svc
from . import streak as streak_svc


# --------------------------------------------------------------------------- #
# User stats (top bar / profile)
# --------------------------------------------------------------------------- #
def build_user_stats(db: Session, user: User) -> dict:
    """Apply heart regen, derive streak + daily goal, return a UserStats dict."""
    hearts_svc.apply_regen(user)
    db.commit()

    today = dt.date.today()
    rows = db.execute(
        select(DailyActivity.date, DailyActivity.xp).where(
            DailyActivity.user_id == user.id
        )
    ).all()
    active_dates = [r[0] for r in rows]
    streak = streak_svc.current_streak(active_dates, today)
    xp_today = streak_svc.xp_today([(r[0], r[1]) for r in rows], today)

    return {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "avatar_color": user.avatar_color,
        "total_xp": user.total_xp,
        "gems": user.gems,
        "hearts": user.hearts,
        "max_hearts": MAX_HEARTS,
        "minutes_to_next_heart": hearts_svc.minutes_to_next_heart(user),
        "streak": streak,
        "daily_goal_xp": user.daily_goal_xp,
        "xp_today": xp_today,
        "daily_goal_met": streak_svc.daily_goal_met(xp_today, user.daily_goal_xp),
    }


# --------------------------------------------------------------------------- #
# Path / unlock state
# --------------------------------------------------------------------------- #
def _progress_map(db: Session, user_id: int) -> dict[int, UserSkillProgress]:
    rows = db.scalars(
        select(UserSkillProgress).where(UserSkillProgress.user_id == user_id)
    ).all()
    return {p.skill_id: p for p in rows}


def build_path(db: Session, user: User) -> dict:
    """Return the full path (units -> skills) with lock/available/completed states.

    Unlock rule: a skill is unlocked if it is the first skill overall or the
    immediately preceding skill (in path order) is completed (crown_level >= 1).
    The 'active' skill is the first unlocked-but-not-completed skill.
    """
    course = db.scalars(select(Course)).first()
    progress = _progress_map(db, user.id)

    units = db.scalars(
        select(Unit).where(Unit.course_id == course.id).order_by(Unit.order_index)
    ).all()

    # Flatten skills in path order to apply the unlock rule sequentially.
    ordered_skills: list[Skill] = []
    for unit in units:
        ordered_skills.extend(
            sorted(unit.skills, key=lambda s: s.order_index)
        )

    skill_state: dict[int, str] = {}
    prev_completed = True  # first skill is always unlocked
    active_id: int | None = None
    for skill in ordered_skills:
        prog = progress.get(skill.id)
        completed = bool(prog and prog.crown_level >= 1)
        unlocked = prev_completed
        if completed:
            state = "completed"
        elif unlocked:
            state = "available"
        else:
            state = "locked"
        skill_state[skill.id] = state
        if state == "available" and active_id is None:
            active_id = skill.id
        prev_completed = completed

    def skill_out(skill: Skill) -> dict:
        prog = progress.get(skill.id)
        done = prog.lessons_completed if prog else 0
        ordered_lessons = sorted(skill.lessons, key=lambda l: l.order_index)
        # Next incomplete lesson; once the skill is finished, tapping re-practices
        # the first lesson.
        if done < len(ordered_lessons):
            next_lesson = ordered_lessons[done]
        else:
            next_lesson = ordered_lessons[0] if ordered_lessons else None
        return {
            "id": skill.id,
            "title": skill.title,
            "icon": skill.icon,
            "order_index": skill.order_index,
            "crown_level": prog.crown_level if prog else 0,
            "total_lessons": len(skill.lessons),
            "lessons_completed": done,
            "state": skill_state[skill.id],
            "is_active": skill.id == active_id,
            "next_lesson_id": next_lesson.id if next_lesson else None,
        }

    return {
        "course_title": course.title,
        "language_flag": course.language_flag,
        "user": build_user_stats(db, user),
        "units": [
            {
                "id": unit.id,
                "title": unit.title,
                "description": unit.description,
                "color": unit.color,
                "order_index": unit.order_index,
                "skills": [skill_out(s) for s in sorted(unit.skills, key=lambda s: s.order_index)],
            }
            for unit in units
        ],
    }


# --------------------------------------------------------------------------- #
# Lesson completion
# --------------------------------------------------------------------------- #
def complete_lesson(db: Session, user: User, lesson: Lesson, mistakes: int) -> dict:
    """Award XP, advance skill crown, log daily activity, check achievements."""
    now = utcnow()
    today = dt.date.today()
    xp = lesson.xp_reward

    # Record the attempt.
    from ..models import LessonAttempt  # local import to avoid clutter at top

    db.add(LessonAttempt(user_id=user.id, lesson_id=lesson.id,
                         xp_earned=xp, mistakes=mistakes, completed_at=now))

    # Total XP.
    user.total_xp += xp

    # Skill progress + crown.
    skill = lesson.skill
    prog = db.scalars(
        select(UserSkillProgress).where(
            UserSkillProgress.user_id == user.id,
            UserSkillProgress.skill_id == skill.id,
        )
    ).first()
    if prog is None:
        prog = UserSkillProgress(user_id=user.id, skill_id=skill.id,
                                 crown_level=0, lessons_completed=0)
        db.add(prog)
    prog.lessons_completed += 1
    total_lessons = len(skill.lessons)
    if prog.lessons_completed >= total_lessons and prog.crown_level < 1:
        prog.crown_level = 1  # first full pass earns the first crown

    # Daily activity (one row per day; accumulate XP).
    activity = db.scalars(
        select(DailyActivity).where(
            DailyActivity.user_id == user.id, DailyActivity.date == today
        )
    ).first()
    if activity is None:
        activity = DailyActivity(user_id=user.id, date=today, xp=0)
        db.add(activity)
    activity.xp += xp

    db.flush()
    newly_unlocked = check_achievements(db, user)
    db.commit()

    stats = build_user_stats(db, user)
    return {
        "xp_earned": xp,
        "total_xp": user.total_xp,
        "crown_level": prog.crown_level,
        "streak": stats["streak"],
        "daily_goal_met": stats["daily_goal_met"],
        "newly_unlocked_achievements": newly_unlocked,
    }


# --------------------------------------------------------------------------- #
# Achievements
# --------------------------------------------------------------------------- #
def _current_value(db: Session, user: User, code: str) -> int:
    """Compute the live value an achievement is measured against."""
    if code == "first_lesson":
        from ..models import LessonAttempt
        return db.query(LessonAttempt).filter(LessonAttempt.user_id == user.id).count()
    if code.startswith("xp_"):
        return user.total_xp
    if code == "streak_7":
        today = dt.date.today()
        dates = db.scalars(
            select(DailyActivity.date).where(DailyActivity.user_id == user.id)
        ).all()
        return streak_svc.current_streak(dates, today)
    if code == "unit_complete":
        # Number of fully-completed units.
        units = db.scalars(select(Unit)).all()
        progress = _progress_map(db, user.id)
        done = 0
        for unit in units:
            if unit.skills and all(
                progress.get(s.id) and progress[s.id].crown_level >= 1
                for s in unit.skills
            ):
                done += 1
        return done
    return 0


def check_achievements(db: Session, user: User) -> list[str]:
    """Update progress on every achievement; unlock any newly met. Returns new titles."""
    newly: list[str] = []
    achievements = db.scalars(select(Achievement)).all()
    existing = {
        ua.achievement_id: ua
        for ua in db.scalars(
            select(UserAchievement).where(UserAchievement.user_id == user.id)
        ).all()
    }
    for ach in achievements:
        value = _current_value(db, user, ach.code)
        ua = existing.get(ach.id)
        if ua is None:
            ua = UserAchievement(user_id=user.id, achievement_id=ach.id, progress=0)
            db.add(ua)
        ua.progress = value
        if ua.unlocked_at is None and value >= ach.threshold:
            ua.unlocked_at = utcnow()
            newly.append(ach.title)
    db.flush()
    return newly
