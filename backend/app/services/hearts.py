"""Heart regeneration, computed on read from ``hearts_updated_at``.

No background job: every time we load the user we figure out how many hearts
should have regenerated since ``hearts_updated_at`` and apply them.
"""
from __future__ import annotations

import datetime as dt

from ..clock import utcnow
from ..config import HEART_REGEN_MINUTES, MAX_HEARTS
from ..models import User


def compute_regen(
    hearts: int, updated_at: dt.datetime, now: dt.datetime
) -> tuple[int, dt.datetime]:
    """Pure helper: return (new_hearts, new_updated_at).

    Hearts cap at MAX_HEARTS. When already full, the timer is simply reset to
    ``now`` so time doesn't bank up while the user has nothing to regenerate.
    """
    if hearts >= MAX_HEARTS:
        return MAX_HEARTS, now

    elapsed_minutes = (now - updated_at).total_seconds() / 60
    regenerated = int(elapsed_minutes // HEART_REGEN_MINUTES)
    if regenerated <= 0:
        return hearts, updated_at

    new_hearts = min(MAX_HEARTS, hearts + regenerated)
    if new_hearts >= MAX_HEARTS:
        return MAX_HEARTS, now

    # Advance the timer only by the whole hearts we consumed, preserving the
    # remainder so partial progress toward the next heart isn't lost.
    new_updated_at = updated_at + dt.timedelta(minutes=regenerated * HEART_REGEN_MINUTES)
    return new_hearts, new_updated_at


def apply_regen(user: User, now: dt.datetime | None = None) -> User:
    """Mutate ``user`` in place with any regenerated hearts."""
    now = now or utcnow()
    user.hearts, user.hearts_updated_at = compute_regen(
        user.hearts, user.hearts_updated_at, now
    )
    return user


def lose_heart(user: User, now: dt.datetime | None = None) -> User:
    """Deduct one heart (not below zero) and start the regen timer if needed."""
    now = now or utcnow()
    apply_regen(user, now)
    if user.hearts == MAX_HEARTS:
        # Leaving a full state: begin counting regen time from now.
        user.hearts_updated_at = now
    user.hearts = max(0, user.hearts - 1)
    return user


def refill_hearts(user: User, now: dt.datetime | None = None) -> User:
    """Mocked 'practice/refill' — restore to full."""
    now = now or utcnow()
    user.hearts = MAX_HEARTS
    user.hearts_updated_at = now
    return user


def minutes_to_next_heart(user: User, now: dt.datetime | None = None) -> int:
    """Whole minutes until the next heart regenerates (0 when full)."""
    now = now or utcnow()
    if user.hearts >= MAX_HEARTS:
        return 0
    elapsed = (now - user.hearts_updated_at).total_seconds() / 60
    remainder = elapsed % HEART_REGEN_MINUTES
    return max(0, int(round(HEART_REGEN_MINUTES - remainder)))
