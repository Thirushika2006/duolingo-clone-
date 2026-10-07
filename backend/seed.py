"""Seed the SQLite database.

Creates one course (Spanish for English speakers) with 3 units, 9 skills, lessons
built from all five exercise types, 10 leaderboard users, and a sample learner
(id=1, "Diego") with partial progress, an active streak, and some achievements.

Run:  venv\\Scripts\\python.exe seed.py
"""
from __future__ import annotations

import datetime as dt
import random

from app.clock import utcnow
from app.database import Base, SessionLocal, engine
from app.models import (
    Achievement,
    Course,
    DailyActivity,
    Exercise,
    Lesson,
    Skill,
    Unit,
    User,
    UserAchievement,
    UserSkillProgress,
)


# --------------------------------------------------------------------------- #
# Exercise builders — small helpers so the content below reads cleanly.
# --------------------------------------------------------------------------- #
def mc(prompt, choices, answer_index):
    return dict(type="multiple_choice", prompt=prompt,
               payload={"choices": choices, "answer_index": answer_index})


def translate(prompt, words, answer):
    # words = the word bank (tappable), answer = the correct ordered sequence
    return dict(type="translate", prompt=prompt,
               payload={"words": words, "answer": answer})


def match(prompt, pairs):
    return dict(type="match", prompt=prompt, payload={"pairs": pairs})


def fill_blank(prompt, sentence, answer, choices):
    return dict(type="fill_blank", prompt=prompt,
               payload={"sentence": sentence, "answer": answer, "choices": choices})


def type_answer(prompt, answer, accepted=None):
    return dict(type="type_answer", prompt=prompt,
               payload={"answer": answer, "accepted": accepted or [answer]})


