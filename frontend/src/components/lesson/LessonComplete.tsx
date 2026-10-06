"use client";

import { motion } from "framer-motion";
import type { CompleteResponse } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/Mascot";
import { BoltIcon, FlameIcon } from "@/components/Icons";

export function LessonComplete({
  result,
  onContinue,
}: {
  result: CompleteResponse;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center page-bg px-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Mascot size={140} />
      </motion.div>
      <h1 className="mt-4 text-3xl font-extrabold text-bee">Lesson complete!</h1>

      <div className="mt-8 flex gap-4">
        <StatCard color="#FFC800" label="Total XP" value={result.total_xp}>
          <BoltIcon width={22} height={22} />
        </StatCard>
        <StatCard color="#FF9600" label="Day streak" value={result.streak}>
          <FlameIcon width={22} height={22} />
        </StatCard>
      </div>

      {result.newly_unlocked_achievements.length > 0 && (
        <div className="mt-6 rounded-2xl bg-bee/15 border-2 border-bee px-5 py-3">
          <p className="font-extrabold text-bee-dark">🏅 Achievement unlocked!</p>
          <p className="font-bold text-body">
            {result.newly_unlocked_achievements.join(", ")}
          </p>
        </div>
      )}

      <p className="mt-6 font-bold text-feather">+{result.xp_earned} XP earned</p>

      <div className="mt-8 w-full max-w-xs">
        <Button variant="primary" size="lg" full onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  color,
  label,
  value,
  children,
}: {
  color: string;
  label: string;
  value: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-[2px] w-32"
      style={{ background: color }}
    >
      <div className="rounded-[14px] px-3 py-2 text-left" style={{ background: color }}>
        <div className="flex items-center gap-1 text-white font-bold text-xs uppercase">
          {children}
          {label}
        </div>
        <p className="text-white text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}
