import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "كيف تعمل" : "Comment ça marche" };
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "كيف تعمل درسو" : "Comment ça marche"}
          description={
            ar
              ? "دليل خطوة بخطوة لاستخدام درسو متاح قريبًا."
              : "Le guide pas-à-pas de Darso arrive bientôt."
          }
          breadcrumb={[ar ? "المساعدة" : "Aide", ar ? "كيف تعمل" : "Comment ça marche"]}
          relatedLinks={[
            { label: ar ? "تصفّح الأساتذة" : "Découvrir les professeurs", href: "/teachers" },
            { label: ar ? "تصفّح الدروس" : "Parcourir les cours", href: "/browse" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
