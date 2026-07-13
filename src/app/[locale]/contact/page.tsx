import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PlaceholderPage
      title="Contactez darso"
      body="Le formulaire de contact arrive bientôt. En attendant, écrivez-nous à hello@darso.com."
      primaryHref="/browse"
      primaryLabel="Parcourir les cours"
    />
  );
}
