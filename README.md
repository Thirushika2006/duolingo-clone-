# Duolingo Clone

A functional clone of the Duolingo web app — a gamified language-learning experience
with a skill-tree learning path, an interactive lesson player with five exercise types,
hearts, XP, streaks, a daily goal, achievements, and a leaderboard. Built from scratch
(no Duolingo assets or third-party clone code).

![stack](https://img.shields.io/badge/Next.js-16-black) ![stack](https://img.shields.io/badge/FastAPI-0.1x-009688) ![stack](https://img.shields.io/badge/SQLite-3-003B57)

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Query · Zustand · Framer Motion |
| Backend    | Python · FastAPI · SQLAlchemy 2.0 · Pydantic |
| Database   | SQLite |
| Testing    | pytest (28 backend tests) |

---

## Features

**Learning path / skill tree**
- Winding path of units → skills with locked / available / completed states
- Progress rings per skill and gold crown nodes for completed skills
- An animated "Start" bubble + start popover on the active node
- Top bar with streak, gems (mocked), hearts; a right rail with the daily-goal ring

**Lesson player (the core loop)**
- Five exercise types: multiple choice, translate (tap-the-words word bank),
  match pairs, fill-in-the-blank, and type-the-answer
- Signature feedback bar that slides up (green/correct, red/incorrect) and reveals the
  correct answer on a miss
- Lesson progress bar, heart loss on wrong answers, out-of-hearts handling
- XP award, skill-crown progression, and a celebratory lesson-complete screen

**Gamification & progress (persisted per user)**
- Streak derived from a daily-activity log; daily XP goal indicator
- Hearts that regenerate over time (computed on read) or via a mocked practice/refill
- Achievements with live progress bars; a leaderboard over seeded users
- A **debug "Advance one day"** control so day/streak logic is testable (per the brief)

**Experience & polish**
- Nunito font + Duolingo color palette, the "3D" pressable buttons
- Framer Motion animations (feedback bar, node bounce, modals, complete screen)
- Dark mode, responsive layout (desktop sidebar → mobile bottom tabs)
- Optional text-to-speech on tapped words (browser `speechSynthesis`)
- "Coming soon" placeholders for Super, gems purchase, notifications

---

## Architecture Overview

```
┌──────────────────────────┐        REST / JSON         ┌───────────────────────────┐
│   Next.js frontend :3000 │  ───────────────────────►  │   FastAPI backend :8000    │
│                          │                            │                            │
│  App Router pages        │   GET  /api/path           │  routers/   (HTTP layer)   │
│  React Query (server     │   GET  /api/lessons/{id}   │  services/  (pure logic):  │
│    state) + Zustand      │   POST /api/lessons/{id}/  │    grading · hearts ·      │
│  Tailwind design system  │        check | complete    │    streak · progress       │
│                          │   GET  /api/profile        │  models.py  (SQLAlchemy)   │
│                          │   GET  /api/leaderboard    │        │                   │
│                          │   POST /api/hearts/refill  │        ▼                   │
│                          │   POST /api/debug/         │   SQLite  (app.db)         │
│                          │        advance-day         │                            │
└──────────────────────────┘                            └───────────────────────────┘
```

**Key design decisions**
- **Server validates every answer.** The client never decides correctness; exercise
  payloads are sanitized (answer keys stripped) before being sent, so XP and hearts
  can't be faked. See `backend/app/services/grading.py`.
- **Hearts regenerate on read** from `hearts_updated_at` — no background job.
  See `backend/app/services/hearts.py`.
- **Streak & daily goal are derived** from the `daily_activity` table rather than a
  stored counter, so they can't drift out of sync. See `services/streak.py`.
- **Exercise content is a JSON payload** keyed by `type`, keeping five very different
  exercise shapes in one table while staying seed-friendly.
- **No real auth** — a single default learner (`user_id = 1`) is assumed logged in.

---

## Database Schema

```
courses            ──1:N──►  units  ──1:N──►  skills  ──1:N──►  lessons  ──1:N──►  exercises
                                                                                   (type, prompt,
                                                                                    JSON payload)

users ──1:N──► user_skill_progress (crown_level, lessons_completed)   ► skills
      ──1:N──► lesson_attempts      (xp_earned, mistakes, timestamp)   ► lessons
      ──1:N──► daily_activity       (date, xp)   ← streak + daily goal derived here
      ──1:N──► user_achievements    (progress, unlocked_at)            ► achievements

achievements (code, title, description, icon, threshold)

leaderboard = SELECT users ORDER BY total_xp DESC   (no table of its own)
```

**Tables**

| Table | Purpose / notable columns |
|-------|---------------------------|
| `courses` | one seeded course (Spanish). `language_name`, `language_flag` |
| `units` | ordered units within a course. `color`, `order_index` |
| `skills` | ordered skills within a unit. `icon`, `order_index` |
| `lessons` | ordered lessons within a skill. `xp_reward` |
| `exercises` | `type`, `prompt`, JSON `payload` (choices / word bank / pairs / accepted answers) |
| `users` | learner + seeded leaderboard users. `total_xp`, `gems`, `hearts`, `hearts_updated_at`, `daily_goal_xp` |
| `user_skill_progress` | per-user crown level + lessons completed. Unique (user, skill) |
| `lesson_attempts` | log of completed lessons (xp, mistakes, time) |
| `daily_activity` | one row per user per active day; `xp`. Unique (user, date) |
| `achievements` / `user_achievements` | achievement definitions + per-user progress/unlock |

---

## Setup

Requirements: **Node.js 18+** and **Python 3.11+** (developed on Node 24 / Python 3.14).
On Windows the Python launcher is `py`; on macOS/Linux use `python3`.

### 1. Backend (FastAPI, port 8000)

```bash
cd backend
py -m venv venv                 # Windows        (python3 -m venv venv on mac/linux)
venv\Scripts\activate           # Windows        (source venv/bin/activate on mac/linux)
pip install -r requirements.txt
python seed.py                  # create + seed app.db
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend (Next.js, port 3000)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 → redirects to `/learn`. The app expects the API at
`http://localhost:8000` (override with `NEXT_PUBLIC_API_URL`).

### 3. Tests

```bash
cd backend
venv\Scripts\python.exe -m pytest      # 28 tests: hearts, streak, grading, unlock logic
```

---

## Seeded Data

Running `seed.py` creates:
- **1 course** (Spanish) · **3 units** · **9 skills** · **9 lessons** · **36 exercises**
  spanning all five exercise types
- A **sample learner** "Diego" (`user_id = 1`) with 240 XP, a 5-day streak, 4 hearts,
  the first three skills completed, and two achievements unlocked
- **9 additional seeded users** for the leaderboard
- **5 achievements** (First Steps, Wildfire, Century, Champion, Explorer)

So the app is immediately usable on first load.

---

## How to Try the Core Flows

1. **Learning path** — `/learn`. Completed skills show gold crowns; the active skill has
   a bouncing "Start". Locked skills show a padlock.
2. **Lesson loop** — tap the active node → **Start**. Answer the exercises; a wrong answer
   slides up the red feedback bar and costs a heart. Finish to see the celebration screen,
   then watch the next skill unlock back on the path.
3. **Out of hearts** — miss enough answers to hit zero and the out-of-hearts modal appears;
   use **Practice to refill**.
4. **Streak testing** — in the right rail, **Advance one day**, then complete a lesson to
   watch the streak increment (this exercises `POST /api/debug/advance-day`).
5. **Other pages** — `/leaderboard`, `/profile` (stats + achievements), `/shop`, `/settings`
   (dark-mode toggle).

---

## Assumptions

- **No authentication.** A single default learner is always "logged in" (the brief allows
  simplified auth). All progress persists to SQLite for that user.
- **Gems and in-app purchases are mocked** (no real economy).
- **One language course** (Spanish) is seeded; the schema supports more.
- **Audio** is browser text-to-speech only; no recorded/seeded audio files.
- **Hearts** cap at 5 and regenerate 1 per 30 minutes (configurable in `app/config.py`).
- The **debug advance-day** endpoint simulates time passing by shifting the learner's
  activity back a day — intended for evaluating streak logic without waiting.

---

## Project Structure

```
duolingo-clone/
├── backend/
│   ├── app/
│   │   ├── main.py            FastAPI app + CORS
│   │   ├── models.py          SQLAlchemy models (the schema)
│   │   ├── schemas.py         Pydantic request/response contracts
│   │   ├── routers/           path · lessons · profile · leaderboard · hearts · debug
│   │   └── services/          grading · hearts · streak · progress  (pure, tested)
│   ├── seed.py                course content + sample learner
│   └── tests/                 pytest suite
├── frontend/
│   └── src/
│       ├── app/               routes: (main) group + lesson/[id]
│       ├── components/        ui/ · layout/ · path/ · lesson/ (+ exercises/)
│       └── lib/               api client · hooks · types · speech
├── docs/SPEC.md               the assignment brief
└── CLAUDE.md                  project conventions
```
