"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Info } from "lucide-react";

/** Commission model — same piecewise curve as before */
const FREE_THRESHOLD = 10_000;
const CAP_THRESHOLD = 200_000;
const MAX_RATE = 0.15;
const SLIDER_MAX = 300_000;
const SLIDER_STEP = 1_000;
const INITIAL_REVENUE = 45_000;

function commissionRate(revenue: number) {
  if (revenue <= FREE_THRESHOLD) return 0;
  if (revenue >= CAP_THRESHOLD) return MAX_RATE;
  return (
    ((revenue - FREE_THRESHOLD) / (CAP_THRESHOLD - FREE_THRESHOLD)) * MAX_RATE
  );
}

const fmtDZD = new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 });
const fmtPct = new Intl.NumberFormat("fr-DZ", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const CABINET = "var(--font-cabinet), system-ui, sans-serif";

export function CommissionCalculator() {
  const [revenue, setRevenue] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });

  // On first scroll-enter, animate slider 0 → INITIAL_REVENUE over 800ms
  useEffect(() => {
    if (!inView || userInteracted) return;
    const controls = animate(0, INITIAL_REVENUE, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setRevenue(Math.round(v / SLIDER_STEP) * SLIDER_STEP),
    });
    return () => controls.stop();
  }, [inView, userInteracted]);

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
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="calc-title"
      className="relative isolate px-3 pt-16 sm:px-4 sm:pt-20 md:pt-28"
    >
      <div className="container-standard">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl px-2 text-center sm:px-6"
        >
          <h2
            id="calc-title"
            style={{ fontFamily: CABINET }}
            className="text-[32px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[40px] md:text-[44px]"
          >
            Voyez{" "}
            <span className="relative inline-block">
              <span className="relative z-10">combien vous gardez</span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: "0% 50%" }}
                className="absolute inset-x-0 bottom-1 -z-0 h-[10px] bg-[#F0A014]/40 md:h-[14px]"
              />
            </span>
            , au dinar près.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-ink-2 sm:text-[16.5px]">
            Faites glisser. Notre commission dépend de vos revenus mensuels,
            jamais l'inverse — et démarre à zéro jusqu'à 10 000 DZD.
          </p>
        </motion.div>

        {/* Layered card — cream shell + inset white card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mx-auto mt-12 max-w-[780px] sm:mt-16"
        >
          <div className="relative overflow-hidden rounded-[3.5rem] bg-[#F7F7F5] p-6 shadow-[0_30px_60px_-30px_rgba(240,160,20,0.28),0_10px_20px_-12px_rgba(10,11,14,0.06)]">
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 sm:p-8 md:p-10">
              {/* Header */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/6 pb-5 sm:pb-6">
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-3 sm:text-[12.5px]">
                    Vos revenus mensuels bruts
                  </span>
                  <p className="mt-1.5 flex items-baseline gap-1.5">
                    <CountUp
                      value={revenue}
                      format={fmtDZD.format}
                      className="tabular text-[36px] font-extrabold leading-none tracking-[-0.03em] text-ink sm:text-[48px] md:text-[56px]"
                      style={{ fontFamily: CABINET }}
                    />
                    <span className="text-[13px] font-semibold text-ink-3 sm:text-[15px]">
                      DZD
                    </span>
                  </p>
                </div>
                <RateBadge rate={rate} isFree={isFree} isCapped={isCapped} />
              </div>

              {/* Slider */}
              <div className="relative mt-6 sm:mt-8">
                <input
                  type="range"
                  min={0}
                  max={SLIDER_MAX}
                  step={SLIDER_STEP}
                  value={revenue}
                  onChange={(e) => {
                    setUserInteracted(true);
                    setRevenue(Number(e.target.value));
                  }}
                  aria-label="Revenus mensuels"
                  className="darso-range peer relative z-20 block w-full appearance-none bg-transparent"
                  style={{
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

                <div className="mt-1 flex justify-between text-[10.5px] font-semibold tabular text-ink-3 sm:text-[11px]">
                  <span>0 DZD</span>
                  <span>{fmtDZD.format(SLIDER_MAX)} DZD</span>
                </div>
              </div>

              {/* 3-stat grid */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <Stat
                  label="Commission Darso"
                  value={commission}
                  unit="DZD"
                  tone="ink"
                  format={fmtDZD.format}
                />
                <Stat
                  label="Taux appliqué"
                  value={rate * 100}
                  unit="%"
                  tone="ink"
                  format={(v) => fmtPct.format(v)}
                />
                <div className="col-span-2 sm:col-span-1">
                  <Stat
                    label="Vous gardez"
                    value={net}
                    unit="DZD"
                    tone="amber"
                    emphasize
                    format={fmtDZD.format}
                  />
                </div>
              </div>

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
        </motion.div>

        {/* Full-width SVG piecewise curve strip below the card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-8 max-w-[780px] px-6"
        >
          <div className="flex items-baseline justify-between text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            <span>Barème progressif</span>
            <span className="tabular">
              Max <span className="text-[#7A4E00]">15 %</span>
            </span>
          </div>
          <div className="relative mt-3">
            <CurveStrip revenue={revenue} />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[10.5px] font-semibold tabular text-ink-3">
            <span>≤ 10k · 0 %</span>
            <span className="text-center">Progressif</span>
            <span className="text-end">≥ 200k · 15 %</span>
          </div>

          {/* Handwritten "← votre zone" annotation on desktop, positioned near the marker */}
          <div
            aria-hidden
            className="pointer-events-none relative mt-1 hidden h-0 md:block"
          >
            <div
              className="absolute -top-24 -rotate-[8deg] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: `calc(${Math.min(100, (revenue / SLIDER_MAX) * 100)}% - 60px)`,
              }}
            >
              <svg viewBox="0 0 120 40" className="h-8 w-24 text-ink">
                <path
                  d="M110 8 Q 70 8, 20 26"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M30 20 L 20 26 L 30 32"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <p
                style={{ fontFamily: CABINET }}
                className="mt-0.5 pl-1 text-[12.5px] font-semibold leading-tight text-ink"
              >
                ← votre zone
              </p>
            </div>
          </div>
        </motion.div>
      </div>

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

/* --------- Live-color rate badge --------- */

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

  // Dynamic background: neutral → amber-tint → amber-saturated
  const bg = isFree
    ? "#F5F5F2"
    : isCapped
      ? "#F0A014"
      : `rgba(240, 160, 20, ${0.08 + (rate / MAX_RATE) * 0.35})`;
  const text = isCapped ? "#FFF" : isFree ? "var(--color-ink-2)" : "#7A4E00";
  const dotBg = isFree ? "var(--color-success)" : isCapped ? "#FFF" : "#F0A014";

  return (
    <motion.div
      animate={{ backgroundColor: bg, color: text }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
    >
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${isFree ? "live-dot" : ""}`}
        style={{ backgroundColor: dotBg }}
      />
      <div className="text-left">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] opacity-80">
          {label}
        </p>
        <p
          style={{ fontFamily: CABINET }}
          className="text-[15px] font-bold tabular sm:text-[16px]"
        >
          {fmtPct.format(rate * 100)} %
        </p>
      </div>
    </motion.div>
  );
}

/* --------- Tick + Stat + CountUp + CurveStrip --------- */

function Tick({ position, label }: { position: number; label: string }) {
  return (
    <div
      className="absolute -top-0.5 flex -translate-x-1/2 flex-col items-center gap-1"
      style={{ left: `${position}%` }}
    >
      <span aria-hidden className="h-2 w-0.5 rounded-full bg-ink/40" />
      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3">
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
  format,
}: {
  label: string;
  value: number;
  unit?: string;
  tone: "ink" | "amber";
  emphasize?: boolean;
  format: (n: number) => string;
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
      <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-3">
        {label}
      </span>
      <span className="mt-2 flex items-baseline gap-1.5">
        <CountUp
          value={value}
          format={format}
          style={{ fontFamily: CABINET }}
          className={`font-extrabold leading-none tracking-[-0.02em] tabular ${
            emphasize
              ? "text-[26px] sm:text-[34px] md:text-[38px]"
              : "text-[20px] sm:text-[24px] md:text-[26px]"
          } ${isAmber ? "text-[#7A4E00]" : "text-ink"}`}
        />
        {unit && (
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

/**
 * Smoothly transitions the displayed number when `value` changes.
 * Uses framer-motion's motionValue + spring transform.
 */
function CountUp({
  value,
  format,
  className,
  style,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const mv = useMotionValue(value);
  const rendered = useTransform(mv, (v) => format(v));

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, mv]);

  return (
    <motion.span className={className} style={style}>
      {rendered}
    </motion.span>
  );
}

/** SVG piecewise curve strip — dashed path, filled amber circle marker */
function CurveStrip({ revenue }: { revenue: number }) {
  const markerPct = Math.min(100, (revenue / SLIDER_MAX) * 100);
  const p1 = (FREE_THRESHOLD / SLIDER_MAX) * 300;
  const p2 = (CAP_THRESHOLD / SLIDER_MAX) * 300;
  const bottomY = 34;
  const topY = 6;
  const path = `M0 ${bottomY} L ${p1} ${bottomY} L ${p2} ${topY} L 300 ${topY}`;

  return (
    <div className="relative h-16">
      <svg
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* Fill under curve */}
        <path
          d={`M0 ${bottomY} L ${p1} ${bottomY} L ${p2} ${topY} L 300 ${topY} L 300 40 L 0 40 Z`}
          fill="rgba(240, 160, 20, 0.10)"
        />
        {/* Dashed curve line, ink-3 color */}
        <path
          d={path}
          fill="none"
          stroke="var(--color-ink-3)"
          strokeWidth="1.6"
          strokeDasharray="4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* You-are-here filled amber circle marker */}
      <motion.div
        className="pointer-events-none absolute top-0 h-full"
        animate={{ left: `${markerPct}%` }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ left: `${markerPct}%` }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2">
          <div className="h-4 w-4 rounded-full border-2 border-white bg-[#F0A014] shadow-[0_0_0_3px_rgba(240,160,20,0.35)]" />
        </div>
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#F0A014]/40" />
      </motion.div>
    </div>
  );
}
