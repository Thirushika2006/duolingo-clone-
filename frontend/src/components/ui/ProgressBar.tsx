"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  value,
  max,
  color = "#58CC02",
  height = 16,
}: {
  value: number;
  max: number;
  color?: string;
  height?: number;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className="w-full rounded-full bg-swan/80 dark:bg-white/10 overflow-hidden"
      style={{ height }}
    >
      <motion.div
        className="h-full rounded-full relative"
        style={{ background: color }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        {/* glossy highlight, like Duolingo's bars */}
        {pct > 6 && (
          <span
            className="absolute left-2 right-2 top-1 h-[3px] rounded-full bg-white/40"
            style={{ display: "block" }}
          />
        )}
      </motion.div>
    </div>
  );
}
