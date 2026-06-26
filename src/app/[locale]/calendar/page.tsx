import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { CalendarShell } from "./calendar-shell";

export default async function CalendarPage({
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
        <CalendarShell />
      </main>
      <SiteFooter />
    </>
  );
}
