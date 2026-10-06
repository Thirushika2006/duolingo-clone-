"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { HeartIcon } from "@/components/Icons";

export function OutOfHearts({
  open,
  onRefill,
  onQuit,
  refilling,
}: {
  open: boolean;
  onRefill: () => void;
  onQuit: () => void;
  refilling: boolean;
}) {
  return (
    <Modal open={open} dismissable={false}>
      <div className="text-center">
        <div className="flex justify-center gap-1 mb-3">
          <HeartIcon width={48} height={48} className="opacity-30" />
        </div>
        <h2 className="text-2xl font-extrabold text-cardinal mb-1">
          You&apos;re out of hearts!
        </h2>
        <p className="text-muted font-medium mb-6">
          Practice to refill your hearts and keep learning.
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="primary" full onClick={onRefill} disabled={refilling}>
            {refilling ? "Refilling…" : "Practice to refill ❤️"}
          </Button>
          <Button variant="secondary" full onClick={onQuit}>
            Quit lesson
          </Button>
        </div>
      </div>
    </Modal>
  );
}
