import type { Exercise } from "@/lib/types";

// Shared interface every exercise renderer implements.
// The renderer reports the current answer via `onReady` (null = not answerable
// yet, which disables the Check button). After the player checks, `disabled`
// locks the inputs.
export interface ExerciseProps {
  exercise: Exercise;
  disabled: boolean;
  onReady: (answer: unknown | null) => void;
}