# --------------------------------------------------------------------------- #
# Course content
# --------------------------------------------------------------------------- #
# Each skill is a list of lessons; each lesson is a list of exercise dicts.
COURSE_CONTENT = {
    "title": "Spanish",
    "language_name": "Spanish",
    "language_flag": "🇪🇸",
    "units": [
        {
            "title": "Form basic sentences",
            "description": "Order food, use basic phrases",
            "color": "#58CC02",
            "skills": [
                {
                    "title": "Basics 1", "icon": "book",
                    "lessons": [
                        [
                            mc("Which one of these is “the woman”?",
                               ["la mujer", "el hombre", "el niño", "la manzana"], 0),
                            translate("Tap what you hear: “Yo soy un niño”",
                                      ["Yo", "soy", "un", "niño", "ella", "pan"],
                                      ["Yo", "soy", "un", "niño"]),
                            fill_blank("Complete the sentence",
                                       "La ___ come pan.", "mujer",
                                       ["mujer", "hombre", "agua"]),
                            type_answer("Translate: “I am a man”", "Yo soy un hombre",
                                        ["Yo soy un hombre", "soy un hombre"]),
                            match("Tap the matching pairs", [
                                {"left": "mujer", "right": "woman"},
                                {"left": "hombre", "right": "man"},
                                {"left": "niño", "right": "boy"},
                                {"left": "pan", "right": "bread"},
                            ]),
                        ],
                    ],
                },
                {
                    "title": "Basics 2", "icon": "book",
                    "lessons": [
                        [
                            mc("Which one of these is “the water”?",
                               ["el agua", "la leche", "el pan", "la manzana"], 0),
                            translate("Translate: “She drinks water”",
                                      ["Ella", "bebe", "agua", "come", "él", "leche"],
                                      ["Ella", "bebe", "agua"]),
                            fill_blank("Complete the sentence",
                                       "El niño ___ leche.", "bebe",
                                       ["bebe", "come", "soy"]),
                            type_answer("Translate: “I eat an apple”", "Yo como una manzana",
                                        ["Yo como una manzana", "como una manzana"]),
                        ],
                    ],
                },
                {
                    "title": "Greetings", "icon": "wave",
                    "lessons": [
                        [
                            mc("How do you say “Hello”?",
                               ["Hola", "Adiós", "Gracias", "Sí"], 0),
                            mc("How do you say “Goodbye”?",
                               ["Adiós", "Hola", "Buenos días", "No"], 0),
                            translate("Translate: “Good morning”",
                                      ["Buenos", "días", "noches", "tardes"],
                                      ["Buenos", "días"]),
                            match("Tap the matching pairs", [
                                {"left": "Hola", "right": "Hello"},
                                {"left": "Adiós", "right": "Goodbye"},
                                {"left": "Gracias", "right": "Thanks"},
                                {"left": "Por favor", "right": "Please"},
                            ]),
                        ],
                    ],
                },
                {
                    "title": "Phrases", "icon": "chat",
                    "lessons": [
                        [
                            mc("“Thank you very much” is…",
                               ["Muchas gracias", "De nada", "Lo siento", "Hasta luego"], 0),
                            fill_blank("Complete: “You're welcome”",
                                       "De ___.", "nada", ["nada", "gracias", "favor"]),
                            type_answer("Translate: “I'm sorry”", "Lo siento",
                                        ["Lo siento", "lo siento"]),
                        ],
                    ],
                },
            ],
        },
        {
            "title": "Get around town",
            "description": "Travel and food",
            "color": "#1CB0F6",
            "skills": [
                {
                    "title": "Travel", "icon": "map",
                    "lessons": [
                        [
                            mc("Which one is “the airport”?",
                               ["el aeropuerto", "el hotel", "la calle", "el tren"], 0),
                            translate("Translate: “Where is the hotel?”",
                                      ["¿Dónde", "está", "el", "hotel", "?", "cómo"],
                                      ["¿Dónde", "está", "el", "hotel", "?"]),
                            fill_blank("Complete the sentence",
                                       "El ___ es rápido.", "tren",
                                       ["tren", "hotel", "mapa"]),
                            type_answer("Translate: “the city”", "la ciudad",
                                        ["la ciudad", "ciudad"]),
                        ],
                    ],
                },
                {
                    "title": "Food", "icon": "food",
                    "lessons": [
                        [
                            mc("Which one is “the coffee”?",
                               ["el café", "el té", "la sopa", "el queso"], 0),
                            translate("Translate: “I want a coffee”",
                                      ["Quiero", "un", "café", "una", "sopa", "té"],
                                      ["Quiero", "un", "café"]),
                            match("Tap the matching pairs", [
                                {"left": "café", "right": "coffee"},
                                {"left": "queso", "right": "cheese"},
                                {"left": "sopa", "right": "soup"},
                                {"left": "arroz", "right": "rice"},
                            ]),
                            type_answer("Translate: “the restaurant”", "el restaurante",
                                        ["el restaurante", "restaurante"]),
                        ],
                    ],
                },
                {
                    "title": "Family", "icon": "family",
                    "lessons": [
                        [
                            mc("Which one is “the mother”?",
                               ["la madre", "el padre", "el hermano", "la hija"], 0),
                            fill_blank("Complete the sentence",
                                       "Mi ___ es alto.", "padre",
                                       ["padre", "madre", "hija"]),
                            translate("Translate: “My family”",
                                      ["Mi", "familia", "madre", "casa"],
                                      ["Mi", "familia"]),
                            type_answer("Translate: “the brother”", "el hermano",
                                        ["el hermano", "hermano"]),
                        ],
                    ],
                },
            ],
        },
        {
            "title": "Describe your surroundings",
            "description": "Animals and colors",
            "color": "#CE82FF",
            "skills": [
                {
                    "title": "Animals", "icon": "paw",
                    "lessons": [
                        [
                            mc("Which one is “the cat”?",
                               ["el gato", "el perro", "el pájaro", "el pez"], 0),
                            match("Tap the matching pairs", [
                                {"left": "gato", "right": "cat"},
                                {"left": "perro", "right": "dog"},
                                {"left": "pájaro", "right": "bird"},
                                {"left": "caballo", "right": "horse"},
                            ]),
                            translate("Translate: “The dog is big”",
                                      ["El", "perro", "es", "grande", "gato", "pequeño"],
                                      ["El", "perro", "es", "grande"]),
                            type_answer("Translate: “the bird”", "el pájaro",
                                        ["el pájaro", "pájaro", "el pajaro"]),
                        ],
                    ],
                },
                {
                    "title": "Colors", "icon": "palette",
                    "lessons": [
                        [
                            mc("Which one is “red”?",
                               ["rojo", "azul", "verde", "amarillo"], 0),
                            match("Tap the matching pairs", [
                                {"left": "rojo", "right": "red"},
                                {"left": "azul", "right": "blue"},
                                {"left": "verde", "right": "green"},
                                {"left": "negro", "right": "black"},
                            ]),
                            fill_blank("Complete the sentence",
                                       "El cielo es ___.", "azul",
                                       ["azul", "rojo", "verde"]),
                            type_answer("Translate: “yellow”", "amarillo",
                                        ["amarillo"]),
                        ],
                    ],
                },
                {
                    "title": "Numbers", "icon": "star",
                    "lessons": [
                        [
                            mc("Which one is “three”?",
                               ["tres", "dos", "uno", "cuatro"], 0),
                            match("Tap the matching pairs", [
                                {"left": "uno", "right": "one"},
                                {"left": "dos", "right": "two"},
                                {"left": "tres", "right": "three"},
                                {"left": "cuatro", "right": "four"},
                            ]),
                            translate("Translate: “one apple”",
                                      ["una", "manzana", "dos", "pan"],
                                      ["una", "manzana"]),
                            type_answer("Translate: “five”", "cinco", ["cinco"]),
                        ],
                    ],
                },
                {
                    "title": "Weather", "icon": "star",
                    "lessons": [
                        [
                            mc("Which one is “the sun”?",
                               ["el sol", "la lluvia", "el viento", "la nube"], 0),
                            fill_blank("Complete the sentence",
                                       "Hace ___ hoy.", "sol",
                                       ["sol", "lluvia", "frío"]),
                            translate("Translate: “It is cold”",
                                      ["Hace", "frío", "calor", "sol"],
                                      ["Hace", "frío"]),
                            type_answer("Translate: “the rain”", "la lluvia",
                                        ["la lluvia", "lluvia"]),
                        ],
                    ],
                },
                {
                    "title": "The house", "icon": "star",
                    "lessons": [
                        [
                            mc("Which one is “the house”?",
                               ["la casa", "la mesa", "la puerta", "la silla"], 0),
                            match("Tap the matching pairs", [
                                {"left": "casa", "right": "house"},
                                {"left": "mesa", "right": "table"},
                                {"left": "puerta", "right": "door"},
                                {"left": "silla", "right": "chair"},
                            ]),
                            fill_blank("Complete the sentence",
                                       "La ___ es grande.", "casa",
                                       ["casa", "mesa", "puerta"]),
                            type_answer("Translate: “the table”", "la mesa",
                                        ["la mesa", "mesa"]),
                        ],
                    ],
                },
            ],
        },
    ],
}


