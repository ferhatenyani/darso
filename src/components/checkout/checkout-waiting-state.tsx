"use client";

import { useEffect, useState, useTransition } from "react";
import { Clock, ShieldAlert, ArrowRight, Ban } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { advanceBookingStage, type Booking } from "@/lib/mock/bookings-state";
import { formatPrice } from "@/lib/utils";

// Post-arrangement waiting state. Student has clicked "I paid", the booking
// is at `pending_teacher_confirmation`, and we're waiting on the teacher to
// confirm receipt. 48h countdown from stageEnteredAt; past that, the student
// gets escalation CTAs (withdraw + file a dispute).

const TIMEOUT_MS = 48 * 60 * 60 * 1000;

function useCountdown(deadlineIso: string | undefined): { hours: number; minutes: number; overdue: boolean } {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (!deadlineIso) return { hours: 0, minutes: 0, overdue: false };
  const remaining = new Date(deadlineIso).getTime() + TIMEOUT_MS - now;
  if (remaining <= 0) return { hours: 0, minutes: 0, overdue: true };
  return {
    hours: Math.floor(remaining / (60 * 60 * 1000)),
    minutes: Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000)),
    overdue: false,
  };
}

export function CheckoutWaitingState({ booking }: { booking: Booking }) {
  const router = useRouter();
  const { hours, minutes, overdue } = useCountdown(booking.stageEnteredAt);
  const [isPending, startTransition] = useTransition();

  function onWithdraw() {
    startTransition(() => {
      advanceBookingStage(booking.id, "cancelled");
      router.push(`/bookings/${booking.id}` as never);
    });
  }

  function onEscalate() {
    router.push(`/disputes/new?bookingId=${booking.id}` as never);
  }

  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-e1">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-warning/15 text-warning">
              <Clock className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                En attente de confirmation
              </p>
              <h1 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-foreground md:text-[28px]">
                Votre professeur confirme la réception du paiement
              </h1>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
                {booking.teacherName.fr} confirmera votre paiement sous 48 h. Une notification vous préviendra dès que votre place est verrouillée.
              </p>
            </div>
          </div>

          {/* Countdown pill */}
          <div className="mt-8 border-t border-border pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[12.5px] uppercase tracking-[0.16em] text-ink-3">
                Délai restant
              </p>
              {overdue ? (
                <span className="text-[16px] font-semibold text-danger">
                  Délai dépassé
                </span>
              ) : (
                <span className="text-[24px] font-semibold tabular tracking-tight text-foreground">
                  {hours}h {String(minutes).padStart(2, "0")}m
                </span>
              )}
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface">
              <div
                className={overdue ? "h-full bg-danger" : "h-full bg-accent"}
                style={{
                  width: `${Math.max(2, Math.min(100, (hours * 60 + minutes) / (48 * 60) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Booking summary */}
          <dl className="mt-8 space-y-2 border-t border-border pt-6 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-ink-3">Réservation</dt>
              <dd className="font-medium text-foreground">
                {booking.subjectTitle.fr || booking.subjectTitle.ar}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-3">Montant</dt>
              <dd className="font-semibold tabular text-foreground">
                {formatPrice(booking.priceDzd, "fr")}
              </dd>
            </div>
          </dl>

          {overdue && (
            <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-lg)] border border-danger/20 bg-danger/5 p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
              <div className="text-[13.5px] leading-relaxed text-ink">
                <p className="font-semibold">Le professeur n'a pas confirmé dans les délais.</p>
                <p className="mt-1 text-ink-2">
                  Vous pouvez retirer votre demande et rebooker, ou nous signaler un problème pour ouvrir un litige.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="ghost">
              <a href={`/bookings/${booking.id}`}>
                Voir la réservation
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            {overdue && (
              <>
                <Button
                  variant="ghost"
                  onClick={onWithdraw}
                  disabled={isPending}
                  className="text-danger hover:bg-danger/10 hover:text-danger"
                >
                  <Ban className="h-4 w-4" />
                  Retirer la demande
                </Button>
                <Button variant="ghost" onClick={onEscalate}>
                  Signaler un problème
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
