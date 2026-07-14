"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Calendar, ArrowRight, Search, PenLine, Inbox } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";
import {
  getBookingsForAccount,
  subscribeBookings,
  type Booking,
  type BookingStage,
} from "@/lib/mock/bookings-state";
import { BookingCard } from "@/components/bookings/booking-card";
import { cn } from "@/lib/utils";

// Client-rendered because the booking store is hydrated from localStorage
// after mount (server state is always seed-empty). Filter tabs drive a
// pure client-side selector across the current user's bookings.

type FilterKey = "active" | "past" | "cancelled" | "all";

const ACTIVE_STAGES: readonly BookingStage[] = [
  "requested",
  "approved",
  "pending_payment",
  "pending_teacher_confirmation",
  "confirmed",
];
const PAST_STAGES: readonly BookingStage[] = ["completed", "reviewed"];
const CANCELLED_STAGES: readonly BookingStage[] = [
  "cancelled",
  "rejected",
  "expired",
  "removed_by_teacher",
  "refunded",
  "dismissed",
  "disputed",
];

const filterLabels: Record<FilterKey, string> = {
  active: "En cours",
  past: "Passées",
  cancelled: "Annulées",
  all: "Toutes",
};

function stageOf(b: Booking): BookingStage {
  return b.stage ?? (b.status === "confirmed" ? "confirmed" : b.status === "cancelled" ? "cancelled" : "pending_payment");
}

function useMyBookings(accountId: string | undefined): readonly Booking[] {
  return useSyncExternalStore(
    subscribeBookings,
    () => getBookingsForAccount(accountId),
    () => [] as readonly Booking[],
  );
}

export function BookingsClient() {
  const { user } = useCurrentUser();
  const bookings = useMyBookings(user?.id);
  const [filter, setFilter] = useState<FilterKey>("active");

  const counts = useMemo(() => {
    const c = { active: 0, past: 0, cancelled: 0, all: bookings.length };
    for (const b of bookings) {
      const s = stageOf(b);
      if (ACTIVE_STAGES.includes(s)) c.active += 1;
      else if (PAST_STAGES.includes(s)) c.past += 1;
      else if (CANCELLED_STAGES.includes(s)) c.cancelled += 1;
    }
    return c;
  }, [bookings]);

  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    const set =
      filter === "active"
        ? ACTIVE_STAGES
        : filter === "past"
          ? PAST_STAGES
          : CANCELLED_STAGES;
    return bookings.filter((b) => set.includes(stageOf(b)));
  }, [bookings, filter]);

  return (
    <div className="container-narrow py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Mon espace
          </p>
          <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-foreground md:text-[36px]">
            Mes réservations
          </h1>
        </div>
        <Button asChild variant="ghost">
          <Link href="/calendar">
            <Calendar className="h-4 w-4" />
            Voir le calendrier
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-1 rounded-[var(--radius-lg)] border border-border bg-card p-1">
        {(Object.keys(filterLabels) as FilterKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-[var(--radius-md)] px-3 text-[13.5px] font-medium transition-colors",
              filter === key
                ? "bg-primary text-primary-foreground"
                : "text-ink-2 hover:bg-surface hover:text-foreground",
            )}
          >
            {filterLabels[key]}
            <span
              className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] tabular",
                filter === key ? "bg-primary-foreground/20" : "bg-surface text-ink-3",
              )}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {filtered.length === 0 ? (
          <EmptyState filter={filter} totalBookings={bookings.length} />
        ) : (
          <ul className="space-y-3">
            {filtered.map((b) => (
              <li key={b.id}>
                <BookingCard booking={b} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EmptyState({ filter, totalBookings }: { filter: FilterKey; totalBookings: number }) {
  // First-time empty (no bookings ever) vs. filter-empty (has bookings but
  // none in this tab). Different copy + different affordances.
  const isFirstTime = totalBookings === 0;

  if (isFirstTime) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-border bg-card p-10 text-center md:p-14">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface text-ink-2">
          <Inbox className="h-5 w-5" aria-hidden />
        </div>
        <h2 className="mt-5 text-[20px] font-semibold tracking-tight text-foreground">
          Aucune réservation pour l'instant
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-2">
          Explorez la marketplace pour trouver un cours, un événement, ou du soutien scolaire. Vous pouvez aussi publier une demande et laisser les professeurs venir à vous.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/browse">
              <Search className="h-4 w-4" />
              Parcourir la marketplace
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/requests/new">
              <PenLine className="h-4 w-4" />
              Publier une demande
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-card p-8 text-center">
      <p className="text-[14px] text-ink-2">
        Aucune réservation dans « {filterLabels[filter]} ».
      </p>
      <Button asChild variant="ghost" className="mt-3">
        <Link href="/browse">
          <ArrowRight className="h-4 w-4" />
          Parcourir la marketplace
        </Link>
      </Button>
    </div>
  );
}
