"use client";

import { useEffect, useRef, useState } from "react";
import { usePath } from "@/lib/hooks";
import { UnitHeader } from "@/components/path/UnitHeader";
import { UnitDivider } from "@/components/path/UnitDivider";
import { SkillNode, nodeOffset, skillKind } from "@/components/path/SkillNode";
import { Mascot } from "@/components/Mascot";
import { Bee } from "@/components/Bee";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function LearnPage() {
  const { data, isLoading, isError } = usePath();
  const [activeUnit, setActiveUnit] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // A single sticky header updates to the unit currently scrolled into view
  // (Duolingo uses one header card that changes title + color, not one per unit).
  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const line = 180; // just below the sticky header band
      let active = 0;
      sectionsRef.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) active = i;
      });
      setActiveUnit(active);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted">
        <Mascot size={80} className="animate-bounce" />
        <p className="mt-4 font-bold">Loading your path…</p>
      </div>
    );

  if (isError || !data)
    return (
      <div className="py-32 text-center">
        <p className="font-bold text-cardinal">Couldn&apos;t reach the server.</p>
        <p className="text-muted mt-2">
          Make sure the backend is running on port 8000.
        </p>
      </div>
    );

  const current = data.units[Math.min(activeUnit, data.units.length - 1)];

  return (
    <div className="max-w-xl mx-auto flex flex-col pt-2">
      {/* Single sticky unit header — updates as you scroll. */}
      <div className="sticky top-[60px] z-20 pt-1 pb-3 page-bg">
        <UnitHeader unit={current} />
      </div>

      {data.units.map((unit, unitIndex) => (
        <section
          key={unit.id}
          ref={(el) => {
            sectionsRef.current[unitIndex] = el;
          }}
          className="flex flex-col gap-6 pt-2 pb-8"
        >
          <UnitDivider label={unit.title} />
          <div className="relative flex flex-col items-center gap-6 py-2">
            {/* Mascot + buzzing bees beside the path (original art, not Duo). */}
            {unitIndex === 0 && (
              <div className="absolute right-0 sm:right-2 top-[140px] flex flex-col items-center pointer-events-none">
                <Bee size={24} className="self-start ml-2 mb-1" drift={14} />
                <Mascot size={96} animated />
                <span
                  className="w-20 h-5 -mt-3 rounded-[50%]"
                  style={{ background: "var(--node-base)" }}
                />
                <Bee size={18} className="self-end mr-2 -mt-10" drift={8} />
              </div>
            )}
            {unit.skills.map((skill, i) => (
              <SkillNode
                key={skill.id}
                skill={skill}
                offset={nodeOffset(i)}
                kind={skillKind(i, i === unit.skills.length - 1)}
                unitColor={unit.color}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-col items-center gap-2 py-8 text-muted">
        <Mascot size={72} animated />
        <p className="font-bold">More units coming soon!</p>
      </div>

      <ScrollToTop />
    </div>
  );
}
