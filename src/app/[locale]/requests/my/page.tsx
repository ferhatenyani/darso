import { setRequestLocale, getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { MyRequestsClient } from "@/components/requests/my-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "requests.my" });
  return { title: t("metaTitle") };
}

export default async function MyRequestsPage({
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
        <MyRequestsClient />
      </main>
      <SiteFooter />
    </>
  );
}
