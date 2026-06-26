"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Slider } from "@/components/ui/slider";
import { formatPrice, cn } from "@/lib/utils";

type Tier = { id: string; thresholdDzd: number; rate: number; nameFr: string; nameAr: string };

export function SubscriptionSimulator({ locale, tiers }: { locale: "fr" | "ar"; tiers: Tier[] }) {
  const t = useTranslations("teacher.subscription.simulator");
  const [value, setValue] = React.useState(180000);

  const max = tiers[tiers.length - 1].thresholdDzd + 200000;
  const tier = [...tiers].reverse().find((tt) => value >= tt.thresholdDzd) ?? tiers[0];
  const lc = (locale === "ar" ? "ar-DZ" : "fr-DZ") as string;

  return (
    <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card">
      <header className="border-b border-border p-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-1 max-w-xl text-[13px] text-ink-2">{t("subtitle")}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
        <div className="p-6 lg:p-8">
          {/* tier ticks */}
          <div className="relative mb-3 h-8">
            {tiers.map((tt, i) => {
              const pct = (tt.thresholdDzd / max) * 100;
              const active = tier.id === tt.id;
              return (
                <div
                  key={tt.id}
                  className="absolute top-0 -translate-x-1/2 rtl:translate-x-1/2"
                  style={{ insetInlineStart: `${pct}%` }}
                >
                  <span
                    className={cn(
                      "block h-3 w-px",
                      active ? "bg-accent" : "bg-border-strong",
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "absolute top-3 -translate-x-1/2 rtl:translate-x-1/2 whitespace-nowrap font-mono text-[10px] tabular",
                      active ? "font-semibold text-foreground" : "text-ink-3",
                    )}
                  >
                    {Math.round(tt.rate * 100)}%
                  </span>
                </div>
              );
            })}
          </div>
          <Slider
            min={0}
            max={max}
            step={1000}
            value={[value]}
            onValueChange={(v) => setValue(v[0])}
            ariaLabel={t("ifEarn")}
            format={(n) => new Intl.NumberFormat(lc, { notation: "compact" }).format(n)}
          />
          <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
            {tiers.map((tt) => (
              <div
                key={tt.id}
                className={cn(
                  "rounded-[var(--radius-md)] border px-2 py-2 text-center",
                  tier.id === tt.id ? "border-accent bg-accent-soft/30" : "border-border bg-background",
                )}
              >
                <p className="font-semibold uppercase tracking-[0.12em] text-ink-3">
                  {locale === "ar" ? tt.nameAr : tt.nameFr}
                </p>
                <p className="mt-1 tabular text-ink-2">
                  ≥ {new Intl.NumberFormat(lc, { notation: "compact" }).format(tt.thresholdDzd)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="border-t border-border bg-surface/60 p-6 lg:border-s lg:border-t-0 lg:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">{t("ifEarn")}</p>
          <p className="mt-1 text-3xl font-semibold tabular tracking-tight text-foreground">
            {formatPrice(value, locale)}
            <span className="ms-1 text-[12px] font-normal text-ink-3">{t("perMonth")}</span>
          </p>
          <div className="my-5 h-px w-full bg-border" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">{t("rateBecomes")}</p>
          <p className="mt-1 text-5xl font-semibold tabular tracking-tight text-foreground">
            {Math.round(tier.rate * 100)}
            <span className="text-2xl text-ink-3">%</span>
          </p>
          <p className="mt-2 text-[12px] tabular text-ink-3">
            {t("tierName")} · {locale === "ar" ? tier.nameAr : tier.nameFr}
          </p>
        </aside>
      </div>
    </section>
  );
}
