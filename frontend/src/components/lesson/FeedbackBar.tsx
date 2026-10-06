"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/Icons";

// The signature feedback bar that slides up, tinted green or red.
export function FeedbackBar({
  status,
  correctAnswer,
  onContinue,
}: {
  status: "correct" | "wrong" | null;
  correctAnswer?: string | null;
  onContinue: () => void;
}) {
  const open = status !== null;
  const correct = status === "correct";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 160 }}
          animate={{ y: 0 }}
          exit={{ y: 160 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className={[
            "fixed bottom-0 left-0 right-0 z-40 border-t-2",
            correct
              ? "bg-[#d7ffb8] border-[#a8e063] dark:bg-[#1f3a0a] dark:border-[#3d6b12]"
              : "bg-[#ffdfe0] border-[#ffb3b3] dark:bg-[#3a0f10] dark:border-[#6b1a1c]",
          ].join(" ")}
        >
          <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={[
                  "w-12 h-12 rounded-full flex items-center justify-center bg-white",
                  correct ? "text-feather" : "text-cardinal",
                ].join(" ")}
              >
                {correct ? (
                  <CheckIcon width={28} height={28} />
                ) : (
                  <span className="text-2xl font-black">✕</span>
                )}
              </div>
              <div className={correct ? "text-feather-dark" : "text-cardinal-dark"}>
                <p className="text-lg font-extrabold">
                  {correct ? "Nice job!" : "Correct solution:"}
                </p>
                {!correct && correctAnswer && (
                  <p className="font-bold">{correctAnswer}</p>
                )}
              </div>
            </div>
            <Button
              variant={correct ? "primary" : "danger"}
              size="lg"
              onClick={onContinue}
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
