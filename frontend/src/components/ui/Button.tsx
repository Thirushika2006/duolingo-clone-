"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "danger" | "info" | "secondary" | "locked" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

// The Duolingo "3D" button: a colored face sitting on a darker bottom edge
// (border-b-4) that collapses when pressed (active:translate-y + thinner edge).
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-feather text-white border-feather-dark hover:brightness-105",
  danger: "bg-cardinal text-white border-cardinal-dark hover:brightness-105",
  info: "bg-macaw text-white border-macaw-dark hover:brightness-105",
  secondary:
    "surface text-body border-b-2 border hover:bg-black/[0.03] dark:hover:bg-white/5",
  locked:
    "bg-swan text-hare border-[#cfcfcf] cursor-not-allowed hover:brightness-100",
  ghost: "bg-transparent text-macaw border-transparent hover:bg-macaw/10",
};

const SIZES: Record<Size, string> = {
  sm: "text-xs px-3 py-2 rounded-xl",
  md: "text-sm px-5 py-3 rounded-2xl",
  lg: "text-base px-6 py-3.5 rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", full, className = "", disabled, ...props },
  ref
) {
  const is3D = variant !== "secondary" && variant !== "ghost";
  return (
    <button
      ref={ref}
      disabled={disabled || variant === "locked"}
      className={[
        "font-bold uppercase tracking-wide select-none transition-all",
        is3D ? "border-b-4 active:border-b-0 active:translate-y-[3px]" : "",
        "disabled:opacity-100 disabled:active:translate-y-0",
        SIZES[size],
        VARIANTS[variant],
        full ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    />
  );
});
