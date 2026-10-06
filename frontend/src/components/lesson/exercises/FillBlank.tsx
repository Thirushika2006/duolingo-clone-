"use client";

import { useEffect, useState } from "react";
import type { ExerciseProps } from "../types";
import { speak } from "@/lib/speech";

// Tap a chip to fill the blank in the sentence.
export function FillBlank({ exercise, disabled, onReady }: ExerciseProps) {
  const sentence = (exercise.payload.sentence as string) ?? "";
  const choices = (exercise.payload.choices as string[]) ?? [];
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    onReady(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const [before, after] = sentence.split("___");

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-body mb-6">{exercise.prompt}</h2>

      <div className="text-2xl font-bold text-body mb-8 flex flex-wrap items-center gap-2">
        <span>{before}</span>
        <span
          className={[
            "inline-flex min-w-28 justify-center border-b-4 px-3 py-1 rounded-lg",
            selected ? "border-macaw text-macaw" : "border-swan text-transparent",
          ].join(" ")}
        >
          {selected ?? "____"}
        </span>
        <span>{after}</span>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {choices.map((c) => {
          const active = selected === c;
          return (
            <button
              key={c}
              disabled={disabled}
              onClick={() => {
                setSelected(c);
                speak(c);
              }}
              className={[
                "rounded-xl border-2 border-b-4 px-5 py-3 font-bold transition-all",
                active
                  ? "border-macaw bg-macaw/10 text-macaw"
                  : "surface border text-body hover:bg-black/[0.03] dark:hover:bg-white/5",
              ].join(" ")}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
