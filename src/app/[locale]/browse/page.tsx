import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { BrowseClient } from "@/components/student/browse-client";

export default async function BrowsePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <BrowseClient
          initialQuery={typeof sp.q === "string" ? sp.q : ""}
          initialSubject={typeof sp.subject === "string" ? sp.subject : "any"}
          initialWilaya={typeof sp.wilaya === "string" ? sp.wilaya : "any"}
          initialMode={typeof sp.mode === "string" ? (sp.mode as "online" | "in-person" | "both") : "both"}
        />
      </main>
      <SiteFooter />
    </>
  );
}
