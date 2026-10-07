// SVG flags — avoids relying on emoji flags, which don't render on Windows/Chrome.
// Keyed by the emoji string the API sends (falls back to the raw string).

export function Flag({
  flag,
  width = 30,
  className = "",
}: {
  flag: string;
  width?: number;
  className?: string;
}) {
  const height = Math.round(width * 0.72);

  if (flag === "🇪🇸") {
    return (
      <svg
        viewBox="0 0 30 22"
        width={width}
        height={height}
        className={`rounded-[4px] ${className}`}
        role="img"
        aria-label="Spanish"
      >
        <rect width="30" height="22" rx="3" fill="#AA151B" />
        <rect y="5.5" width="30" height="11" fill="#F1BF00" />
        {/* simple crest hint */}
        <rect x="7" y="9" width="3" height="4" rx="0.6" fill="#AD1519" />
        <rect x="7" y="8.2" width="3" height="1" fill="#C7B37F" />
      </svg>
    );
  }

  // Fallback: show whatever the API gave us.
  return (
    <span className={className} style={{ fontSize: width * 0.8 }}>
      {flag}
    </span>
  );
}
