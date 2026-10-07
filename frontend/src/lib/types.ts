// Types mirroring the FastAPI schemas (the API contract).

export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "match"
  | "fill_blank"
  | "type_answer";

export type SkillState = "locked" | "available" | "completed";

export interface UserStats {
  id: number;
  username: string;
  display_name: string;
  avatar_color: string;
  total_xp: number;
  gems: number;
  hearts: number;
  max_hearts: number;
  minutes_to_next_heart: number;
  streak: number;
  daily_goal_xp: number;
  xp_today: number;
  daily_goal_met: boolean;
  week_activity: boolean[];
}

export interface Skill {
  id: number;
  title: string;
  icon: string;
  order_index: number;
  crown_level: number;
  total_lessons: number;
  lessons_completed: number;
  state: SkillState;
  is_active: boolean;
  next_lesson_id: number | null;
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  color: string;
  order_index: number;
  skills: Skill[];
}

export interface PathData {
  course_title: string;
  language_flag: string;
  user: UserStats;
  units: Unit[];
}

// Exercise payloads (answer keys stripped server-side).
export interface MultipleChoicePayload {
  choices: string[];
}
export interface TranslatePayload {
  words: string[];
}
export interface MatchPayload {
  pairs: { left: string; right: string }[];
}
export interface FillBlankPayload {
  sentence: string;
  choices: string[];
}
export interface TypeAnswerPayload {
  answer?: never;
}

export interface Exercise {
  id: number;
  type: ExerciseType;
  prompt: string;
  order_index: number;
  payload: Record<string, unknown>;
}

export interface Lesson {
  id: number;
  skill_id: number;
  skill_title: string;
  xp_reward: number;
  exercises: Exercise[];
}

export interface CheckResponse {
  correct: boolean;
  hearts: number;
  out_of_hearts: boolean;
  correct_answer: unknown | null;
}

export interface CompleteResponse {
  xp_earned: number;
  total_xp: number;
  crown_level: number;
  streak: number;
  daily_goal_met: boolean;
  newly_unlocked_achievements: string[];
}

export interface Achievement {
  code: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  progress: number;
  unlocked: boolean;
}

export interface Profile {
  user: UserStats;
  created_at: string;
  skills_completed: number;
  lessons_completed: number;
  achievements: Achievement[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  display_name: string;
  avatar_color: string;
  total_xp: number;
  is_current_user: boolean;
}

export interface HeartsResponse {
  hearts: number;
  max_hearts: number;
  minutes_to_next_heart: number;
}
