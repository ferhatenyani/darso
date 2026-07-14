"use client";

import { useEffect } from "react";
import {
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Copy,
  Receipt,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Booking } from "@/lib/mock/bookings-state";
import { CheckoutShell } from "@/components/checkout/checkout-shell";

// Step 4 — Confirmé. Renders the success view inside the same shell as the
// upstream steps so the stepper stays visible (with all four steps done).
// Payment logic hasn't changed: the caller has already flipped the booking
// to `pending_teacher_confirmation`; we just render the receipt view and
// auto-forward to /bookings/[id] after 8 s so the student lands on the
// definitive record. The delay was 5s before the redesign — bumped so the
// CTAs are actually readable.

const AUTO_FORWARD_MS = 8000;

export function CheckoutSuccessClient({ booking }: { booking: Booking }) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(`/bookings/${booking.id}` as never);
    }, AUTO_FORWARD_MS);
    return () => clearTimeout(t);
  }, [booking.id, router]);

  const start = booking.start
    ? new Intl.DateTimeFormat("fr-DZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(booking.start))
    : null;

  return (
    <CheckoutShell currentIndex={3}>
      <section aria-labelledby="confirmed-heading">
        {/* Header block */}
        <div className="flex items-start gap-4">
          <div
            aria-hidden
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-success-soft text-success"
          >
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-success">
              Étape 4 · Réservation transmise
            </p>
            <h1
              id="confirmed-heading"
              className="mt-2 text-balance text-[26px] font-semibold leading-[1.15] tracking-tight text-foreground md:text-[32px]"
            >
              Merci — votre demande est envoyée
            </h1>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
              Nous avons transmis votre paiement à {booking.teacherName.fr}.
              Vous serez notifié dès que votre place est verrouillée.
            </p>
          </div>
        </div>

        {/* Booking reference card */}
        <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                Référence
              </p>
              <p className="mt-2 flex items-center gap-2 font-mono text-[18px] font-semibold tabular text-foreground md:text-[20px]">
                <span className="text-ink-3">#</span>
                <span className="select-all">{booking.id}</span>
                <CopyIdButton id={booking.id} />
              </p>
              <p className="mt-2 text-[13px] text-ink-3">
                Conservez cet identifiant — il apparaît sur votre reçu et
                dans vos messages avec le professeur.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                Montant
              </p>
              <p className="mt-2 text-[20px] font-semibold tabular text-foreground">
                {formatPrice(booking.priceDzd, "fr")}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-5 text-[13.5px]">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <div>
                <p className="text-ink-3">Sujet</p>
                <p className="mt-0.5 font-medium text-foreground">
                  {booking.subjectTitle.fr || booking.subjectTitle.ar || "—"}
                </p>
              </div>
              <div>
                <p className="text-ink-3">Professeur</p>
                <p className="mt-0.5 font-medium text-foreground">
                  {booking.teacherName.fr}
                </p>
              </div>
              {start && (
                <div>
                  <p className="text-ink-3">Créneau</p>
                  <p className="mt-0.5 font-medium text-foreground">{start}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What happens next — three lines */}
        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            La suite
          </p>
          <ol className="mt-4 space-y-3">
            <NextItem
              index={1}
              title="Le professeur confirme la réception"
              body="Sous 48 h. Vous recevrez une notification dès que la place est verrouillée."
            />
            <NextItem
              index={2}
              title="La séance apparaît dans votre calendrier"
              body="Avec des rappels 24 h et 1 h avant le début."
            />
            <NextItem
              index={3}
              title="Vous accédez au lien vidéo ou à l'adresse"
              body="Débloqué automatiquement 15 min avant la session."
            />
          </ol>
        </div>

        {/* Two primary CTAs — required by spec */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild variant="accent" size="lg" className="sm:min-w-[240px]">
            <Link href="/calendar">
              <Calendar className="h-4 w-4" />
              Voir dans mon calendrier
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/messages">
              <MessageSquare className="h-4 w-4" />
              Envoyer un message à l'enseignant
            </Link>
          </Button>
        </div>

        {/* Secondary utility row */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-[13px]">
          <Link
            href={`/bookings/${booking.id}` as never}
            className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-hover"
          >
            <Receipt className="h-4 w-4" aria-hidden />
            Voir la réservation
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 text-ink-2 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Retour à l'exploration
          </Link>
          <span className="ml-auto text-[11px] uppercase tracking-[0.14em] text-ink-3">
            Redirection dans 8 secondes
          </span>
        </div>
      </section>
    </CheckoutShell>
  );
}

function NextItem({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-e1">
      <span
        aria-hidden
        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-[12.5px] font-semibold tabular text-ink-2"
      >
        {index}
      </span>
      <div className="min-w-0">
        <p className="text-[14.5px] font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-2">
          {body}
        </p>
      </div>
    </li>
  );
}

function CopyIdButton({ id }: { id: string }) {
  function onCopy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(id);
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      className="ml-1 grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-ink-3 transition-colors hover:border-border-strong hover:text-foreground"
      aria-label="Copier la référence"
    >
      <Copy className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
