import * as React from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Shared empty-state surface for list views across the app.
 *
 * Phase 2 design constraints applied (impeccable pass):
 * - No accent-bar cards (`border-l-*`).
 * - No bento tiles, no rainbow gradients, no "wow" emoji glyphs.
 * - The visual is a quiet, restrained icon tile (or caller-supplied
 *   illustration). The headline is precise — never "Nothing here yet" —
 *   and copy is one sentence pointing at the next step.
 * - At least one CTA, optional secondary CTA, optional supplementary
 *   "hint" chips that route to discovery surfaces (popular categories,
 *   templates, etc.).
 *
 * Composition: pass either `icon` (a Lucide component reference) OR
 * `illustration` (any ReactNode — SVG fragment, faded skeleton row,
 * sample preview). Tone defaults to `neutral`; use `accent` to anchor
 * with the brand color when the surface is the primary entry point for
 * a flow (e.g. inbox), and `success` to signal a positive "all clear"
 * (e.g. disputes resolved).
 */

export type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type EmptyStateHint = {
  label: string;
  href: string;
};

export type EmptyStateProps = {
  icon?: React.ComponentType<{ className?: string }>;
  illustration?: React.ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  primary?: EmptyStateAction;
  secondary?: EmptyStateAction;
  hints?: EmptyStateHint[];
  hintsLabel?: string;
  tone?: "neutral" | "accent" | "success" | "warning";
  density?: "default" | "compact";
  className?: string;
};

const toneTile: Record<NonNullable<EmptyStateProps["tone"]>, string> = {
  neutral: "bg-surface text-ink-2",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning-foreground",
};

export function EmptyState({
  icon: Icon,
  illustration,
  eyebrow,
  title,
  description,
  primary,
  secondary,
  hints,
  hintsLabel,
  tone = "neutral",
  density = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-card text-center shadow-e1/0",
        density === "compact" ? "px-6 py-10" : "px-6 py-14 sm:py-16",
        className,
      )}
    >
      {illustration ? (
        <div className="mb-1 grid place-items-center">{illustration}</div>
      ) : Icon ? (
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-[var(--radius-md)]",
            toneTile[tone],
          )}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>
      ) : null}

      {eyebrow && (
        <p className="mt-4 font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
          {eyebrow}
        </p>
      )}

      <h3
        className={cn(
          "max-w-md text-balance font-semibold tracking-tight text-foreground",
          eyebrow ? "mt-2" : "mt-4",
          density === "compact" ? "text-[15px]" : "text-[17px] sm:text-[19px]",
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "mt-2 max-w-md text-pretty text-ink-2",
            density === "compact" ? "text-[12.5px]" : "text-[13.5px] leading-relaxed",
          )}
        >
          {description}
        </p>
      )}

      {(primary || secondary) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {primary && <ActionButton action={primary} variant="primary" />}
          {secondary && <ActionButton action={secondary} variant="outline" />}
        </div>
      )}

      {hints && hints.length > 0 && (
        <div className="mt-6 flex max-w-md flex-col items-center gap-3">
          {hintsLabel && (
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
              {hintsLabel}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-1.5">
            {hints.map((h) => (
              <Link
                key={`${h.label}-${h.href}`}
                href={h.href as never}
                className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:border-foreground hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {h.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  action,
  variant,
}: {
  action: EmptyStateAction;
  variant: "primary" | "outline";
}) {
  if (action.href) {
    return (
      <Button asChild variant={variant} size="md">
        <Link href={action.href as never}>{action.label}</Link>
      </Button>
    );
  }
  return (
    <Button variant={variant} size="md" onClick={action.onClick}>
      {action.label}
    </Button>
  );
}
