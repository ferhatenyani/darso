"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ArrowLeft, Search } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";
import {
  findBookingByIdForAccount,
  subscribeBookings,
  type Booking,
} from "@/lib/mock/bookings-state";
import { getDirectPayMethods } from "@/lib/mock/direct-pay-methods";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { CheckoutWaitingState } from "@/components/checkout/checkout-waiting-state";
import { CheckoutTerminalState } from "@/components/checkout/checkout-terminal-state";

function useBooking(id: string, accountId: string | undefined): Booking | null {
  return useSyncExternalStore(
    subscribeBookings,
    () => findBookingByIdForAccount(id, accountId),
    () => null,
  );
}

export function CheckoutPageClient({ bookingId }: { bookingId: string }) {
  const { user } = useCurrentUser();
  const router = useRouter();
  const booking = useBooking(bookingId, user?.id);

  // Redirect confirmed / terminal-happy stages to the definitive record on
  // the detail page. Kept in an effect so we don't fire during render.
  useEffect(() => {
    if (!booking) return;
    const stage = booking.stage ?? "pending_payment";
    if (stage === "confirmed" || stage === "completed" || stage === "reviewed") {
      router.replace(`/bookings/${booking.id}` as never);
    }
  }, [booking, router]);

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

  const stage = booking.stage ?? "pending_payment";

  if (stage === "pending_teacher_confirmation") {
    return <CheckoutWaitingState booking={booking} />;
  }
  if (
    stage === "rejected" ||
    stage === "expired" ||
    stage === "cancelled" ||
    stage === "removed_by_teacher"
  ) {
    return <CheckoutTerminalState booking={booking} stage={stage} />;
  }
  // Fall-through: pending_payment | approved | requested (fresh arrangement).
  return <CheckoutClient booking={booking} methods={getDirectPayMethods(booking.teacherSlug)} />;
}
