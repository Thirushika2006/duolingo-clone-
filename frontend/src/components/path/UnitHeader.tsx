"use client";

import type { Unit } from "@/lib/types";
import { toast } from "@/lib/toast";
import { ArrowLeftIcon, BookIcon } from "@/components/Icons";

export function UnitHeader({ unit }: { unit: Unit }) {
  // A darker shade of the unit color for the guidebook button's 3D edge.
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-5 py-4 text-white"
      style={{ background: unit.color }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <ArrowLeftIcon width={22} height={22} className="opacity-90 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide opacity-95">
            Section 1, Unit {unit.order_index + 1}
          </p>
          <h2 className="text-xl font-extrabold truncate">{unit.title}</h2>
        </div>
      </div>
      <button
        onClick={() => toast("Guidebook coming soon", { emoji: "📘" })}
        className="flex items-center gap-2 rounded-2xl bg-black/15 border-2 border-black/15 border-b-4 active:border-b-2 active:translate-y-[2px] px-4 py-2 font-extrabold uppercase text-sm transition-all shrink-0"
      >
        <BookIcon width={20} height={20} />
        <span className="hidden sm:inline">Guidebook</span>
      </button>
    </div>
  );
}
