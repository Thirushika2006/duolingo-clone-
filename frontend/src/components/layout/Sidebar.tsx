"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mascot } from "@/components/Mascot";

const NAV = [
  { href: "/learn", label: "Learn", glyph: "🏠" },
  { href: "/sounds", label: "Sounds", glyph: "👄" },
  { href: "/leaderboard", label: "Leaderboards", glyph: "🛡️" },
  { href: "/quests", label: "Quests", glyph: "🗝️" },
  { href: "/shop", label: "Shop", glyph: "🛍️" },
  { href: "/profile", label: "Profile", glyph: "👤" },
  { href: "/settings", label: "More", glyph: "⚙️" },
];

// Mobile bottom bar shows a focused subset to avoid crowding.
const MOBILE_NAV = NAV.filter((n) =>
  ["/learn", "/leaderboard", "/quests", "/shop", "/profile"].includes(n.href)
);

export function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop: fixed left rail */}
      <aside className="hidden lg:flex flex-col gap-2 fixed top-0 left-0 h-full w-60 border-r surface px-4 py-6">
        <Link href="/learn" className="flex items-center gap-2 px-2 mb-6">
          <Mascot size={40} />
          <span className="text-2xl font-extrabold text-feather tracking-tight">
            lingo
          </span>
        </Link>
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase text-sm tracking-wide border-2 transition-colors",
                active
                  ? "bg-macaw/10 border-macaw/40 text-macaw"
                  : "border-transparent text-body hover:bg-black/[0.04] dark:hover:bg-white/5",
              ].join(" ")}
            >
              <span className="text-xl">{item.glyph}</span>
              {item.label}
            </Link>
          );
        })}
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
