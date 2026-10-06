// Typed API client for the FastAPI backend.
import type {
  CheckResponse,
  CompleteResponse,
  HeartsResponse,
  LeaderboardEntry,
  Lesson,
  PathData,
  Profile,
} from "./types";

const BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${detail || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getPath: () => req<PathData>("/api/path"),

  getLesson: (lessonId: number) => req<Lesson>(`/api/lessons/${lessonId}`),

  checkAnswer: (lessonId: number, exerciseId: number, answer: unknown) =>
    req<CheckResponse>(`/api/lessons/${lessonId}/check`, {
      method: "POST",
      body: JSON.stringify({ exercise_id: exerciseId, answer }),
    }),

  completeLesson: (lessonId: number, mistakes: number) =>
    req<CompleteResponse>(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify({ mistakes }),
    }),

  getProfile: () => req<Profile>("/api/profile"),

  getLeaderboard: () => req<LeaderboardEntry[]>("/api/leaderboard"),

  getHearts: () => req<HeartsResponse>("/api/hearts"),

  refillHearts: () =>
    req<HeartsResponse>("/api/hearts/refill", { method: "POST" }),

  advanceDay: () =>
    req<{ message: string; streak: number }>("/api/debug/advance-day", {
      method: "POST",
    }),
};
