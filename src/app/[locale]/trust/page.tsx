import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Confiance et sécurité" };

export default async function TrustPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PlaceholderPage
      title="Confiance et sécurité"
      body="Notre centre de confiance est en préparation. Consultez les conditions et la politique de confidentialité dans le pied de page."
      primaryHref="/legal/terms"
      primaryLabel="Voir les conditions"
    />
  );
}
