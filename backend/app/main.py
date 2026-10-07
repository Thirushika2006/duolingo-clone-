"""FastAPI application entrypoint."""
from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from .database import Base, SessionLocal, engine
from .models import Course
from .routers import debug, hearts, leaderboard, lessons, path, profile

Base.metadata.create_all(engine)


def _ensure_seeded() -> None:
    """Seed on a fresh server (e.g. a hosting platform's ephemeral disk).

    Only runs when the course table is empty, so it never clobbers existing
    local data. Locally you'd still run `python seed.py` explicitly.
    """
    db = SessionLocal()
    try:
        if db.scalar(select(Course)) is None:
            from seed import seed  # imported lazily; seed.py lives at backend root

            seed()
    finally:
        db.close()


_ensure_seeded()

app = FastAPI(title="Duolingo Clone API", version="1.0.0")

# Allowed origins come from an env var in production (comma-separated), falling
# back to local dev. We send no cookies, so credentials can stay off and "*" is
# acceptable for a public demo.
_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allow_origins = (
    [o.strip() for o in _origins_env.split(",") if o.strip()]
    if _origins_env
    else ["http://localhost:3000", "http://127.0.0.1:3000"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(path.router)
app.include_router(lessons.router)
app.include_router(profile.router)
app.include_router(leaderboard.router)
app.include_router(hearts.router)
app.include_router(debug.router)


@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}
