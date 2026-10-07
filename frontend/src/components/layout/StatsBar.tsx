"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { UserStats } from "@/lib/types";
import { FlameIcon, GemIcon, HeartIcon, HeartEmptyIcon } from "@/components/Icons";
import { toast } from "@/lib/toast";
import { useRefillHearts } from "@/lib/hooks";

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

      <StreakMenu streak={user.streak} week={user.week_activity} />
      <GemsMenu gems={user.gems} />
      <HeartsMenu user={user} />
    </div>
  );
}

// Shared popover shell so all four top-bar menus align and animate the same way.
function Dropdown({
  open,
  onClose,
  children,
  width = "w-72",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className={`absolute right-0 mt-2 ${width} surface border rounded-2xl shadow-xl z-40 p-4`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function GemsMenu({ gems }: { gems: number }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-bold text-macaw"
        title="Gems"
      >
        <GemIcon width={24} height={24} />
        <span>{gems}</span>
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center gap-3">
          <GemIcon width={54} height={54} />
          <div>
            <p className="text-lg font-extrabold text-body">Gems</p>
            <p className="text-sm text-muted">You have {gems} gems</p>
            <button
              onClick={() => {
                setOpen(false);
                router.push("/shop");
              }}
              className="text-macaw font-extrabold text-sm uppercase mt-1"
            >
              Go to shop
            </button>
          </div>
        </div>
      </Dropdown>
    </div>
  );
}

function HeartsMenu({ user }: { user: UserStats }) {
  const [open, setOpen] = useState(false);
  const refill = useRefillHearts();
  const full = user.hearts >= user.max_hearts;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-bold text-cardinal"
        title="Hearts"
      >
        <HeartIcon width={24} height={24} />
        <span>{user.hearts}</span>
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)}>
        <p className="text-lg font-extrabold text-body text-center mb-3">Hearts</p>
        <div className="flex justify-center gap-1.5 mb-2">
          {Array.from({ length: user.max_hearts }).map((_, i) =>
            i < user.hearts ? (
              <HeartIcon key={i} width={28} height={28} />
            ) : (
              <HeartEmptyIcon key={i} width={28} height={28} />
            )
          )}
        </div>
        <p className="text-center font-extrabold text-body">
          {full ? "You have full hearts" : `${user.hearts} hearts left`}
        </p>
        <p className="text-center text-sm text-muted mb-3">
          {full ? "Keep on learning" : `Next heart in ${user.minutes_to_next_heart} min`}
        </p>

        <button
          onClick={() => toast("Unlimited hearts is mocked in this demo", { emoji: "💖" })}
          className="w-full flex items-center justify-between border-2 border-swan dark:border-[#37464f] rounded-xl px-4 py-3 mb-2 hover:bg-black/[0.03] dark:hover:bg-white/5"
        >
          <span className="font-extrabold text-body">♾️ Unlimited Hearts</span>
          <span className="font-extrabold text-beetle text-sm uppercase">Free trial</span>
        </button>
        <button
          disabled={full || refill.isPending}
          onClick={() =>
            refill.mutate(undefined, {
              onSuccess: () => {
                toast("Hearts refilled!", { emoji: "❤️", variant: "success" });
                setOpen(false);
              },
            })
          }
          className="w-full flex items-center justify-between border-2 border-swan dark:border-[#37464f] rounded-xl px-4 py-3 hover:bg-black/[0.03] dark:hover:bg-white/5 disabled:opacity-50"
        >
          <span className="font-extrabold text-body">❤️ Refill Hearts</span>
          <span className="flex items-center gap-1 font-extrabold text-muted text-sm">
            <GemIcon width={16} height={16} /> 350
          </span>
        </button>
      </Dropdown>
    </div>
  );
}

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function StreakMenu({ streak, week }: { streak: number; week: boolean[] }) {
  const [open, setOpen] = useState(false);
  const todayIdx = new Date().getDay(); // 0 = Sunday
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-bold text-fox"
        title="Day streak"
      >
        <FlameIcon width={26} height={26} />
        <span>{streak}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="absolute right-0 mt-2 w-72 surface border rounded-2xl shadow-xl z-40 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`text-xl font-extrabold ${streak > 0 ? "text-fox" : "text-muted"}`}>
                    {streak} day streak
                  </p>
                  <p className="text-sm text-muted">
                    {streak > 0
                      ? "Keep it going — practice today!"
                      : "Do a lesson today to start a new streak!"}
                  </p>
                </div>
                <FlameIcon width={40} height={40} className={streak > 0 ? "" : "opacity-40 grayscale"} />
              </div>

              {/* weekly calendar */}
              <div className="flex justify-between rounded-xl bg-black/[0.04] dark:bg-white/5 p-2">
                {DAY_LETTERS.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 w-8">
                    <span
                      className={`text-xs font-extrabold ${i === todayIdx ? "text-fox" : "text-muted"}`}
                    >
                      {d}
                    </span>
                    <span
                      className={[
                        "w-7 h-7 rounded-full flex items-center justify-center text-sm",
                        week[i]
                          ? "bg-fox text-white"
                          : "bg-black/10 dark:bg-white/10 text-transparent",
                      ].join(" ")}
                    >
                      {week[i] ? "🔥" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
