// Hand-rolled SVG icons (no third-party icon pack, no Duolingo assets).
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function FlameIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2c0 4-5 5-5 10a5 5 0 0010 0c0-2-1-3-1-3 0 1.5-1 2-1 2 .5-3-3-5-3-9z"
        fill="#FF9600"
      />
      <path d="M12 21a3.5 3.5 0 003.5-3.5c0-2.5-3.5-3.5-3.5-6 0 2.5-3.5 3-3.5 6A3.5 3.5 0 0012 21z" fill="#FFC800" />
    </svg>
  );
}

export function GemIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 3h12l3 5-9 13L3 8l3-5z" fill="#1CB0F6" />
      <path d="M12 21l9-13H3l9 13z" fill="#1899D6" />
      <path d="M3 8h18l-9 4-9-4z" fill="#8EE3FF" opacity="0.6" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3 1.2 4 2.5 1-1.3 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z"
        fill="#FF4B4B"
      />
    </svg>
  );
}

export function HeartEmptyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3 1.2 4 2.5 1-1.3 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z"
        fill="#E5E5E5"
      />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#FFC800" stroke="#E5A100" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" fill="#FFC800" stroke="#E5A100" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 4h6a2 2 0 012 2v14a2 2 0 00-2-2H4V4z" fill="currentColor" opacity="0.95" />
      <path d="M20 4h-6a2 2 0 00-2 2v14a2 2 0 012-2h6V4z" fill="currentColor" opacity="0.75" />
      <path d="M6 8h4M6 11h4M14 8h4M14 11h4" stroke="#1a8a2e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" />
      <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6L12 16.8 6.6 19.6l1-6L3.3 9.4l6-.9L12 3z"
        fill="currentColor"
      />
    </svg>
  );
}

// Map a skill's icon key to an emoji glyph (simple, original, no assets).
const SKILL_GLYPHS: Record<string, string> = {
  book: "📖",
  wave: "👋",
  chat: "💬",
  map: "🗺️",
  food: "🍽️",
  family: "👨‍👩‍👧",
  paw: "🐾",
  palette: "🎨",
  star: "⭐",
};

export function SkillGlyph({ icon }: { icon: string }) {
  return <span className="text-2xl leading-none">{SKILL_GLYPHS[icon] ?? "⭐"}</span>;
}
