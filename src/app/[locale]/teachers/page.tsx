import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { TeachersLeaderboard } from "@/components/student/teachers-leaderboard";

export default async function TeachersPage({
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
        <TeachersLeaderboard />
      </main>
      <SiteFooter />
    </>
  );
}
