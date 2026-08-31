"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { PathCalculator } from "./path-calculator";

const DISPLAY = "'General Sans', 'Cabinet Grotesk', system-ui, sans-serif";

/* ------------------------------------------------------------------ */
/* Locked palette                                                      */
/* ------------------------------------------------------------------ */

const TEXT = "#1B1A17";
const PAPER = "#F2ECDD"; // student inner panel
const PRIMARY = "#C5F82A"; // lime
const SECONDARY = "#2A2620"; // warm charcoal (prof inner panel)
const ACCENT = "#2A3A6B"; // navy
const WHITE = "#FFFFFF";
const CREAM = "#EDEEE6";

type TabKey = "student" | "teacher";
type Direction = "from-left" | "from-right";

export type PathVariant = "tinted" | "mirror" | "drench";
type ShapeKind = "scoop" | "arch" | "wedge";

/* ------------------------------------------------------------------ */
/* Variant table                                                       */
/* ------------------------------------------------------------------ */

const VARIANTS: Record<
  PathVariant,
  {
    surroundStudent: string;
    surroundTeacher: string;
    shape: ShapeKind;
    /** Ink color for compare-label chip against surround */
    chipInkStudent: string;
    chipBgStudent: string;
    chipInkTeacher: string;
    chipBgTeacher: string;
  }
> = {
  tinted: {
    surroundStudent: "#E4E7EE", // navy-tinted neutral
    surroundTeacher: "#EDE8CB", // lime-tinted neutral
    shape: "scoop",
    chipInkStudent: TEXT,
    chipBgStudent: "rgba(27,26,23,0.08)",
    chipInkTeacher: TEXT,
    chipBgTeacher: "rgba(27,26,23,0.08)",
  },
  mirror: {
    surroundStudent: "#1B1A17", // dark around paper panel
    surroundTeacher: CREAM, // cream around dark panel
    shape: "arch",
    chipInkStudent: "#F2ECDD",
    chipBgStudent: "rgba(255,255,255,0.10)",
    chipInkTeacher: TEXT,
    chipBgTeacher: "rgba(27,26,23,0.08)",
  },
  drench: {
    surroundStudent: ACCENT, // navy drench
    surroundTeacher: PRIMARY, // lime drench
    shape: "wedge",
    chipInkStudent: WHITE,
    chipBgStudent: "rgba(255,255,255,0.14)",
    chipInkTeacher: TEXT,
    chipBgTeacher: "rgba(27,26,23,0.12)",
  },
};

/* ------------------------------------------------------------------ */
/* Motion tokens                                                       */
/* ------------------------------------------------------------------ */

const JITTER_EASE = [0.117, 1, 0.849, 1] as const;
const WIPE_DURATION = 0.5;

/* ------------------------------------------------------------------ */
/* PathSection                                                         */
/* ------------------------------------------------------------------ */

