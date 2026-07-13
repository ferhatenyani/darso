import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { AgencyShowcase } from "@/components/agencies/agency-showcase";
import { agency, agencyMembers } from "@/lib/mock/agency";
import { featuredTeachers } from "@/lib/mock/teachers";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Only one agency is seeded (Studio Numidia). Accept both its id and a
// human slug so the URL is friendly whether linked by id from teacher
// profiles or by a marketing slug.
const ACCEPTED_SLUGS = new Set(["ag-numidia", "numidia"]);

export function generateStaticParams() {
  return ["fr"].flatMap((locale) =>
    ["ag-numidia", "numidia"].map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!ACCEPTED_SLUGS.has(slug)) return { title: "Agence" };
  return { title: `${agency.name.fr} · Agence` };
}

export default async function AgencyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!ACCEPTED_SLUGS.has(slug)) notFound();

  // Roster = teachers whose parentAgencyId matches, enriched with the
  // agency-specific member metadata (subject label / accent) if present.
  const teachersInAgency = featuredTeachers.filter(
    (t) => t.parentAgencyId === agency.id,
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <AgencyShowcase
          agency={agency}
          members={agencyMembers}
          teachers={teachersInAgency}
        />
      </main>
      <SiteFooter />
    </>
  );
}
