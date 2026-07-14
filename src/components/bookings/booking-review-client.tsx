"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { ArrowLeft, ArrowRight, Star, Send } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";
import {
  advanceBookingStage,
  findBookingByIdForAccount,
  subscribeBookings,
  type Booking,
} from "@/lib/mock/bookings-state";
import { cn } from "@/lib/utils";

// Post-completion review form. Reachable only when the booking is
// `completed`; other stages redirect back to detail. Submission advances
// the stage to `reviewed`. The review body itself isn't persisted in the
// mock — real backend would write a Review row keyed to the booking.

const TAGS = [
  "Pédagogue",
  "Ponctuel",
  "Bien préparé",
  "Bienveillant",
  "Exigeant",
  "Créatif",
] as const;

type Tag = (typeof TAGS)[number];

function useBooking(id: string, accountId: string | undefined): Booking | null {
  return useSyncExternalStore(
    subscribeBookings,
    () => findBookingByIdForAccount(id, accountId),
    () => null,
  );
}

export function BookingReviewClient({ bookingId }: { bookingId: string }) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const booking = useBooking(bookingId, user?.id);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<Set<Tag>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  if (!booking) {
    return (
      <div className="container-narrow py-16">
        <div className="mx-auto max-w-md rounded-[var(--radius-xl)] border border-border bg-card p-8 text-center shadow-e1">
          <h1 className="text-[20px] font-semibold text-foreground">
            Réservation introuvable
          </h1>
          <p className="mt-2 text-[13.5px] text-ink-2">
            Impossible de charger cette réservation.
          </p>
          <Button asChild variant="ghost" className="mt-4">
            <Link href="/bookings">
              <ArrowLeft className="h-4 w-4" />
              Mes réservations
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const stage = booking.stage ?? "confirmed";
  const canReview = stage === "completed";
  const alreadyReviewed = stage === "reviewed";

  if (alreadyReviewed) {
    return (
      <ReviewLandingCard
        title="Vous avez déjà laissé un avis"
        body={`Merci ! Votre avis pour ${booking.teacherName.fr} est enregistré.`}
        primaryHref={`/teachers/${booking.teacherSlug}`}
        primaryLabel="Voir le professeur"
      />
    );
  }

  if (!canReview) {
    return (
      <ReviewLandingCard
        title="Cette réservation n'est pas encore terminée"
        body="Vous pourrez laisser un avis dès la fin de la session."
        primaryHref={`/bookings/${booking.id}`}
        primaryLabel="Voir la réservation"
      />
    );
  }

  function toggleTag(t: Tag) {
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  const targetId = booking.id;
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    startTransition(() => {
      advanceBookingStage(targetId, "reviewed");
      setSubmitted(true);
      // Land back on the booking detail after a brief thank-you screen.
      setTimeout(() => router.push(`/bookings/${targetId}` as never), 1400);
    });
  }

  if (submitted) {
    return (
      <ReviewLandingCard
        title="Merci pour votre avis"
        body={`Il aidera d'autres élèves à choisir ${booking.teacherName.fr}.`}
        primaryHref={`/bookings/${booking.id}`}
        primaryLabel="Voir la réservation"
      />
    );
  }

  return (
    <div className="container-narrow py-8 md:py-12">
      <Link
        href={`/bookings/${booking.id}` as never}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour à la réservation
      </Link>

      <div className="mt-4 mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Nouvel avis
        </p>
        <h1 className="mt-3 text-balance text-[28px] font-semibold leading-tight tracking-tight text-foreground md:text-[36px]">
          Comment était votre session avec {booking.teacherName.fr} ?
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
          Votre avis s'affichera sur la fiche du professeur après vérification. Il apparaît publiquement dès que {booking.teacherName.fr} laisse aussi un avis sur vous, ou automatiquement sous 14 jours.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-8 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1 md:p-8"
        >
          {/* Rating */}
          <fieldset>
            <legend className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              Note globale
            </legend>
            <div
              className="mt-3 flex gap-1"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const active = (hovered || rating) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    className="rounded-md p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        active ? "fill-warning text-warning" : "text-ink-3",
                      )}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-[12.5px] text-ink-2">
                {rating === 5
                  ? "Excellent"
                  : rating === 4
                    ? "Très bien"
                    : rating === 3
                      ? "Correct"
                      : rating === 2
                        ? "Décevant"
                        : "À revoir"}
              </p>
            )}
          </fieldset>

          {/* Body */}
          <div>
            <label
              htmlFor="review-body"
              className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-3"
            >
              Votre expérience
            </label>
            <textarea
              id="review-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Qu'avez-vous appris ? Comment se déroulait la session ? Recommanderiez-vous ?"
              className="mt-3 w-full resize-y rounded-[var(--radius-md)] border border-border bg-background px-3 py-3 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-ink-3 focus:border-accent focus:ring-2 focus:ring-ring-soft"
            />
          </div>

          {/* Tags */}
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              Étiquettes (optionnel)
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TAGS.map((t) => {
                const on = tags.has(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                      on
                        ? "border-accent bg-accent-soft/60 text-accent"
                        : "border-border bg-background text-ink-2 hover:border-accent hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={rating === 0 || isPending}
            >
              <Send className="h-4 w-4" />
              Envoyer l'avis
            </Button>
            <p className="text-[12.5px] text-ink-3">
              {rating === 0
                ? "Choisissez au moins une étoile"
                : "Vous pouvez modifier votre avis pendant 24 h"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReviewLandingCard({
  title,
  body,
  primaryHref,
  primaryLabel,
}: {
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
}) {
  return (
    <div className="container-narrow py-12 md:py-20">
      <div className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-border bg-card p-8 text-center shadow-e1">
        <h1 className="text-[22px] font-semibold text-foreground md:text-[26px]">
          {title}
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={primaryHref as never}>
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/bookings">
              <ArrowLeft className="h-4 w-4" />
              Mes réservations
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