ACHIEVEMENTS = [
    dict(code="first_lesson", title="First Steps",
         description="Complete your first lesson", icon="shoe", threshold=1),
    dict(code="streak_7", title="Wildfire",
         description="Reach a 7 day streak", icon="flame", threshold=7),
    dict(code="xp_100", title="Century",
         description="Earn 100 total XP", icon="bolt", threshold=100),
    dict(code="xp_500", title="Champion",
         description="Earn 500 total XP", icon="trophy", threshold=500),
    dict(code="unit_complete", title="Explorer",
         description="Complete a full unit", icon="compass", threshold=1),
]

LEADERBOARD_NAMES = [
    ("sofia_g", "Sofía", "#FF4B4B"), ("liam99", "Liam", "#1CB0F6"),
    ("emma_r", "Emma", "#CE82FF"), ("noah_k", "Noah", "#FF9600"),
    ("ava_m", "Ava", "#58CC02"), ("mateo", "Mateo", "#FFC800"),
    ("olivia", "Olivia", "#FF4B4B"), ("lucas_p", "Lucas", "#1CB0F6"),
    ("mia_t", "Mia", "#CE82FF"),
]


def seed() -> None:
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    db = SessionLocal()
    random.seed(42)

    # --- Course content -------------------------------------------------- #
    course = Course(
        title=COURSE_CONTENT["title"],
        language_name=COURSE_CONTENT["language_name"],
        language_flag=COURSE_CONTENT["language_flag"],
        from_language="English",
    )
    db.add(course)
    db.flush()

    all_skills: list[Skill] = []
    for u_idx, unit_data in enumerate(COURSE_CONTENT["units"]):
        unit = Unit(course_id=course.id, title=unit_data["title"],
                    description=unit_data["description"], color=unit_data["color"],
                    order_index=u_idx)
        db.add(unit)
        db.flush()
        for s_idx, skill_data in enumerate(unit_data["skills"]):
            skill = Skill(unit_id=unit.id, title=skill_data["title"],
                          icon=skill_data["icon"], order_index=s_idx)
            db.add(skill)
            db.flush()
            all_skills.append(skill)
            for l_idx, exercises in enumerate(skill_data["lessons"]):
                lesson = Lesson(skill_id=skill.id, order_index=l_idx, xp_reward=10)
                db.add(lesson)
                db.flush()
                for e_idx, ex in enumerate(exercises):
                    db.add(Exercise(lesson_id=lesson.id, order_index=e_idx,
                                    type=ex["type"], prompt=ex["prompt"],
                                    payload=ex["payload"]))

    # --- Achievements ---------------------------------------------------- #
    achievements = {}
    for a in ACHIEVEMENTS:
        ach = Achievement(**a)
        db.add(ach)
        db.flush()
        achievements[a["code"]] = ach

    # --- Sample learner (id=1) ------------------------------------------- #
    learner = User(username="diego", display_name="Diego", avatar_color="#58CC02",
                   total_xp=240, gems=500, daily_goal_xp=50, hearts=4,
                   hearts_updated_at=utcnow())
    db.add(learner)
    db.flush()

    # Completed the first three skills (crowns), started the fourth.
    for i, skill in enumerate(all_skills):
        if i < 3:
            db.add(UserSkillProgress(user_id=learner.id, skill_id=skill.id,
                                     crown_level=1, lessons_completed=len(skill.lessons)))

    # Active streak: last 5 days including today.
    today = dt.date.today()
    for d in range(5):
        db.add(DailyActivity(user_id=learner.id,
                             date=today - dt.timedelta(days=d),
                             xp=50 if d == 0 else random.choice([30, 40, 50, 60])))

    # Unlock a couple of achievements for the learner.
    db.add(UserAchievement(user_id=learner.id,
                           achievement_id=achievements["first_lesson"].id,
                           progress=1, unlocked_at=utcnow()))
    db.add(UserAchievement(user_id=learner.id,
                           achievement_id=achievements["xp_100"].id,
                           progress=240, unlocked_at=utcnow()))

    # --- Leaderboard users ---------------------------------------------- #
    for uname, dname, color in LEADERBOARD_NAMES:
        xp = random.randint(80, 600)
        u = User(username=uname, display_name=dname, avatar_color=color,
                 total_xp=xp, gems=random.randint(100, 900), daily_goal_xp=50,
                 hearts=5, hearts_updated_at=utcnow())
        db.add(u)
        db.flush()
        # Give them some activity today so they appear on a daily board.
        db.add(DailyActivity(user_id=u.id, date=today,
                             xp=random.randint(10, 80)))

    db.commit()

    # Report
    skills_n = len(all_skills)
    lessons_n = db.query(Lesson).count()
    ex_n = db.query(Exercise).count()
    users_n = db.query(User).count()
    db.close()
    print(f"Seeded: 1 course, {len(COURSE_CONTENT['units'])} units, {skills_n} skills, "
          f"{lessons_n} lessons, {ex_n} exercises, {users_n} users, "
          f"{len(ACHIEVEMENTS)} achievements.")
    print("Sample learner: username='diego' (id=1), 240 XP, 5-day streak, 4 hearts.")


if __name__ == "__main__":
    seed()
