import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/nav/dashboard-shell";
import { NotificationsShell } from "./notifications-shell";

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <DashboardShell>
      <NotificationsShell />
    </DashboardShell>
  );
}
