"""Shared fixtures: an isolated in-memory DB with a tiny course + learner."""
from __future__ import annotations

import datetime as dt

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.clock import utcnow
from app.database import Base
from app.models import Achievement, Course, Lesson, Skill, Unit, User


@pytest.fixture()
def db():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def course(db):
    """One unit with three sequential skills, each with a single one-exercise lesson."""
    c = Course(title="Spanish", language_name="Spanish", language_flag="🇪🇸")
    db.add(c)
    db.flush()
    unit = Unit(course_id=c.id, title="Unit 1", order_index=0)
    db.add(unit)
    db.flush()
    for i in range(3):
        skill = Skill(unit_id=unit.id, title=f"Skill {i}", order_index=i)
        db.add(skill)
        db.flush()
        db.add(Lesson(skill_id=skill.id, order_index=0, xp_reward=10))
    db.commit()
    return c


@pytest.fixture()
def achievements(db):
    ach = Achievement(code="first_lesson", title="First Steps",
                      description="Complete your first lesson", icon="shoe", threshold=1)
    db.add(ach)
    db.commit()
    return ach


@pytest.fixture()
def learner(db):
    u = User(username="diego", display_name="Diego", total_xp=0, gems=0,
             daily_goal_xp=50, hearts=5, hearts_updated_at=utcnow())
    db.add(u)
    db.commit()
    return u
