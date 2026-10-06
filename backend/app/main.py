"""FastAPI application entrypoint."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import debug, hearts, leaderboard, lessons, path, profile

# Create tables on startup if they don't exist (seed.py populates them).
Base.metadata.create_all(engine)

app = FastAPI(title="Duolingo Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
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
