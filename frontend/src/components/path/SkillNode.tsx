"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Skill } from "@/lib/types";
import {
  ChestIcon,
  CrownIcon,
  HeadphonesIcon,
  StarIcon,
  TrophyIcon,
} from "@/components/Icons";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Button } from "@/components/ui/Button";

// Horizontal sine-wave offset so the path snakes left and right.
export function nodeOffset(indexInUnit: number): number {
  const pattern = [0, 48, 72, 48, 0, -48, -72, -48];
  return pattern[indexInUnit % pattern.length];
}

export type NodeKind = "star" | "chest" | "headphones" | "trophy";

// Vary node icons along the path like Duolingo (lesson stars, a chest, a
// listening node, and a trophy at the end of each unit).
export function skillKind(indexInUnit: number, isLast: boolean): NodeKind {
  if (isLast) return "trophy";
  const pattern: NodeKind[] = ["star", "star", "chest", "headphones", "star"];
  return pattern[indexInUnit % pattern.length];
}

function KindIcon({ kind, size }: { kind: NodeKind; size: number }) {
  switch (kind) {
    case "chest":
      return <ChestIcon width={size} height={size} />;
    case "headphones":
      return <HeadphonesIcon width={size} height={size} />;
    case "trophy":
      return <TrophyIcon width={size} height={size} />;
    default:
      return <StarIcon width={size} height={size} />;
  }
}

export function SkillNode({
  skill,
  offset,
  kind,
  unitColor,
}: {
  skill: Skill;
  offset: number;
  kind: NodeKind;
  unitColor: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const locked = skill.state === "locked";
  const completed = skill.state === "completed";

  // Face colour: gold when done, the unit colour when playable, muted when locked.
  const faceStyle = completed
    ? { background: "#FFC800", borderColor: "#E5A100" }
    : locked
    ? { background: "var(--node-locked)", borderColor: "var(--node-locked-edge)" }
    : { background: unitColor, borderColor: "rgba(0,0,0,0.2)" };

  function handleClick() {
    setOpen((o) => !o);
  }
  function start() {
    if (skill.next_lesson_id != null) router.push(`/lesson/${skill.next_lesson_id}`);
  }

  return (
    <div className="relative flex flex-col items-center" style={{ marginLeft: offset }}>
      {/* "START" bubble floats above the active node */}
      {skill.is_active && !open && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="relative mb-2 px-4 py-1.5 rounded-xl bg-white dark:bg-[#1b2b33] border-2 border-swan dark:border-[#37464f] text-sm font-extrabold uppercase shadow-md"
          style={{ color: unitColor }}
        >
          Start
          <span className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-[#1b2b33] border-r-2 border-b-2 border-swan dark:border-[#37464f]" />
        </motion.div>
      )}

      <div className="relative">
        {/* platform base shadow */}
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-[76px] h-5 rounded-[50%]"
          style={{ background: "var(--node-base)" }}
        />

        {/* progress ring on the active/available node */}
        {!locked && !completed && skill.total_lessons > 0 && (
          <div className="absolute -inset-2 flex items-center justify-center">
            <CircularProgress
              value={skill.lessons_completed}
              max={skill.total_lessons}
              size={88}
              stroke={7}
              color={unitColor}
              track="var(--node-base)"
            />
          </div>
        )}

        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.92 }}
          style={faceStyle}
          className={[
            "relative w-[72px] h-[64px] rounded-[40%] flex items-center justify-center",
            "border-b-[6px] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer",
            locked ? "text-black/30 dark:text-white/40" : "text-white",
          ].join(" ")}
          aria-label={skill.title}
        >
          {completed ? (
            <CrownIcon width={34} height={34} />
          ) : (
            <KindIcon kind={kind} size={34} />
          )}
        </motion.button>
      </div>

      {/* popover — start (available/completed) or locked message */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-[78px] z-20 w-60 rounded-2xl p-4 text-center shadow-xl"
              style={{
                background: locked ? "var(--bg-card)" : completed ? "#FFC800" : unitColor,
                border: locked ? "2px solid var(--border-card)" : "none",
              }}
            >
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                style={{
                  background: locked ? "var(--bg-card)" : completed ? "#FFC800" : unitColor,
                  borderLeft: locked ? "2px solid var(--border-card)" : "none",
                  borderTop: locked ? "2px solid var(--border-card)" : "none",
                }}
              />
              {locked ? (
                <>
                  <p className="font-extrabold text-body">{skill.title}</p>
                  <p className="text-muted text-sm mb-3">
                    Complete all levels above to unlock this!
                  </p>
                  <Button variant="locked" full>
                    Locked
                  </Button>
                </>
              ) : (
                <>
                  <p className="font-extrabold text-white">{skill.title}</p>
                  <p className="text-white/90 text-sm mb-3">
                    {completed
                      ? "Practice to keep it fresh"
                      : `Lesson ${skill.lessons_completed + 1} of ${skill.total_lessons}`}
                  </p>
                  <Button variant="secondary" full onClick={start} style={{ color: unitColor }}>
                    {completed ? "Practice +5 XP" : "Start +10 XP"}
                  </Button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
