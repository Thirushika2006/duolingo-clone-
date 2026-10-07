"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Skill } from "@/lib/types";
import { CrownIcon, LockIcon, SkillGlyph, StarIcon } from "@/components/Icons";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Button } from "@/components/ui/Button";

// Horizontal sine-wave offset so the path snakes left and right.
export function nodeOffset(indexInUnit: number): number {
  const pattern = [0, 48, 72, 48, 0, -48, -72, -48];
  return pattern[indexInUnit % pattern.length];
}

export function SkillNode({ skill, offset }: { skill: Skill; offset: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const locked = skill.state === "locked";
  const completed = skill.state === "completed";

  const face = completed
    ? "bg-bee border-bee-dark"
    : locked
    ? "border-[color:var(--node-locked-edge)]"
    : "bg-feather border-feather-dark";
  const lockedStyle = locked ? { background: "var(--node-locked)" } : undefined;

  function handleClick() {
    if (locked) return;
    setOpen((o) => !o);
  }

  function start() {
    if (skill.next_lesson_id != null) router.push(`/lesson/${skill.next_lesson_id}`);
  }

  return (
    <div className="relative flex flex-col items-center" style={{ marginLeft: offset }}>
      {/* "START" bubble floats ABOVE the active node with a downward pointer */}
      {skill.is_active && !open && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="relative mb-2 px-4 py-1.5 rounded-xl bg-white dark:bg-[#1b2b33] border-2 border-swan dark:border-[#37464f] text-feather text-sm font-extrabold uppercase shadow-md"
        >
          Start
          <span className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-[#1b2b33] border-r-2 border-b-2 border-swan dark:border-[#37464f]" />
        </motion.div>
      )}

      {/* progress ring wraps non-locked, non-completed nodes */}
      <div className="relative">
        {/* platform base shadow the node sits on */}
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-[76px] h-5 rounded-[50%]"
          style={{ background: "var(--node-base)" }}
        />

        {!locked && !completed && skill.total_lessons > 0 && (
          <div className="absolute -inset-2 flex items-center justify-center">
            <CircularProgress
              value={skill.lessons_completed}
              max={skill.total_lessons}
              size={88}
              stroke={7}
              color="#FFC800"
              track="var(--node-base)"
            />
          </div>
        )}

        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.92 }}
          style={lockedStyle}
          className={[
            "relative w-[72px] h-[64px] rounded-[40%] flex items-center justify-center",
            "border-b-[6px] active:border-b-0 active:translate-y-[4px] transition-all",
            face,
            locked ? "cursor-default" : "cursor-pointer",
          ].join(" ")}
          aria-label={skill.title}
        >
          {locked ? (
            <LockIcon width={28} height={28} className="text-black/30 dark:text-white/40" />
          ) : completed ? (
            <CrownIcon width={34} height={34} />
          ) : skill.is_active ? (
            <StarIcon width={32} height={32} className="text-white" />
          ) : (
            <SkillGlyph icon={skill.icon} />
          )}
        </motion.button>
      </div>

      {/* popover with start button */}
      <AnimatePresence>
        {open && !locked && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-[78px] z-20 w-56 rounded-2xl p-4 text-center shadow-xl"
              style={{
                background: completed ? "#FFC800" : "#58CC02",
              }}
            >
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                style={{ background: completed ? "#FFC800" : "#58CC02" }}
              />
              <p className="font-extrabold text-white">{skill.title}</p>
              <p className="text-white/90 text-sm mb-3">
                {completed
                  ? "Practice to keep it fresh"
                  : `Lesson ${skill.lessons_completed + 1} of ${skill.total_lessons}`}
              </p>
              <Button
                variant="secondary"
                full
                onClick={start}
                className="!text-feather"
              >
                {completed ? "Practice +5 XP" : "Start +10 XP"}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
