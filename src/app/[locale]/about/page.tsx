import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "من نحن" : "À propos" };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "من نحن" : "À propos"}
          description={
            ar
              ? "رسالتنا وفريقنا — قريبًا على الإنترنت."
              : "Notre mission, notre équipe — bientôt en ligne."
          }
          breadcrumb={[ar ? "درسو" : "darso", ar ? "من نحن" : "À propos"]}
          relatedLinks={[
            { label: ar ? "الصحافة" : "Presse", href: "/press" },
            { label: ar ? "الوظائف" : "Carrières", href: "/careers" },
            { label: ar ? "اتصل بنا" : "Contact", href: "/contact" },
            { label: ar ? "المدوّنة" : "Blog", href: "/blog" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
