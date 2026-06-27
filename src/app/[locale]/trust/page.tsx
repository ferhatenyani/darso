import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "الثقة والأمان" : "Confiance & sécurité" };
}

export default async function TrustPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "الثقة والأمان" : "Confiance & sécurité"}
          description={
            ar
              ? "سياستنا الأمنية والتزاماتنا — قريبًا."
              : "Notre politique de sécurité et nos engagements — bientôt."
          }
          breadcrumb={[ar ? "الدعم" : "Support", ar ? "الثقة والأمان" : "Confiance & sécurité"]}
          relatedLinks={[
            { label: ar ? "الشروط" : "Conditions", href: "/legal/terms" },
            { label: ar ? "الخصوصية" : "Confidentialité", href: "/legal/privacy" },
            { label: ar ? "اتصل بنا" : "Contact", href: "/contact" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
