"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export function usePath() {
  return useQuery({ queryKey: ["path"], queryFn: api.getPath });
}

export function useLesson(lessonId: number) {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => api.getLesson(lessonId),
    enabled: Number.isFinite(lessonId),
  });
}

export function useProfile() {
  return useQuery({ queryKey: ["profile"], queryFn: api.getProfile });
}

export function useLeaderboard() {
  return useQuery({ queryKey: ["leaderboard"], queryFn: api.getLeaderboard });
}

export function useHearts() {
  return useQuery({ queryKey: ["hearts"], queryFn: api.getHearts });
}

export function useRefillHearts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.refillHearts,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hearts"] });
      qc.invalidateQueries({ queryKey: ["path"] });
    },
  });
}

export function useAdvanceDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.advanceDay,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["path"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
