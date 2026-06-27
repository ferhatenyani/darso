import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, MapPin, Briefcase, Mail } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.careers" });
  return { title: t("metaTitle") };
}

type Value = { title: string; body: string };
type Opening = {
  title: string;
  team: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
};
type Benefit = { title: string; body: string };

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const t = await getTranslations("marketing.careers");
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const values: Value[] = t.raw("values");
  const openings: Opening[] = t.raw("openings");
  const benefits: Benefit[] = t.raw("benefits");

  const teamCounts = openings.reduce<Record<string, number>>((acc, o) => {
    acc[o.team] = (acc[o.team] ?? 0) + 1;
    return acc;
  }, {});
  const teams = Object.keys(teamCounts);

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
          <p
            aria-hidden
            className="pointer-events-none absolute -top-10 end-6 -z-10 select-none text-[120px] font-black leading-none tracking-tighter text-foreground/[0.04] md:text-[200px]"
          >
            {openings.length.toString().padStart(2, "0")}
          </p>
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

            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Button asChild variant="primary" size="lg">
                <a href="#openings">
                  {openings.length} {ar ? "منصب مفتوح" : "postes ouverts"}
                  <Arrow className="h-4 w-4 rtl-flip" />
                </a>
              </Button>
              {teams.map((team) => (
                <a
                  key={team}
                  href="#openings"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent"
                >
                  {team}
                  <span className="tabular text-ink-3">· {teamCounts[team]}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {ar ? "ثقافتنا" : "Notre culture"}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                  {t("valuesTitle")}
                </h2>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <ol className="divide-y divide-border border-y border-border">
                  {values.map((v, i) => (
                    <li key={v.title} className="grid gap-3 py-6 md:grid-cols-[40px_1fr] md:gap-8 md:py-7">
                      <span className="font-mono text-[12px] font-semibold tabular text-ink-3">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="text-[17px] font-semibold tracking-tight text-foreground md:text-[18px]">
                          {v.title}
                        </h3>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{v.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* OPENINGS — clean table-like list, no card stripes */}
        <section id="openings" className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {t("openingsEyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                {t("openingsTitle")}
              </h2>
            </div>

            <ul className="mt-10 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card divide-y divide-border">
              {openings.map((o) => (
                <li key={o.title}>
                  <article className="group grid gap-4 p-6 md:grid-cols-[1.6fr_1fr_auto] md:items-center md:gap-8 md:p-7">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                        {o.team}
                      </p>
                      <h3 className="mt-1 text-balance text-[17px] font-semibold tracking-tight text-foreground md:text-[19px]">
                        {o.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-ink-2">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-ink-3" />
                          {o.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-ink-3" />
                          {o.type}
                        </span>
                        <span className="tabular text-ink-3">· {o.salary}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {o.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="font-mono text-[10.5px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="hidden md:block" />
                    <div className="flex md:justify-end">
                      <Button asChild variant="outline" size="md">
                        <a href="mailto:jobs@darso.dz">
                          {t("applyLabel")}
                          <Arrow className="h-4 w-4 rtl-flip" />
                        </a>
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {ar ? "المزايا" : "Avantages"}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                {t("benefitsTitle")}
              </h2>
            </div>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b) => (
                <li key={b.title} className="bg-card p-6 md:p-7">
                  <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* No-fit CTA */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-20">
            <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-8 md:p-12">
              <div className="grid gap-6 md:grid-cols-[1.6fr_auto] md:items-center">
                <div>
                  <h2 className="max-w-xl text-balance text-[26px] font-semibold tracking-tight text-foreground md:text-[32px]">
                    {t("noFitTitle")}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] text-ink-2">{t("noFitBody")}</p>
                </div>
                <Button asChild variant="primary" size="lg">
                  <a href="mailto:jobs@darso.dz">
                    <Mail className="h-4 w-4" />
                    {t("noFitCta")}
                  </a>
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
