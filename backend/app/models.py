"""SQLAlchemy ORM models.

Schema overview
---------------
Content hierarchy : Course -> Unit -> Skill -> Lesson -> Exercise
Learner           : User
Progress          : UserSkillProgress, LessonAttempt
Streak/daily goal : DailyActivity   (streak + daily goal are DERIVED from this)
Achievements      : Achievement, UserAchievement

Design notes
------------
* Each Exercise carries a free-form JSON ``payload`` whose shape depends on its
  ``type`` (choices / word bank / pairs / accepted answers). This keeps five very
  different exercise types in one queryable table.
* There is deliberately no ``streak_count`` column: deriving it from DailyActivity
  means it can never drift out of sync with the actual activity log.
* Hearts are stored as a count plus ``hearts_updated_at``; regeneration is computed
  on read (see services/hearts.py), so no background job is needed.
"""
from __future__ import annotations

import datetime as dt
from typing import Any

from sqlalchemy import (
    JSON,
    Date,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


# --------------------------------------------------------------------------- #
# Content
# --------------------------------------------------------------------------- #
class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    language_name: Mapped[str] = mapped_column(String(50))
    language_flag: Mapped[str] = mapped_column(String(10))  # emoji flag
    from_language: Mapped[str] = mapped_column(String(50), default="English")

    units: Mapped[list["Unit"]] = relationship(
        back_populates="course", order_by="Unit.order_index", cascade="all, delete-orphan"
    )


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(255), default="")
    color: Mapped[str] = mapped_column(String(20), default="#58CC02")  # unit banner color
    order_index: Mapped[int] = mapped_column(default=0)

    course: Mapped["Course"] = relationship(back_populates="units")
    skills: Mapped[list["Skill"]] = relationship(
        back_populates="unit", order_by="Skill.order_index", cascade="all, delete-orphan"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id"))
    title: Mapped[str] = mapped_column(String(100))
    icon: Mapped[str] = mapped_column(String(20), default="star")  # icon key for the UI
    order_index: Mapped[int] = mapped_column(default=0)

    unit: Mapped["Unit"] = relationship(back_populates="skills")
    lessons: Mapped[list["Lesson"]] = relationship(
        back_populates="skill", order_by="Lesson.order_index", cascade="all, delete-orphan"
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))
    order_index: Mapped[int] = mapped_column(default=0)
    xp_reward: Mapped[int] = mapped_column(default=10)

    skill: Mapped["Skill"] = relationship(back_populates="lessons")
    exercises: Mapped[list["Exercise"]] = relationship(
        back_populates="lesson",
        order_by="Exercise.order_index",
        cascade="all, delete-orphan",
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"))
    order_index: Mapped[int] = mapped_column(default=0)
    # one of: multiple_choice | translate | match | fill_blank | type_answer
    type: Mapped[str] = mapped_column(String(30))
    prompt: Mapped[str] = mapped_column(String(255))
    # Type-specific content + the correct answer(s). Shape documented in seed.py.
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)

    lesson: Mapped["Lesson"] = relationship(back_populates="exercises")


# --------------------------------------------------------------------------- #
# Learner
# --------------------------------------------------------------------------- #
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True)
    display_name: Mapped[str] = mapped_column(String(80))
    avatar_color: Mapped[str] = mapped_column(String(20), default="#1CB0F6")

    total_xp: Mapped[int] = mapped_column(default=0)
    gems: Mapped[int] = mapped_column(default=500)  # mocked currency
    daily_goal_xp: Mapped[int] = mapped_column(default=50)

    hearts: Mapped[int] = mapped_column(default=5)
    hearts_updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime, default=func.now()
    )

    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=func.now())

    skill_progress: Mapped[list["UserSkillProgress"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    attempts: Mapped[list["LessonAttempt"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    activity: Mapped[list["DailyActivity"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    achievements: Mapped[list["UserAchievement"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


# --------------------------------------------------------------------------- #
# Progress
# --------------------------------------------------------------------------- #
class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    __table_args__ = (UniqueConstraint("user_id", "skill_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))
    crown_level: Mapped[int] = mapped_column(default=0)  # 0 = not started
    lessons_completed: Mapped[int] = mapped_column(default=0)

    user: Mapped["User"] = relationship(back_populates="skill_progress")
    skill: Mapped["Skill"] = relationship()


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"))
    xp_earned: Mapped[int] = mapped_column(default=0)
    mistakes: Mapped[int] = mapped_column(default=0)
    completed_at: Mapped[dt.datetime] = mapped_column(DateTime, default=func.now())

    user: Mapped["User"] = relationship(back_populates="attempts")
    lesson: Mapped["Lesson"] = relationship()


class DailyActivity(Base):
    """One row per user per day the user earned XP. Streak + daily goal derive from this."""

    __tablename__ = "daily_activity"
    __table_args__ = (UniqueConstraint("user_id", "date"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    date: Mapped[dt.date] = mapped_column(Date)
    xp: Mapped[int] = mapped_column(default=0)

    user: Mapped["User"] = relationship(back_populates="activity")


# --------------------------------------------------------------------------- #
# Achievements
# --------------------------------------------------------------------------- #
class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    title: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(String(255))
    icon: Mapped[str] = mapped_column(String(20), default="trophy")
    threshold: Mapped[int] = mapped_column(default=1)  # target value to unlock


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    achievement_id: Mapped[int] = mapped_column(ForeignKey("achievements.id"))
    progress: Mapped[int] = mapped_column(default=0)
    unlocked_at: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)

    user: Mapped["User"] = relationship(back_populates="achievements")
    achievement: Mapped["Achievement"] = relationship()
