import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ComingSoon } from "@/components/marketing/coming-soon";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "المدوّنة" : "Blog" };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ComingSoon
          title={ar ? "المدوّنة" : "Blog"}
          description={
            ar
              ? "مقالات وشهادات ومستجدّات — قريبًا."
              : "Articles, témoignages et nouveautés — à venir."
          }
          breadcrumb={[ar ? "درسو" : "darso", ar ? "المدوّنة" : "Blog"]}
          relatedLinks={[
            { label: ar ? "كيف تعمل" : "Comment ça marche", href: "/how-it-works" },
            { label: ar ? "تصفّح" : "Explorer", href: "/browse" },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
