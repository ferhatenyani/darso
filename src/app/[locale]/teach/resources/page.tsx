import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { ResourcesLibrary } from "@/components/marketing/resources-library";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.teachResources" });
  return { title: t("metaTitle") };
}

type Resource = {
  category: string;
  type: string;
  title: string;
  summary: string;
  meta: string;
  kind: "pdf" | "video" | "template";
};

export default async function TeachResourcesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const t = await getTranslations("marketing.teachResources");

  const resources: Resource[] = t.raw("resources");
  const categories = Array.from(new Set(resources.map((r) => r.category)));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_15%,black,transparent_80%)]"
          />
          <div className="container-narrow py-16 md:py-24">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="ink-rule" aria-hidden />
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 max-w-3xl text-balance text-[34px] font-bold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[44px] md:text-[56px] lg:text-[64px]">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              {t("lede")}
            </p>

            {/* Stat strip */}
            <dl className="mt-12 grid grid-cols-3 gap-x-6 gap-y-6 border-t border-border pt-6">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {ar ? "موارد" : "Ressources"}
                </dt>
                <dd className="mt-1 text-[20px] font-semibold tabular text-foreground md:text-[24px]">
                  {resources.length}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {ar ? "أصناف" : "Catégories"}
                </dt>
                <dd className="mt-1 text-[20px] font-semibold tabular text-foreground md:text-[24px]">
                  {categories.length}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {ar ? "تحديث" : "Mise à jour"}
                </dt>
                <dd className="mt-1 text-[15px] font-semibold text-foreground md:text-[17px]">
                  {ar ? "كلّ جمعة" : "Chaque vendredi"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Library — filterable client component */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-12 md:py-16">
            <ResourcesLibrary
              resources={resources}
              labels={{
                all: t("filterAll"),
                searchPlaceholder: t("searchPlaceholder"),
                open: t("openLabel"),
                download: t("downloadLabel"),
                watch: t("watchLabel"),
                tagToastTitle: t("tagToastTitle"),
                tagToastBody: t("tagToastBody"),
                empty: ar ? "لا نتيجة." : "Aucun résultat.",
              }}
            />
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
                <div>
                  <h2 className="max-w-xl text-balance text-[26px] font-semibold tracking-tight text-foreground md:text-[34px]">
                    {t("newsletterTitle")}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] text-ink-2">{t("newsletterBody")}</p>
                </div>
                <NewsletterForm
                  placeholder={t("newsletterPlaceholder")}
                  cta={t("newsletterCta")}
                  successTitle={ar ? "تمّ الاشتراك" : "Inscription enregistrée"}
                  successBody={
                    ar
                      ? "ستتلقّى أوّل مورد الجمعة القادمة."
                      : "Tu recevras la prochaine ressource vendredi."
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
