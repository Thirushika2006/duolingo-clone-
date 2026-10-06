"""Single clock helper.

Returns a naive UTC datetime so it can be compared against SQLite-stored values
(which come back naive) without tz-aware/naive mismatch errors. Keeping it in one
place also makes 'now' easy to reason about for the debug advance-day feature.
"""
from __future__ import annotations

import datetime as dt


def utcnow() -> dt.datetime:
    return dt.datetime.now(dt.UTC).replace(tzinfo=None)
