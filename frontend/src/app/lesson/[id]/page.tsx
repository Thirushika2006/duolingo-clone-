"use client";

import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useHearts, useRefillHearts } from "@/lib/hooks";
import type { CompleteResponse } from "@/lib/types";
import { ExerciseRenderer } from "@/components/lesson/ExerciseRenderer";
import { FeedbackBar } from "@/components/lesson/FeedbackBar";
import { LessonComplete } from "@/components/lesson/LessonComplete";
import { OutOfHearts } from "@/components/lesson/OutOfHearts";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { HeartIcon } from "@/components/Icons";
import { useLesson } from "@/lib/hooks";
import { playComplete, playCorrect, playWrong } from "@/lib/sound";
import { toast } from "@/lib/toast";

function answerToText(a: unknown): string | null {
  if (a == null) return null;
  if (typeof a === "string") return a;
  if (Array.isArray(a)) {
    // match answer = [[left,right],...]; translate = [words]
    if (a.length && Array.isArray(a[0])) {
      return (a as string[][]).map((p) => p.join(" – ")).join(", ");
    }
    return (a as string[]).join(" ");
  }
  return String(a);
}

export default function LessonPage() {
  const params = useParams();
  const lessonId = Number(params.id);
  const router = useRouter();
  const qc = useQueryClient();

  const { data: lesson, isLoading } = useLesson(lessonId);
  const { data: heartsData } = useHearts();
  const refill = useRefillHearts();

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>(null);
  const [status, setStatus] = useState<"correct" | "wrong" | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [hearts, setHearts] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [result, setResult] = useState<CompleteResponse | null>(null);

  const currentHearts = hearts ?? heartsData?.hearts ?? 5;

  if (isLoading || !lesson)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted font-bold">
        Loading lesson…
      </div>
    );

  const total = lesson.exercises.length;
  const exercise = lesson.exercises[index];

  async function check() {
    if (answer == null || checking) return;
    setChecking(true);
    try {
      const res = await api.checkAnswer(lessonId, exercise.id, answer);
      setHearts(res.hearts);
      if (res.correct) {
        setStatus("correct");
        playCorrect();
      } else {
        setStatus("wrong");
        setMistakes((m) => m + 1);
        setCorrectAnswer(answerToText(res.correct_answer));
        playWrong();
        // (out-of-hearts is surfaced on Continue via the next() handler)
      }
    } finally {
      setChecking(false);
    }
  }

  async function next() {
    // Out of hearts after a wrong answer -> block progression.
    if (status === "wrong" && (hearts ?? 5) <= 0) {
      setStatus(null);
      setOutOfHearts(true);
      return;
    }

    setStatus(null);
    setCorrectAnswer(null);

    if (index < total - 1) {
      setIndex((i) => i + 1);
      setAnswer(null);
    } else {
      const res = await api.completeLesson(lessonId, mistakes);
      qc.invalidateQueries({ queryKey: ["path"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["hearts"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
      playComplete();
      res.newly_unlocked_achievements.forEach((title) =>
        toast(`Achievement unlocked: ${title}`, { emoji: "🏅", variant: "success" })
      );
      setResult(res);
    }
  }

  function doRefill() {
    refill.mutate(undefined, {
      onSuccess: (data) => {
        setHearts(data.hearts);
        setOutOfHearts(false);
        setAnswer(null); // retry the current exercise
      },
    });
  }

  if (result) {
    return (
      <>
        <Confetti />
        <LessonComplete result={result} onContinue={() => router.push("/learn")} />
      </>
    );
  }

  return (
    <div className="min-h-screen page-bg flex flex-col">
      {/* Header: close, progress, hearts */}
      <header className="flex items-center gap-4 max-w-3xl w-full mx-auto px-4 py-5">
        <button
          onClick={() => router.push("/learn")}
          className="text-2xl text-hare hover:text-wolf font-bold"
          aria-label="Quit lesson"
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar value={index + (status ? 1 : 0)} max={total} />
        </div>
        <div className="flex items-center gap-1 font-bold text-cardinal">
          <HeartIcon width={26} height={26} />
          {currentHearts}
        </div>
      </header>

      {/* Exercise */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <ExerciseRenderer
          exercise={exercise}
          disabled={status !== null}
          onReady={setAnswer}
        />
      </main>

      {/* Check button (hidden while feedback bar is showing) */}
      {status === null && (
        <footer className="border-t-2 border-swan dark:border-[#37464f]">
          <div className="max-w-3xl mx-auto px-4 py-5 flex justify-end">
            <Button
              variant={answer == null ? "locked" : "primary"}
              size="lg"
              onClick={check}
              disabled={answer == null || checking}
            >
              Check
            </Button>
          </div>
        </footer>
      )}

      <FeedbackBar status={status} correctAnswer={correctAnswer} onContinue={next} />

      <OutOfHearts
        open={outOfHearts}
        refilling={refill.isPending}
        onRefill={doRefill}
        onQuit={() => router.push("/learn")}
      />
    </div>
  );
}
