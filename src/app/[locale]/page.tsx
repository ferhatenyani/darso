import { setRequestLocale } from "next-intl/server";

import { HomeHeader } from "@/components/nav/home-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeSearchBand } from "@/components/marketing/home-search-band";
import { CategoryCarousel } from "@/components/marketing/category-carousel";
import { HowItWorksV2 } from "@/components/marketing/how-it-works-v2";
import { TrustSafety } from "@/components/marketing/trust-safety";
import { FeaturedTeachersV2 } from "@/components/marketing/featured-teachers-v2";
import { SubjectGrid } from "@/components/marketing/subject-grid";
import { UpcomingEventsStrip } from "@/components/marketing/upcoming-events-strip";
import { TeachCtaBand } from "@/components/marketing/teach-cta-band";
import { FoundersNote } from "@/components/marketing/founders-note";
import { HomeFaq } from "@/components/marketing/home-faq";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHeader />
      <main className="flex-1">
        {/* 1 · Hero — cinematic Remotion composition, two-column, floating CTAs */}
        <HomeHero />
        {/* 2 · Search — moved out of the hero, sits directly beneath it */}
        <HomeSearchBand />
        {/* 3 · Popular categories — carousel on mobile, grid on desktop */}
        <CategoryCarousel />
        {/* 3 · How it works — 3 steps */}
        <HowItWorksV2 />
        {/* 4 · Featured teachers — real roster only */}
        <FeaturedTeachersV2 />
        {/* 5 · Popular subjects — dark surface, real count */}
        <SubjectGrid />
        {/* 6 · Upcoming events / live sessions */}
        <UpcomingEventsStrip />
        {/* 7 · Trust & safety */}
        <TrustSafety />
        {/* 8 · Teach on darso — dark band */}
        <TeachCtaBand />
        {/* 9 · Founders note (pre-traction alternative to fake testimonials) */}
        <FoundersNote />
        {/* 10 · FAQ */}
        <HomeFaq />
      </main>
      <SiteFooter />
    </>
  );
}
