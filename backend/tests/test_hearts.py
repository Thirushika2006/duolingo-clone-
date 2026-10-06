"""Heart regeneration logic."""
from __future__ import annotations

import datetime as dt

from app.config import HEART_REGEN_MINUTES, MAX_HEARTS
from app.models import User
from app.services import hearts as h


def _user(hearts, updated_at):
    return User(username="u", display_name="U", hearts=hearts, hearts_updated_at=updated_at)


def test_no_regen_before_interval():
    now = dt.datetime(2026, 1, 1, 12, 0)
    before = now - dt.timedelta(minutes=HEART_REGEN_MINUTES - 1)
    hearts, updated = h.compute_regen(2, before, now)
    assert hearts == 2
    assert updated == before  # timer untouched


def test_regen_one_heart_after_interval():
    now = dt.datetime(2026, 1, 1, 12, 0)
    before = now - dt.timedelta(minutes=HEART_REGEN_MINUTES + 5)
    hearts, updated = h.compute_regen(2, before, now)
    assert hearts == 3
    # timer advanced by exactly one interval, preserving the 5-minute remainder
    assert updated == before + dt.timedelta(minutes=HEART_REGEN_MINUTES)


def test_regen_caps_at_max_and_resets_timer():
    now = dt.datetime(2026, 1, 1, 12, 0)
    before = now - dt.timedelta(hours=10)
    hearts, updated = h.compute_regen(1, before, now)
    assert hearts == MAX_HEARTS
    assert updated == now


def test_full_hearts_resets_timer_to_now():
    now = dt.datetime(2026, 1, 1, 12, 0)
    hearts, updated = h.compute_regen(MAX_HEARTS, now - dt.timedelta(hours=5), now)
    assert hearts == MAX_HEARTS
    assert updated == now


def test_lose_heart_starts_timer_from_full():
    now = dt.datetime(2026, 1, 1, 12, 0)
    user = _user(MAX_HEARTS, now - dt.timedelta(hours=5))
    h.lose_heart(user, now)
    assert user.hearts == MAX_HEARTS - 1
    assert user.hearts_updated_at == now


def test_lose_heart_not_below_zero():
    now = dt.datetime(2026, 1, 1, 12, 0)
    user = _user(0, now)
    h.lose_heart(user, now)
    assert user.hearts == 0


def test_refill_restores_to_max():
    now = dt.datetime(2026, 1, 1, 12, 0)
    user = _user(1, now - dt.timedelta(hours=1))
    h.refill_hearts(user, now)
    assert user.hearts == MAX_HEARTS


def test_minutes_to_next_heart():
    now = dt.datetime(2026, 1, 1, 12, 0)
    user = _user(2, now - dt.timedelta(minutes=10))
    assert h.minutes_to_next_heart(user, now) == HEART_REGEN_MINUTES - 10
    full = _user(MAX_HEARTS, now)
    assert h.minutes_to_next_heart(full, now) == 0
