"use client";

import { usePath, useRefillHearts } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import { GemIcon, HeartIcon } from "@/components/Icons";

export default function ShopPage() {
  const { data } = usePath();
  const refill = useRefillHearts();
  const user = data?.user;
  const full = user ? user.hearts >= user.max_hearts : false;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-extrabold text-body mb-6">Shop</h1>

      {/* Hearts refill (functional, mocked currency) */}
      <section className="surface border rounded-2xl p-5 mb-4 flex items-center gap-4">
        <HeartIcon width={48} height={48} />
        <div className="flex-1">
          <p className="font-extrabold text-body">Refill hearts</p>
          <p className="text-sm text-muted">
            {user ? `${user.hearts}/${user.max_hearts} hearts` : "—"}
          </p>
        </div>
        <Button
          variant={full ? "locked" : "primary"}
          size="sm"
          onClick={() => refill.mutate()}
          disabled={full || refill.isPending}
        >
          {full ? "Full" : "Refill"}
        </Button>
      </section>

      {/* Gems (mocked) */}
      <section className="surface border rounded-2xl p-5 mb-4 flex items-center gap-4">
        <GemIcon width={44} height={44} />
        <div className="flex-1">
          <p className="font-extrabold text-body">Gems</p>
          <p className="text-sm text-muted">{user?.gems ?? 0} gems (mocked)</p>
        </div>
        <Button variant="locked" size="sm">
          Coming soon
        </Button>
      </section>

      {/* Super subscription (placeholder) */}
      <section className="rounded-2xl p-5 bg-gradient-to-r from-[#ce82ff] to-[#9b4dff] text-white">
        <p className="font-extrabold text-lg">Super Lingo</p>
        <p className="text-white/90 text-sm mb-3">
          Unlimited hearts, no ads, and more. In-app purchases are mocked for this demo.
        </p>
        <Button variant="secondary" size="sm" className="!text-beetle-dark">
          Coming soon
        </Button>
      </section>
    </div>
  );
}
