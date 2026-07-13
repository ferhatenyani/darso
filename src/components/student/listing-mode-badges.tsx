import { Zap, UserCheck, Info } from "lucide-react";

import { cn } from "@/lib/utils";

// Public-facing badges that signal a listing's booking model to prospective
// students. Instant-book = pay now, seat locked. Approval-required = the
// teacher reviews your request before you pay, may take up to 72 h. Shown
// prominently near the primary CTA so the student never guesses the flow.

type Mode = "instant" | "approval";

/**
 * Deterministic fallback while seeded catalogue data doesn't carry an
 * explicit `approvalMode`. Simple hash so different courses/events show
 * a mix in the demo. Real backend passes the actual value through.
 */
export function deriveApprovalMode(id: string): Mode {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(hash) % 4 === 0 ? "approval" : "instant";
}

export function ListingApprovalBadge({
  mode,
  size = "md",
  className,
}: {
  mode: Mode;
  size?: "sm" | "md";
  className?: string;
}) {
  const isInstant = mode === "instant";
  const Icon = isInstant ? Zap : UserCheck;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-[0.06em]",
        isInstant
          ? "border-success/25 bg-success/10 text-success"
          : "border-warning/25 bg-warning/10 text-warning",
        size === "sm" ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-1 text-[11px]",
        className,
      )}
      title={
        isInstant
          ? "Réservation instantanée — vous payez et votre place est immédiatement verrouillée."
          : "Approbation manuelle — le professeur examine votre demande sous 72 h avant que vous ne payiez."
      }
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
      {isInstant ? "Réservation instantanée" : "Approbation requise"}
    </span>
  );
}

/**
 * Explainer strip. Fuller version shown on detail pages under the CTA so
 * students know what happens right after they click.
 */
export function ListingApprovalExplainer({ mode }: { mode: Mode }) {
  const isInstant = mode === "instant";
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius-md)] border p-3 text-[12.5px] leading-relaxed",
        isInstant
          ? "border-success/25 bg-success/8 text-success"
          : "border-warning/25 bg-warning/8 text-warning",
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="text-ink">
        {isInstant ? (
          <>
            <p className="font-semibold">
              Réservation instantanée
            </p>
            <p className="mt-0.5 text-ink-2">
              Vous payez et votre place est verrouillée immédiatement — pas d'attente.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold">
              Approbation requise
            </p>
            <p className="mt-0.5 text-ink-2">
              Le professeur examine votre demande sous 72 h. Aucun paiement n'est prélevé tant que la demande n'est pas acceptée.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
