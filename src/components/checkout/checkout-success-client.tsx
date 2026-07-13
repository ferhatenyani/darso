"use client";

import { useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/lib/mock/bookings-state";

// Interstitial success page. Confirms the payment arrangement was recorded,
// then auto-forwards to the booking detail after ~5 seconds so the student
// lands on the definitive record. Manual "Voir la réservation" button is
// always available.

const AUTO_FORWARD_MS = 5000;

export function CheckoutSuccessClient({ booking }: { booking: Booking }) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(`/bookings/${booking.id}` as never);
    }, AUTO_FORWARD_MS);
    return () => clearTimeout(t);
  }, [booking.id, router]);

  return (
    <div className="container-narrow py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-6 text-[26px] font-semibold leading-tight tracking-tight text-foreground md:text-[32px]">
          Paiement enregistré
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          Nous avons informé {booking.teacherName.fr} que vous avez effectué le paiement. Vous recevrez une notification dès la confirmation.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href={`/bookings/${booking.id}` as never}>
              Voir la réservation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/browse">Continuer à explorer</Link>
          </Button>
        </div>

        <p className="mt-8 text-[12px] uppercase tracking-[0.14em] text-ink-3">
          Redirection automatique dans 5 secondes
        </p>
      </div>
    </div>
  );
}
