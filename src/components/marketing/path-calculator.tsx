"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/**
 * Payout ledger — reads like a printed decompte.
 * Paper card with perforated top edge, monospace labels, tabular figures,
 * ruler-slider with bracket ticks (0 / 10k / 50k / 100k / 200k+).
 */

const PAPER = "#F2ECDD";
const INK = "#1B1A17";
const INK_MID = "rgba(27,26,23,0.62)";
const INK_FAINT = "rgba(27,26,23,0.42)";
const HAIRLINE = "rgba(27,26,23,0.14)";
const HAIRLINE_STRONG = "rgba(27,26,23,0.28)";
const NAVY = "#2A3A6B";

const MONO =
  "ui-monospace, 'JetBrains Mono', 'IBM Plex Mono', Menlo, Monaco, Consolas, monospace";
const DISPLAY = "'General Sans', 'Cabinet Grotesk', system-ui, sans-serif";

const FREE_THRESHOLD = 10_000;
const CAP_THRESHOLD = 200_000;
const MAX_RATE = 0.15;
const SLIDER_MAX = 300_000;
const SLIDER_STEP = 1_000;
const INITIAL_REVENUE = 45_000;

const TICKS = [
  { value: 0, label: "0" },
  { value: 10_000, label: "10k" },
  { value: 50_000, label: "50k" },
  { value: 100_000, label: "100k" },
  { value: 200_000, label: "200k+" },
] as const;

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

export function PathCalculator() {
  const [revenue, setRevenue] = useState(INITIAL_REVENUE);

  const { rate, commission, net } = useMemo(() => {
    const r = commissionRate(revenue);
    const c = Math.round(revenue * r);
    return { rate: r, commission: c, net: revenue - c };
  }, [revenue]);

  return (
    <div
      className="relative select-none"
      style={{ filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.35))" }}
    >
      {/* Card with perforated top edge */}
      <div
        style={{
          backgroundColor: PAPER,
          // Scalloped top edge: repeating half-circles cut into the top
          WebkitMaskImage: `radial-gradient(circle 5px at 50% 0, transparent 4.5px, black 5px), linear-gradient(black, black)`,
          WebkitMaskSize: `16px 10px, 100% calc(100% - 5px)`,
          WebkitMaskPosition: `0 0, 0 5px`,
          WebkitMaskRepeat: `repeat-x, no-repeat`,
          maskImage: `radial-gradient(circle 5px at 50% 0, transparent 4.5px, black 5px), linear-gradient(black, black)`,
          maskSize: `16px 10px, 100% calc(100% - 5px)`,
          maskPosition: `0 0, 0 5px`,
          maskRepeat: `repeat-x, no-repeat`,
        }}
        className="pt-4"
      >
        {/* Header */}
        <div
          className="flex items-baseline justify-between px-5 pt-3"
          style={{ fontFamily: MONO }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: INK_MID }}
          >
            Décompte
          </p>
          <p
            className="text-[10px] font-medium tabular-nums"
            style={{ color: INK_FAINT }}
          >
            Nov · 2026 · DZ
          </p>
        </div>

        {/* Dotted separator */}
        <div
          aria-hidden
          className="mx-5 mt-3"
          style={{
            height: "1px",
            backgroundImage: `radial-gradient(circle 0.6px, ${HAIRLINE_STRONG} 100%, transparent 100%)`,
            backgroundSize: "5px 1px",
            backgroundRepeat: "repeat-x",
          }}
        />

        {/* Row: Revenus */}
        <LedgerRow
          label="Revenus bruts"
          value={
            <>
              <CountUp value={revenue} format={fmtDZD.format} />
              <span style={{ color: INK_FAINT }}> DZD</span>
            </>
          }
          labelColor={INK}
          valueColor={INK}
        />

        {/* Row: Commission */}
        <LedgerRow
          label={
            <>
              Commission Darso
              <span
                style={{ color: INK_MID }}
                className="ml-2 tabular-nums"
              >
                (<CountUp value={rate * 100} format={fmtPct.format} /> %)
              </span>
            </>
          }
          value={
            <>
              {"− "}
              <CountUp value={commission} format={fmtDZD.format} />
              <span style={{ color: INK_FAINT }}> DZD</span>
            </>
          }
          labelColor={INK_MID}
          valueColor={INK_MID}
        />

        {/* Double hairline before total (ledger convention) */}
        <div className="mx-5 mt-4 pb-[1px]">
          <div style={{ borderTop: `1px solid ${HAIRLINE_STRONG}` }} />
          <div
            className="mt-[2px]"
            style={{ borderTop: `1px solid ${HAIRLINE_STRONG}` }}
          />
        </div>

        {/* Total: Vous gardez */}
        <div className="flex items-end justify-between px-5 pt-3.5">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: INK, fontFamily: MONO }}
          >
            Vous gardez
          </p>
          <p
            className="text-right tabular-nums"
            style={{
              fontFamily: DISPLAY,
              color: NAVY,
              fontSize: "clamp(28px, 3.2vw, 40px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            <CountUp value={net} format={fmtDZD.format} />
            <span
              className="ml-2 text-[13px] font-semibold"
              style={{ color: INK_MID, fontFamily: MONO }}
            >
              DZD
            </span>
          </p>
        </div>

        {/* Ruler-slider */}
        <div className="px-5 pb-4 pt-6">
          <RulerSlider revenue={revenue} onChange={setRevenue} />
        </div>

        {/* Footer note with payout indicator */}
        <div
          className="flex items-center justify-between px-5 pb-4 pt-3"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: NAVY }}
            />
            <p
              className="text-[9.5px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: INK_MID, fontFamily: MONO }}
            >
              Viré sous 48 h
            </p>
          </div>
          <p
            className="text-[9.5px] font-medium uppercase tracking-[0.14em]"
            style={{ color: INK_FAINT, fontFamily: MONO }}
          >
            #DARSO-{Math.max(1, Math.floor(revenue / 1000))
              .toString()
              .padStart(4, "0")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Row                                                                 */
