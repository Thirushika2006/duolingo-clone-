"use client";

import { useEffect, useState } from "react";
import type { ExerciseProps } from "../types";
import { speak } from "@/lib/speech";

export function MultipleChoice({ exercise, disabled, onReady }: ExerciseProps) {
  const choices = (exercise.payload.choices as string[]) ?? [];
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    onReady(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-body mb-6">{exercise.prompt}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((choice, i) => {
          const active = selected === i;
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => {
                setSelected(i);
                speak(choice);
              }}
              className={[
                "flex items-center gap-3 text-left rounded-2xl border-2 border-b-4 px-4 py-4 font-bold transition-colors",
                active
                  ? "border-macaw bg-macaw/10 text-macaw"
                  : "surface border text-body hover:bg-black/[0.03] dark:hover:bg-white/5",
                disabled ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
            >
              <span
                className={[
                  "w-7 h-7 shrink-0 rounded-lg border-2 flex items-center justify-center text-sm",
                  active ? "border-macaw text-macaw" : "border-swan text-muted",
                ].join(" ")}
              >
                {i + 1}
              </span>
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
