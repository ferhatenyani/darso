import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "تسعير الأساتذة" : "Tarifs enseignants" };
}

export default async function TeachPricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "تسعير الأساتذة" : "Tarifs enseignants"}
          description={
            ar
              ? "شبكة التسعير المفصّلة الخاصّة بنا — قريبًا."
              : "Notre grille tarifaire détaillée — bientôt."
          }
          breadcrumb={[ar ? "علِّم" : "Enseigner", ar ? "التسعير" : "Tarifs"]}
          relatedLinks={[
            { label: ar ? "صفحة الأساتذة" : "Devenir prof", href: "/teach" },
            { label: ar ? "الموارد" : "Ressources", href: "/teach/resources" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
