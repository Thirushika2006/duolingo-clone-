"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExerciseProps } from "../types";
import { speak } from "@/lib/speech";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchPairs({ exercise, disabled, onReady }: ExerciseProps) {
  const pairs = useMemo(
    () => (exercise.payload.pairs as { left: string; right: string }[]) ?? [],
    [exercise]
  );
  const lefts = useMemo(() => shuffle(pairs.map((p) => p.left)), [pairs]);
  const rights = useMemo(() => shuffle(pairs.map((p) => p.right)), [pairs]);

  const [selLeft, setSelLeft] = useState<string | null>(null);
  // left value -> right value
  const [matches, setMatches] = useState<Record<string, string>>({});

  useEffect(() => {
    const complete = Object.keys(matches).length === pairs.length && pairs.length > 0;
    onReady(complete ? Object.entries(matches).map(([l, r]) => [l, r]) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  const leftMatched = (l: string) => l in matches;
  const rightMatched = (r: string) => Object.values(matches).includes(r);

  const tapLeft = (l: string) => {
    if (disabled || leftMatched(l)) return;
    setSelLeft(l);
    speak(l);
  };
  const tapRight = (r: string) => {
    if (disabled || rightMatched(r)) return;
    if (selLeft) {
      setMatches((m) => ({ ...m, [selLeft]: r }));
      setSelLeft(null);
    }
  };

  const chip = (label: string, matched: boolean, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      disabled={matched}
      className={[
        "w-full rounded-2xl border-2 border-b-4 px-4 py-4 font-bold transition-all",
        matched
          ? "border-feather bg-feather/15 text-feather opacity-60"
          : active
          ? "border-macaw bg-macaw/10 text-macaw"
          : "surface border text-body hover:bg-black/[0.03] dark:hover:bg-white/5",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-body mb-6">{exercise.prompt}</h2>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="flex flex-col gap-3">
          {lefts.map((l) => chip(l, leftMatched(l), selLeft === l, () => tapLeft(l)))}
        </div>
        <div className="flex flex-col gap-3">
          {rights.map((r) => chip(r, rightMatched(r), false, () => tapRight(r)))}
        </div>
      </div>
    </div>
  );
}
