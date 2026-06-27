import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "سياسة الخصوصية" : "Politique de confidentialité" };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "سياسة الخصوصية" : "Politique de confidentialité"}
          description={ar ? "الوثيقة قيد الصياغة." : "Document en cours de rédaction."}
          breadcrumb={[ar ? "قانوني" : "Légal", ar ? "الخصوصية" : "Confidentialité"]}
          relatedLinks={[
            { label: ar ? "الشروط" : "Conditions d'utilisation", href: "/legal/terms" },
            { label: ar ? "سياسة الكوكيز" : "Politique de cookies", href: "/legal/cookies" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
