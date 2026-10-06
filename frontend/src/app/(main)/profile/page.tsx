"use client";

import { useProfile } from "@/lib/hooks";
import { Mascot } from "@/components/Mascot";
import { BoltIcon, CrownIcon, FlameIcon, StarIcon } from "@/components/Icons";

export default function ProfilePage() {
  const { data, isLoading } = useProfile();

  if (isLoading || !data)
    return <p className="text-center text-muted py-20">Loading profile…</p>;

  const u = data.user;
  const joined = new Date(data.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  const stats = [
    { icon: <FlameIcon width={24} height={24} />, label: "Day streak", value: u.streak },
    { icon: <BoltIcon width={24} height={24} />, label: "Total XP", value: u.total_xp },
    { icon: <CrownIcon width={24} height={24} />, label: "Skills done", value: data.skills_completed },
    { icon: <StarIcon width={24} height={24} className="text-bee" />, label: "Lessons", value: data.lessons_completed },
  ];

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shrink-0"
          style={{ background: u.avatar_color }}
        >
          {u.display_name[0]}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-body">{u.display_name}</h1>
          <p className="text-muted font-medium">@{u.username}</p>
          <p className="text-muted text-sm">Joined {joined}</p>
        </div>
        <div className="ml-auto hidden sm:block">
          <Mascot size={70} />
        </div>
      </div>

      {/* Stats */}
      <h2 className="font-extrabold text-body mb-3">Statistics</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="surface border rounded-2xl p-4 flex items-center gap-3"
          >
            {s.icon}
            <div>
              <p className="text-xl font-extrabold text-body leading-none">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <h2 className="font-extrabold text-body mb-3">Achievements</h2>
      <div className="flex flex-col gap-3">
        {data.achievements.map((a) => {
          const pct = Math.min(100, (a.progress / a.threshold) * 100);
          return (
            <div
              key={a.code}
              className={[
                "surface border rounded-2xl p-4 flex items-center gap-4",
                a.unlocked ? "" : "opacity-70",
              ].join(" ")}
            >
              <span
                className={[
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                  a.unlocked ? "bg-bee/20" : "bg-black/5 dark:bg-white/5 grayscale",
                ].join(" ")}
              >
                {a.unlocked ? "🏅" : "🔒"}
              </span>
              <div className="flex-1">
                <p className="font-extrabold text-body">{a.title}</p>
                <p className="text-sm text-muted mb-1">{a.description}</p>
                <div className="h-2 rounded-full bg-swan/70 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-bee"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              {a.unlocked && <span className="text-feather font-extrabold">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
