"use client";

import type { ExerciseProps } from "./types";
import { MultipleChoice } from "./exercises/MultipleChoice";
import { Translate } from "./exercises/Translate";
import { MatchPairs } from "./exercises/MatchPairs";
import { FillBlank } from "./exercises/FillBlank";
import { TypeAnswer } from "./exercises/TypeAnswer";

const MAP = {
  multiple_choice: MultipleChoice,
  translate: Translate,
  match: MatchPairs,
  fill_blank: FillBlank,
  type_answer: TypeAnswer,
} as const;

export function ExerciseRenderer(props: ExerciseProps) {
  const Component = MAP[props.exercise.type as keyof typeof MAP];
  if (!Component) return <p>Unsupported exercise type: {props.exercise.type}</p>;
  // Key by exercise id so component state resets cleanly between exercises.
  return <Component key={props.exercise.id} {...props} />;
}
