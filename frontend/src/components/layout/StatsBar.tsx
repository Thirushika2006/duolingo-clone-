"use client";

import Link from "next/link";
import type { UserStats } from "@/lib/types";
import { FlameIcon, GemIcon, HeartIcon } from "@/components/Icons";

// The compact streak / gems / hearts cluster shown at the top of app pages.
export function StatsBar({
  user,
  flag,
}: {
  user: UserStats;
  flag: string;
}) {
  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <span className="text-2xl" title="Spanish">
        {flag}
      </span>

      <div className="flex items-center gap-1.5 font-bold text-fox" title="Day streak">
        <FlameIcon width={26} height={26} />
        <span>{user.streak}</span>
      </div>

      <div className="flex items-center gap-1.5 font-bold text-macaw" title="Gems">
        <GemIcon width={24} height={24} />
        <span>{user.gems}</span>
      </div>

      <Link
        href="/shop"
        className="flex items-center gap-1.5 font-bold text-cardinal"
        title="Hearts"
      >
        <HeartIcon width={24} height={24} />
        <span>{user.hearts}</span>
      </Link>
    </div>
  );
}
