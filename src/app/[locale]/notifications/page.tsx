import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { NotificationsShell } from "./notifications-shell";

export default async function NotificationsPage({
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
        <NotificationsShell />
      </main>
      <SiteFooter />
    </>
  );
}
