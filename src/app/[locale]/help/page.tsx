import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Aide" };

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PlaceholderPage
      title="Centre d'aide"
      body="Notre base de connaissances arrive bientôt. En attendant, envoyez-nous vos questions via la page contact."
      primaryHref="/contact"
      primaryLabel="Nous contacter"
    />
  );
}
