"use client";

import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
  emoji?: string;
  variant?: "default" | "success" | "error";
}

interface ToastState {
  toasts: Toast[];
  show: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (t) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    // auto-dismiss after 3s
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
    }, 3000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

// Convenience helper usable outside React components.
export const toast = (message: string, opts?: Partial<Omit<Toast, "id" | "message">>) =>
  useToastStore.getState().show({ message, ...opts });
