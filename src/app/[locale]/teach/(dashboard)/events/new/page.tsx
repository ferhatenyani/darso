import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "إنشاء حدث" : "Créer un événement" };
}

export default async function NewEventPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <ComingSoon
      title={ar ? "إنشاء حدث" : "Créer un événement"}
      description={
        ar
          ? "محرّر الأحداث قادم قريبًا."
          : "L'éditeur d'événements arrive bientôt."
      }
      breadcrumb={[
        ar ? "علِّم" : "Enseigner",
        ar ? "الأحداث" : "Événements",
        ar ? "جديد" : "Nouveau",
      ]}
      relatedLinks={[
        { label: ar ? "كل الأحداث" : "Tous les événements", href: "/teach/events" },
        { label: ar ? "دروسي" : "Mes cours", href: "/teach/courses" },
      ]}
    />
  );
}
