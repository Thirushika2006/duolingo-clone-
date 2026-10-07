"use client";

import { useEffect, useState } from "react";

// Floating "back to top" button. Rendered inside a fixed overlay that mirrors
// the app's content container (sidebar offset + centered max-width), so the
// button lands at the right edge of the path column (left of the rail) at any
// window width — not jammed against the viewport edge.
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none lg:pl-64">
      <div className="mx-auto max-w-6xl h-full px-4 relative">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className={[
            "absolute bottom-6 right-4 xl:right-[29rem] w-14 h-14 rounded-2xl surface border-2 border-b-4",
            "flex items-center justify-center text-macaw text-2xl font-black shadow-lg",
            "active:border-b-2 active:translate-y-[2px] transition-all",
            visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
