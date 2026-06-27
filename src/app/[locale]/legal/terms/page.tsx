import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "شروط الاستخدام" : "Conditions d'utilisation" };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "شروط الاستخدام" : "Conditions d'utilisation"}
          description={ar ? "الوثيقة قيد الصياغة." : "Document en cours de rédaction."}
          breadcrumb={[ar ? "قانوني" : "Légal", ar ? "الشروط" : "Conditions"]}
          relatedLinks={[
            { label: ar ? "سياسة الخصوصية" : "Politique de confidentialité", href: "/legal/privacy" },
            { label: ar ? "سياسة الكوكيز" : "Politique de cookies", href: "/legal/cookies" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
