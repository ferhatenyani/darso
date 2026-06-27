import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  BadgeCheck,
  GraduationCap,
  Video,
  Eye,
  Headphones,
  Gavel,
  Wallet,
  Mail,
  MapPin,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ locale: string }> };

type Stat = { value: string; label: string };
type VerStep = { badge: string; title: string; body: string };
type DisStep = { title: string; body: string };
type ConductItem = { title: string; body: string };
type DataPoint = { label: string; value: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.trust.meta" });
  return { title: t("title"), description: t("description") };
}

const VERIFICATION_ICONS = [BadgeCheck, GraduationCap, Video];
const DISPUTE_ICONS = [Eye, Headphones, Gavel, Wallet];

export default async function TrustPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.trust");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const stats: Stat[] = t.raw("hero.stats");
  const verSteps: VerStep[] = t.raw("verification.steps");
  const disSteps: DisStep[] = t.raw("disputes.steps");
  const conductItems: ConductItem[] = t.raw("conduct.items");
  const dataPoints: DataPoint[] = t.raw("data.points");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(60%_55%_at_50%_0%,black,transparent_85%)]"
          />
          <div className="container-narrow py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="accent"
                className="mb-5 gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              >
                <ShieldCheck className="h-3 w-3" aria-hidden />
                {t("hero.eyebrow")}
              </Badge>
              <h1 className="text-balance text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[48px] md:text-[58px]">
                {t("hero.title")}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
                {t("hero.subtitle")}
              </p>
            </div>

            <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-card p-5 text-center">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                    {s.label}
                  </dt>
                  <dd className="mt-2 text-[26px] font-semibold tabular tracking-tight text-foreground md:text-[30px]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* VERIFICATION */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                {t("verification.eyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold tracking-tight text-foreground md:text-[36px]">
                {t("verification.title")}
              </h2>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
                {t("verification.subtitle")}
              </p>
            </div>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {verSteps.map((s, i) => {
                const Icon = VERIFICATION_ICONS[i] ?? BadgeCheck;
                return (
                  <li
                    key={s.title}
                    className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/12 text-accent">
                        <Icon className="h-5 w-5" />
                      </span>
                      <Badge variant="success" className="gap-1 text-[10px] uppercase tracking-[0.14em]">
                        <BadgeCheck className="h-3 w-3" />
                        {s.badge}
                      </Badge>
                    </div>
                    <h3 className="mt-5 text-[16px] font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-[42ch] text-[13.5px] leading-relaxed text-ink-2">
                      {s.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* DISPUTE TIMELINE */}
        <section className="border-b border-border bg-surface/40">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                {t("disputes.eyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold tracking-tight text-foreground md:text-[36px]">
                {t("disputes.title")}
              </h2>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
                {t("disputes.subtitle")}
              </p>
            </div>

            <ol className="relative mt-12 grid gap-6 md:grid-cols-4">
              {/* Horizontal connector line — visual only, decorative */}
              <div
                aria-hidden
                className="absolute start-0 end-0 top-5 -z-0 hidden h-px bg-border md:block"
              />
              {disSteps.map((s, i) => {
                const Icon = DISPUTE_ICONS[i] ?? Eye;
                return (
                  <li key={s.title} className="relative">
                    <div className="relative z-10 inline-flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-accent">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3 tabular">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[15px] font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-ink-2">
                      {s.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* CODE OF CONDUCT */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                {t("conduct.eyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold tracking-tight text-foreground md:text-[36px]">
                {t("conduct.title")}
              </h2>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-ink-2">
                {t("conduct.subtitle")}
              </p>
            </div>

            <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2">
              {conductItems.map((it) => (
                <li key={it.title} className="bg-card p-6">
                  <h3 className="text-[15px] font-semibold text-foreground">{it.title}</h3>
                  <p className="mt-2 max-w-[52ch] text-[13.5px] leading-relaxed text-ink-2">
                    {it.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* DATA PRIVACY SNAPSHOT */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
              <div className="lg:sticky lg:top-24">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                  {t("data.eyebrow")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold tracking-tight text-foreground md:text-[34px]">
                  {t("data.title")}
                </h2>
                <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
                  {t("data.subtitle")}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="primary" size="md">
                    <Link href="/legal/privacy">
                      {t("data.ctaPrivacy")}
                      <Arrow className="h-4 w-4 rtl-flip" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="md">
                    <Link href="/legal/cookies">{t("data.ctaCookies")}</Link>
                  </Button>
                </div>
              </div>

              <dl className="divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
                {dataPoints.map((p) => (
                  <div key={p.label} className="grid gap-2 p-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                      {p.label}
                    </dt>
                    <dd className="max-w-[60ch] text-[14px] leading-relaxed text-foreground">
                      {p.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* FOUNDERS CONTACT */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-20">
            <div className="rounded-[var(--radius-2xl)] border border-border bg-primary p-8 text-primary-foreground md:p-12">
              <div className="grid gap-6 md:grid-cols-[1.6fr_auto] md:items-center">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary-foreground/70">
                    {t("founders.eyebrow")}
                  </span>
                  <h2 className="mt-3 max-w-xl text-balance text-[26px] font-semibold tracking-tight md:text-[34px]">
                    {t("founders.title")}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] text-primary-foreground/80">
                    {t("founders.subtitle")}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-primary-foreground/80">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      {t("founders.email")}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      {t("founders.address")}
                    </span>
                  </div>
                </div>
                <Button asChild variant="accent" size="lg">
                  <Link href="/contact">
                    {t("founders.cta")}
                    <Arrow className="h-4 w-4 rtl-flip" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
