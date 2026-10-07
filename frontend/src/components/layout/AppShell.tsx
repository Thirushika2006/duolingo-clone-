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

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 pb-24 lg:pb-8">
          {/* Top stats bar */}
          <header className="sticky top-0 z-30 flex justify-end lg:justify-between items-center py-4 page-bg">
            <span className="hidden lg:block" />
            {data && (
              <StatsBar
                user={data.user}
                flag={data.language_flag}
                courseTitle={data.course_title}
              />
            )}
          </header>

          <div className="flex gap-8 items-start">
            <main className="flex-1 min-w-0">{children}</main>
            {/* Sticky right rail: stays pinned while the path scrolls, like Duolingo. */}
            <div className="hidden xl:block w-96 shrink-0 self-start sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar py-2">
              {data && <RightRail user={data.user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
