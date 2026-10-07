"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mascot } from "@/components/Mascot";
import { toast } from "@/lib/toast";

const NAV = [
  { href: "/learn", label: "Learn", glyph: "🏠" },
  { href: "/sounds", label: "Sounds", glyph: "👄" },
  { href: "/leaderboard", label: "Leaderboards", glyph: "🛡️" },
  { href: "/quests", label: "Quests", glyph: "🗝️" },
  { href: "/shop", label: "Shop", glyph: "🛍️" },
  { href: "/profile", label: "Profile", glyph: "👤" },
];

// Mobile bottom bar shows a focused subset to avoid crowding.
const MOBILE_NAV = NAV.filter((n) =>
  ["/learn", "/leaderboard", "/quests", "/shop", "/profile"].includes(n.href)
);

function navClass(active: boolean) {
  return [
    "flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase text-sm tracking-wide border-2 transition-colors w-full",
    active
      ? "bg-macaw/10 border-macaw/40 text-macaw"
      : "border-transparent text-body hover:bg-black/[0.04] dark:hover:bg-white/5",
  ].join(" ");
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop: fixed left rail */}
      <aside className="hidden lg:flex flex-col gap-2 fixed top-0 left-0 h-full w-64 border-r surface px-4 py-6">
        <Link href="/learn" className="flex items-center gap-2 px-2 mb-6">
          <Mascot size={46} />
          <span
            className="text-[30px] leading-none font-black text-feather lowercase"
            style={{ letterSpacing: "-0.02em" }}
          >
            lingo
          </span>
        </Link>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className={navClass(pathname.startsWith(item.href))}>
            <span className="text-xl">{item.glyph}</span>
            {item.label}
          </Link>
        ))}
        <MoreMenu active={pathname.startsWith("/settings")} />
      </aside>

      {/* Mobile: bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t surface py-2">
        {MOBILE_NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex flex-col items-center px-3 py-1 rounded-lg text-[11px] font-bold",
                active ? "text-macaw" : "text-muted",
              ].join(" ")}
            >
              <span className="text-xl">{item.glyph}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function MoreMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const soon = (what: string) => () => {
    setOpen(false);
    toast(`${what} — coming soon`, { emoji: "🔜" });
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className={navClass(active || open)}>
        <span className="text-xl">•••</span>
        More
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, x: -8, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="absolute top-0 left-full ml-2 w-64 surface border rounded-2xl shadow-xl z-40 overflow-hidden"
            >
              <div className="p-2 border-b border-[var(--border-card)]">
                <MenuRow glyph="🧪" label="Language Test" onClick={soon("Language Test")} />
                <MenuRow glyph="🎧" label="Podcast" onClick={soon("Podcast")} />
              </div>
              <div className="p-2">
                <MenuRow
                  glyph="⚙️"
                  label="Settings"
                  onClick={() => {
                    setOpen(false);
                    router.push("/settings");
                  }}
                />
                <MenuRow glyph="❓" label="Help" onClick={soon("Help")} />
                <MenuRow glyph="🚪" label="Log out" onClick={soon("Log out")} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuRow({
  glyph,
  label,
  onClick,
}: {
  glyph: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold uppercase text-sm tracking-wide text-body hover:bg-black/[0.04] dark:hover:bg-white/5"
    >
      <span className="text-lg">{glyph}</span>
      {label}
    </button>
  );
}
