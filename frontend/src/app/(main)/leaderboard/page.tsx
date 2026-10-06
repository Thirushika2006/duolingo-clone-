"use client";

import { useLeaderboard } from "@/lib/hooks";
import { BoltIcon } from "@/components/Icons";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { data, isLoading } = useLeaderboard();

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold text-body">🏆 Diamond League</h1>
        <p className="text-muted font-medium">Top learners this week</p>
      </div>

      {isLoading && <p className="text-center text-muted">Loading…</p>}

      <div className="surface border rounded-2xl divide-y divide-[var(--border-card)] overflow-hidden">
        {data?.map((e) => (
          <div
            key={e.user_id}
            className={[
              "flex items-center gap-4 px-4 py-3",
              e.is_current_user ? "bg-macaw/10" : "",
            ].join(" ")}
          >
            <span className="w-7 text-center font-extrabold text-muted">
              {MEDALS[e.rank - 1] ?? e.rank}
            </span>
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold"
              style={{ background: e.avatar_color }}
            >
              {e.display_name[0]}
            </span>
            <span className="flex-1 font-bold text-body">
              {e.display_name}
              {e.is_current_user && (
                <span className="ml-2 text-xs text-macaw">(you)</span>
              )}
            </span>
            <span className="flex items-center gap-1 font-bold text-bee-dark">
              <BoltIcon width={18} height={18} />
              {e.total_xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
