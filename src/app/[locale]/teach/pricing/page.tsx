import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, TrendingDown, ShieldCheck, Eye } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubscriptionSimulator } from "@/components/teacher/subscription-simulator";
import { TeachPricingFaq } from "@/components/marketing/teach-pricing-faq";
import { Reveal, Stagger } from "@/components/ui/reveal";
import { tiers as allTiers } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.teachPricing" });
  return { title: t("metaTitle") };
}

type Principle = { title: string; body: string };
type ComparisonRow = { label: string; rate: string; net: string; highlight?: boolean };
type Faq = { q: string; a: string };

const principleIcons = [TrendingDown, ShieldCheck, Eye];

export default async function TeachPricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const loc = locale as "fr" | "ar";
  const t = await getTranslations("marketing.teachPricing");
  const Arrow = ar ? ArrowLeft : ArrowRight;

  // Locked-in default 3 — agency tier RIP. Filter from public-facing display.
  const tiers = allTiers.filter((tt) => tt.id !== "agency");
  const principles: Principle[] = t.raw("principles");
  const comparison: ComparisonRow[] = t.raw("comparison");
  const faqs: Faq[] = t.raw("faqs");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* HERO — editorial. Big "0 %" mark behind the title. */}
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_15%,black,transparent_80%)]"
          />
          <p
            aria-hidden
            className="pointer-events-none absolute -top-10 end-6 -z-10 select-none text-[120px] font-black leading-none tracking-tighter text-foreground/[0.045] md:text-[220px]"
          >
            0 %
          </p>
          <div className="container-narrow grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="anim-fade-up flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                <span className="ink-rule" aria-hidden />
                {t("eyebrow")}
              </p>
              <h1
                className="anim-fade-up mt-5 text-balance text-[34px] font-bold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[44px] md:text-[56px] lg:text-[64px]"
                style={{ animationDelay: "90ms" }}
              >
                {t("title")}
              </h1>
              <p
                className="anim-fade-up mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]"
                style={{ animationDelay: "180ms" }}
              >
                {t("lede")}
              </p>
              <div
                className="anim-fade-up mt-8 flex flex-wrap gap-3"
                style={{ animationDelay: "270ms" }}
              >
                <Button asChild variant="primary" size="lg">
                  <Link href="/sign-up">
                    {t("primaryCta")}
                    <Arrow className="h-4 w-4 rtl-flip" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/teach/resources">{t("secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            {/* Tier ladder preview — typographic, not bento */}
            <Reveal as="aside" direction="scale" delay={220} duration={800} className="lg:col-span-5">
              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1 md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {ar ? "سلّم النّسب" : "Échelle des taux"}
                </p>
                <ol className="mt-5 divide-y divide-border">
                  {tiers.map((tt) => (
                    <li
                      key={tt.id}
                      className="group flex items-baseline justify-between gap-4 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-surface/50"
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold tracking-tight text-foreground">
                          {ar ? tt.nameAr : tt.nameFr}
                        </p>
                        <p className="font-mono text-[11.5px] tabular text-ink-3">
                          ≥{" "}
                          {new Intl.NumberFormat(ar ? "ar-DZ" : "fr-DZ", {
                            notation: "compact",
                          }).format(tt.thresholdDzd)}{" "}
                          DZD
                        </p>
                      </div>
                      <p className="text-end font-mono text-[20px] font-semibold tabular tracking-tight text-foreground">
                        {Math.round(tt.rate * 100)}
                        <span className="text-[12px] text-ink-3">%</span>
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRINCIPLES — clean 3-col */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <Reveal>
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("principleEyebrow")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                  {t("principleTitle")}
                </h2>
              </div>
            </Reveal>
            <Stagger as="ul" step={110} initialDelay={100} className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border md:grid-cols-3">
              {principles.map((p, i) => {
                const Icon = principleIcons[i] ?? TrendingDown;
                return (
                  <li key={p.title} className="group bg-card p-7 transition-colors hover:bg-surface/40 md:p-8">
                    <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-accent-soft text-accent transition-transform duration-500 group-hover:rotate-[-4deg]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-foreground md:text-[20px]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{p.body}</p>
                  </li>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* SIMULATOR */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("simulatorEyebrow")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                  {t("simulatorTitle")}
                </h2>
                <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-2">
                  {t("simulatorBody")}
                </p>
                <div aria-hidden className="mt-6 h-[3px] w-16 bg-accent origin-left anim-underline" />
              </Reveal>
              <Reveal delay={140} className="lg:col-span-8">
                <SubscriptionSimulator locale={loc} tiers={tiers} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <Reveal>
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("comparisonEyebrow")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                  {t("comparisonTitle")}
                </h2>
              </div>
            </Reveal>

            <Reveal delay={100} className="mt-10 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
              <div className="hidden grid-cols-[1.6fr_0.7fr_1fr] gap-4 border-b border-border bg-surface/60 px-6 py-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-3 md:grid">
                <span>{ar ? "الخيار" : "Option"}</span>
                <span className="text-end">{ar ? "النّسبة" : "Commission"}</span>
                <span className="text-end">{ar ? "صافيك" : "Ton net"}</span>
              </div>
              <ul className="divide-y divide-border">
                {comparison.map((c) => (
                  <li
                    key={c.label}
                    className={cn(
                      "grid grid-cols-1 gap-2 px-6 py-5 md:grid-cols-[1.6fr_0.7fr_1fr] md:items-center md:gap-4",
                      c.highlight && "bg-accent/5",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[14.5px] text-foreground">{c.label}</span>
                      {c.highlight ? (
                        <Badge variant="accent" className="font-mono text-[10px]">
                          {ar ? "نحن" : "Nous"}
                        </Badge>
                      ) : null}
                    </div>
                    <span className="text-[13.5px] tabular text-ink-2 md:text-end">{c.rate}</span>
                    <span
                      className={cn(
                        "text-[14px] font-semibold tabular md:text-end",
                        c.highlight ? "text-foreground" : "text-ink-2",
                      )}
                    >
                      {c.net}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-border px-6 py-3 text-[11.5px] tabular text-ink-3">
                {t("comparisonNote")}
              </p>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("faqEyebrow")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                  {t("faqTitle")}
                </h2>
              </Reveal>
              <Reveal delay={140} className="lg:col-span-7 lg:col-start-6">
                <TeachPricingFaq faqs={faqs} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-20">
            <Reveal className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-primary p-8 text-primary-foreground md:p-12">
              <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.06]" />
              <div
                aria-hidden
                className="absolute -end-24 -top-24 -z-10 h-64 w-64 rounded-full bg-accent/18 blur-[100px] float-slow"
              />
              <div className="grid gap-6 md:grid-cols-[1.6fr_auto] md:items-center">
                <div>
                  <h2 className="max-w-xl text-balance text-[26px] font-semibold tracking-tight md:text-[34px]">
                    {t("ctaTitle")}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] text-primary-foreground/80">
                    {t("ctaBody")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="accent" size="lg">
                    <Link href="/sign-up">
                      {t("ctaPrimary")}
                      <Arrow className="h-4 w-4 rtl-flip" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="border border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Link href="/contact">{t("ctaSecondary")}</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
