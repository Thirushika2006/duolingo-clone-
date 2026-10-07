"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { UserStats } from "@/lib/types";
import { FlameIcon, GemIcon, HeartIcon } from "@/components/Icons";
import { toast } from "@/lib/toast";

// The compact streak / gems / hearts cluster shown at the top of app pages.
export function StatsBar({
  user,
  flag,
  courseTitle,
}: {
  user: UserStats;
  flag: string;
  courseTitle: string;
}) {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <CourseSwitcher flag={flag} courseTitle={courseTitle} />

      <div className="flex items-center gap-1.5 font-bold text-fox" title="Day streak">
        <FlameIcon width={26} height={26} />
        <span>{user.streak}</span>
      </div>

      <div className="flex items-center gap-1.5 font-bold text-macaw" title="Gems">
        <GemIcon width={24} height={24} />
        <span>{user.gems}</span>
      </div>

      <Link
        href="/shop"
        className="flex items-center gap-1.5 font-bold text-cardinal"
        title="Hearts"
      >
        <HeartIcon width={24} height={24} />
        <span>{user.hearts}</span>
      </Link>
    </div>
  );
}

function CourseSwitcher({ flag, courseTitle }: { flag: string; courseTitle: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-11 h-9 rounded-xl surface border flex items-center justify-center text-2xl hover:brightness-95"
        title={courseTitle}
      >
        {flag}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="absolute right-0 mt-2 w-64 surface border rounded-2xl shadow-xl z-40 overflow-hidden"
            >
              <p className="px-4 pt-3 pb-2 text-xs font-extrabold uppercase text-muted tracking-wide">
                My Courses
              </p>
              <div className="flex items-center gap-3 px-4 py-2 bg-macaw/10">
                <span className="text-2xl">{flag}</span>
                <span className="font-bold text-macaw">{courseTitle}</span>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  toast("More languages coming soon", { emoji: "🌎" });
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.04] dark:hover:bg-white/5"
              >
                <span className="w-8 h-8 rounded-lg border-2 border-swan dark:border-[#37464f] flex items-center justify-center text-xl text-muted">
                  +
                </span>
                <span className="font-bold text-body">Add a new course</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
