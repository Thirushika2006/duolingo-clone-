"use client";

import { usePath } from "@/lib/hooks";
import { UnitHeader } from "@/components/path/UnitHeader";
import { SkillNode, nodeOffset } from "@/components/path/SkillNode";
import { Mascot } from "@/components/Mascot";

export default function LearnPage() {
  const { data, isLoading, isError } = usePath();

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

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-10 pt-2">
      {data.units.map((unit) => (
        <section key={unit.id} className="flex flex-col gap-6">
          <UnitHeader unit={unit} />
          <div className="flex flex-col items-center gap-6 py-2">
            {unit.skills.map((skill, i) => (
              <SkillNode key={skill.id} skill={skill} offset={nodeOffset(i)} />
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-col items-center gap-2 py-8 text-muted">
        <Mascot size={72} />
        <p className="font-bold">More units coming soon!</p>
      </div>
    </div>
  );
}
