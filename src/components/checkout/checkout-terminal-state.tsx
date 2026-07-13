import { XCircle, Clock3, Ban, UserX, ArrowRight, Search } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { Booking, BookingStage } from "@/lib/mock/bookings-state";

// Terminal-state landing on the checkout route. Reached when a student
// clicks an old email link or bookmark for a booking that's now in a
// terminal stage. Explains what happened and points to next steps.

type TerminalStage = "rejected" | "expired" | "cancelled" | "removed_by_teacher";

const copy: Record<TerminalStage, {
  Icon: typeof XCircle;
  eyebrow: string;
  title: string;
  body: string;
  color: "danger" | "warning" | "ink";
}> = {
  rejected: {
    Icon: XCircle,
    eyebrow: "Demande refusée",
    title: "Le professeur a décliné votre demande",
    body: "Aucun paiement n'a été effectué. Vous pouvez trouver un autre professeur ou transformer cette demande en annonce ouverte.",
    color: "danger",
  },
  expired: {
    Icon: Clock3,
    eyebrow: "Délai dépassé",
    title: "Le professeur n'a pas répondu à temps",
    body: "Les professeurs disposent de 72 h pour accepter une demande. Aucun paiement n'a été effectué. Publiez une demande ouverte pour élargir la recherche.",
    color: "warning",
  },
  cancelled: {
    Icon: Ban,
    eyebrow: "Réservation annulée",
    title: "Cette réservation a été annulée",
    body: "L'annulation a été enregistrée. Consultez vos réservations pour voir l'historique.",
    color: "ink",
  },
  removed_by_teacher: {
    Icon: UserX,
    eyebrow: "Place retirée",
    title: "Le professeur a retiré votre place",
    body: "Cela arrive rarement — par exemple si le niveau ne correspondait pas. Un remboursement vous sera proposé directement par le professeur.",
    color: "warning",
  },
};

export function CheckoutTerminalState({ booking, stage }: { booking: Booking; stage: BookingStage }) {
  const state = copy[stage as TerminalStage];
  if (!state) return null;
  const Icon = state.Icon;
  const badgeCls = {
    danger: "bg-danger/15 text-danger",
    warning: "bg-warning/15 text-warning",
    ink: "bg-ink/10 text-ink-2",
  }[state.color];

  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-e1">
          <div className="flex items-start gap-4">
            <div className={`grid h-11 w-11 place-items-center rounded-full ${badgeCls}`}>
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                {state.eyebrow}
              </p>
              <h1 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-foreground md:text-[28px]">
                {state.title}
              </h1>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
                {state.body}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6 text-[13.5px]">
            <p className="text-ink-3">Réservation initiale</p>
            <p className="mt-1 font-medium text-foreground">
              {booking.subjectTitle.fr || booking.subjectTitle.ar} — avec {booking.teacherName.fr}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`/teachers` as never}>
                <Search className="h-4 w-4" />
                Voir d'autres professeurs
              </Link>
            </Button>
            {(stage === "rejected" || stage === "expired") && (
              <Button asChild size="lg" variant="ghost">
                <Link href="/requests/new">
                  Publier une demande ouverte
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="ghost">
              <Link href={`/bookings/${booking.id}` as never}>Voir le détail</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
