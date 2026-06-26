import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { DisputeDetail } from "./dispute-detail";
import { findDispute } from "@/lib/mock/disputes";

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const dispute = findDispute(id);
  if (!dispute) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <DisputeDetail dispute={dispute} />
      </main>
      <SiteFooter />
    </>
  );
}
