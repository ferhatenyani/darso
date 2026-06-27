"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { SectionIndex } from "@/components/teacher/section-index";
import {
  getKpis,
  getBookingsSeries,
  getRevenueSeries,
  getTopCourses,
  getTopSubjects,
  type AnalyticsPeriod,
  type AnalyticsScope,
  type TimeSeriesPoint,
} from "@/lib/mock/analytics-state";
import { cn, formatCompact, formatNumber, formatPrice } from "@/lib/utils";

const PERIODS: AnalyticsPeriod[] = [7, 30, 90, 365];

export function AnalyticsDashboard({
  accountId,
  initialPeriod,
  scope = "teacher",
}: {
  accountId: string;
  initialPeriod: AnalyticsPeriod;
  scope?: AnalyticsScope;
}) {
  const t = useTranslations("analytics");
  const router = useRouter();
  const locale = useLocale() as "fr" | "ar";

  // Local state mirrors the URL — the URL is the source of truth, but we
  // optimistically update locally so the period switch feels instant.
  const [period, setPeriod] = React.useState<AnalyticsPeriod>(initialPeriod);

  React.useEffect(() => {
    setPeriod(initialPeriod);
  }, [initialPeriod]);

  // Pure derivations — recompute when (accountId, period, scope) change.
  const kpis = React.useMemo(() => getKpis(accountId, period, scope), [accountId, period, scope]);
  const bookings = React.useMemo(
    () => getBookingsSeries(accountId, period, scope),
    [accountId, period, scope],
  );
  const revenue = React.useMemo(
    () => getRevenueSeries(accountId, period, scope),
    [accountId, period, scope],
  );
  const topCourses = React.useMemo(
    () => getTopCourses(accountId, period, scope, 5),
    [accountId, period, scope],
  );
  const topSubjects = React.useMemo(
    () => getTopSubjects(accountId, period, scope, 6),
    [accountId, period, scope],
  );

  const handlePeriodChange = (next: AnalyticsPeriod) => {
    if (next === period) return;
    setPeriod(next);
    const base = scope === "agency" ? "/teach/agency/analytics" : "/teach/analytics";
    router.push(`${base}?period=${next}`, { scroll: false });
  };

  const kpiCards: KpiCardData[] = [
    {
      key: "conversionRate",
      label: t("kpis.conversionRate"),
      hint: t("kpis.conversionRateHint"),
      current: kpis.conversionRate.current,
      previous: kpis.conversionRate.previous,
      higherIsBetter: true,
    },
    {
      key: "retention",
      label: t("kpis.retention"),
      hint: t("kpis.retentionHint"),
      current: kpis.retention.current,
      previous: kpis.retention.previous,
      higherIsBetter: true,
    },
    {
      key: "refundRate",
      label: t("kpis.refundRate"),
      hint: t("kpis.refundRateHint"),
      current: kpis.refundRate.current,
      previous: kpis.refundRate.previous,
      higherIsBetter: false,
    },
    {
      key: "noShowRate",
      label: t("kpis.noShowRate"),
      hint: t("kpis.noShowRateHint"),
      current: kpis.noShowRate.current,
      previous: kpis.noShowRate.previous,
      higherIsBetter: false,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Period picker — segmented control. Restrained: no card, no shadow,
          one accent on the active segment. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          {t("period.label")}
        </p>
        <PeriodPicker
          period={period}
          onChange={handlePeriodChange}
          getLabel={(p) => t(`period.${p}`)}
          ariaLabel={t("period.ariaLabel")}
        />
      </div>

      {/* KPI row — hairline grid (gap-px on bg-border) so cells share borders
          like a print table. No accent stripes; density variation does the
          work of hierarchy. */}
      <section>
        <SectionIndex
          num={t("kpis.indexNum")}
          label={t("kpis.section")}
          title={t("kpis.sectionTitle")}
          description={t("kpis.sectionSubtitle")}
          className="mb-5"
        />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-border lg:grid-cols-4">
          {kpiCards.map((card) => (
            <KpiCell key={card.key} card={card} locale={locale} t={t} />
          ))}
        </div>
      </section>

      {/* Charts row */}
      <section>
        <SectionIndex
          num={t("charts.indexNum")}
          label={t("charts.section")}
          title={t("charts.sectionTitle")}
          className="mb-5"
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard
            title={t("charts.bookingsTitle")}
            series={bookings}
            ariaLabel={t("charts.ariaBookings")}
            formatValue={(v) => `${formatNumber(v, locale)} ${t("charts.bookingsSuffix")}`}
            axisStart={t("charts.axisStart")}
            axisEnd={t("charts.axisEnd")}
            noData={t("charts.noData")}
            locale={locale}
          />
          <ChartCard
            title={t("charts.revenueTitle")}
            series={revenue}
            ariaLabel={t("charts.ariaRevenue")}
            formatValue={(v) => formatPrice(v, locale)}
            axisStart={t("charts.axisStart")}
            axisEnd={t("charts.axisEnd")}
            noData={t("charts.noData")}
            locale={locale}
            useCompact
          />
        </div>
      </section>

      {/* Bottom detail row — top courses + top subjects */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionIndex
            num={t("topCourses.indexNum")}
            label={t("topCourses.section")}
            title={t("topCourses.sectionTitle")}
            description={t("topCourses.sectionSubtitle")}
            className="mb-5"
          />
          <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card">
            {topCourses.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-3">{t("topCourses.empty")}</p>
            ) : (
              <table className="w-full table-fixed text-start text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/60 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                    <th scope="col" className="w-[44%] px-5 py-3 text-start font-semibold">
                      {t("topCourses.th.course")}
                    </th>
                    <th scope="col" className="w-[18%] px-3 py-3 text-end font-semibold">
                      {t("topCourses.th.bookings")}
                    </th>
                    <th scope="col" className="w-[22%] px-3 py-3 text-end font-semibold">
                      {t("topCourses.th.revenue")}
                    </th>
                    <th scope="col" className="w-[16%] px-5 py-3 text-end font-semibold">
                      {t("topCourses.th.conversion")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCourses.map((c, i) => (
                    <tr
                      key={c.courseId}
                      className={cn(
                        "border-b border-border last:border-b-0",
                        i % 2 === 1 && "bg-surface/30",
                      )}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[10px] tabular text-ink-3">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate text-[13px] font-medium text-foreground">
                            {c.title[locale]}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-end text-[13px] tabular text-foreground">
                        {formatNumber(c.bookings, locale)}
                      </td>
                      <td className="px-3 py-3.5 text-end text-[13px] tabular text-foreground">
                        {formatPrice(c.revenueDzd, locale)}
                      </td>
                      <td className="px-5 py-3.5 text-end text-[13px] tabular text-ink-2">
                        {formatNumber(c.conversionRate, locale)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <SectionIndex
            num={t("topSubjects.indexNum")}
            label={t("topSubjects.section")}
            title={t("topSubjects.sectionTitle")}
            description={t("topSubjects.sectionSubtitle")}
            className="mb-5"
          />
          <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card">
            {topSubjects.length === 0 && (
              <li className="px-5 py-6 text-sm text-ink-3">{t("topSubjects.empty")}</li>
            )}
            {topSubjects.map((s, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-4">
                <span className="font-mono text-[10px] tabular text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {s.subject[locale]}
                  </p>
                  <p className="mt-0.5 text-[11px] tabular text-ink-3">
                    {t("topSubjects.searches", { count: s.searches })}
                    {" · "}
                    {t("topSubjects.bookings", { count: s.bookings })}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] tabular text-ink-2">
                  {formatNumber(s.conversionRate, locale)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="text-[11px] tabular text-ink-3">{t("footnote")}</p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

function PeriodPicker({
  period,
  onChange,
  getLabel,
  ariaLabel,
}: {
  period: AnalyticsPeriod;
  onChange: (next: AnalyticsPeriod) => void;
  getLabel: (p: AnalyticsPeriod) => string;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-[var(--radius-md)] border border-border bg-card p-0.5"
    >
      {PERIODS.map((p) => {
        const active = p === period;
        return (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(p)}
            className={cn(
              "inline-flex h-8 items-center justify-center rounded-[var(--radius-sm)] px-3 text-[12px] font-medium tabular transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active
                ? "bg-foreground text-background"
                : "text-ink-2 hover:bg-surface hover:text-foreground",
            )}
          >
            {getLabel(p)}
          </button>
        );
      })}
    </div>
  );
}

type KpiCardData = {
  key: string;
  label: string;
  hint: string;
  current: number;
  previous: number;
  /** When true, an increase is positive (e.g. conversion). When false, an
   *  increase is negative (e.g. refund rate). Drives the arrow + tone. */
  higherIsBetter: boolean;
};

function KpiCell({
  card,
  locale,
  t,
}: {
  card: KpiCardData;
  locale: "fr" | "ar";
  t: ReturnType<typeof useTranslations>;
}) {
  const delta = card.current - card.previous;
  const absDelta = Math.abs(delta);
  const FLAT_THRESHOLD = 0.05;
  const isFlat = absDelta < FLAT_THRESHOLD;
  const isUp = delta > 0;
  // Tone: good = delta direction matches `higherIsBetter`. Use design tokens
  // (success / danger) — never raw colors.
  const tone: "good" | "bad" | "flat" = isFlat
    ? "flat"
    : (isUp && card.higherIsBetter) || (!isUp && !card.higherIsBetter)
      ? "good"
      : "bad";

  const Arrow = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight;
  const deltaText = isFlat
    ? t("kpis.deltaFlat")
    : isUp
      ? t("kpis.deltaUp", { value: formatNumber(Math.round(absDelta * 10) / 10, locale) })
      : t("kpis.deltaDown", { value: formatNumber(Math.round(absDelta * 10) / 10, locale) });

  return (
    <div className="flex flex-col gap-4 bg-card p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
        {card.label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[40px] font-semibold leading-none tracking-tight text-foreground tabular sm:text-[44px]">
          {formatNumber(card.current, locale)}
        </span>
        <span className="text-[18px] font-medium text-ink-3 tabular">%</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-medium tabular",
            tone === "good" && "text-success",
            tone === "bad" && "text-danger",
            tone === "flat" && "text-ink-3",
          )}
        >
          <Arrow className="h-3.5 w-3.5" aria-hidden />
          {deltaText}
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-3">
          {t("period.comparePrev")}
        </span>
      </div>
      <p className="text-[11px] leading-snug text-ink-3">{card.hint}</p>
    </div>
  );
}

function ChartCard({
  title,
  series,
  ariaLabel,
  formatValue,
  axisStart,
  axisEnd,
  noData,
  locale,
  useCompact = false,
}: {
  title: string;
  series: TimeSeriesPoint[];
  ariaLabel: string;
  formatValue: (value: number) => string;
  axisStart: string;
  axisEnd: string;
  noData: string;
  locale: "fr" | "ar";
  useCompact?: boolean;
}) {
  if (series.length === 0) {
    return (
      <article className="rounded-[var(--radius-2xl)] border border-border bg-card p-6">
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="mt-4 text-sm text-ink-3">{noData}</p>
      </article>
    );
  }

  const values = series.map((p) => p.value);
  const total = values.reduce((acc, v) => acc + v, 0);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <article className="flex flex-col gap-5 rounded-[var(--radius-2xl)] border border-border bg-card p-6">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-[12px] tabular text-ink-3">
          {useCompact ? formatPrice(total, locale) : formatValue(total)}
        </p>
      </header>
      <SparklineChart values={values} ariaLabel={ariaLabel} />
      <footer className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-ink-3">
        <span>{axisStart}</span>
        <span className="font-mono tabular text-ink-2">
          {useCompact
            ? `${formatCompact(min, locale)} → ${formatCompact(max, locale)}`
            : `${formatNumber(min, locale)} → ${formatNumber(max, locale)}`}
        </span>
        <span>{axisEnd}</span>
      </footer>
    </article>
  );
}

/**
 * Minimal SVG line chart. No grid noise, no gradient fill, single accent
 * color used for the trace + last-point marker. Designed to feel like a
 * printed magazine stats page rather than a SaaS dashboard.
 */
function SparklineChart({ values, ariaLabel }: { values: number[]; ariaLabel: string }) {
  const w = 480;
  const h = 140;
  const padX = 8;
  const padY = 10;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = (w - padX * 2) / Math.max(1, values.length - 1);

  const toY = (v: number) =>
    padY + (1 - (v - min) / range) * (h - padY * 2);

  const path = values
    .map((v, i) => {
      const x = padX + i * stepX;
      const y = toY(v);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastIdx = values.length - 1;
  const lastX = padX + lastIdx * stepX;
  const lastY = toY(values[lastIdx]);

  // Baseline = the "min" axis. Quarter line at the median for a print-y feel.
  const baselineY = h - padY;
  const medianY = padY + (h - padY * 2) / 2;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className="h-32 w-full"
      preserveAspectRatio="none"
    >
      {/* Two hairline reference lines — baseline + median. No full grid. */}
      <line
        x1={padX}
        x2={w - padX}
        y1={baselineY}
        y2={baselineY}
        stroke="var(--border)"
        strokeWidth="0.6"
      />
      <line
        x1={padX}
        x2={w - padX}
        y1={medianY}
        y2={medianY}
        stroke="var(--border)"
        strokeDasharray="2 4"
        strokeWidth="0.6"
      />

      {/* Vertical tick marks at first / last points (anchors only) */}
      <line
        x1={padX}
        x2={padX}
        y1={baselineY - 4}
        y2={baselineY}
        stroke="var(--border)"
        strokeWidth="0.6"
      />
      <line
        x1={w - padX}
        x2={w - padX}
        y1={baselineY - 4}
        y2={baselineY}
        stroke="var(--border)"
        strokeWidth="0.6"
      />

      {/* The trace */}
      <path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Last-point marker */}
      <circle
        cx={lastX}
        cy={lastY}
        r="3"
        fill="var(--background)"
        stroke="var(--accent)"
        strokeWidth="1.6"
      />
    </svg>
  );
}
