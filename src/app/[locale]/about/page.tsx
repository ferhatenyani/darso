import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Check, MapPin } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.about" });
  return { title: t("metaTitle") };
}

type Pillar = { title: string; body: string };
type Chapter = { year: string; title: string; body: string };
type Member = { name: string; role: string; city: string; initials: string };
type Metric = { value: string; label: string };

const memberAccents = [
  "from-[#6E5BFF] to-[#9C7BFF]",
  "from-[#FF7A59] to-[#FFA38C]",
  "from-[#16A085] to-[#2EC4A2]",
  "from-[#2563EB] to-[#60A5FA]",
  "from-[#D946EF] to-[#F0ABFC]",
  "from-[#F59E0B] to-[#FBBF24]",
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const t = await getTranslations("marketing.about");
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const pillars: Pillar[] = t.raw("pillars");
  const chapters: Chapter[] = t.raw("storyChapters");
  const members: Member[] = t.raw("members");
  const metrics: Metric[] = t.raw("metrics");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* HERO — editorial. Year & city framed as a masthead. */}
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_15%,black,transparent_80%)]"
          />
          <p
            aria-hidden
            className="pointer-events-none absolute -top-10 end-6 -z-10 select-none text-[140px] font-black leading-none tracking-tighter text-foreground/[0.04] md:text-[240px]"
          >
            2024
          </p>

          <div className="container-narrow pt-16 pb-12 md:pt-24 md:pb-16">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="ink-rule" aria-hidden />
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 max-w-4xl text-balance text-[34px] font-bold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[44px] md:text-[56px] lg:text-[68px]">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              {t("lede")}
            </p>

            {/* Masthead facts strip — no cards, just a typographic rule */}
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6 sm:grid-cols-4">
              {[
                { label: t("founded"), value: t("foundedYear") },
                { label: t("foundedCity").split(",")[0], value: t("foundedCity") },
                { label: t("team"), value: t("teamSize") },
                { label: t("reach"), value: t("reachValue") },
              ].map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-[18px] font-semibold tabular tracking-tight text-foreground md:text-[20px]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* MISSION — long-form column. Big quote-mark behind. */}
        <section className="relative isolate border-b border-border bg-background">
          <div className="container-narrow grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                {t("missionEyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                {t("missionTitle")}
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-pretty text-[16px] leading-[1.7] text-ink-2 md:text-[18px]">
                {t("missionBody")}
              </p>
            </div>
          </div>
        </section>

        {/* PILLARS — clean 3-col grid, no accent stripes */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {t("pillarsEyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                {t("pillarsTitle")}
              </h2>
            </div>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border md:grid-cols-3">
              {pillars.map((p, i) => (
                <li key={p.title} className="bg-card p-7 md:p-8">
                  <span className="font-mono text-[11px] tabular text-ink-3">
                    {String(i + 1).padStart(2, "0")} / {String(pillars.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[20px] font-semibold tracking-tight text-foreground md:text-[22px]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* STORY — timeline. Editorial year scale on the left rail. */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {t("storyEyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                {t("storyTitle")}
              </h2>
            </div>

            <ol className="mt-12 divide-y divide-border border-y border-border">
              {chapters.map((c) => (
                <li
                  key={c.year}
                  className="grid gap-4 py-7 md:grid-cols-[180px_1fr] md:gap-12 md:py-9"
                >
                  <div>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                      {c.year}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold tracking-tight text-foreground md:text-[24px]">
                      {c.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-2 md:text-[15.5px]">
                      {c.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* TEAM — clean 3-col cards, members. No accent stripes. */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("teamEyebrow")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                  {t("teamTitle")}
                </h2>
              </div>
              <p className="max-w-md text-[14px] text-ink-2 md:text-[14.5px]">
                {t("teamSubtitle")}
              </p>
            </div>

            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m, i) => (
                <li
                  key={m.name}
                  className="rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-shadow hover:shadow-e2"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-background">
                      <AvatarFallback
                        className={cn(
                          "bg-gradient-to-br text-sm font-semibold text-white",
                          memberAccents[i % memberAccents.length],
                        )}
                      >
                        {m.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                        {m.name}
                      </p>
                      <p className="truncate text-[12.5px] text-ink-3">{m.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-ink-2">
                    <MapPin className="h-3.5 w-3.5 text-ink-3" />
                    {m.city}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* METRICS — editorial number rail. Massive numerals, hairlines between. */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("metricsTitle")}
            </p>
            <dl className="mt-8 grid grid-cols-2 divide-x divide-border rtl:divide-x-reverse md:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="px-4 py-3 first:ps-0 md:px-8">
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="text-[44px] font-semibold tabular leading-none tracking-tight text-foreground md:text-[64px]">
                    {m.value}
                  </dd>
                  <p className="mt-3 text-[12.5px] uppercase tracking-[0.14em] text-ink-3">
                    {m.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="rounded-[var(--radius-2xl)] border border-border bg-primary p-8 text-primary-foreground md:p-14">
              <div className="grid gap-6 md:grid-cols-[1.6fr_auto] md:items-center">
                <div>
                  <h2 className="max-w-xl text-balance text-[28px] font-semibold leading-[1.1] tracking-tight md:text-[40px]">
                    {t("ctaTitle")}
                  </h2>
                  <p className="mt-4 max-w-xl text-[15px] text-primary-foreground/80 md:text-[16px]">
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
                    <Link href="/careers">{t("ctaSecondary")}</Link>
                  </Button>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-primary-foreground/15 pt-6 text-[12.5px] text-primary-foreground/70">
                <Check className="h-3.5 w-3.5" aria-hidden />
                {ar ? "حساب مجّاني · لا بطاقة مطلوبة" : "Compte gratuit · pas de carte requise"}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
