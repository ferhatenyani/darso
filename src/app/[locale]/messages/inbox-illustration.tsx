/**
 * Distinctive empty-state mark for the inbox.
 * — A stylized quotation-mark composed of two overlapping speech blocks,
 *   one filled with editorial accent, one outlined. Sits on a marker rule.
 * — Not a stock envelope.
 */
export function InboxIllustration() {
  return (
    <svg
      aria-hidden
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative drop-shadow-[0_4px_18px_rgba(47,107,255,0.18)]"
    >
      {/* marker rule */}
      <line x1="0" y1="86" x2="120" y2="86" stroke="var(--border)" strokeWidth="1" />
      <line x1="10" y1="86" x2="36" y2="86" stroke="var(--accent)" strokeWidth="2" />

      {/* back outlined block */}
      <path
        d="M28 14 L88 14 Q98 14 98 24 L98 56 Q98 66 88 66 L74 66 L66 80 L66 66 L28 66 Q18 66 18 56 L18 24 Q18 14 28 14 Z"
        fill="var(--card)"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* big quote stroke inside outlined block */}
      <path
        d="M40 30 Q34 32 33 40 Q33 48 40 48 Q47 48 47 41 Q47 36 42 35"
        stroke="var(--ink-2)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M62 30 Q56 32 55 40 Q55 48 62 48 Q69 48 69 41 Q69 36 64 35"
        stroke="var(--ink-2)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* front filled accent block, slightly offset */}
      <g transform="translate(20, -2)">
        <path
          d="M16 32 L62 32 Q68 32 68 38 L68 56 Q68 62 62 62 L52 62 L48 70 L48 62 L16 62 Q10 62 10 56 L10 38 Q10 32 16 32 Z"
          fill="var(--accent)"
          opacity="0.94"
        />
        {/* two tiny dots — message indicator */}
        <circle cx="28" cy="48" r="2.5" fill="var(--accent-foreground)" />
        <circle cx="39" cy="48" r="2.5" fill="var(--accent-foreground)" />
        <circle cx="50" cy="48" r="2.5" fill="var(--accent-foreground)" />
      </g>

      {/* corner accent tick */}
      <path d="M110 14 L116 8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M114 18 L120 12" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
