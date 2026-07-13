import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Comment ça marche" };

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PlaceholderPage
      title="Comment darso fonctionne"
      body="Le guide complet arrive prochainement. Pour tester dès maintenant : parcourez les cours ou publiez une demande."
    />
  );
}
