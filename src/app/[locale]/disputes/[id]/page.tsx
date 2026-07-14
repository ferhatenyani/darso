import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { DashboardShell } from "@/components/nav/dashboard-shell";
import { DisputeDetail } from "./dispute-detail";
import { getDisputeById } from "@/lib/mock/disputes-state";

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Read from the in-session store so disputes opened via the
  // "+ Start a dispute" flow (Batch 5c) resolve here as well as the
  // seeded catalogue.
  const dispute = getDisputeById(id);
  if (!dispute) {
    notFound();
  }

  return (
    <DashboardShell>
      <DisputeDetail dispute={dispute} />
    </DashboardShell>
  );
}
