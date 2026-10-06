# Duolingo Clone — Project Guide

A functional Duolingo web clone. See `docs/SPEC.md` for the full assignment brief.
Focus: the lesson loop + gamification, with a UI that closely matches Duolingo.

## Stack
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS. React Query (server
  state), Zustand (in-lesson state), Framer Motion (animations).
- **Backend:** Python + FastAPI + SQLAlchemy 2.0 + Pydantic.
- **DB:** SQLite (single file, `backend/app.db`).

## Folder Layout
```
frontend/        Next.js app (src/ dir, @/* import alias)
backend/
  app/
    main.py      FastAPI app + CORS
    database.py  engine / session
    models.py    SQLAlchemy models
    schemas.py   Pydantic schemas
    routers/     path, lessons, progress, profile, leaderboard, debug
    services/    XP / streak / hearts / unlock logic (pure, testable)
  seed.py        seeds 1 course, 3 units, ~8 skills, 5 exercise types, leaderboard users
  tests/         pytest (heart regen, streak, unlock logic)
  requirements.txt
docs/SPEC.md     assignment brief
```

## Run Commands (Windows / PowerShell)
Python is **3.14** and the `python` alias is NOT on PATH — use the `py` launcher.
- Backend setup: `cd backend; py -m venv venv; venv\Scripts\Activate.ps1; pip install -r requirements.txt`
- Seed DB: `cd backend; venv\Scripts\python.exe seed.py`
- Run API: `cd backend; venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000`
- Tests: `cd backend; venv\Scripts\python.exe -m pytest`
- Frontend: `cd frontend; npm run dev` (http://localhost:3000)
- API runs on http://localhost:8000, docs at /docs

## Architecture Decisions (keep these)
- **No real auth.** A single default learner (`user_id = 1`) is assumed logged in.
- **Server validates all answers.** The client never decides correctness; XP and hearts
  are computed server-side so they can't be faked.
- **Hearts regenerate on read**, computed from `hearts_updated_at` (no background job).
- **Streak + daily goal are derived** from a `daily_activity(user, date, xp)` table —
  no denormalized streak counter that can drift.
- **A debug `POST /debug/advance-day` endpoint** exists so day/streak logic is testable
  (the brief requires simulatable day logic).
- **Exercises:** each row has a `type`, `prompt`, and a JSON `payload` (choices / word
  bank / pairs / accepted answers). One React renderer component per type behind a shared
  interface (`onAnswer`, `isChecked`).

## Design Tokens (match Duolingo)
- **Font:** Nunito, weights 700–800.
- **Colors:** green `#58CC02` (primary), blue `#1CB0F6`, red `#FF4B4B`,
  yellow `#FFC800`, borders `#E5E5E5`, text `#4B4B4B`. Darker green press `#58A700`.
- **Buttons ("3D"):** 2px border + 4px darker bottom border that collapses on press;
  uppercase, bold, rounded-2xl.
- **Path:** round nodes offset horizontally in a sine-wave pattern.
- **Feedback bar:** slides up from the bottom, green/red tinted; Check button becomes
  Continue after checking.

## Rules
- **Original work only.** Do NOT copy Duolingo's owl/mascot or any real assets, and do
  NOT lift code from existing Duolingo-clone repos. Draw our own SVG mascot.
- Server is the source of truth for all progress.
- Commit after each phase that works.
