"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/lib/toast";

const ACCENT = {
  default: "border-swan",
  success: "border-feather",
  error: "border-cardinal",
} as const;

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 w-[90%] max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => dismiss(t.id)}
            className={[
              "surface border-2 rounded-2xl px-4 py-3 shadow-lg font-bold text-body w-full flex items-center gap-2",
              ACCENT[t.variant ?? "default"],
            ].join(" ")}
          >
            {t.emoji && <span className="text-xl">{t.emoji}</span>}
            <span>{t.message}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
