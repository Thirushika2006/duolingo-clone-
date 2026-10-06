"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExerciseProps } from "../types";
import { speak } from "@/lib/speech";

// Tap-the-words: a word bank at the bottom feeds an answer row at the top.
export function Translate({ exercise, disabled, onReady }: ExerciseProps) {
  const words = useMemo(
    () => (exercise.payload.words as string[]) ?? [],
    [exercise]
  );
  // Track picks by bank index so duplicate words stay distinct.
  const [picked, setPicked] = useState<number[]>([]);

  useEffect(() => {
    onReady(picked.length ? picked.map((i) => words[i]) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  const pick = (i: number) => {
    if (disabled || picked.includes(i)) return;
    setPicked((p) => [...p, i]);
    speak(words[i]);
  };
  const unpick = (i: number) => {
    if (disabled) return;
    setPicked((p) => p.filter((x) => x !== i));
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-body mb-6">{exercise.prompt}</h2>

      {/* answer row */}
      <div className="min-h-16 flex flex-wrap gap-2 border-b-2 border-swan pb-4 mb-2">
        {picked.map((i) => (
          <Chip key={i} label={words[i]} onClick={() => unpick(i)} />
        ))}
      </div>
      <div className="border-b-2 border-swan mb-6" />

      {/* word bank */}
      <div className="flex flex-wrap gap-2 justify-center">
        {words.map((w, i) => (
          <Chip
            key={i}
            label={w}
            hidden={picked.includes(i)}
            onClick={() => pick(i)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  onClick,
  hidden,
}: {
  label: string;
  onClick: () => void;
  hidden?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl border-2 border-b-4 px-4 py-2 font-bold transition-all",
        hidden
          ? "opacity-0 pointer-events-none"
          : "surface border text-body hover:bg-black/[0.03] dark:hover:bg-white/5",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
