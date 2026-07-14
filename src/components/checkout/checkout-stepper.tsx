"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

// Four-step indicator for the booking / checkout flow, per MASTER §12.
// - Desktop: vertical numbered stepper (280px column), accent underline on active.
// - Mobile: horizontal step dots + "Étape X sur 4 · [step name]" label,
//   4px progress bar with --surface-2 track and --accent fill.
//
// The stepper is presentational — it doesn't own step state. The caller
// passes the currentIndex and whether the flow is at the terminal
// "Confirmé" step so the connector fills correctly.

export const CHECKOUT_STEPS = [
  { id: "details", label: "Détails" },
  { id: "confirmation", label: "Confirmation" },
  { id: "payment", label: "Paiement" },
  { id: "confirmed", label: "Confirmé" },
] as const;

export type CheckoutStepId = (typeof CHECKOUT_STEPS)[number]["id"];

type Props = {
  currentIndex: number;
  className?: string;
};

/**
 * Desktop-only vertical stepper. Renders in a 280px left column above `lg`.
 */
export function CheckoutStepperDesktop({ currentIndex, className }: Props) {
  return (
    <aside
      aria-label="Étapes"
      className={cn(
        "hidden lg:block lg:w-[280px] lg:shrink-0",
        className,
      )}
    >
      <ol className="sticky top-24 space-y-1">
        {CHECKOUT_STEPS.map((step, i) => {
          const state = getState(i, currentIndex);
          return (
            <li key={step.id}>
              <div
                className={cn(
                  "group relative flex items-start gap-3 rounded-[var(--radius-lg)] px-3 py-3 transition-colors",
                  state === "current" && "bg-accent-soft/40",
                )}
                aria-current={state === "current" ? "step" : undefined}
              >
                <StepBadge state={state} index={i} />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.14em]",
                      state === "current"
                        ? "text-accent"
                        : state === "done"
                          ? "text-ink-2"
                          : "text-ink-3",
                    )}
                  >
                    Étape {i + 1}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-[14.5px] font-semibold leading-tight",
                      state === "upcoming" ? "text-ink-3" : "text-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  {state === "current" && (
                    <span
                      aria-hidden
                      className="mt-2 block h-[2px] w-8 bg-accent"
                    />
                  )}
                </div>
              </div>
              {i < CHECKOUT_STEPS.length - 1 && (
                <div className="ml-[calc(0.75rem+14px)] h-4 w-px bg-border" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

/**
 * Mobile-only header. Sticky under the site nav, contains dots + label
 * + 4px progress bar. Hidden on `lg`.
 */
export function CheckoutStepperMobile({ currentIndex, className }: Props) {
  const step = CHECKOUT_STEPS[Math.max(0, Math.min(currentIndex, CHECKOUT_STEPS.length - 1))];
  // Progress bar fill: current step counts as half-progress until it moves
  // forward, so the bar always shows the user has traction on the step.
  const pct = Math.min(
    100,
    Math.max(6, ((currentIndex + 1) / CHECKOUT_STEPS.length) * 100),
  );

  return (
    <div className={cn("lg:hidden", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3 tabular">
            Étape {currentIndex + 1} sur {CHECKOUT_STEPS.length}
          </p>
          <p className="mt-1 truncate text-[15px] font-semibold text-foreground">
            {step.label}
          </p>
        </div>
        <ol className="flex items-center gap-1.5" aria-label="Étapes">
          {CHECKOUT_STEPS.map((s, i) => {
            const state = getState(i, currentIndex);
            return (
              <li
                key={s.id}
                aria-label={`Étape ${i + 1} · ${s.label}`}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "h-2 rounded-full transition-all",
                  state === "current"
                    ? "w-6 bg-accent"
                    : state === "done"
                      ? "w-2 bg-accent/70"
                      : "w-2 bg-surface-2",
                )}
              />
            );
          })}
        </ol>
      </div>
      <div
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={CHECKOUT_STEPS.length}
        aria-valuenow={currentIndex + 1}
        aria-label="Progression"
      >
        <div
          className="h-full bg-accent transition-[width] duration-[240ms] ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

type StepState = "done" | "current" | "upcoming";

function getState(i: number, currentIndex: number): StepState {
  if (i < currentIndex) return "done";
  if (i === currentIndex) return "current";
  return "upcoming";
}

function StepBadge({ state, index }: { state: StepState; index: number }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12.5px] font-semibold tabular transition-colors",
        state === "done" && "bg-accent text-accent-foreground",
        state === "current" && "bg-foreground text-primary-foreground ring-4 ring-accent-soft",
        state === "upcoming" && "border border-border bg-background text-ink-3",
      )}
    >
      {state === "done" ? <Check className="h-3.5 w-3.5" /> : index + 1}
    </span>
  );
}
