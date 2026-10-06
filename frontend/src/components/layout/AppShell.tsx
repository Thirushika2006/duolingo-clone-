"use client";

import { usePath } from "@/lib/hooks";
import { Sidebar } from "./Sidebar";
import { StatsBar } from "./StatsBar";
import { RightRail } from "./RightRail";

// Shared chrome for the main app pages: left nav, top stats, right rail.
export function AppShell({ children }: { children: React.ReactNode }) {
  const { data } = usePath();

  return (
    <div className="min-h-screen page-bg">
      <Sidebar />

      <div className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 pb-24 lg:pb-8">
          {/* Top stats bar */}
          <header className="sticky top-0 z-30 flex justify-end lg:justify-between items-center py-4 page-bg">
            <span className="hidden lg:block" />
            {data && <StatsBar user={data.user} flag={data.language_flag} />}
          </header>

          <div className="flex gap-8">
            <main className="flex-1 min-w-0">{children}</main>
            <div className="hidden xl:block w-80 shrink-0 py-2">
              {data && <RightRail user={data.user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
