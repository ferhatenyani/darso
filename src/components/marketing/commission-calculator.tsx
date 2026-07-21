"use client";

import { useMemo, useState } from "react";
import { Info, TrendingUp } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";

/** ---------- Commission model ----------
 * 0 DZD              → 0 %
 * ≤ 10 000 DZD       → 0 %      ("zéro commission")
 * 10 000 → 200 000   → gradual, linearly from 0 % to 15 %
 * ≥ 200 000 DZD      → 15 %     (cap)
 *
 * The rate applies to total monthly revenue, not to the bracket excess —
 * simpler to communicate on a marketing page and matches the inspo model.
 */
const FREE_THRESHOLD = 10_000;
const CAP_THRESHOLD = 200_000;
const MAX_RATE = 0.15;
const SLIDER_MAX = 300_000;
const SLIDER_STEP = 1_000;

function commissionRate(revenue: number) {
  if (revenue <= FREE_THRESHOLD) return 0;
  if (revenue >= CAP_THRESHOLD) return MAX_RATE;
  return (
    ((revenue - FREE_THRESHOLD) / (CAP_THRESHOLD - FREE_THRESHOLD)) * MAX_RATE
  );
}

const fmtDZD = new Intl.NumberFormat("fr-DZ", {
  maximumFractionDigits: 0,
});

