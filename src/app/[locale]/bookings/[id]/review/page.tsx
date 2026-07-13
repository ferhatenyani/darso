import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { BookingReviewClient } from "@/components/bookings/booking-review-client";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Laisser un avis" };

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function BookingReviewPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/bookings/${id}/review`)}`);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-surface">
        <BookingReviewClient bookingId={id} />
      </main>
      <SiteFooter />
    </>
  );
}
