import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/nav/dashboard-shell";
import { CalendarShell } from "./calendar-shell";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <DashboardShell>
      <CalendarShell />
    </DashboardShell>
  );
}
