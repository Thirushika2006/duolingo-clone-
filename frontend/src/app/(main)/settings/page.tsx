"use client";

import { DarkModeToggle } from "@/components/DarkModeToggle";

function Row({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="font-bold text-body">{label}</p>
        {desc && <p className="text-sm text-muted">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-extrabold text-body mb-6">Settings</h1>

      <h2 className="font-extrabold text-muted uppercase text-xs mb-2">Preferences</h2>
      <div className="surface border rounded-2xl divide-y divide-[var(--border-card)] mb-6">
        <Row label="Dark mode" desc="Switch between light and dark themes">
          <DarkModeToggle />
        </Row>
        <Row label="Sound effects" desc="Play audio during lessons">
          <span className="text-muted font-bold text-sm">On</span>
        </Row>
        <Row label="Daily goal" desc="50 XP per day">
          <span className="text-muted font-bold text-sm">Casual</span>
        </Row>
      </div>

      <h2 className="font-extrabold text-muted uppercase text-xs mb-2">Account</h2>
      <div className="surface border rounded-2xl divide-y divide-[var(--border-card)]">
        <Row label="Profile" desc="Default learner (no auth in this demo)">
          <span className="text-muted">→</span>
        </Row>
        <Row label="Notifications" desc="Coming soon">
          <span className="text-hare">🔒</span>
        </Row>
        <Row label="Privacy settings" desc="Coming soon">
          <span className="text-hare">🔒</span>
        </Row>
      </div>

      <p className="text-center text-muted text-sm mt-8">
        Duolingo Clone · built with Next.js + FastAPI
      </p>
    </div>
  );
}
