import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { GlobalSearch } from "@/components/student/global-search";

/**
 * Global free-text search across teachers, courses, and events. Server
 * component reads `?q=` from the URL and hands it to the client island so
 * the result list is immediately populated on initial render (no flash of
 * empty state for shared/bookmarked queries).
 */
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const initialQuery = typeof sp.q === "string" ? sp.q : "";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <GlobalSearch initialQuery={initialQuery} />
      </main>
      <SiteFooter />
    </>
  );
}