/* ------------------------------------------------------------------ */

function LedgerRow({
  label,
  value,
  labelColor,
  valueColor,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  labelColor: string;
  valueColor: string;
}) {
  return (
    <div className="flex items-baseline justify-between px-5 pt-3">
      <p
        className="text-[11.5px] font-medium"
        style={{ color: labelColor, fontFamily: MONO }}
      >
        {label}
      </p>
      <p
        className="text-[14px] font-semibold tabular-nums"
        style={{ color: valueColor, fontFamily: MONO }}
      >
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ruler-slider                                                        */
/* ------------------------------------------------------------------ */

function RulerSlider({
  revenue,
  onChange,
}: {
  revenue: number;
  onChange: (v: number) => void;
}) {
  const pct = (revenue / SLIDER_MAX) * 100;

  return (
    <div className="relative">
      {/* Rail zone (input overlay + visual) */}
      <div className="relative h-4">
        {/* Base rail line */}
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{ backgroundColor: HAIRLINE_STRONG }}
        />

        {/* Tick marks */}
        {TICKS.map((t) => {
          const left = (t.value / SLIDER_MAX) * 100;
          const isMajor = t.value === 0 || t.value === 200_000;
          return (
            <div
              key={t.value}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${left}%`,
                height: isMajor ? 10 : 7,
                width: 1,
                backgroundColor: INK,
                opacity: isMajor ? 1 : 0.75,
              }}
            />
          );
        })}

        {/* Handle */}
        <motion.div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pct}%` }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="h-3.5 w-3.5 rounded-full"
            style={{
              backgroundColor: INK,
              boxShadow: `0 0 0 3px ${PAPER}, 0 0 0 4px ${INK}`,
            }}
          />
        </motion.div>

        {/* Range input overlay (invisible, capture input) */}
        <input
          type="range"
          min={0}
          max={SLIDER_MAX}
          step={SLIDER_STEP}
          value={revenue}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Revenus mensuels"
          className="path-ledger-range absolute inset-x-0 -inset-y-2 z-10 w-full cursor-pointer opacity-0"
        />
      </div>

      {/* Tick labels */}
      <div className="relative mt-3 h-3">
        {TICKS.map((t, i) => {
          const left = (t.value / SLIDER_MAX) * 100;
          const transform =
            i === 0
              ? "translateX(0)"
              : i === TICKS.length - 1
                ? "translateX(-100%)"
                : "translateX(-50%)";
          return (
            <span
              key={t.value}
              className="absolute top-0 text-[9.5px] font-semibold tracking-wide tabular-nums"
              style={{
                left: `${left}%`,
                transform,
                color: INK_MID,
                fontFamily: MONO,
              }}
            >
              {t.label}
            </span>
          );
        })}
      </div>

      <style jsx global>{`
        input.path-ledger-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 32px;
          height: 32px;
          background: transparent;
          cursor: pointer;
        }
        input.path-ledger-range::-moz-range-thumb {
          width: 32px;
          height: 32px;
          background: transparent;
          border: 0;
          cursor: pointer;
        }
        input.path-ledger-range:focus {
          outline: none;
        }
        input.path-ledger-range:focus-visible + * {
          outline: 2px solid ${NAVY};
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — animated number                                           */
/* ------------------------------------------------------------------ */

function CountUp({
  value,
  format,
}: {
  value: number;
  format: (n: number) => string;
}) {
  const mv = useMotionValue(value);
  const rendered = useTransform(mv, (v) => format(v));

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, mv]);

  return <motion.span>{rendered}</motion.span>;
}
