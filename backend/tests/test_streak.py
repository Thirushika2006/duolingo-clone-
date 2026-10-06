"""Streak + daily goal logic."""
from __future__ import annotations

import datetime as dt

from app.services import streak as s

TODAY = dt.date(2026, 10, 7)


def d(n: int) -> dt.date:
    """n days before TODAY."""
    return TODAY - dt.timedelta(days=n)


def test_empty_history_is_zero():
    assert s.current_streak([], TODAY) == 0


def test_active_today_counts():
    assert s.current_streak([d(0)], TODAY) == 1


def test_consecutive_days_ending_today():
    assert s.current_streak([d(0), d(1), d(2)], TODAY) == 3


def test_grace_when_active_yesterday_not_today():
    # Still alive: user was active yesterday and has today to practice.
    assert s.current_streak([d(1), d(2)], TODAY) == 2


def test_gap_breaks_streak():
    # Last active two days ago -> streak already broken.
    assert s.current_streak([d(2), d(3)], TODAY) == 0


def test_gap_in_middle_stops_count():
    assert s.current_streak([d(0), d(1), d(3), d(4)], TODAY) == 2


def test_out_of_order_dates():
    assert s.current_streak([d(2), d(0), d(1)], TODAY) == 3


def test_xp_today():
    activity = [(d(0), 30), (d(0), 20), (d(1), 50)]
    assert s.xp_today(activity, TODAY) == 50


def test_daily_goal_met():
    assert s.daily_goal_met(50, 50) is True
    assert s.daily_goal_met(49, 50) is False
