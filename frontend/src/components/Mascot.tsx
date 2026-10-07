"use client";

import { motion } from "framer-motion";

// "Lingo" — an original mascot character (a friendly green sprout-bird).
// Deliberately NOT Duolingo's owl or any of its assets.
export function Mascot({
  size = 120,
  className = "",
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  // A looping idle "dance": gentle bob, sway and squash so it feels alive.
  const danceProps = animated
    ? {
        animate: {
          y: [0, -8, 0, -4, 0],
          rotate: [0, -4, 0, 4, 0],
          scaleY: [1, 1.03, 0.98, 1.02, 1],
        },
        transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
      }
    : {};

  return (
    <motion.svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Lingo the mascot"
      style={{ transformOrigin: "50% 100%" }}
      {...danceProps}
    >
      {/* body */}
      <ellipse cx="60" cy="72" rx="34" ry="36" fill="#58CC02" />
      <ellipse cx="60" cy="80" rx="24" ry="24" fill="#89E219" />
      {/* leaf sprout on head */}
      <path d="M60 30c0-10 8-16 16-16-2 10-8 16-16 16z" fill="#89E219" />
      <path d="M60 30c0-10-8-16-16-16 2 10 8 16 16 16z" fill="#58CC02" />
      <rect x="57" y="28" width="6" height="12" rx="3" fill="#58A700" />
      {/* eyes */}
      <circle cx="49" cy="60" r="11" fill="#fff" />
      <circle cx="71" cy="60" r="11" fill="#fff" />
      <motion.g
        animate={animated ? { x: [0, 1.5, 0, -1.5, 0] } : undefined}
        transition={animated ? { duration: 2.2, repeat: Infinity } : undefined}
      >
        <circle cx="51" cy="61" r="5" fill="#4b4b4b" />
        <circle cx="69" cy="61" r="5" fill="#4b4b4b" />
        <circle cx="53" cy="59" r="1.6" fill="#fff" />
        <circle cx="71" cy="59" r="1.6" fill="#fff" />
      </motion.g>
      {/* beak */}
      <path d="M55 72h10l-5 7z" fill="#FFC800" />
      {/* cheeks */}
      <circle cx="40" cy="72" r="4" fill="#FFC800" opacity="0.5" />
      <circle cx="80" cy="72" r="4" fill="#FFC800" opacity="0.5" />
      {/* feet */}
      <rect x="47" y="104" width="8" height="8" rx="3" fill="#FFC800" />
      <rect x="65" y="104" width="8" height="8" rx="3" fill="#FFC800" />
    </motion.svg>
  );
}
