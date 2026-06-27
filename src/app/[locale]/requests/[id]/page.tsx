import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { RequestDetailClient } from "@/components/requests/detail-client";
import { learningRequests } from "@/lib/mock/requests";
import { getRequestById } from "@/lib/mock/learning-requests-state";

export async function generateStaticParams() {
  // SSG seed list — only the seeded catalogue is statically generated.
  // Wizard-published requests resolve at request-time via the store.
  return learningRequests.map((r) => ({ id: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "requests.detail" });
  // `getRequestById` accepts slug OR id and reads from the in-session
  // store, so wizard-published requests (Batch 5b) resolve here too.
  const r = getRequestById(id);
  const lang = locale === "ar" ? "ar" : "fr";
  return { title: r ? r.title[lang] : t("metaTitle", { n: id }) };
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const req = getRequestById(id);
  if (!req) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <RequestDetailClient request={req} />
      </main>
      <SiteFooter />
    </>
  );
}
