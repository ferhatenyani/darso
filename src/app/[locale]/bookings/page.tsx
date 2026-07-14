import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { BookingsClient } from "@/components/bookings/bookings-client";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Mes réservations" };

type Props = { params: Promise<{ locale: string }> };

export default async function BookingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent("/bookings")}`);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-surface">
        <BookingsClient />
      </main>
      <SiteFooter />
    </>
  );
}
