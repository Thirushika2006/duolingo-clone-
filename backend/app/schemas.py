"""Pydantic response/request schemas (the API contract the frontend consumes)."""
from __future__ import annotations

import datetime as dt
from typing import Any, Literal

from pydantic import BaseModel


# --------------------------------------------------------------------------- #
# User / top bar
# --------------------------------------------------------------------------- #
class UserStats(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_color: str
    total_xp: int
    gems: int
    hearts: int
    max_hearts: int
    minutes_to_next_heart: int
    streak: int
    daily_goal_xp: int
    xp_today: int
    daily_goal_met: bool


# --------------------------------------------------------------------------- #
# Path
# --------------------------------------------------------------------------- #
class SkillOut(BaseModel):
    id: int
    title: str
    icon: str
    order_index: int
    crown_level: int
    total_lessons: int
    lessons_completed: int
    state: Literal["locked", "available", "completed"]
    is_active: bool  # the single node the start-popover attaches to
    next_lesson_id: int | None  # lesson to launch when the node is tapped


class UnitOut(BaseModel):
    id: int
    title: str
    description: str
    color: str
    order_index: int
    skills: list[SkillOut]


class PathOut(BaseModel):
    course_title: str
    language_flag: str
    user: UserStats
    units: list[UnitOut]


# --------------------------------------------------------------------------- #
# Lesson player
# --------------------------------------------------------------------------- #
class ExerciseOut(BaseModel):
    id: int
    type: str
    prompt: str
    order_index: int
    payload: dict[str, Any]  # answer keys are stripped before sending (see router)


class LessonOut(BaseModel):
    id: int
    skill_id: int
    skill_title: str
    xp_reward: int
    exercises: list[ExerciseOut]


class CheckRequest(BaseModel):
    exercise_id: int
    answer: Any


class CheckResponse(BaseModel):
    correct: bool
    hearts: int
    out_of_hearts: bool
    correct_answer: Any | None = None  # revealed only when the user is wrong


class CompleteRequest(BaseModel):
    mistakes: int = 0


class CompleteResponse(BaseModel):
    xp_earned: int
    total_xp: int
    crown_level: int
    streak: int
    daily_goal_met: bool
    newly_unlocked_achievements: list[str]


# --------------------------------------------------------------------------- #
# Profile / leaderboard / achievements
# --------------------------------------------------------------------------- #
class AchievementOut(BaseModel):
    code: str
    title: str
    description: str
    icon: str
    threshold: int
    progress: int
    unlocked: bool


class ProfileOut(BaseModel):
    user: UserStats
    created_at: dt.datetime
    skills_completed: int
    lessons_completed: int
    achievements: list[AchievementOut]


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    display_name: str
    avatar_color: str
    total_xp: int
    is_current_user: bool


class HeartsResponse(BaseModel):
    hearts: int
    max_hearts: int
    minutes_to_next_heart: int


class AdvanceDayResponse(BaseModel):
    message: str
    streak: int
