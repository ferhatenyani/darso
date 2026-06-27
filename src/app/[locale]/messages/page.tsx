import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/nav/dashboard-shell";
import { InboxShell } from "./inbox-shell";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <DashboardShell>
      <InboxShell />
    </DashboardShell>
  );
}
