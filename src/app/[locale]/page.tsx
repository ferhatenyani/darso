import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Hero } from "@/components/marketing/hero";
import { LiveTicker } from "@/components/marketing/live-ticker";
import { CategoriesGrid } from "@/components/marketing/categories-grid";
import { FeaturedTeachers } from "@/components/marketing/featured-teachers";
import { RequestPathRibbon } from "@/components/marketing/request-path-ribbon";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { TeacherCta } from "@/components/marketing/teacher-cta";
import { Testimonials } from "@/components/marketing/testimonials";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <LiveTicker />
        <CategoriesGrid />
        <FeaturedTeachers />
        <RequestPathRibbon />
        <HowItWorks />
        <TeacherCta />
        <Testimonials />
      </main>
      <SiteFooter />
    </>
  );
}
