"use client";

import type { Unit } from "@/lib/types";

export function UnitHeader({ unit }: { unit: Unit }) {
  // Slightly darker shade of the unit color for the 3D bottom edge.
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-5 py-4 text-white shadow-[0_4px_0_rgba(0,0,0,0.15)]"
      style={{ background: unit.color }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wide opacity-90">
          Unit {unit.order_index + 1}
        </p>
        <h2 className="text-lg font-extrabold">{unit.title}</h2>
      </div>
      <span className="text-2xl">📘</span>
    </div>
  );
}
