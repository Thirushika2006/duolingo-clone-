"""Path unlock state + lesson completion against a real (in-memory) DB."""
from __future__ import annotations

from app.models import Lesson, Skill
from app.services import progress as p


def _states(path):
    """Flatten skill states in path order -> list of (title, state)."""
    out = []
    for unit in path["units"]:
        for skill in unit["skills"]:
            out.append((skill["title"], skill["state"]))
    return out


def test_initial_path_only_first_skill_available(db, course, learner):
    path = p.build_path(db, learner)
    assert _states(path) == [
        ("Skill 0", "available"),
        ("Skill 1", "locked"),
        ("Skill 2", "locked"),
    ]
    # The first available skill is the active one.
    assert path["units"][0]["skills"][0]["is_active"] is True


def test_completing_first_skill_unlocks_second(db, course, learner):
    first_lesson = db.query(Lesson).join(Skill).order_by(Skill.order_index).first()
    p.complete_lesson(db, learner, first_lesson, mistakes=0)

    path = p.build_path(db, learner)
    assert _states(path) == [
        ("Skill 0", "completed"),
        ("Skill 1", "available"),
        ("Skill 2", "locked"),
    ]


def test_complete_awards_xp_crown_and_activity(db, course, learner):
    first_lesson = db.query(Lesson).join(Skill).order_by(Skill.order_index).first()
    result = p.complete_lesson(db, learner, first_lesson, mistakes=1)

    assert result["xp_earned"] == 10
    assert result["total_xp"] == 10
    assert result["crown_level"] == 1
    assert result["streak"] == 1  # first day of activity
    assert learner.total_xp == 10


def test_first_lesson_achievement_unlocks(db, course, learner, achievements):
    first_lesson = db.query(Lesson).join(Skill).order_by(Skill.order_index).first()
    result = p.complete_lesson(db, learner, first_lesson, mistakes=0)
    assert "First Steps" in result["newly_unlocked_achievements"]
