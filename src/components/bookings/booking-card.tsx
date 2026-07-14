import {
  ArrowRight,
  Clock,
  CircleCheck,
  CircleDashed,
  CircleX,
  Ban,
  Wallet,
  UserCheck,
  UserX,
  Timer,
  MessageSquare,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { Booking, BookingStage } from "@/lib/mock/bookings-state";
import { formatPrice, cn } from "@/lib/utils";

// Reusable booking list-item — shared between /bookings (list) and any
// dashboard preview surface. Renders the stage as a colored pill that
// summarizes the next action a student can take.

type StageMeta = {
  Icon: typeof Clock;
  label: string;
  hint: string;
  tone: "amber" | "blue" | "green" | "red" | "grey";
};

const stageMeta: Record<BookingStage, StageMeta> = {
  requested: {
    Icon: Clock,
    label: "En attente d'acceptation",
    hint: "Le professeur répond sous 72 h",
    tone: "amber",
  },
  approved: {
    Icon: UserCheck,
    label: "Acceptée · à régler",
    hint: "Effectuez le paiement direct",
    tone: "blue",
  },
  pending_payment: {
    Icon: Wallet,
    label: "Paiement à effectuer",
    hint: "Arrangez le paiement avec le professeur",
    tone: "blue",
  },
  pending_teacher_confirmation: {
    Icon: Timer,
    label: "En attente de confirmation",
    hint: "Le professeur confirme sous 48 h",
    tone: "amber",
  },
  confirmed: {
    Icon: CircleCheck,
    label: "Confirmée",
    hint: "Rendez-vous dans le calendrier",
    tone: "green",
  },
  completed: {
    Icon: CircleCheck,
    label: "Terminée",
    hint: "Pensez à laisser un avis",
    tone: "green",
  },
  reviewed: {
    Icon: CircleCheck,
    label: "Terminée · notée",
    hint: "Merci pour votre avis",
    tone: "grey",
  },
  rejected: {
    Icon: CircleX,
    label: "Refusée",
    hint: "Aucun paiement effectué",
    tone: "red",
  },
  expired: {
    Icon: Timer,
    label: "Délai dépassé",
    hint: "Aucune réponse du professeur",
    tone: "red",
  },
  cancelled: {
    Icon: Ban,
    label: "Annulée",
    hint: "",
    tone: "grey",
  },
  removed_by_teacher: {
    Icon: UserX,
    label: "Place retirée",
    hint: "Le professeur a retiré votre place",
    tone: "amber",
  },
  disputed: {
    Icon: CircleDashed,
    label: "Litige en cours",
    hint: "Un arbitre traite le dossier",
    tone: "amber",
  },
  refunded: {
    Icon: Ban,
    label: "Remboursée",
    hint: "",
    tone: "grey",
  },
  dismissed: {
    Icon: Ban,
    label: "Litige rejeté",
    hint: "",
    tone: "grey",
  },
};

const toneClass: Record<StageMeta["tone"], string> = {
  amber: "bg-warning/12 text-warning",
  blue: "bg-accent/12 text-accent",
  green: "bg-success/12 text-success",
  red: "bg-danger/12 text-danger",
  grey: "bg-ink/8 text-ink-2",
};

function fmtStart(iso: string | undefined): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("fr-DZ", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export function BookingCard({ booking }: { booking: Booking }) {
  const stage = booking.stage ?? "pending_payment";
  const meta = stageMeta[stage];
  const start = fmtStart(booking.start);
  const Icon = meta.Icon;

  // Awaiting-action bookings get a stronger CTA; others get a passive View link.
  const needsAction =
    stage === "pending_payment" ||
    stage === "approved" ||
    stage === "pending_teacher_confirmation";
  const detailHref = needsAction ? `/checkout/${booking.id}` : `/bookings/${booking.id}`;

  return (
    <Link
      href={detailHref as never}
      className="group block rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-shadow hover:shadow-e2"
    >
      <div className="flex flex-wrap items-start gap-5">
        {/* Stage pill (left rail) */}
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full", toneClass[meta.tone])}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="min-w-0 truncate text-[16px] font-semibold tracking-tight text-foreground">
              {booking.subjectTitle.fr || booking.subjectTitle.ar || "Réservation"}
            </h3>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em]", toneClass[meta.tone])}>
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-ink-2">
            avec {booking.teacherName.fr}
            {start ? <> · {start}</> : null}
          </p>
          {meta.hint && (
            <p className="mt-2 text-[12.5px] text-ink-3">{meta.hint}</p>
          )}
        </div>

        {/* Price + CTA affordance */}
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <span className="text-[14px] font-semibold tabular text-foreground">
            {formatPrice(booking.priceDzd, "fr")}
          </span>
          <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-2 group-hover:text-foreground">
            {needsAction ? (
              <>
                Continuer
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            ) : stage === "confirmed" ? (
              <>
                <MessageSquare className="h-3.5 w-3.5" />
                Détails
              </>
            ) : (
              <>Voir</>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
