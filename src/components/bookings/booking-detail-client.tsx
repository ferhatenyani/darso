"use client";

import { useMemo, useSyncExternalStore, useTransition } from "react";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Receipt,
  Video,
  MapPin,
  Ban,
  Star,
  ShieldAlert,
  Search,
  PenLine,
  Users,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";
import {
  advanceBookingStage,
  findBookingByIdForAccount,
  subscribeBookings,
  type Booking,
  type BookingStage,
} from "@/lib/mock/bookings-state";
import { BookingTimeline } from "@/components/bookings/booking-timeline";
import { formatPrice, cn } from "@/lib/utils";

// Client-rendered detail page. Subscribes to the booking store so an
// action taken here (cancel, mark-as-arranged from /checkout, teacher
// updates via the dev switcher) refreshes the view without a reload.

function useBooking(id: string, accountId: string | undefined): Booking | null {
  return useSyncExternalStore(
    subscribeBookings,
    () => findBookingByIdForAccount(id, accountId),
    () => null,
  );
}

export function BookingDetailClient({ bookingId }: { bookingId: string }) {
  const { user } = useCurrentUser();
  const booking = useBooking(bookingId, user?.id);

  if (!booking) {
    return (
      <div className="container-narrow py-16">
        <div className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-border bg-card p-8 text-center shadow-e1">
          <h1 className="text-[22px] font-semibold text-foreground">
            Réservation introuvable
          </h1>
          <p className="mt-3 text-[14px] text-ink-2">
            Cette réservation n'existe pas ou ne vous appartient pas.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/bookings">
                <ArrowLeft className="h-4 w-4" />
                Retour à mes réservations
              </Link>
            </Button>
            <Button asChild>
              <Link href="/browse">
                <Search className="h-4 w-4" />
                Parcourir
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <BookingDetailView booking={booking} />;
}

function BookingDetailView({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const stage = booking.stage ?? "pending_payment";

  const start = booking.start
    ? new Intl.DateTimeFormat("fr-DZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(booking.start))
    : null;

  function onCancel() {
    if (!confirm("Annuler cette réservation ?")) return;
    startTransition(() => {
      advanceBookingStage(booking.id, "cancelled");
    });
  }

  // Reveal-after-confirmation: join link / venue address only after the
  // booking is `confirmed` (or beyond). Prior stages just show teasers.
  const isRevealed = ["confirmed", "completed", "reviewed"].includes(stage);
  const isTerminal = [
    "cancelled",
    "rejected",
    "expired",
    "removed_by_teacher",
    "refunded",
    "dismissed",
  ].includes(stage);

  return (
    <div className="container-narrow py-8 md:py-12">
      {/* Back link */}
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Mes réservations
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* Left column */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {stageBadge(stage)}
          </p>
          <h1 className="mt-3 text-balance text-[28px] font-semibold leading-tight tracking-tight text-foreground md:text-[36px]">
            {booking.subjectTitle.fr || booking.subjectTitle.ar || "Réservation"}
          </h1>
          <p className="mt-2 text-[15px] text-ink-2">
            avec {booking.teacherName.fr}
            {start ? <> · {start}</> : null}
          </p>

          {/* Timeline */}
          <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1">
            <BookingTimeline stage={stage} kind={booking.kind} />
          </div>

          {/* Stage-specific action panel */}
          <div className="mt-6 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1">
            <StageActions
              booking={booking}
              stage={stage}
              isPending={isPending}
              onCancel={onCancel}
              onPayNow={() => router.push(`/checkout/${booking.id}` as never)}
              onLeaveReview={() => router.push(`/bookings/${booking.id}/review` as never)}
              onFileDispute={() => router.push(`/disputes/new?bookingId=${booking.id}` as never)}
            />
          </div>

          {/* Unlocks — only after confirmed */}
          {isRevealed && <UnlocksPanel booking={booking} />}
        </div>

        {/* Right column — sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SummarySidebar booking={booking} isRevealed={isRevealed} isTerminal={isTerminal} />
        </aside>
      </div>
    </div>
  );
}

function stageBadge(stage: BookingStage): string {
  switch (stage) {
    case "requested":
      return "En attente d'acceptation";
    case "approved":
      return "Acceptée — à régler";
    case "pending_payment":
      return "Paiement à effectuer";
    case "pending_teacher_confirmation":
      return "En attente de confirmation";
    case "confirmed":
      return "Confirmée";
    case "completed":
      return "Terminée";
    case "reviewed":
      return "Terminée · notée";
    case "rejected":
      return "Refusée";
    case "expired":
      return "Délai dépassé";
    case "cancelled":
      return "Annulée";
    case "removed_by_teacher":
      return "Place retirée";
    case "disputed":
      return "Litige en cours";
    case "refunded":
      return "Remboursée";
    case "dismissed":
      return "Litige rejeté";
  }
}

function StageActions({
  booking,
  stage,
  isPending,
  onCancel,
  onPayNow,
  onLeaveReview,
  onFileDispute,
}: {
  booking: Booking;
  stage: BookingStage;
  isPending: boolean;
  onCancel: () => void;
  onPayNow: () => void;
  onLeaveReview: () => void;
  onFileDispute: () => void;
}) {
  switch (stage) {
    case "requested":
      return (
        <ActionRow
          title="Le professeur examine votre demande"
          body="Vous recevrez une notification dès la réponse. Vous pouvez annuler à tout moment sans frais."
        >
          <Button variant="ghost">
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isPending}>
            <Ban className="h-4 w-4" />
            Annuler la demande
          </Button>
        </ActionRow>
      );

    case "approved":
    case "pending_payment":
      return (
        <ActionRow
          title="Arrangez le paiement"
          body="Choisissez une méthode et suivez les instructions du professeur. Votre place est réservée une fois le paiement confirmé."
        >
          <Button onClick={onPayNow}>
            <Receipt className="h-4 w-4" />
            Régler le paiement
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isPending}>
            <Ban className="h-4 w-4" />
            Annuler
          </Button>
        </ActionRow>
      );

    case "pending_teacher_confirmation":
      return (
        <ActionRow
          title="Le professeur confirme la réception"
          body="Nous attendons la confirmation sous 48 h. Vous êtes notifié dès que votre place est verrouillée."
        >
          <Button variant="ghost">
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button variant="ghost" onClick={onFileDispute}>
            <ShieldAlert className="h-4 w-4" />
            Signaler un problème
          </Button>
        </ActionRow>
      );

    case "confirmed":
      return (
        <ActionRow
          title="Votre place est confirmée"
          body="Rendez-vous dans votre calendrier pour rejoindre la session. Le lien apparaîtra 15 min avant le début."
        >
          {booking.start && (
            <Button variant="ghost">
              <Video className="h-4 w-4" />
              Rejoindre (le jour J)
            </Button>
          )}
          <Button variant="ghost">
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isPending}>
            <Ban className="h-4 w-4" />
            Annuler
          </Button>
        </ActionRow>
      );

    case "completed":
      return (
        <ActionRow
          title="Merci d'avoir participé"
          body="Laissez un avis pour aider les prochains élèves à choisir. Vous avez 14 jours."
        >
          <Button onClick={onLeaveReview}>
            <Star className="h-4 w-4" />
            Laisser un avis
          </Button>
          <Button variant="ghost" onClick={onFileDispute}>
            <ShieldAlert className="h-4 w-4" />
            Signaler un problème
          </Button>
        </ActionRow>
      );

    case "reviewed":
      return (
        <ActionRow
          title="Avis envoyé"
          body="Vous pouvez retrouver votre avis sur la fiche du professeur."
        >
          <Button asChild variant="ghost">
            <Link href={`/teachers/${booking.teacherSlug}` as never}>
              Voir le professeur
            </Link>
          </Button>
        </ActionRow>
      );

    case "rejected":
    case "expired":
      return (
        <ActionRow
          title={stage === "rejected" ? "Demande refusée" : "Aucune réponse dans les délais"}
          body="Aucun paiement n'a été effectué. Trouvez un autre professeur ou publiez une demande ouverte."
        >
          <Button asChild>
            <Link href="/teachers">
              <Search className="h-4 w-4" />
              Voir d'autres professeurs
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/requests/new">
              <PenLine className="h-4 w-4" />
              Publier une demande
            </Link>
          </Button>
        </ActionRow>
      );

    case "cancelled":
    case "removed_by_teacher":
      return (
        <ActionRow
          title={stage === "cancelled" ? "Réservation annulée" : "Place retirée par le professeur"}
          body="Cette réservation est clôturée."
        >
          <Button asChild variant="ghost">
            <Link href="/bookings">Retour à mes réservations</Link>
          </Button>
        </ActionRow>
      );

    case "disputed":
      return (
        <ActionRow
          title="Litige ouvert"
          body="Un arbitre darso examine votre dossier. Vous recevrez des mises à jour par notification."
        >
          <Button variant="ghost">Voir le litige</Button>
        </ActionRow>
      );

    case "refunded":
      return (
        <ActionRow
          title="Remboursement traité"
          body="Le professeur vous a remboursé. Le dossier est clôturé."
        >
          <Button asChild variant="ghost">
            <Link href="/bookings">Retour</Link>
          </Button>
        </ActionRow>
      );

    case "dismissed":
      return (
        <ActionRow
          title="Litige rejeté"
          body="L'arbitre a estimé que la réservation devait être maintenue."
        >
          <Button asChild variant="ghost">
            <Link href="/bookings">Retour</Link>
          </Button>
        </ActionRow>
      );
  }
}

function ActionRow({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 className="text-[16px] font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </>
  );
}

function UnlocksPanel({ booking }: { booking: Booking }) {
  const isOnline = booking.kind !== "event"; // events can be in-person; other kinds are online by default in the mock
  return (
    <div className="mt-6 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
        Débloqué à la confirmation
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        <UnlockItem
          Icon={Calendar}
          title="Ajout au calendrier"
          body="La session apparaît dans votre calendrier avec des rappels 24 h et 1 h avant."
          href="/calendar"
        />
        <UnlockItem
          Icon={MessageSquare}
          title="Fil de discussion"
          body="Un fil de messages est ouvert avec votre professeur."
          href="/messages"
        />
        {isOnline ? (
          <UnlockItem
            Icon={Video}
            title="Lien de la session"
            body="Le lien vidéo s'affiche 15 min avant le début."
            href={`/call/${booking.id}` as never}
          />
        ) : (
          <UnlockItem
            Icon={MapPin}
            title="Adresse du lieu"
            body="L'adresse complète est révélée sur cette page."
          />
        )}
        <UnlockItem
          Icon={Receipt}
          title="Reçu de paiement"
          body="Un reçu est disponible dans votre compte."
          href={`/account/invoices/${booking.id}` as never}
        />
      </ul>
    </div>
  );
}

function UnlockItem({
  Icon,
  title,
  body,
  href,
}: {
  Icon: typeof Calendar;
  title: string;
  body: string;
  href?: string;
}) {
  const content = (
    <div className={cn(
      "flex gap-3 rounded-[var(--radius-lg)] border border-border bg-background p-4 transition-colors",
      href && "hover:border-accent hover:bg-accent-soft/30",
    )}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface text-ink-2">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">{body}</p>
      </div>
    </div>
  );
  if (href) return <li><Link href={href as never}>{content}</Link></li>;
  return <li>{content}</li>;
}

function SummarySidebar({
  booking,
  isRevealed,
  isTerminal,
}: {
  booking: Booking;
  isRevealed: boolean;
  isTerminal: boolean;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
        Détails
      </p>
      <dl className="mt-4 space-y-3 text-[13.5px]">
        <div className="flex items-center justify-between">
          <dt className="text-ink-3">Type</dt>
          <dd className="font-medium text-foreground">{fmtKind(booking.kind)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink-3">Montant</dt>
          <dd className="text-[15px] font-semibold tabular text-foreground">
            {formatPrice(booking.priceDzd, "fr")}
          </dd>
        </div>
        {booking.paymentLabel && (
          <div className="flex items-center justify-between">
            <dt className="text-ink-3">Paiement</dt>
            <dd className="font-medium text-foreground">{booking.paymentLabel}</dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="text-ink-3">Réservé le</dt>
          <dd className="font-medium text-foreground">
            {new Intl.DateTimeFormat("fr-DZ", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(booking.bookedAt))}
          </dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-border pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
          Professeur
        </p>
        <Link
          href={`/teachers/${booking.teacherSlug}` as never}
          className="mt-3 flex items-center gap-3 rounded-md p-2 -mx-2 transition-colors hover:bg-surface"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent">
            <Users className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-foreground">
              {booking.teacherName.fr}
            </p>
            <p className="text-[12px] text-ink-3">Voir la fiche →</p>
          </div>
        </Link>
      </div>

      {!isRevealed && !isTerminal && (
        <p className="mt-4 rounded-md bg-surface px-3 py-2 text-[12px] leading-relaxed text-ink-3">
          Les détails de session (lieu / lien vidéo) apparaissent après la confirmation.
        </p>
      )}
    </div>
  );
}

function fmtKind(kind: Booking["kind"]): string {
  switch (kind) {
    case "1to1":
      return "Cours particulier";
    case "course":
      return "Cours en cohorte";
    case "event":
      return "Événement";
    case "live":
      return "Session en direct";
  }
}
