"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Floating button that appears after scrolling and jumps back to the top.
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40 w-12 h-12 rounded-2xl surface border-2 border-b-4 flex items-center justify-center text-macaw text-2xl font-black shadow-lg active:border-b-2 active:translate-y-[2px] transition-all"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
