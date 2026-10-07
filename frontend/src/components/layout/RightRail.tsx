"use client";

import Link from "next/link";
import type { UserStats } from "@/lib/types";
import { useAdvanceDay, useRefillHearts } from "@/lib/hooks";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/Mascot";
import { BoltIcon, ChestIcon, ShieldIcon } from "@/components/Icons";

const FOOTER_LINKS = [
  "About", "Blog", "Store", "Efficacy", "Careers", "Investors", "Terms", "Privacy",
];

export function RightRail({ user }: { user: UserStats }) {
  const advanceDay = useAdvanceDay();
  const refill = useRefillHearts();
  const goalPct = Math.min(100, (user.xp_today / user.daily_goal_xp) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Super promo */}
      <section className="surface border rounded-2xl p-5 relative overflow-hidden">
        <span className="inline-block text-xs font-extrabold uppercase italic text-white px-2 py-0.5 rounded-md bg-gradient-to-r from-macaw to-beetle">
          Super
        </span>
        <div className="absolute top-2 right-2 opacity-90">
          <Mascot size={60} animated />
        </div>
        <p className="text-lg font-extrabold text-body mt-2">Try Super for free</p>
        <p className="text-[15px] text-muted my-1 pr-14">
          No ads, personalized practice, and unlimited Legendary!
        </p>
        <Button
          variant="info"
          full
          className="mt-2"
          onClick={() => toast("Super is mocked in this demo", { emoji: "💜" })}
        >
          Try 1 week free
        </Button>
      </section>

      {/* Leaderboards */}
      <Link
        href="/leaderboard"
        className="surface border rounded-2xl p-5 flex items-center gap-4 hover:brightness-95 transition"
      >
        <ShieldIcon width={48} height={48} />
        <div>
          <p className="text-lg font-extrabold text-body">Leaderboards</p>
          <p className="text-[15px] text-muted">See this week&apos;s standings</p>
        </div>
      </Link>

      {/* Daily Quests (doubles as the daily-goal indicator) */}
      <section className="surface border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-extrabold text-body">Daily Quests</h3>
          <Link href="/quests" className="text-macaw font-extrabold text-sm uppercase">
            View all
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <BoltIcon width={40} height={40} />
          <div className="flex-1">
            <p className="font-bold text-body mb-1">Earn {user.daily_goal_xp} XP</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-5 rounded-full bg-swan/80 dark:bg-white/10 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-bee transition-all"
                  style={{ width: `${goalPct}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-eel/70">
                  {user.xp_today} / {user.daily_goal_xp}
                </span>
              </div>
              <ChestIcon width={26} height={26} className="text-fox" />
            </div>
          </div>
        </div>
        {user.daily_goal_met && (
          <p className="text-sm font-bold text-feather mt-2">Daily goal complete! 🎉</p>
        )}
      </section>

      {/* Testing tools (brief requires simulatable day logic) */}
      <section className="surface border rounded-2xl p-4">
        <h3 className="font-extrabold text-body mb-1">Testing tools</h3>
        <p className="text-xs text-muted mb-3">
          Simulate time passing to see streaks and hearts change.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            full
            onClick={() =>
              advanceDay.mutate(undefined, {
                onSuccess: (d) => toast(`Day advanced — streak is ${d.streak}`, { emoji: "⏭" }),
              })
            }
            disabled={advanceDay.isPending}
          >
            ⏭ Advance one day
          </Button>
          <Button
            size="sm"
            variant="secondary"
            full
            onClick={() =>
              refill.mutate(undefined, {
                onSuccess: () => toast("Hearts refilled!", { emoji: "❤️", variant: "success" }),
              })
            }
            disabled={refill.isPending || user.hearts >= user.max_hearts}
          >
            ❤️ Refill hearts
          </Button>
        </div>
      </section>

      {/* Footer links */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 pt-1 pb-6">
        {FOOTER_LINKS.map((l) => (
          <button
            key={l}
            onClick={() => toast("Coming soon", { emoji: "🔗" })}
            className="text-[11px] font-bold uppercase text-muted hover:text-body"
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
