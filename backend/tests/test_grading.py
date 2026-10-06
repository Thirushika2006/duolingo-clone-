"""Server-side answer grading for every exercise type."""
from __future__ import annotations

from app.services import grading as g


def test_multiple_choice():
    payload = {"choices": ["la mujer", "el hombre"], "answer_index": 0}
    assert g.check("multiple_choice", payload, 0) is True
    assert g.check("multiple_choice", payload, 1) is False
    assert g.check("multiple_choice", payload, "x") is False


def test_translate_order_matters():
    payload = {"words": ["Yo", "soy", "un", "niño"], "answer": ["Yo", "soy", "un", "niño"]}
    assert g.check("translate", payload, ["Yo", "soy", "un", "niño"]) is True
    assert g.check("translate", payload, ["soy", "Yo", "un", "niño"]) is False
    assert g.check("translate", payload, "not a list") is False


def test_translate_is_case_insensitive():
    payload = {"answer": ["Yo", "soy"]}
    assert g.check("translate", payload, ["yo", "SOY"]) is True


def test_match_ignores_pair_order():
    payload = {"pairs": [{"left": "gato", "right": "cat"}, {"left": "perro", "right": "dog"}]}
    assert g.check("match", payload, [["perro", "dog"], ["gato", "cat"]]) is True
    assert g.check("match", payload, [["gato", "dog"], ["perro", "cat"]]) is False


def test_fill_blank_accepts_and_normalizes():
    payload = {"answer": "suis", "accepted": ["suis"]}
    assert g.check("fill_blank", payload, "  Suis ") is True
    assert g.check("fill_blank", payload, "est") is False


def test_type_answer_accepts_variants_and_punctuation():
    payload = {"answer": "I am a man", "accepted": ["I am a man", "I'm a man"]}
    assert g.check("type_answer", payload, "i am a man") is True
    assert g.check("type_answer", payload, "I'm a man!") is True
    assert g.check("type_answer", payload, "a man") is False


def test_unknown_type_is_false():
    assert g.check("mystery", {}, "anything") is False
