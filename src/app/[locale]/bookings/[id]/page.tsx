import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { BookingDetailClient } from "@/components/bookings/booking-detail-client";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Détail de la réservation" };

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function BookingDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/bookings/${id}`)}`);

  // Booking existence is verified client-side against the hydrated store.
  // Server can't see localStorage — see mock/persistence.ts caveat.
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-surface">
        <BookingDetailClient bookingId={id} />
      </main>
      <SiteFooter />
    </>
  );
}
