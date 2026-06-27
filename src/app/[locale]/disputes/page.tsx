import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/nav/dashboard-shell";
import { DisputesShell } from "./disputes-shell";

export default async function DisputesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <DashboardShell>
      <DisputesShell />
    </DashboardShell>
  );
}