const fmtPct = new Intl.NumberFormat("fr-DZ", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function CommissionCalculator() {
  const [revenue, setRevenue] = useState(45_000);

  const { rate, commission, net, isFree, isCapped } = useMemo(() => {
    const r = commissionRate(revenue);
    const c = Math.round(revenue * r);
    return {
      rate: r,
      commission: c,
      net: revenue - c,
      isFree: revenue <= FREE_THRESHOLD,
      isCapped: revenue >= CAP_THRESHOLD,
    };
  }, [revenue]);

  const sliderPct = (revenue / SLIDER_MAX) * 100;
  const freeMark = (FREE_THRESHOLD / SLIDER_MAX) * 100;
  const capMark = (CAP_THRESHOLD / SLIDER_MAX) * 100;

  return (
    <section
      aria-labelledby="calc-title"
      className="relative isolate px-3 pt-8 sm:px-4 sm:pt-12 md:pt-16"
    >
      <div className="container-standard">
        <Reveal direction="up">
          <div className="mx-auto max-w-2xl px-2 text-center sm:px-6">
            <h2
              id="calc-title"
              style={{
                fontFamily: "var(--font-cabinet), system-ui, sans-serif",
              }}
              className="text-[32px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[42px] md:text-[52px] lg:text-[58px]"
            >
              Ce que{" "}
              <span className="relative inline-block">
                <span className="relative z-10">vous gardez</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-0 h-[10px] origin-left bg-[#F0A014]/40 md:h-[14px]"
                />
              </span>
              , au dinar près.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-ink-2 sm:text-[16.5px]">
              Faites glisser. Notre commission dépend de vos revenus mensuels,
              jamais l'inverse — et démarre à zéro jusqu'à 10 000 DZD.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} direction="up">
          <div className="relative mx-auto mt-10 max-w-3xl sm:mt-14">
            {/* Outer cream shell */}
            <div className="relative overflow-hidden rounded-[2rem] bg-[#F7F1E5] p-2 shadow-[0_30px_60px_-30px_rgba(240,160,20,0.35),0_10px_20px_-12px_rgba(10,11,14,0.06)] sm:rounded-[2.5rem] sm:p-3 md:rounded-[3rem]">
              {/* Inner white card */}
              <div className="relative overflow-hidden rounded-[1.6rem] bg-white p-5 sm:rounded-[2rem] sm:p-8 md:p-10">
                {/* Header */}
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/6 pb-4 sm:pb-6">
                  <div>
                    <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-2 sm:text-[12.5px]">
                      Vos revenus mensuels bruts
                    </span>
                    <p className="mt-1.5 flex items-baseline gap-1.5">
                      <span
                        style={{
                          fontFamily:
                            "var(--font-cabinet), system-ui, sans-serif",
                        }}
                        className="text-[36px] font-extrabold leading-none tracking-[-0.03em] text-ink tabular sm:text-[48px] md:text-[56px]"
                      >
                        {fmtDZD.format(revenue)}
                      </span>
                      <span className="text-[13px] font-semibold text-ink-3 sm:text-[15px]">
                        DZD
                      </span>
                    </p>
                  </div>
                  <RateBadge
                    rate={rate}
                    isFree={isFree}
                    isCapped={isCapped}
                  />
                </div>

                {/* Slider */}
                <div className="relative mt-6 sm:mt-8">
                  <input
                    type="range"
                    min={0}
                    max={SLIDER_MAX}
                    step={SLIDER_STEP}
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    aria-label="Revenus mensuels"
                    className="darso-range peer relative z-20 block w-full appearance-none bg-transparent"
                    style={{
                      // Live gradient fill matches the thumb position
                      background: `linear-gradient(to right,
                        #F0A014 0%,
                        #F0A014 ${sliderPct}%,
                        #E9E4D7 ${sliderPct}%,
                        #E9E4D7 100%)`,
                      backgroundClip: "content-box",
                      padding: "8px 0",
                    }}
                  />

                  {/* Tick marks */}
                  <div className="pointer-events-none relative mt-2 h-4">
                    <Tick position={freeMark} label="Seuil zéro" />
                    <Tick position={capMark} label="Plafond 15 %" />
                  </div>

                  {/* Scale end labels */}
                  <div className="mt-1 flex justify-between text-[10px] font-semibold tabular text-ink-3 sm:text-[11px]">
                    <span>0 DZD</span>
                    <span>{fmtDZD.format(SLIDER_MAX)} DZD</span>
                  </div>
                </div>

                {/* Breakdown grid */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  <Stat
                    label="Commission Darso"
                    value={fmtDZD.format(commission)}
                    unit="DZD"
                    tone="ink"
                    highlight={commission === 0}
                    highlightLabel="Gratuit"
                  />
                  <Stat
                    label="Taux appliqué"
                    value={`${fmtPct.format(rate * 100)} %`}
                    tone="ink"
                  />
                  <div className="col-span-2 sm:col-span-1">
                    <Stat
                      label="Vous gardez"
                      value={fmtDZD.format(net)}
                      unit="DZD"
                      tone="amber"
                      emphasize
                    />
                  </div>
                </div>

                {/* Rate curve visualization */}
                <div className="mt-8 rounded-2xl bg-ink/[0.03] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                    <span className="inline-flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.2} />
                      Barème de commission
                    </span>
                    <span className="tabular text-ink-2">
                      Max <span className="text-[#7A4E00]">15 %</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <CurveStrip revenue={revenue} />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] font-semibold text-ink-3 sm:text-[11px]">
                    <span>≤ 10k · 0 %</span>
                    <span className="text-center">Progressif</span>
                    <span className="text-end">≥ 200k · 15 %</span>
                  </div>
                </div>

                {/* Footnote */}
                <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed text-ink-3 sm:text-[12.5px]">
                  <Info
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  Zéro commission jusqu'à 10 000 DZD de revenus mensuels
                  cumulés. Ensuite, notre part augmente doucement — jamais au-delà de 15 %.
                </p>
              </div>
            </div>

            {/* Handwritten annotation on desktop */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-14 left-6 hidden -rotate-[8deg] md:block"
            >
              <svg viewBox="0 0 130 60" className="h-14 w-32 text-ink">
                <path
                  d="M8 40 C 20 8, 60 8, 116 22"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M106 14 L 116 22 L 106 30"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <p
                style={{
                  fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                }}
                className="mt-1 max-w-[180px] text-[13px] font-semibold leading-tight text-ink"
              >
                Faites glisser pour voir votre part.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Custom range thumb / track — scoped via a stable class */}
      <style jsx global>{`
        input.darso-range {
          --thumb-size: 26px;
          --track-height: 8px;
          height: calc(var(--thumb-size) + 16px);
          cursor: pointer;
        }
        input.darso-range::-webkit-slider-runnable-track {
          height: var(--track-height);
          border-radius: 999px;
          background: transparent;
        }
        input.darso-range::-moz-range-track {
          height: var(--track-height);
          border-radius: 999px;
          background: transparent;
        }
        input.darso-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 999px;
          background: #0a0b0e;
          border: 4px solid #f0a014;
          box-shadow:
            0 6px 18px -8px rgba(240, 160, 20, 0.65),
            0 0 0 6px rgba(240, 160, 20, 0.14);
          transform: translateY(calc((var(--thumb-size) - var(--track-height)) / -2));
          transition:
            transform 180ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        input.darso-range::-webkit-slider-thumb:hover,
        input.darso-range:focus-visible::-webkit-slider-thumb {
          transform:
            translateY(calc((var(--thumb-size) - var(--track-height)) / -2))
            scale(1.06);
          box-shadow:
            0 10px 24px -8px rgba(240, 160, 20, 0.7),
            0 0 0 8px rgba(240, 160, 20, 0.18);
        }
        input.darso-range::-moz-range-thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 999px;
          background: #0a0b0e;
          border: 4px solid #f0a014;
          box-shadow:
            0 6px 18px -8px rgba(240, 160, 20, 0.65),
            0 0 0 6px rgba(240, 160, 20, 0.14);
          cursor: pointer;
        }
        input.darso-range:focus {
          outline: none;
        }
      `}</style>
    </section>
  );
}

