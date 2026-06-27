import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "مركز المساعدة" : "Centre d'aide" };
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "مركز المساعدة" : "Centre d'aide"}
          description={
            ar
              ? "إجابات على الأسئلة الشائعة — قريبًا."
              : "Réponses aux questions fréquentes — bientôt."
          }
          breadcrumb={[ar ? "الدعم" : "Support", ar ? "المساعدة" : "Aide"]}
          relatedLinks={[
            { label: ar ? "اتصل بنا" : "Contact", href: "/contact" },
            { label: ar ? "الثقة والأمان" : "Confiance & sécurité", href: "/trust" },
            { label: ar ? "كيف تعمل" : "Comment ça marche", href: "/how-it-works" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
