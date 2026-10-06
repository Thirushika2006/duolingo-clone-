"use client";

import { useEffect, useState } from "react";
import type { ExerciseProps } from "../types";

export function TypeAnswer({ exercise, disabled, onReady }: ExerciseProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    onReady(text.trim() ? text.trim() : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-body mb-6">{exercise.prompt}</h2>
      <textarea
        autoFocus
        disabled={disabled}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type in Spanish…"
        rows={3}
        className="w-full rounded-2xl border-2 surface border p-4 text-lg font-medium text-body outline-none focus:border-macaw resize-none"
      />
    </div>
  );
}
