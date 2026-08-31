"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "ink" | "amber" | "blue" | "cream";

const ACCENT_MAP: Record<
  Accent,
  { border: string; label: string; bg: string; glow: string }
> = {
  ink: {
    border: "border-ink/20",
    label: "text-ink-3",
    bg: "bg-white/70",
    glow: "before:bg-ink/[0.04]",
  },
  amber: {
    border: "border-[#F0A014]/50",
    label: "text-[#7A4E00]",
    bg: "bg-[#FEF7E5]/70",
    glow: "before:bg-[#F0A014]/10",
  },
  blue: {
    border: "border-accent/40",
    label: "text-accent",
    bg: "bg-accent-soft/40",
    glow: "before:bg-accent/[0.08]",
  },
  cream: {
    border: "border-ink/15",
    label: "text-ink-3",
    bg: "bg-[#F7F1E5]/70",
    glow: "before:bg-[#F0A014]/[0.06]",
  },
};

/**
 * Aesthetic placeholder card for spots where animated illustrations will drop in later.
 * Reads as intentional — dashed border, soft dotted texture, an SVG "wireframe" hint,
 * and a clear description label — not as a broken image.
 */
export function IllustrationSlot({
  label,
  caption,
  aspect = "aspect-[4/5]",
  accent = "ink",
  className,
  wireframe = "mixed",
}: {
  label: string;
  caption?: string;
  aspect?: string;
  accent?: Accent;
  className?: string;
  wireframe?: "mixed" | "cards" | "avatar" | "chart" | "blank";
}) {
  const a = ACCENT_MAP[accent];
  return (
    <div
      className={cn(
        "group relative isolate flex w-full items-center justify-center overflow-hidden rounded-[2rem] border border-dashed p-5 sm:p-7 md:rounded-[2.5rem]",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:opacity-100",
        a.border,
        a.bg,
        a.glow,
        aspect,
        className,
      )}
    >
      {/* Dotted grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-40"
      />

      {/* Wireframe hint — a soft SVG stand-in for the future motion piece */}
      {wireframe !== "blank" && (
        <Wireframe kind={wireframe} accent={accent} />
      )}

      {/* Label */}
      <div className="relative z-10 mx-auto flex max-w-[80%] flex-col items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-center shadow-[0_10px_28px_-16px_rgba(10,11,14,0.25)] backdrop-blur-sm sm:max-w-[70%] sm:px-4 sm:py-2.5">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em]",
            a.label,
          )}
        >
          <Sparkles className="h-3 w-3" strokeWidth={2.4} aria-hidden />
          Illustration animée
        </span>
        <span className="text-[12px] font-medium leading-snug text-ink-2 sm:text-[13px]">
          {label}
        </span>
        {caption && (
          <span className="text-[10.5px] leading-snug text-ink-3">
            {caption}
          </span>
        )}
      </div>

      {/* Hand-drawn corner marker (top-right) */}
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className={cn(
          "absolute right-3 top-3 h-6 w-6 opacity-40",
          accent === "amber"
            ? "text-[#F0A014]"
            : accent === "blue"
              ? "text-accent"
              : "text-ink",
        )}
      >
        <path
          d="M6 10 Q 20 4 34 10 M 34 10 Q 34 24 30 34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function Wireframe({
  kind,
  accent,
}: {
  kind: "mixed" | "cards" | "avatar" | "chart";
  accent: Accent;
}) {
  const stroke =
    accent === "amber"
      ? "stroke-[#F0A014]/40"
      : accent === "blue"
        ? "stroke-accent/40"
        : "stroke-ink/25";
  const fill =
    accent === "amber"
      ? "fill-[#F0A014]/12"
      : accent === "blue"
        ? "fill-accent/12"
        : "fill-ink/[0.06]";

  if (kind === "cards") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 300 220"
        className={cn(
          "absolute inset-0 -z-[1] h-full w-full opacity-70",
          fill,
          stroke,
        )}
        preserveAspectRatio="xMidYMid slice"
      >
        <rect x="20" y="30" width="120" height="80" rx="14" strokeWidth="1.5" />
        <rect x="160" y="30" width="120" height="60" rx="14" strokeWidth="1.5" />
        <rect x="20" y="130" width="80" height="70" rx="14" strokeWidth="1.5" />
        <rect x="120" y="110" width="160" height="90" rx="14" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "chart") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 300 220"
        className={cn(
          "absolute inset-0 -z-[1] h-full w-full opacity-70",
          fill,
          stroke,
        )}
        preserveAspectRatio="xMidYMid slice"
      >
        <rect x="30" y="140" width="30" height="50" rx="6" strokeWidth="1.5" />
        <rect x="80" y="110" width="30" height="80" rx="6" strokeWidth="1.5" />
        <rect x="130" y="80" width="30" height="110" rx="6" strokeWidth="1.5" />
        <rect x="180" y="60" width="30" height="130" rx="6" strokeWidth="1.5" />
        <rect x="230" y="40" width="30" height="150" rx="6" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "avatar") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 300 220"
        className={cn(
          "absolute inset-0 -z-[1] h-full w-full opacity-70",
          fill,
          stroke,
        )}
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="150" cy="90" r="40" strokeWidth="1.5" />
        <rect x="60" y="150" width="180" height="50" rx="24" strokeWidth="1.5" />
      </svg>
    );
  }
  // mixed
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 220"
      className={cn(
        "absolute inset-0 -z-[1] h-full w-full opacity-70",
        fill,
        stroke,
      )}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect x="30" y="30" width="140" height="100" rx="18" strokeWidth="1.5" />
      <circle cx="230" cy="70" r="34" strokeWidth="1.5" />
      <rect x="30" y="150" width="240" height="40" rx="20" strokeWidth="1.5" />
    </svg>
  );
}
