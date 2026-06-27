import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowLeft, Check, TrendingUp, Sparkles, ShieldCheck, Clock } from "lucide-react";

import { Link, redirect } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/server";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

/**
 * Public "Become a teacher" landing page. Anonymous visitors and students
 * see a marketing pitch; authenticated teachers are bounced to their
 * dashboard at /teach/dashboard.
 */
export default async function TeachLanding({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (user?.role === "teacher") {
    redirect({ href: routes.teachDashboard(), locale });
  }

  const t = await getTranslations("teacher.landing");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const points: string[] = t.raw("points");
  const steps: { title: string; body: string }[] = t.raw("steps");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent_80%)]"
          />
          <div className="container-narrow grid gap-10 py-16 md:py-24 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                {t("eyebrow")}
              </p>
              <h1 className="mt-4 text-[34px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[44px] md:text-[56px] lg:text-[64px]">
                <span className="text-balance">{t("title")}</span>
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
                {t("subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="primary" size="lg">
                  <Link href={routes.signUp()}>
                    {t("ctaPrimary")}
                    <Arrow className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={routes.teachPricing()}>{t("ctaSecondary")}</Link>
                </Button>
              </div>
              <p className="mt-5 inline-flex items-center gap-1.5 text-[12px] text-ink-3">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                {t("trustLine")}
              </p>
            </div>

            {/* Side preview — revenue tier mock */}
            <aside className="rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1 md:p-7">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="h-[20px] gap-1 px-2 text-[10px] uppercase tracking-[0.16em]">
                  <Sparkles className="h-3 w-3" />
                  {t("previewBadge")}
                </Badge>
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                {t("previewRateLabel")}
              </p>
              <p className="mt-1 text-4xl font-semibold tabular tracking-tight text-foreground">
                {t("previewRate")}
              </p>
              <p className="mt-1 text-[12px] text-ink-3">{t("previewRateBlurb")}</p>
              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] tabular text-ink-3">
                    <span>{t("previewTierCurrent")}</span>
                    <span>{t("previewTierCurrentRange")}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
                    <div className="h-full w-[64%] rounded-full bg-accent" />
                  </div>
                </div>
                <p className="flex items-center justify-between text-[11px] tabular text-ink-3">
                  <span>{t("previewTierNext")}</span>
                  <span className="font-semibold text-foreground">{t("previewTierNextLabel")}</span>
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Why darso */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
              {t("benefitsEyebrow")}
            </p>
            <h2 className="mt-3 max-w-2xl text-balance text-[28px] font-semibold tracking-tight text-foreground md:text-[36px]">
              {t("benefitsTitle")}
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {points.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[14px] leading-relaxed text-foreground">{p}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
              {t("stepsEyebrow")}
            </p>
            <h2 className="mt-3 max-w-2xl text-balance text-[28px] font-semibold tracking-tight text-foreground md:text-[36px]">
              {t("stepsTitle")}
            </h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {steps.map((s, i) => (
                <li
                  key={i}
                  className="relative rounded-[var(--radius-lg)] border border-border bg-card p-5"
                >
                  <span className="absolute -top-3 start-5 inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-foreground px-2 text-[11px] font-semibold tabular text-background">
                    № {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-[15px] font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA strip */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-20">
            <div className="rounded-[var(--radius-2xl)] border border-border bg-primary p-8 text-primary-foreground md:p-12">
              <div className="grid gap-6 md:grid-cols-[1.6fr_auto] md:items-center">
                <div>
                  <h2 className="max-w-xl text-balance text-[26px] font-semibold tracking-tight md:text-[34px]">
                    {t("ctaStripTitle")}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] text-primary-foreground/80">
                    {t("ctaStripBlurb")}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-primary-foreground/70">
                    <Clock className="h-3.5 w-3.5" />
                    {t("ctaStripTime")}
                  </p>
                </div>
                <Button asChild variant="accent" size="lg">
                  <Link href={routes.signUp()}>
                    {t("ctaStripButton")}
                    <Arrow className="h-4 w-4" />
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