function RateBadge({
  rate,
  isFree,
  isCapped,
}: {
  rate: number;
  isFree: boolean;
  isCapped: boolean;
}) {
  const label = isFree
    ? "Zéro commission"
    : isCapped
      ? "Plafond atteint"
      : "Commission progressive";
  const dot = isFree ? "bg-success" : isCapped ? "bg-ink" : "bg-[#F0A014]";
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${dot} ${isFree ? "live-dot" : ""}`}
      />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-3">
          {label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-cabinet), system-ui, sans-serif",
          }}
          className="text-[15px] font-bold tabular text-ink sm:text-[16px]"
        >
          {fmtPct.format(rate * 100)} %
        </p>
      </div>
    </div>
  );
}

function Tick({ position, label }: { position: number; label: string }) {
  return (
    <div
      className="absolute -top-0.5 flex -translate-x-1/2 flex-col items-center gap-1"
      style={{ left: `${position}%` }}
    >
      <span
        aria-hidden
        className="h-2 w-0.5 rounded-full bg-ink/40"
      />
      <span className="whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-3 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  tone,
  emphasize = false,
  highlight = false,
  highlightLabel,
}: {
  label: string;
  value: string;
  unit?: string;
  tone: "ink" | "amber";
  emphasize?: boolean;
  highlight?: boolean;
  highlightLabel?: string;
}) {
  const isAmber = tone === "amber";
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
        isAmber
          ? "border-[#F0A014]/30 bg-[#FEF7E5]"
          : "border-ink/8 bg-ink/[0.02]"
      } ${emphasize ? "sm:scale-[1.02]" : ""}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-3">
        {label}
      </span>
      <span className="mt-2 flex items-baseline gap-1.5">
        {highlight && highlightLabel ? (
          <span
            style={{
              fontFamily: "var(--font-cabinet), system-ui, sans-serif",
            }}
            className={`text-[22px] font-extrabold leading-none tracking-[-0.02em] sm:text-[26px] ${isAmber ? "text-[#7A4E00]" : "text-success"}`}
          >
            {highlightLabel}
          </span>
        ) : (
          <span
            style={{
              fontFamily: "var(--font-cabinet), system-ui, sans-serif",
            }}
            className={`font-extrabold leading-none tracking-[-0.02em] tabular ${
              emphasize
                ? "text-[26px] sm:text-[34px] md:text-[38px]"
                : "text-[20px] sm:text-[24px] md:text-[26px]"
            } ${isAmber ? "text-[#7A4E00]" : "text-ink"}`}
          >
            {value}
          </span>
        )}
        {unit && !highlight && (
          <span
            className={`text-[11px] font-semibold ${isAmber ? "text-[#7A4E00]/70" : "text-ink-3"}`}
          >
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

function CurveStrip({ revenue }: { revenue: number }) {
  const markerPct = Math.min(100, (revenue / SLIDER_MAX) * 100);
  // We render a small SVG curve that mirrors the piecewise commission function.
  // 0 → 10k : flat at bottom | 10k → 200k : ramp up | 200k → 300k : flat at top.
  // Mapped into 0…300 x-domain and 0…40 y-domain (inverted).
  const p1 = (FREE_THRESHOLD / SLIDER_MAX) * 300;
  const p2 = (CAP_THRESHOLD / SLIDER_MAX) * 300;
  const bottomY = 34;
  const topY = 6;

  return (
    <div className="relative h-14">
      <svg
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* Fill under curve */}
        <path
          d={`M0 ${bottomY} L ${p1} ${bottomY} L ${p2} ${topY} L 300 ${topY} L 300 40 L 0 40 Z`}
          fill="rgba(240, 160, 20, 0.18)"
        />
        {/* Curve line */}
        <path
          d={`M0 ${bottomY} L ${p1} ${bottomY} L ${p2} ${topY} L 300 ${topY}`}
          fill="none"
          stroke="#F0A014"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* You-are-here marker */}
      <div
        className="pointer-events-none absolute top-0 h-full"
        style={{ left: `${markerPct}%` }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2">
          <div className="h-3 w-3 rounded-full border-2 border-white bg-ink shadow-[0_0_0_3px_rgba(240,160,20,0.6)]" />
        </div>
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/40" />
      </div>
    </div>
  );
}
