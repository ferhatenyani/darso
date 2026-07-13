import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "À propos" };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PlaceholderPage
      title="À propos de darso"
      body="Nous racontons l'histoire de darso très bientôt. En attendant, découvrez la plateforme ou publiez votre première demande."
    />
  );
}
