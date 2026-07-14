import { Check } from "lucide-react";

import type { Booking, BookingStage } from "@/lib/mock/bookings-state";
import { cn } from "@/lib/utils";

// Visual timeline of the v3 stage machine. Two variants depending on the
// listing type: custom listings have an approval step; catalog listings
// skip straight to payment. Terminal states (rejected/expired/cancelled)
// render an inline banner instead of forcing a fake progression.

type Step = {
  key: BookingStage | "start";
  label: string;
  hint?: string;
};

const CATALOG_STEPS: Step[] = [
  { key: "pending_payment", label: "Paiement à effectuer" },
  { key: "pending_teacher_confirmation", label: "Confirmation du professeur" },
  { key: "confirmed", label: "Confirmée" },
  { key: "completed", label: "Terminée" },
];

const CUSTOM_STEPS: Step[] = [
  { key: "requested", label: "Demande envoyée" },
  { key: "approved", label: "Acceptée" },
  { key: "pending_teacher_confirmation", label: "Confirmation du paiement" },
  { key: "confirmed", label: "Confirmée" },
  { key: "completed", label: "Terminée" },
];

const TERMINAL_STAGES: readonly BookingStage[] = [
  "rejected",
  "expired",
  "cancelled",
  "removed_by_teacher",
  "refunded",
  "dismissed",
];

const TERMINAL_COPY: Partial<Record<BookingStage, string>> = {
  rejected: "Le professeur a décliné la demande.",
  expired: "Aucune réponse dans les 72 h.",
  cancelled: "Réservation annulée.",
  removed_by_teacher: "Place retirée par le professeur.",
  refunded: "Réservation remboursée.",
  dismissed: "Litige rejeté par l'arbitre.",
};

export function BookingTimeline({
  stage,
  kind,
}: {
  stage: BookingStage;
  kind: Booking["kind"];
}) {
  if (TERMINAL_STAGES.includes(stage)) {
    return (
      <div className="rounded-[var(--radius-md)] border border-danger/20 bg-danger/5 p-4">
        <p className="text-[13.5px] font-medium text-danger">
          {TERMINAL_COPY[stage] ?? "Cette réservation est clôturée."}
        </p>
      </div>
    );
  }

  const isCustom = kind === "1to1";
  const steps = isCustom ? CUSTOM_STEPS : CATALOG_STEPS;
  const currentIndex = steps.findIndex((s) => s.key === stage);
  const activeIndex =
    stage === "reviewed"
      ? steps.length - 1
      : currentIndex === -1
        ? 0
        : currentIndex;

  return (
    <ol className="flex items-stretch justify-between gap-2 overflow-x-auto">
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <li key={step.key} className="flex flex-1 flex-col items-center text-center">
            <div className="relative flex w-full items-center justify-center">
              {/* Left connector */}
              {i > 0 && (
                <span
                  className={cn(
                    "absolute start-0 top-1/2 h-px w-1/2 -translate-y-1/2",
                    done || active ? "bg-accent" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
              {/* Right connector */}
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "absolute end-0 top-1/2 h-px w-1/2 -translate-y-1/2",
                    done ? "bg-accent" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
              {/* Node */}
              <span
                className={cn(
                  "relative z-10 grid h-7 w-7 place-items-center rounded-full border-2 bg-card",
                  done
                    ? "border-accent bg-accent text-accent-foreground"
                    : active
                      ? "border-accent bg-card text-accent"
                      : "border-border bg-card text-ink-3",
                )}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <span className="text-[11px] font-semibold tabular">{i + 1}</span>
                )}
              </span>
            </div>
            <p
              className={cn(
                "mt-3 max-w-[9rem] text-[11.5px] font-medium leading-tight",
                done || active ? "text-foreground" : "text-ink-3",
              )}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
