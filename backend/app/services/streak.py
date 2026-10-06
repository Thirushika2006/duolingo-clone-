"""Streak and daily-goal logic derived from the DailyActivity log.

Keeping these as pure functions over a set of dates makes them trivial to unit
test and keeps 'what day is it' injectable (the debug advance-day endpoint).
"""
from __future__ import annotations

import datetime as dt
from collections.abc import Iterable


def current_streak(active_dates: Iterable[dt.date], today: dt.date) -> int:
    """Count consecutive active days ending today or yesterday.

    A streak stays alive if the user was active today OR yesterday (they still
    have today to practice). Any gap of two+ days breaks it.
    """
    days = set(active_dates)
    if not days:
        return 0

    # Anchor: today if active today, else yesterday (grace), else streak is 0.
    if today in days:
        anchor = today
    elif (today - dt.timedelta(days=1)) in days:
        anchor = today - dt.timedelta(days=1)
    else:
        return 0

    streak = 0
    cursor = anchor
    while cursor in days:
        streak += 1
        cursor -= dt.timedelta(days=1)
    return streak


def xp_today(activity: Iterable[tuple[dt.date, int]], today: dt.date) -> int:
    """Total XP earned on ``today`` from (date, xp) pairs."""
    return sum(xp for date, xp in activity if date == today)


def daily_goal_met(xp_today_value: int, goal: int) -> bool:
    return xp_today_value >= goal
