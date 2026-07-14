import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { CheckoutSuccessPageClient } from "@/components/checkout/checkout-success-page-client";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Paiement enregistré" };

type Props = { params: Promise<{ locale: string; bookingId: string }> };

// Server only handles auth; the booking lookup lives client-side because
// the mock store isn't visible to server renders.
export default async function CheckoutSuccessPage({ params }: Props) {
  const { locale, bookingId } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/bookings/${bookingId}`)}`);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-surface">
        <CheckoutSuccessPageClient bookingId={bookingId} />
      </main>
      <SiteFooter />
    </>
  );
}
