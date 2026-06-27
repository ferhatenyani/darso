import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { RequestEditForm } from "@/components/requests/edit-form";
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
  const t = await getTranslations({ locale, namespace: "requests.edit" });
  const r = getRequestBySlug(id);
  const lang = locale === "ar" ? "ar" : "fr";
  return { title: r ? `${t("title")} — ${r.title[lang]}` : t("title") };
}

export default async function RequestEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Initial seed pull: the client island re-derives from the live store on
  // mount so any in-session mutation shows up. We hand it the slug + the
  // seeded shape so the first paint isn't empty.
  const seed = getRequestBySlug(id);
  if (!seed) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <RequestEditForm slug={id} initial={seed} />
      </main>
      <SiteFooter />
    </>
  );
}
