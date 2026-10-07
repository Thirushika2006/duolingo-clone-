"use client";

import type { Unit } from "@/lib/types";
import { toast } from "@/lib/toast";

export function UnitHeader({ unit }: { unit: Unit }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-5 py-4 text-white shadow-[0_4px_0_rgba(0,0,0,0.15)]"
      style={{ background: unit.color }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wide opacity-90">
          Section 1, Unit {unit.order_index + 1}
        </p>
        <h2 className="text-lg font-extrabold">{unit.title}</h2>
      </div>
      <button
        onClick={() => toast("Guidebook coming soon", { emoji: "📘" })}
        className="flex items-center gap-2 rounded-xl bg-black/15 hover:bg-black/25 px-3 py-2 font-bold uppercase text-sm transition-colors"
      >
        <span className="text-base">📖</span>
        Guidebook
      </button>
    </div>
  );
}
