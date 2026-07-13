"use client";

import { useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";
import {
  findBookingByIdForAccount,
  subscribeBookings,
  type Booking,
} from "@/lib/mock/bookings-state";
import { CheckoutSuccessClient } from "@/components/checkout/checkout-success-client";

function useBooking(id: string, accountId: string | undefined): Booking | null {
  return useSyncExternalStore(
    subscribeBookings,
    () => findBookingByIdForAccount(id, accountId),
    () => null,
  );
}

export function CheckoutSuccessPageClient({ bookingId }: { bookingId: string }) {
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
            Impossible de charger le récapitulatif.
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

  return <CheckoutSuccessClient booking={booking} />;
}
