import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Paiement" };

type Props = { params: Promise<{ locale: string; bookingId: string }> };

// Server only handles the auth guard; booking lookup + stage branching
// happens client-side because the mock booking store lives in localStorage
// and isn't visible to server renders. See src/lib/mock/persistence.ts.
export default async function CheckoutPage({ params }: Props) {
  const { locale, bookingId } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(`/checkout/${bookingId}`)}`);
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-surface">
        <CheckoutPageClient bookingId={bookingId} />
      </main>
      <SiteFooter />
    </>
  );
}
