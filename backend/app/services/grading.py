"""Server-side answer validation for every exercise type.

The client submits a raw ``answer`` whose shape depends on the exercise type;
this module is the single source of truth for correctness so XP/hearts can't be
faked from the browser.

Payload shapes (see seed.py for concrete examples)
--------------------------------------------------
multiple_choice : {"choices": [...], "answer_index": int}
                  answer -> int (chosen index)
translate       : {"words": [...], "answer": [ordered words]}
                  answer -> list[str] (tapped words in order)
match           : {"pairs": [{"left": a, "right": b}, ...]}
                  answer -> list[[left, right]] (user's pairings)
fill_blank      : {"sentence": "... ___ ...", "answer": str, "choices": [...]}
                  answer -> str
type_answer     : {"answer": str, "accepted": [str, ...]}
                  answer -> str
"""
from __future__ import annotations

import re
import string
from typing import Any


def _normalize(text: str) -> str:
    """Lowercase, strip punctuation, collapse whitespace — forgiving text match."""
    text = text.strip().lower()
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text)
    return text


def check(exercise_type: str, payload: dict[str, Any], answer: Any) -> bool:
    if exercise_type == "multiple_choice":
        try:
            return int(answer) == int(payload["answer_index"])
        except (TypeError, ValueError, KeyError):
            return False

    if exercise_type == "translate":
        if not isinstance(answer, list):
            return False
        expected = [_normalize(w) for w in payload.get("answer", [])]
        given = [_normalize(str(w)) for w in answer]
        return given == expected

    if exercise_type == "match":
        if not isinstance(answer, list):
            return False
        expected = {
            (_normalize(p["left"]), _normalize(p["right"]))
            for p in payload.get("pairs", [])
        }
        try:
            given = {(_normalize(str(a)), _normalize(str(b))) for a, b in answer}
        except (ValueError, TypeError):
            return False
        return given == expected

    if exercise_type in ("fill_blank", "type_answer"):
        if not isinstance(answer, (str, int, float)):
            return False
        accepted = payload.get("accepted") or [payload.get("answer", "")]
        normalized_answer = _normalize(str(answer))
        return any(_normalize(str(a)) == normalized_answer for a in accepted)

    return False
