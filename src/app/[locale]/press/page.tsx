import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "الصحافة" : "Presse" };
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "الصحافة" : "Presse"}
          description={
            ar
              ? "ملفّنا الصحفي وبياناتنا ستكون متاحة هنا."
              : "Notre kit presse et nos communiqués seront disponibles ici."
          }
          breadcrumb={[ar ? "درسو" : "darso", ar ? "الصحافة" : "Presse"]}
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
