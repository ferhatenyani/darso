import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Download, Mail, ExternalLink } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.press" });
  return { title: t("metaTitle") };
}

type Fact = { label: string; value: string };
type Release = { date: string; category: string; title: string; excerpt: string };
type Coverage = { outlet: string; title: string };

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const t = await getTranslations("marketing.press");
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const facts: Fact[] = t.raw("facts");
  const releases: Release[] = t.raw("releases");
  const coverage: Coverage[] = t.raw("coverage");

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
          <div className="container-narrow grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                <span className="ink-rule" aria-hidden />
                {t("eyebrow")}
              </p>
              <h1 className="mt-5 text-balance text-[34px] font-bold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[44px] md:text-[56px] lg:text-[64px]">
                {t("title")}
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
                {t("lede")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="primary" size="lg">
                  <a href="mailto:presse@darso.dz">
                    <Mail className="h-4 w-4" />
                    {t("ctaContact")}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#kit">
                    <Download className="h-4 w-4" />
                    {t("ctaKit")}
                  </a>
                </Button>
              </div>
            </div>

            {/* Facts panel */}
            <aside className="lg:col-span-5">
              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-7 shadow-e1 md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {t("factsTitle")}
                </p>
                <dl className="mt-6 divide-y divide-border">
                  {facts.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <dt className="text-[12.5px] text-ink-2">{f.label}</dt>
                      <dd className="text-end text-[13px] font-semibold tabular text-foreground">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </section>

        {/* Releases */}
        <section id="kit" className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("releasesEyebrow")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                  {t("releasesTitle")}
                </h2>
              </div>
            </div>

            <ul className="mt-10 divide-y divide-border border-y border-border">
              {releases.map((r) => (
                <li key={r.title} className="py-7 md:py-9">
                  <article className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-12">
                    <div className="flex flex-col gap-2">
                      <time className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                        {r.date}
                      </time>
                      <Badge variant="default" className="self-start">
                        {r.category}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-balance text-[20px] font-semibold leading-[1.2] tracking-tight text-foreground md:text-[24px]">
                        {r.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-ink-2">
                        {r.excerpt}
                      </p>
                      <Link
                        href="/press"
                        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent transition-colors hover:text-foreground"
                      >
                        {t("readMore")}
                        <Arrow className="h-3.5 w-3.5 rtl-flip" />
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Coverage */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {t("coverageEyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                {t("coverageTitle")}
              </h2>
            </div>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border md:grid-cols-2">
              {coverage.map((c) => (
                <li key={c.title} className="bg-card p-6 md:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                    {c.outlet}
                  </p>
                  <p className="mt-3 text-balance text-[16px] font-semibold leading-[1.3] tracking-tight text-foreground md:text-[17px]">
                    {c.title}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-ink-3">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {ar ? "اقرأ المقال" : "Lire l'article"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
