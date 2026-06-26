import { useLocale, useTranslations } from "next-intl";
import { Check, ArrowRight, ArrowLeft, TrendingUp } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function TeacherCta() {
  const t = useTranslations("home.teacherCta");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const points: string[] = t.raw("points");

  return (
    <section className="container-narrow py-16 md:py-24">
      <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-primary text-primary-foreground">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(60% 80% at 80% 0%, rgba(47,107,255,0.55) 0, transparent 60%), radial-gradient(40% 60% at 0% 100%, rgba(62,143,208,0.45) 0, transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative grid gap-10 p-8 md:grid-cols-[1.4fr_1fr] md:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/85 md:text-lg">
              {t("subtitle")}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-1">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary-foreground/90">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/teach">
                  {t("primary")}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-primary-foreground hover:bg-white/10">
                <Link href="/teach/pricing">{t("secondary")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br from-white/12 to-white/4 backdrop-blur" />
            <div className="relative rounded-[var(--radius-xl)] border border-white/10 bg-white/6 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
                  {t("preview.modelLabel")}
                </p>
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <p className="mt-3 text-3xl font-semibold tabular">
                {t("preview.currentRate")}
              </p>
              <p className="text-xs text-primary-foreground/70">
                {t("preview.currentRateLabel")}
              </p>

              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-primary-foreground/70">
                    <span>{t("preview.tierCurrent")}</span>
                    <span className="tabular">
                      {t("preview.tierCurrentRange")}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-[64%] rounded-full bg-accent" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-primary-foreground/70">
                  <span>{t("preview.tierNext")}</span>
                  <span className="font-medium text-primary-foreground tabular">
                    {t("preview.tierNextLabel")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
