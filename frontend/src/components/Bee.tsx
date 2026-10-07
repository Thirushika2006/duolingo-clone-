"use client";

import { motion } from "framer-motion";

// A small original bee doodle that drifts in a gentle loop — playful flourish.
export function Bee({
  size = 26,
  className = "",
  drift = 10,
}: {
  size?: number;
  className?: string;
  drift?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 32 24"
      width={size}
      height={(size * 24) / 32}
      className={className}
      animate={{ x: [0, drift, 0, -drift, 0], y: [0, -drift, 0, drift / 2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      role="img"
      aria-label="bee"
    >
      {/* wings */}
      <ellipse cx="13" cy="7" rx="5" ry="3.5" fill="#cfe8ff" opacity="0.8" />
      <ellipse cx="19" cy="7" rx="5" ry="3.5" fill="#cfe8ff" opacity="0.8" />
      {/* body */}
      <ellipse cx="16" cy="13" rx="8" ry="6" fill="#FFC800" />
      <rect x="12" y="8" width="2.5" height="10" rx="1" fill="#4b4b4b" />
      <rect x="17.5" y="8" width="2.5" height="10" rx="1" fill="#4b4b4b" />
      {/* face */}
      <circle cx="23" cy="12" r="1.1" fill="#4b4b4b" />
    </motion.svg>
  );
}
