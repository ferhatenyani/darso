import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Carrières" };

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PlaceholderPage
      title="Rejoignez darso"
      body="Nous n'avons pas encore d'offres publiées. Envoyez une candidature spontanée à jobs@darso.com."
      primaryHref="/contact"
      primaryLabel="Nous contacter"
    />
  );
}
