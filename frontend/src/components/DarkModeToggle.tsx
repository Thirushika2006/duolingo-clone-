"use client";

import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.theme = next ? "dark" : "light";
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={toggle}
      className={[
        "relative w-14 h-8 rounded-full transition-colors",
        dark ? "bg-macaw" : "bg-swan",
      ].join(" ")}
      aria-label="Toggle dark mode"
    >
      <span
        className={[
          "absolute top-1 left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs transition-transform",
          dark ? "translate-x-6" : "",
        ].join(" ")}
      >
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
