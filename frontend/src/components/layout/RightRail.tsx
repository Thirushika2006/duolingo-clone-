"use client";

import type { UserStats } from "@/lib/types";
import { useAdvanceDay, useRefillHearts } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { BoltIcon, FlameIcon, HeartIcon } from "@/components/Icons";

export function RightRail({ user }: { user: UserStats }) {
  const advanceDay = useAdvanceDay();
  const refill = useRefillHearts();

  return (
    <div className="flex flex-col gap-4">
      {/* Daily goal */}
      <section className="surface border rounded-2xl p-4">
        <h3 className="font-extrabold text-body mb-3">Daily goal</h3>
        <div className="flex items-center gap-4">
          <CircularProgress value={user.xp_today} max={user.daily_goal_xp} color="#FFC800">
            <BoltIcon width={26} height={26} />
          </CircularProgress>
          <div>
            <p className="font-bold text-body">
              {user.xp_today} / {user.daily_goal_xp} XP
            </p>
            <p className="text-sm text-muted">
              {user.daily_goal_met ? "Goal complete! 🎉" : "Earn XP to hit your goal"}
            </p>
          </div>
        </div>
      </section>

      {/* Streak + hearts summary */}
      <section className="surface border rounded-2xl p-4 flex gap-6">
        <div className="flex items-center gap-2">
          <FlameIcon width={30} height={30} />
          <div>
            <p className="font-extrabold text-fox leading-none">{user.streak}</p>
            <p className="text-xs text-muted">day streak</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HeartIcon width={28} height={28} />
          <div>
            <p className="font-extrabold text-cardinal leading-none">
              {user.hearts}/{user.max_hearts}
            </p>
            <p className="text-xs text-muted">
              {user.hearts >= user.max_hearts
                ? "full"
                : `+1 in ${user.minutes_to_next_heart}m`}
            </p>
          </div>
        </div>
      </section>

      {/* Dev / testing tools (the brief asks for simulatable day logic). */}
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
            onClick={() => advanceDay.mutate()}
            disabled={advanceDay.isPending}
          >
            ⏭ Advance one day
          </Button>
          <Button
            size="sm"
            variant="secondary"
            full
            onClick={() => refill.mutate()}
            disabled={refill.isPending || user.hearts >= user.max_hearts}
          >
            ❤️ Refill hearts
          </Button>
        </div>
      </section>
    </div>
  );
}
