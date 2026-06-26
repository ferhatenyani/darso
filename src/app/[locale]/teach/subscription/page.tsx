import { setRequestLocale, getTranslations } from "next-intl/server";
import { CreditCard, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscriptionSimulator } from "@/components/teacher/subscription-simulator";
import { CancelSubscriptionDialog } from "@/components/teacher/cancel-subscription";
import { invoices, revenueSnapshot, tiers } from "@/lib/mock/dashboard";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export default async function SubscriptionPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.subscription");
  const loc = locale as "fr" | "ar";

  const toNext = revenueSnapshot.nextTierThresholdDzd - revenueSnapshot.currentMonthDzd;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {/* Editorial header */}
      <header className="mb-12 max-w-3xl">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          <span className="ink-rule" aria-hidden />
          {loc === "ar" ? "الاشتراك" : "Abonnement"}
        </p>
        <h1 className="mt-3 text-balance text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[52px]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-[15px] text-ink-2 sm:text-base">{t("subtitle")}</p>
      </header>

      {/* Big tier display + progress */}
      <section className="mb-10 overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.3fr_1fr]">
          <div className="border-e border-border p-8 lg:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("currentTier")}
            </p>
            <div className="mt-3 flex items-baseline gap-4">
              <span className="text-[88px] font-semibold leading-none tabular tracking-tighter text-foreground">
                {Math.round(revenueSnapshot.rate * 100)}
                <span className="text-3xl text-ink-3">%</span>
              </span>
              <Badge variant="warning">{revenueSnapshot.currentTierLabel[loc]}</Badge>
            </div>
            <p className="mt-2 max-w-md text-[13px] text-ink-2">
              {loc === "ar"
                ? "هذه النسبة تُطبَّق على إيرادات الشهر فقط، لا اشتراك ثابت."
                : "Ce taux s'applique sur le chiffre du mois — pas d'abonnement fixe."}
            </p>
          </div>
          <div className="bg-surface/60 p-8 lg:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("thisMonth")}
            </p>
            <p className="mt-3 text-3xl font-semibold tabular text-foreground">
              {formatPrice(revenueSnapshot.currentMonthDzd, locale)}
            </p>
            <p className="mt-1 text-[12px] tabular text-ink-3">
              {t("toNext")}: <span className="font-semibold text-foreground">{formatPrice(toNext, locale)}</span>
            </p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-background">
              <div
                className="h-full bg-accent"
                style={{
                  width: `${Math.min(100, (revenueSnapshot.currentMonthDzd / revenueSnapshot.nextTierThresholdDzd) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-[11px] tabular text-ink-3">
              {revenueSnapshot.nextTierLabel[loc]} ·{" "}
              {Math.round(revenueSnapshot.nextTierRate * 100)}%
            </p>
          </div>
        </div>
      </section>

      <SubscriptionSimulator locale={loc} tiers={tiers} />

      {/* Plan comparison */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t("compare.title")}</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { id: "starter", rate: 5, name: loc === "ar" ? "بداية" : "Démarrage", features: ["publicProfile"] },
            { id: "pro", rate: 8, name: loc === "ar" ? "برو" : "Pro", featured: true, features: ["publicProfile", "instantBook", "joinPriority"] },
            { id: "agency", rate: 15, name: loc === "ar" ? "وكالة" : "Agence", features: ["publicProfile", "instantBook", "joinPriority", "agencyTools", "manager"] },
          ].map((plan) => (
            <div
              key={plan.id}
              className={
                plan.featured
                  ? "relative rounded-[var(--radius-xl)] border-2 border-accent bg-card p-6 shadow-e2"
                  : "rounded-[var(--radius-xl)] border border-border bg-card p-6"
              }
            >
              {plan.featured && (
                <Badge variant="accent" className="absolute -top-2 start-6">
                  {loc === "ar" ? "الأكثر شيوعًا" : "Le plus choisi"}
                </Badge>
              )}
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                {plan.name}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tabular tracking-tight text-foreground">{plan.rate}</span>
                <span className="text-2xl text-ink-3">%</span>
              </div>
              <p className="mt-1 text-[11px] tabular text-ink-3">
                {loc === "ar" ? "من إيراداتك" : "de vos revenus"}
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-border pt-4">
                {(["publicProfile", "instantBook", "joinPriority", "agencyTools", "manager"] as const).map((f) => {
                  const has = plan.features.includes(f);
                  return (
                    <li key={f} className={"flex items-start gap-2 text-[13px] " + (has ? "text-ink-2" : "text-ink-3")}>
                      <span
                        className={
                          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full " +
                          (has ? "bg-success/15 text-success" : "bg-surface text-ink-3")
                        }
                      >
                        {has ? "✓" : "·"}
                      </span>
                      {t(`compare.features.${f}`)}
                    </li>
                  );
                })}
              </ul>
              <Button variant={plan.featured ? "primary" : "outline"} size="md" className="mt-6 w-full">
                {t("compare.select")}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Invoices + payment */}
      <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
          <header className="border-b border-border p-5">
            <h3 className="text-base font-semibold text-foreground">{t("invoices.title")}</h3>
            <p className="text-[12px] text-ink-3">{t("invoices.subtitle")}</p>
          </header>
          <div className="hidden grid-cols-[1fr_1fr_1.5fr_0.8fr_0.5fr_60px] gap-3 border-b border-border bg-surface/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3 md:grid">
            <span>{t("invoices.thead.id")}</span>
            <span>{t("invoices.thead.date")}</span>
            <span>{t("invoices.thead.description")}</span>
            <span className="text-end">{t("invoices.thead.amount")}</span>
            <span>{t("invoices.thead.status")}</span>
            <span className="sr-only">action</span>
          </div>
          <ul className="divide-y divide-border">
            {invoices.map((inv) => (
              <li
                key={inv.id}
                className="grid grid-cols-2 gap-3 px-5 py-3 text-[13px] md:grid-cols-[1fr_1fr_1.5fr_0.8fr_0.5fr_60px] md:items-center"
              >
                <span className="font-mono text-[12px] font-semibold tabular text-foreground">{inv.id}</span>
                <span className="text-ink-2">{inv.date[loc]}</span>
                <span className="col-span-2 text-[12px] text-ink-3 md:col-span-1">{inv.description[loc]}</span>
                <span className="text-end font-semibold tabular text-foreground">{formatPrice(inv.amountDzd, locale)}</span>
                <span>
                  <Badge variant={inv.status === "paid" ? "success" : "warning"}>
                    {t(`invoices.${inv.status}`)}
                  </Badge>
                </span>
                <Button variant="ghost" size="icon-sm" aria-label={t("invoices.download")}>
                  <Download className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-border bg-card p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              {t("payment.title")}
            </p>
            <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-3">
              <CreditCard className="h-5 w-5 text-ink-2" aria-hidden />
              <span className="flex-1 text-[13px] font-semibold tabular text-foreground">{t("payment.card")}</span>
            </div>
            <p className="mt-2 text-[12px] text-ink-3">{t("payment.subtitle")}</p>
            <Button variant="outline" size="sm" className="mt-4 w-full">{t("payment.change")}</Button>
          </div>

          <CancelSubscriptionDialog />
        </div>
      </section>
    </div>
  );
}
