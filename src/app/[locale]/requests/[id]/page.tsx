import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { RequestDetailClient } from "@/components/requests/detail-client";
import { getRequestBySlug, learningRequests } from "@/lib/mock/requests";

export async function generateStaticParams() {
  return learningRequests.map((r) => ({ id: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "requests.detail" });
  const r = getRequestBySlug(id);
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

  const req = getRequestBySlug(id);
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
