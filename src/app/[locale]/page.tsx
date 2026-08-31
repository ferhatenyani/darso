import { setRequestLocale } from "next-intl/server";

import { HomeHeader } from "@/components/nav/home-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { HomeHero } from "@/components/marketing/home-hero";
import { PathSection } from "@/components/marketing/path-section";
import { AgencyCollective } from "@/components/marketing/agency-collective";
import { CommissionCalculator } from "@/components/marketing/commission-calculator";
import { BrowseLiveStrip } from "@/components/marketing/browse-live-strip";
import { TeamManifesto } from "@/components/marketing/team-manifesto";
import { CommunityNotes } from "@/components/marketing/community-notes";
import { HomeFaqV2 } from "@/components/marketing/home-faq-v2";
import { ClosingCta } from "@/components/marketing/closing-cta";

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
        {/* 1 · Hero — untouched */}
        <HomeHero />

        {/* 2 · Path — 3 comparison variants stacked (pick one, remove the others) */}
        <PathSection
          variant="tinted"
          label="Variant A · Tinted surround + Concave scoop"
          magnet={false}
        />
        <PathSection
          variant="mirror"
          label="Variant B · Charcoal/Paper mirror + Center arch"
          magnet={false}
        />
        <PathSection
          variant="drench"
          label="Variant C · Accent drench + Angled wedge"
          magnet={false}
        />

        {/* 3 · Agency / collective — 3-card grid, ink accent */}
        <AgencyCollective />

        {/* 5 · Commission calculator — interactive DZD simulator */}
        <CommissionCalculator />

        {/* 6 · Browse tabs — En direct / À venir strip */}
        <BrowseLiveStrip />

        {/* 7 · Team manifesto — dark editorial "un mot de l'équipe" */}
        <TeamManifesto />

        {/* 8 · Community notes — two-row marquee testimonials */}
        <CommunityNotes />

        {/* 9 · FAQ — sticky-title accordion */}
        <HomeFaqV2 />

        {/* 10 · Closing CTA — dark "une seule question" band */}
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
