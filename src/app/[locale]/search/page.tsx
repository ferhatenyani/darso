import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { SearchPage } from "@/components/student/search-page";

export default async function Page({
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
        <SearchPage initialQuery={typeof sp.q === "string" ? sp.q : ""} />
      </main>
      <SiteFooter />
    </>
  );
}
