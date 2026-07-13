import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Presse" };

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PlaceholderPage
      title="Salle de presse"
      body="Notre kit presse arrive bientôt. Pour toute demande média, contactez-nous à presse@darso.com."
      primaryHref="/contact"
      primaryLabel="Nous contacter"
    />
  );
}
