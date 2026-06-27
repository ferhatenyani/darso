import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "موارد الأساتذة" : "Ressources enseignants" };
}

export default async function TeachResourcesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "موارد الأساتذة" : "Ressources enseignants"}
          description={
            ar
              ? "أدلّة، نماذج وقوالب — قريبًا."
              : "Guides, modèles et templates — bientôt."
          }
          breadcrumb={[ar ? "علِّم" : "Enseigner", ar ? "الموارد" : "Ressources"]}
          relatedLinks={[
            { label: ar ? "التسعير" : "Tarifs", href: "/teach/pricing" },
            { label: ar ? "صفحة الأساتذة" : "Devenir prof", href: "/teach" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
