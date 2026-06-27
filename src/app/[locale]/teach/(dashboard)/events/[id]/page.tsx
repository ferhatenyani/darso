import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "تفاصيل الحدث" : "Détail de l'événement" };
}

export default async function EventDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <ComingSoon
      title={ar ? "تفاصيل الحدث" : "Détail de l'événement"}
      description={
        ar
          ? "تحرير الحدث قادم قريبًا."
          : "L'édition d'événement arrive bientôt."
      }
      breadcrumb={[
        ar ? "علِّم" : "Enseigner",
        ar ? "الأحداث" : "Événements",
        `#${id}`,
      ]}
      relatedLinks={[
        { label: ar ? "كل الأحداث" : "Tous les événements", href: "/teach/events" },
        { label: ar ? "إنشاء حدث جديد" : "Créer un événement", href: "/teach/events/new" },
      ]}
    />
  );
}
