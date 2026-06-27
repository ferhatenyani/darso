import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "اتصل بنا" : "Contact" };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "اتصل بنا" : "Contact"}
          description={
            ar
              ? "نموذج اتّصال قادم قريبًا. في الأثناء: hello@darso.dz"
              : "Un formulaire de contact arrive bientôt. En attendant : hello@darso.dz"
          }
          breadcrumb={[ar ? "الدعم" : "Support", ar ? "اتصل بنا" : "Contact"]}
          relatedLinks={[
            { label: ar ? "مركز المساعدة" : "Centre d'aide", href: "/help" },
            { label: ar ? "الثقة والأمان" : "Confiance & sécurité", href: "/trust" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