export function PathSection({
  variant = "tinted",
  label,
  magnet = true,
}: {
  variant?: PathVariant;
  /** Optional comparison label shown as a chip in the top-right of the surround */
  label?: string;
  /** Auto-scroll magnet (session-once). Disable in comparison mode. */
  magnet?: boolean;
}) {
  const [active, setActive] = useState<TabKey>("student");
  const [direction, setDirection] = useState<Direction>("from-left");
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  const v = VARIANTS[variant];
  const surround =
    active === "student" ? v.surroundStudent : v.surroundTeacher;
  const chipInk =
    active === "student" ? v.chipInkStudent : v.chipInkTeacher;
  const chipBg = active === "student" ? v.chipBgStudent : v.chipBgTeacher;

  // Auto-scroll magnet — once per session
  useEffect(() => {
    if (!magnet || reduce) return;
    const KEY = `path-section-magnet-fired-${variant}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !sessionStorage.getItem(KEY)) {
            sessionStorage.setItem(KEY, "1");
            setTimeout(() => {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 120);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce, magnet, variant]);

  const handleTab = (next: TabKey) => {
    if (next === active) return;
    setDirection(next === "student" ? "from-left" : "from-right");
    setActive(next);
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby={`path-title-${variant}`}
      style={{
        backgroundColor: surround,
        transition: "background-color 320ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className="relative px-4 pb-14 pt-10 sm:px-6 md:pb-16 md:pt-12"
    >
      <h2 id={`path-title-${variant}`} className="sr-only">
        Comment Darso fonctionne pour vous
      </h2>

      {/* Top shape — SVG poking up into the hero/previous section */}
      <div className="pointer-events-none absolute inset-x-0 -top-[71px] h-[72px] overflow-hidden">
        <TopShape kind={v.shape} color={surround} />
      </div>

      {/* Compare-label chip */}
      {label && (
        <div
          className="pointer-events-none absolute right-4 top-3 z-40 sm:right-6 sm:top-4"
          aria-hidden
        >
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em]"
            style={{
              backgroundColor: chipBg,
              color: chipInk,
              transition:
                "background-color 320ms cubic-bezier(0.22, 1, 0.36, 1), color 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {label}
          </span>
        </div>
      )}

      <div className="relative mx-auto max-w-[1160px]">
        <div
          className="relative overflow-hidden rounded-[8px] md:h-[560px] md:min-h-[520px]"
          role="tablist"
          aria-label="Public"
        >
          {/* Tab pill — smaller, tighter */}
          <div className="absolute inset-x-0 top-3 z-30 flex justify-center sm:top-3.5">
            <TabPill
              active={active}
              onChange={handleTab}
              reduce={!!reduce}
              variantId={variant}
            />
          </div>

          <AnimatePresence initial={false} mode="popLayout">
            {active === "student" ? (
              <PanelShell
                key="student"
                direction={direction}
                bg={PAPER}
                reduce={!!reduce}
              >
                <PanelContent
                  theme="paper"
                  invert={false}
                  headline="Trouvez un prof qui vous fait progresser."
                  friction="Sans WhatsApp anonyme, sans avance à l'aveugle, sans mauvaise surprise."
                  beats={[
                    "Vous voyez le prix, l'agenda et les avis avant de réserver.",
                    "Fonds bloqués par Darso, remboursés si la séance n'a pas lieu.",
                  ]}
                  cta={{
                    label: "Explorer les cours",
                    href: routes.browse(),
                  }}
                  trust="Remboursé sous 24 h"
                  mock={<StudentMock />}
                  direction={direction}
                  reduce={!!reduce}
                />
              </PanelShell>
            ) : (
              <PanelShell
                key="teacher"
                direction={direction}
                bg={SECONDARY}
                reduce={!!reduce}
              >
                <PanelContent
                  theme="dark"
                  invert={true}
                  headline="Enseignez. On gère le reste."
                  friction="Sans facturation à la main, sans no-show impuni, sans agence à 30 %."
                  beats={[
                    "Vous fixez le prix, vous choisissez l'agenda.",
                    "Fonds bloqués avant la séance, virés sous 48 h après validation.",
                  ]}
                  cta={{
                    label: "Devenir enseignant",
                    href: routes.teachLanding(),
                  }}
                  trust="Payé sous 48 h"
                  mock={<PathCalculator />}
                  direction={direction}
                  reduce={!!reduce}
                />
              </PanelShell>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Top shape                                                           */
/* ------------------------------------------------------------------ */

function TopShape({ kind, color }: { kind: ShapeKind; color: string }) {
  // 72px shape height; viewBox chosen per shape.
  if (kind === "scoop") {
    return (
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block h-full w-full"
        aria-hidden
      >
        <path
          d="M 0 72 Q 720 -6 1440 72 Z"
          style={{
            fill: color,
            transition: "fill 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
    );
  }

  if (kind === "arch") {
    return (
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block h-full w-full"
        aria-hidden
      >
        <path
          d="M 0 72 L 460 72 C 560 72 620 4 720 4 C 820 4 880 72 980 72 L 1440 72 Z"
          style={{
            fill: color,
            transition: "fill 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
    );
  }

  // wedge — diagonal cut from top-left down to bottom-right
  return (
    <svg
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      className="block h-full w-full"
      aria-hidden
    >
      <path
        d="M 0 72 L 0 0 L 1440 72 Z"
        style={{
          fill: color,
          transition: "fill 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tab pill — compact                                                  */
/* ------------------------------------------------------------------ */

function TabPill({
  active,
  onChange,
  reduce,
  variantId,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  reduce: boolean;
  variantId: string;
}) {
  return (
    <div
      style={{ backgroundColor: SECONDARY }}
      className="inline-flex items-center gap-0.5 rounded-[10px] p-[3px] shadow-[0_6px_18px_-8px_rgba(10,11,14,0.5)]"
    >
      <TabPillButton
        label="Élève"
        isActive={active === "student"}
        onClick={() => onChange("student")}
        reduce={reduce}
        layoutId={`tab-pill-active-${variantId}`}
      />
      <TabPillButton
        label="Prof"
        isActive={active === "teacher"}
        onClick={() => onChange("teacher")}
        reduce={reduce}
        layoutId={`tab-pill-active-${variantId}`}
      />
    </div>
  );
}

function TabPillButton({
  label,
  isActive,
  onClick,
  reduce,
  layoutId,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  reduce: boolean;
  layoutId: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className="relative rounded-[7px] px-3 py-[5px] text-[10px] font-bold uppercase tracking-[0.14em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5F82A] focus-visible:ring-offset-1 focus-visible:ring-offset-[#2A2620] sm:px-3.5 sm:py-[5.5px] sm:text-[10.5px]"
    >
      {isActive && (
        <motion.span
          layoutId={layoutId}
          style={{ backgroundColor: PRIMARY }}
          className="absolute inset-0 rounded-[7px]"
          transition={{
            duration: reduce ? 0 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      )}
      <span
        className="relative z-10 transition-colors duration-150"
        style={{ color: isActive ? TEXT : "rgba(255,255,255,0.6)" }}
      >
        {label}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Panel shell — color-wipe reveal                                     */
/* ------------------------------------------------------------------ */

function PanelShell({
  direction,
  bg,
  reduce,
  children,
}: {
  direction: Direction;
  bg: string;
  reduce: boolean;
  children: React.ReactNode;
}) {
  const fromLeft = direction === "from-left";
  const initialClip = reduce
    ? "inset(0 0 0 0)"
    : fromLeft
      ? "inset(0 100% 0 0)"
      : "inset(0 0 0 100%)";
  const exitClip = reduce
    ? "inset(0 0 0 0)"
    : fromLeft
      ? "inset(0 0 0 100%)"
      : "inset(0 100% 0 0)";

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { clipPath: initialClip }}
      animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)" }}
      exit={reduce ? { opacity: 0 } : { clipPath: exitClip }}
      transition={{
        duration: reduce ? 0.15 : WIPE_DURATION,
        ease: JITTER_EASE,
      }}
      style={{
        backgroundColor: bg,
        WebkitClipPath: initialClip,
      }}
      className="absolute inset-0 z-10 rounded-[8px]"
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Peel-up line reveal                                                 */
/* ------------------------------------------------------------------ */

function PeelLine({
  delay,
  reduce,
  className,
  children,
}: {
  delay: number;
  reduce: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`relative inline-block overflow-hidden pb-[0.14em] align-baseline ${className ?? ""}`}
      style={{ verticalAlign: "top" }}
    >
      <motion.span
        className="block will-change-transform"
        initial={reduce ? { opacity: 0 } : { y: "105%" }}
        animate={reduce ? { opacity: 1 } : { y: "0%" }}
        transition={{
          delay: reduce ? 0 : delay,
          duration: reduce ? 0.15 : 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Panel content                                                       */
/* ------------------------------------------------------------------ */

function PanelContent({
  theme,
  invert,
  headline,
  friction,
  beats,
  cta,
  trust,
  mock,
  reduce,
}: {
  theme: "paper" | "dark";
  invert: boolean;
  headline: string;
  friction: string;
  beats: string[];
  cta: { label: string; href: string };
  trust: string;
  mock: React.ReactNode;
  direction: Direction;
  reduce: boolean;
}) {
  const isPaper = theme === "paper";
  const ink = isPaper ? TEXT : "#F2ECDD";
  const inkFaint = isPaper
    ? "rgba(27,26,23,0.6)"
    : "rgba(255,255,255,0.6)";
  const roleTagColor = isPaper
    ? "rgba(27,26,23,0.55)"
    : "rgba(255,255,255,0.55)";
  const bulletBar = isPaper ? TEXT : PRIMARY;

  const textOrder = invert ? "md:order-2" : "md:order-1";
  const mockOrder = invert ? "md:order-1" : "md:order-2";

  return (
    <div className="grid h-full grid-cols-1 items-center gap-5 px-5 pb-8 pt-14 sm:px-7 sm:pb-10 sm:pt-16 md:grid-cols-12 md:gap-8 md:px-10 md:pb-8 md:pt-14 lg:gap-10 lg:px-12">
      {/* Text column */}
      <div className={`md:col-span-7 ${textOrder}`}>
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: roleTagColor }}
        >
          <PeelLine delay={0.1} reduce={reduce}>
            {isPaper ? "Côté élève" : "Côté prof"}
          </PeelLine>
        </p>

        <h3
          style={{
            fontFamily: DISPLAY,
            color: ink,
            fontSize: "clamp(24px, 2.8vw, 40px)",
            lineHeight: 1.04,
            letterSpacing: "-0.028em",
          }}
          className="mt-2.5 text-balance font-bold md:mt-3"
        >
          <PeelLine delay={0.18} reduce={reduce}>
            {headline}
          </PeelLine>
        </h3>

        <p
          style={{ color: inkFaint }}
          className="mt-2.5 max-w-lg text-[13px] leading-relaxed sm:text-[14px] md:mt-3"
        >
          <PeelLine delay={0.26} reduce={reduce}>
            {friction}
          </PeelLine>
        </p>

        <ul className="mt-4 space-y-2.5 md:mt-5 md:space-y-3">
          {beats.map((b, i) => (
            <li
              key={b}
              style={{ color: ink }}
              className="flex gap-3 text-[13px] leading-snug sm:text-[14px]"
            >
              <span
                aria-hidden
                style={{ backgroundColor: bulletBar }}
                className="mt-[0.6em] h-[2px] w-5 shrink-0"
              />
              <span className="max-w-md">
                <PeelLine delay={0.34 + i * 0.08} reduce={reduce}>
                  {b}
                </PeelLine>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-6">
          <PeelLine delay={0.54} reduce={reduce}>
            <PathCTA cta={cta} theme={theme} />
          </PeelLine>
          <span
            className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: inkFaint }}
          >
            <PeelLine delay={0.62} reduce={reduce}>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck
                  className="h-3.5 w-3.5"
                  style={{ color: ACCENT }}
                  strokeWidth={2}
                />
                {trust}
              </span>
            </PeelLine>
          </span>
        </div>
      </div>

      {/* Mock column */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reduce ? 0 : 0.28,
          duration: reduce ? 0.15 : 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`md:col-span-5 ${mockOrder}`}
      >
        {mock}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */

function PathCTA({
  cta,
  theme,
}: {
  cta: { label: string; href: string };
  theme: "paper" | "dark";
}) {
  const isPaper = theme === "paper";
  const btnBg = isPaper ? SECONDARY : PRIMARY;
  const btnInk = isPaper ? WHITE : TEXT;
  const chipBg = isPaper ? PRIMARY : SECONDARY;
  const chipInk = isPaper ? TEXT : PRIMARY;

  return (
    <Link
      href={cta.href}
      style={{ backgroundColor: btnBg, color: btnInk }}
      className="group inline-flex items-center gap-2 rounded-[10px] py-[6px] pl-4 pr-[6px] text-[11.5px] font-bold uppercase tracking-[0.08em] transition-[filter] duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
    >
      {cta.label}
      <span
        aria-hidden
        style={{ backgroundColor: chipBg }}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] transition-transform duration-200 group-hover:translate-x-0.5"
      >
        <ArrowUpRight
          className="h-3.5 w-3.5"
          style={{ color: chipInk }}
          strokeWidth={2.4}
        />
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Student mock                                                        */
/* ------------------------------------------------------------------ */

function StudentMock() {
  return (
    <div
      style={{ backgroundColor: SECONDARY }}
      className="overflow-hidden rounded-[8px] border border-black/[0.06] shadow-[0_18px_44px_-24px_rgba(27,26,23,0.4)]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-2.5">
        <span className="text-[11px] font-medium text-white/50">/browse</span>
        <span className="text-[11px] font-medium tabular-nums text-white/50">
          142 profs · Alger
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-white/[0.08] px-5 py-3">
        {[
          { label: "Matière", value: "Anglais", active: true },
          { label: "Wilaya", value: "Alger", active: false },
          { label: "Budget", value: "≤ 1 500 DA", active: false },
        ].map((f) => (
          <div
            key={f.label}
            style={
              f.active
                ? {
                    borderColor: ACCENT,
                    backgroundColor: "rgba(42,58,107,0.22)",
                  }
                : {}
            }
            className={`inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-1 text-[11px] ${
              f.active ? "" : "border-white/[0.12] bg-white/[0.03]"
            }`}
          >
            <span className="text-white/55">{f.label}</span>
            <span className="font-semibold text-white">{f.value}</span>
          </div>
        ))}
      </div>
      <ul>
        {[
          {
            initial: "A",
            name: "Amina B.",
            meta: "IELTS · 4.9 ★ (32)",
            price: "1 200",
          },
          {
            initial: "K",
            name: "Karim H.",
            meta: "Anglais · 4.8 ★ (18)",
            price: "800",
          },
          {
            initial: "N",
            name: "Nour S.",
            meta: "Prépa bac · 5.0 ★ (7)",
            price: "1 000",
          },
        ].map((t, i) => (
          <li
            key={t.name}
            className={`flex items-center gap-3 px-5 py-2.5 ${i > 0 ? "border-t border-white/[0.08]" : ""}`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[12.5px] font-semibold text-white/85">
              {t.initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-white">
                {t.name}
              </p>
              <p className="truncate text-[11px] text-white/55">{t.meta}</p>
            </div>
            <p className="whitespace-nowrap text-[12.5px] font-semibold tabular-nums text-white">
              {t.price} DA
              <span className="font-normal text-white/50">/h</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
