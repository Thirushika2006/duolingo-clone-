"""Lesson player endpoints: fetch a lesson, check an answer, complete a lesson."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Exercise, Lesson, User
from ..schemas import (
    CheckRequest,
    CheckResponse,
    CompleteRequest,
    CompleteResponse,
    ExerciseOut,
    LessonOut,
)
from ..services import grading
from ..services import hearts as hearts_svc
from ..services import progress as progress_svc

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


def _sanitize_payload(exercise_type: str, payload: dict[str, Any]) -> dict[str, Any]:
    """Strip correct-answer keys so the client can't read the answer from the payload."""
    safe = dict(payload)
    if exercise_type == "multiple_choice":
        safe.pop("answer_index", None)
    elif exercise_type == "translate":
        safe.pop("answer", None)
    elif exercise_type in ("fill_blank", "type_answer"):
        safe.pop("answer", None)
        safe.pop("accepted", None)
    # match: both columns are needed to play, so pairs stay (client shuffles them).
    return safe


def _correct_answer_for(ex: Exercise) -> Any:
    """Human-readable correct answer to reveal after a wrong attempt."""
    p = ex.payload
    if ex.type == "multiple_choice":
        return p["choices"][p["answer_index"]]
    if ex.type == "translate":
        return " ".join(p.get("answer", []))
    if ex.type == "match":
        return [[pair["left"], pair["right"]] for pair in p.get("pairs", [])]
    return p.get("answer")


@router.get("/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db),
               user: User = Depends(get_current_user)):
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    exercises = [
        ExerciseOut(
            id=ex.id, type=ex.type, prompt=ex.prompt, order_index=ex.order_index,
            payload=_sanitize_payload(ex.type, ex.payload),
        )
        for ex in lesson.exercises
    ]
    return LessonOut(
        id=lesson.id, skill_id=lesson.skill_id, skill_title=lesson.skill.title,
        xp_reward=lesson.xp_reward, exercises=exercises,
    )


@router.post("/{lesson_id}/check", response_model=CheckResponse)
def check_answer(lesson_id: int, body: CheckRequest, db: Session = Depends(get_db),
                 user: User = Depends(get_current_user)):
    ex = db.get(Exercise, body.exercise_id)
    if ex is None or ex.lesson_id != lesson_id:
        raise HTTPException(status_code=404, detail="Exercise not found in lesson")

    correct = grading.check(ex.type, ex.payload, body.answer)
    if not correct:
        hearts_svc.lose_heart(user)
        db.commit()

    hearts_svc.apply_regen(user)
    db.commit()
    return CheckResponse(
        correct=correct,
        hearts=user.hearts,
        out_of_hearts=user.hearts <= 0,
        correct_answer=None if correct else _correct_answer_for(ex),
    )


@router.post("/{lesson_id}/complete", response_model=CompleteResponse)
def complete_lesson(lesson_id: int, body: CompleteRequest, db: Session = Depends(get_db),
                    user: User = Depends(get_current_user)):
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return progress_svc.complete_lesson(db, user, lesson, body.mistakes)
