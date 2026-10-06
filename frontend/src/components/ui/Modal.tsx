"use client";

import { AnimatePresence, motion } from "framer-motion";

export function Modal({
  open,
  onClose,
  children,
  dismissable = true,
}: {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  dismissable?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dismissable && onClose?.()}
        >
          <motion.div
            className="surface border w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            initial={{ y: 60, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
