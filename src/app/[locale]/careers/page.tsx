import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "الوظائف" : "Carrières" };
}

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "الوظائف" : "Carrières"}
          description={
            ar
              ? "المناصب المفتوحة ستُنشر هنا."
              : "Les postes ouverts seront publiés ici."
          }
          breadcrumb={[ar ? "درسو" : "darso", ar ? "الوظائف" : "Carrières"]}
          relatedLinks={[
            { label: ar ? "من نحن" : "À propos", href: "/about" },
            { label: ar ? "اتصل بنا" : "Contact", href: "/contact" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
