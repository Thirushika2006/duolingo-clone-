"use client";

// Faded centered label with rules on each side, like Duolingo's unit separator.
export function UnitDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 px-2">
      <span className="flex-1 h-0.5 rounded-full bg-swan dark:bg-[#37464f]" />
      <span className="text-muted font-bold text-sm whitespace-nowrap">{label}</span>
      <span className="flex-1 h-0.5 rounded-full bg-swan dark:bg-[#37464f]" />
    </div>
  );
}
