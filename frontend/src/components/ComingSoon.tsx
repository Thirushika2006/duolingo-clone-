"use client";

import { Mascot } from "@/components/Mascot";

export function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
      <Mascot size={110} animated />
      <h1 className="text-2xl font-extrabold text-body">{title}</h1>
      <p className="text-muted font-medium max-w-sm">{desc}</p>
      <span className="mt-2 px-4 py-1.5 rounded-full bg-bee/20 text-bee-dark font-extrabold text-sm uppercase">
        Coming soon
      </span>
    </div>
  );
}
