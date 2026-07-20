"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Compass } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { HeroVideoPlayer } from "./hero-video-player";

/**
 * Home hero — light rounded container with inverted-radius notches.
 * Three notches: TL headline, TR compass, BC (bottom-center) split-pill CTA.
 * The split pill fuses the two primary CTAs (teachers / learners) into one
 * capsule so they read as a "choose your door" moment.
 */
export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate bg-background pt-10 pb-12 md:pt-14 md:pb-20"
    >
      <div className="container-wide">
        <HeroCard />
      </div>
    </section>
  );
}

/* --- design tokens ------------------------------------------------------- */

/** Padding between content and the notch's interior edge (px). */
const NOTCH_PAD = 10;
/** Convex bump radius where each notch meets the container edge (px). */
const TRANSITION_R = 20;
/** Interior rounded corner radius for each notch (px). */
const INNER_R = 34;
/** Outer container corner radius — used for corners without a notch. */
const CORNER_R = 40;
/** Fallback dimensions used before ResizeObserver fires. */
const FALLBACK = {
  tl: { w: 460, h: 220 },
  tr: { w: 60, h: 60 },
  bc: { w: 420, h: 60 },
};

const COMPACT_QUERY = "(max-width: 639.98px)";
const INTRO_MS = 800;
/** Content reveal fires slightly before the container settles for a tighter feel. */
const REVEAL_START_MS = INTRO_MS - 100;
const REVEAL_MS = 520;
const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Initial SSR clip — dimension-agnostic so the first paint isn't a bare rectangle. */
const INITIAL_CLIP = `inset(0 round ${CORNER_R}px)`;

/* --- CTA typewriter ------------------------------------------------------ */

type CTALine = {
  /** Full text; "\n" produces a hard line break (via `whitespace: pre-line`). */
  text: string;
  /** [start, end) character range rendered inside the dark highlight box. */
  highlightRange: [number, number];
  /** Static tree for SSR / reduced-motion / grid sizers — matches `text` 1:1. */
  staticContent: React.ReactNode;
};

const CTA_HIGHLIGHT_CLASS =
  "inline-block bg-foreground px-[0.12em] py-[0.04em] text-[#F2ECDD]";

const CTA_LINES: CTALine[] = [
  {
    text: "Réservez le prof\nqui vous fait\nprogresser.",
    highlightRange: [31, 42],
    staticContent: (
      <>
        {"Réservez le prof\nqui vous fait\n"}
        <span className={CTA_HIGHLIGHT_CLASS}>progresser.</span>
      </>
    ),
  },
  {
    text: "Rejoignez les élèves\nqui ont\nbesoin de vous.",
    highlightRange: [29, 44],
    staticContent: (
      <>
        {"Rejoignez les élèves\nqui ont\n"}
        <span className={CTA_HIGHLIGHT_CLASS}>besoin de vous.</span>
      </>
    ),
  },
];

const TW_TYPE_MS = 35;
const TW_DELETE_MS = 18;
const TW_DWELL_MS = 2000;
const TW_CURSOR_BLINK_MS = 500;
const TW_CURSOR_COLOR = "#EDE6D1";

function commonPrefixLength(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}

function TypewriterCursor({ visible }: { visible: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: "0.55em",
        height: "0.6em",
        marginLeft: "0.05em",
        marginRight: "-0.02em",
        background: TW_CURSOR_COLOR,
        borderRadius: "0.1em",
        // Nudged just under the baseline so the block visually straddles the
        // typing line instead of hovering above the letters' cap-height.
        verticalAlign: "-0.06em",
        opacity: visible ? 1 : 0,
        transition: "opacity 80ms linear",
      }}
    />
  );
}

function renderTypewriterContent({
  line,
  visibleCount,
  cursorVisible,
  showCursor,
}: {
  line: CTALine;
  visibleCount: number;
  cursorVisible: boolean;
  showCursor: boolean;
}) {
  const [hStart, hEnd] = line.highlightRange;
  const clamped = Math.max(0, Math.min(visibleCount, line.text.length));
  const before = line.text.slice(0, Math.min(hStart, clamped));
  const inside = clamped > hStart ? line.text.slice(hStart, Math.min(hEnd, clamped)) : "";
  const cursor = showCursor ? <TypewriterCursor visible={cursorVisible} /> : null;
  if (!inside) {
    return (
      <>
        {before}
        {cursor}
      </>
    );
  }
  return (
    <>
      {before}
      <span className={CTA_HIGHLIGHT_CLASS}>
        {inside}
        {cursor}
      </span>
    </>
  );
}

function HeroCard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const trRef = useRef<HTMLAnchorElement>(null);
  const bcRef = useRef<HTMLDivElement>(null);
  const introDoneRef = useRef(false);

  const [compact, setCompact] = useState(false);
  const [revealed, setRevealed] = useState(false);
  /** Flips true after the last reveal transition finishes; releases inline
   *  transition/transform so per-element hover classes take over. */
  const [revealSettled, setRevealSettled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [twLineIdx, setTwLineIdx] = useState(0);
  const [twVisible, setTwVisible] = useState(CTA_LINES[0].text.length);
  const [twPhase, setTwPhase] = useState<"dwell" | "deleting" | "typing">("dwell");
  const [cursorOn, setCursorOn] = useState(true);

  useLayoutEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const shape = shapeRef.current;
    if (!wrapper || !shape) return;

    const readTargets = () => {
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      if (w === 0 || h === 0) return null;

      const measure = (
        el: HTMLElement | null,
        fallback: { w: number; h: number },
        padX = NOTCH_PAD,
        padY = NOTCH_PAD,
      ) => {
        if (!el || el.offsetHeight === 0) return fallback;
        return {
          w: el.offsetWidth + 2 * padX,
          h: el.offsetHeight + 2 * padY,
        };
      };

      // TL runs with tighter padding — pulls the inner corner arc closer to the text.
      let tl = measure(tlRef.current, FALLBACK.tl, 11, 11);
      const tr = measure(trRef.current, FALLBACK.tr);
      // BC is a mid-edge notch: pill's bottom sits on the container edge,
      // so only the top of the notch needs interior padding (padY = half).
      let bc = measure(bcRef.current, FALLBACK.bc, NOTCH_PAD, NOTCH_PAD / 2);

      // Cap headline notch so it never dominates the container.
      tl = {
        w: Math.min(tl.w, w * (compact ? 0.88 : 0.6)),
        h: Math.min(tl.h, h * (compact ? 0.58 : 0.45)),
      };

      // Cap the bottom-center notch so its base + 2 transition arcs always
      // fit between the outer corners with breathing room.
      const bcMaxW = Math.max(0, w - 2 * (CORNER_R + TRANSITION_R + 12));
      bc = {
        w: Math.min(bc.w, bcMaxW, w * (compact ? 0.86 : 0.55)),
        h: Math.min(bc.h, h * 0.28),
      };

      return { w, h, tl, tr, bc };
    };

    const scale = (n: NotchSize, p: number): NotchSize => ({
      w: Math.max(0, n.w * p),
      h: Math.max(0, n.h * p),
    });

    type Targets = NonNullable<ReturnType<typeof readTargets>>;

    const writePath = (t: Targets, p: number) => {
      const path = buildHeroPath({
        w: t.w,
        h: t.h,
        transitionR: TRANSITION_R,
        cornerR: CORNER_R,
        innerR: INNER_R,
        tl: scale(t.tl, p),
        tr: scale(t.tr, p),
        bc: scale(t.bc, p),
      });
      shape.style.clipPath = `path("${path}")`;
      (shape.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath =
        `path("${path}")`;
    };

    let rafId: number | null = null;
    let revealTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const targets = readTargets();
    if (!targets) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (introDoneRef.current || prefersReduced) {
      writePath(targets, 1);
      if (!introDoneRef.current) {
        introDoneRef.current = true;
        setRevealed(true);
      }
    } else {
      // Seed the first frame at progress 0 so the rounded-rectangle SSR clip
      // and the first path() frame are visually indistinguishable.
      writePath(targets, 0);
      const start = performance.now();
      const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / INTRO_MS);
        writePath(targets, easeOut(t));
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
      // Kick off content reveal slightly before the container settles.
      revealTimer = setTimeout(() => {
        introDoneRef.current = true;
        setRevealed(true);
      }, REVEAL_START_MS);
    }

    const ro = new ResizeObserver(() => {
      if (!introDoneRef.current) return;
      const next = readTargets();
      if (next) writePath(next, 1);
    });
    ro.observe(wrapper);
    [tlRef, trRef, bcRef].forEach((r) => {
      if (r.current) ro.observe(r.current);
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (revealTimer) clearTimeout(revealTimer);
      ro.disconnect();
    };
  }, [compact]);

  useEffect(() => {
    if (!revealed || revealSettled) return;
    // Longest stagger delay + reveal duration + small buffer.
    const t = setTimeout(() => setRevealSettled(true), 280 + REVEAL_MS + 60);
    return () => clearTimeout(t);
  }, [revealed, revealSettled]);

  // Typewriter state machine — one step per transition. Kicks in only after
  // the intro reveal has settled so the very first entrance stays unchanged.
  useEffect(() => {
    if (!revealSettled || reducedMotion) return;
    const current = CTA_LINES[twLineIdx];
    const nextIdx = (twLineIdx + 1) % CTA_LINES.length;
    const next = CTA_LINES[nextIdx];

    let timer: ReturnType<typeof setTimeout> | null = null;

    if (twPhase === "dwell") {
      timer = setTimeout(() => setTwPhase("deleting"), TW_DWELL_MS);
    } else if (twPhase === "deleting") {
      const target = commonPrefixLength(current.text, next.text);
      if (twVisible > target) {
        timer = setTimeout(() => setTwVisible((v) => v - 1), TW_DELETE_MS);
      } else {
        setTwLineIdx(nextIdx);
        setTwPhase("typing");
      }
    } else if (twPhase === "typing") {
      if (twVisible < current.text.length) {
        timer = setTimeout(() => setTwVisible((v) => v + 1), TW_TYPE_MS);
      } else {
        setTwPhase("dwell");
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [twPhase, twVisible, twLineIdx, revealSettled, reducedMotion]);

  // Cursor blinks only while dwelling; stays solid while chars are moving.
  useEffect(() => {
    if (!revealSettled || reducedMotion || twPhase !== "dwell") {
      setCursorOn(true);
      return;
    }
    setCursorOn(true);
    const interval = setInterval(
      () => setCursorOn((v) => !v),
      TW_CURSOR_BLINK_MS,
    );
    return () => clearInterval(interval);
  }, [twPhase, revealSettled, reducedMotion]);

  const revealStyle = ({
    delay,
    from,
  }: {
    delay: number;
    /** Resting-state transform to slide/scale/rotate FROM (e.g. "translate(-8px,-8px)"). */
    from: string;
  }) => {
    // Once fully settled, drop inline styles so per-element className hover
    // transitions (transition-all duration-200) take over uncontested.
    if (revealSettled) return undefined;
    return {
      opacity: revealed ? 1 : 0,
      transform: revealed ? "none" : from,
      transition: `opacity ${REVEAL_MS}ms ${REVEAL_EASE}, transform ${REVEAL_MS}ms ${REVEAL_EASE}`,
      transitionDelay: revealed ? `${delay}ms` : "0ms",
      pointerEvents: revealed ? undefined : ("none" as const),
      willChange: "opacity, transform" as const,
    };
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[calc(100dvh-160px)] min-h-[380px] max-h-[500px] sm:min-h-[440px] sm:max-h-[600px] md:h-[calc(100dvh-220px)] lg:max-h-[680px]"
    >
        {/* Light container — the Remotion composition provides the motion. */}
        <div
          ref={shapeRef}
          className="absolute inset-0 overflow-hidden bg-[#F7F7F5]"
          style={{
            borderRadius: CORNER_R,
            clipPath: INITIAL_CLIP,
            WebkitClipPath: INITIAL_CLIP,
            filter:
              "drop-shadow(0 30px 60px rgba(10, 11, 14, 0.14)) drop-shadow(0 8px 16px rgba(10, 11, 14, 0.06))",
          }}
        >
          <div className="absolute inset-0">
            <HeroVideoPlayer />
          </div>
        </div>

        {/* TL — headline (grid-stack: invisible sizers lock the container to
            the larger of the two CTAs so the notch stays put while the
            visible headline typewrites between them). */}
        <div
          ref={tlRef}
          className="absolute top-0 left-0 grid w-fit max-w-[85%] pr-0 pb-0 sm:max-w-[55%]"
          style={revealStyle({ delay: 0, from: "translate(-8px, -8px)" })}
        >
          {CTA_LINES.map((line, i) => (
            <div
              key={`cta-sizer-${i}`}
              aria-hidden
              className="pointer-events-none invisible [grid-area:1/1] translate-y-1.5 whitespace-pre-line text-start text-[15px] font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-[22px] md:text-[27px] lg:text-[32px] xl:text-[36px] text-balance"
              style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
            >
              {line.staticContent}
            </div>
          ))}
          <h1
            id="home-hero-heading"
            aria-live="off"
            style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
            className="[grid-area:1/1] translate-y-1.5 whitespace-pre-line text-start text-[15px] font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-[22px] md:text-[27px] lg:text-[32px] xl:text-[36px] text-balance"
          >
            {reducedMotion
              ? CTA_LINES[0].staticContent
              : renderTypewriterContent({
                  line: CTA_LINES[twLineIdx],
                  visibleCount: twVisible,
                  cursorVisible: cursorOn,
                  showCursor: revealSettled,
                })}
          </h1>
        </div>

        {/* TR — guide compass button */}
        <Link
          ref={trRef}
          href={routes.help()}
          aria-label="Ouvrir le guide"
          className="group absolute top-0 right-0 grid h-11 w-11 place-items-center rounded-full bg-white text-foreground ring-1 ring-border shadow-[0_8px_22px_-10px_rgba(10,11,14,0.20),0_3px_8px_-4px_rgba(10,11,14,0.10)] transition-all duration-200 hover:-translate-y-[1px] hover:ring-border-strong focus-visible:outline-none focus-visible:shadow-focus md:h-12 md:w-12"
          style={revealStyle({ delay: 120, from: "translate(8px, -8px) rotate(-15deg) scale(0.9)" })}
        >
          <Compass
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-45 md:h-5 md:w-5"
            strokeWidth={1.8}
          />
        </Link>

        {/* BC — split-pill: two primary CTAs fused into one capsule, seated
            in a single centered bottom-edge notch. Halves are 50/50 so the
            teacher and learner doors read as equally weighted. */}
        <div
          ref={bcRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex w-[86%] max-w-[560px] items-stretch rounded-full bg-accent text-accent-foreground shadow-[0_14px_36px_-12px_rgba(47,111,235,0.5),0_6px_14px_-6px_rgba(10,11,14,0.18)] ring-1 ring-white/10 sm:w-auto sm:min-w-[440px]"
          style={revealStyle({ delay: 250, from: "translate(0, 12px) scale(0.96)" })}
        >
          <Link
            href={routes.teachLanding()}
            className="group flex flex-1 basis-0 items-center justify-center gap-1.5 rounded-l-full py-2 pl-3 pr-3 text-[12px] font-semibold transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:shadow-focus sm:gap-2.5 sm:py-3.5 sm:pl-5 sm:pr-5 sm:text-[14px] md:py-4 md:text-[14.5px]"
          >
            <span
              aria-hidden
              className="grid h-4 w-4 place-items-center rounded-full bg-white/20 transition-transform duration-200 group-hover:rotate-45 sm:h-7 sm:w-7"
            >
              <ArrowUpRight className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
            </span>
            <span className="sm:hidden">Enseigner</span>
            <span className="hidden sm:inline">Devenir enseignant</span>
          </Link>

          <span
            aria-hidden
            className="my-2 w-px shrink-0 bg-white/20 sm:my-3"
          />

          <Link
            href={routes.browse()}
            className="group flex flex-1 basis-0 items-center justify-center gap-1.5 rounded-r-full py-2 pl-3 pr-3 text-[12px] font-semibold transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:shadow-focus sm:gap-2.5 sm:py-3.5 sm:pl-5 sm:pr-5 sm:text-[14px] md:py-4 md:text-[14.5px]"
          >
            <span
              aria-hidden
              className="grid h-4 w-4 place-items-center rounded-full bg-white/20 sm:h-7 sm:w-7"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="sm:hidden">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.4" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="hidden sm:block">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="sm:hidden">Cours</span>
            <span className="hidden sm:inline">Trouver un cours</span>
          </Link>
        </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type NotchSize = { w: number; h: number };

/**
 * Build the container's clip-path outline going CW.
 * TL is always a notch. TR is an optional corner notch.
 * BC is an optional mid-edge notch centered on the bottom, cutting UP into
 * the container to seat the split-pill CTA.
 */
function buildHeroPath({
  w,
  h,
  transitionR,
  cornerR,
  innerR,
  tl,
  tr,
  bc,
}: {
  w: number;
  h: number;
  transitionR: number;
  cornerR: number;
  innerR: number;
  tl: NotchSize;
  tr: NotchSize | null;
  bc: NotchSize | null;
}) {
  const TR = transitionR;
  const CR = cornerR;
  const cap = (r: number, n: NotchSize) =>
    Math.min(r, Math.max(0, n.w - TR) * 0.5, Math.max(0, n.h - TR) * 0.5);
  const tlIR = cap(innerR, tl);
  const trIR = tr ? cap(innerR, tr) : 0;
  const bcIR = bc ? cap(innerR, bc) : 0;

  const parts: string[] = [`M ${tl.w + TR} 0`];

  // ── Top edge → TR corner ─────────────────────────────────────────────
  if (tr) {
    parts.push(`L ${w - tr.w - TR} 0`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${w - tr.w} ${TR}`);
    parts.push(`L ${w - tr.w} ${tr.h - trIR}`);
    parts.push(`A ${trIR} ${trIR} 0 0 0 ${w - tr.w + trIR} ${tr.h}`);
    parts.push(`L ${w - TR} ${tr.h}`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${w} ${tr.h + TR}`);
  } else {
    parts.push(`L ${w - CR} 0`);
    parts.push(`A ${CR} ${CR} 0 0 1 ${w} ${CR}`);
  }

  // ── Right edge → BR corner (plain) ───────────────────────────────────
  parts.push(`L ${w} ${h - CR}`);
  parts.push(`A ${CR} ${CR} 0 0 1 ${w - CR} ${h}`);

  // ── Bottom edge → BC notch (optional, centered) → BL corner (plain) ──
  if (bc && bc.w > 0 && bc.h > 0) {
    const cx = w / 2;
    const bcRightX = cx + bc.w / 2;
    const bcLeftX = cx - bc.w / 2;
    const bcTopY = h - bc.h;
    // Walk right→left along the bottom edge:
    //   ...outer bottom edge... → convex bump up (TR arc) → straight up
    //   the notch's right wall → concave inner arc at notch top-right →
    //   straight across notch ceiling → concave inner arc at notch
    //   top-left → straight down notch's left wall → convex bump back
    //   down (TR arc) → continue along bottom edge.
    parts.push(`L ${bcRightX + TR} ${h}`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${bcRightX} ${h - TR}`);
    parts.push(`L ${bcRightX} ${bcTopY + bcIR}`);
    parts.push(`A ${bcIR} ${bcIR} 0 0 0 ${bcRightX - bcIR} ${bcTopY}`);
    parts.push(`L ${bcLeftX + bcIR} ${bcTopY}`);
    parts.push(`A ${bcIR} ${bcIR} 0 0 0 ${bcLeftX} ${bcTopY + bcIR}`);
    parts.push(`L ${bcLeftX} ${h - TR}`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${bcLeftX - TR} ${h}`);
  }
  parts.push(`L ${CR} ${h}`);
  parts.push(`A ${CR} ${CR} 0 0 1 0 ${h - CR}`);

  // ── Left edge → TL notch (always present) ────────────────────────────
  parts.push(`L 0 ${tl.h + TR}`);
  parts.push(`A ${TR} ${TR} 0 0 1 ${TR} ${tl.h}`);
  parts.push(`L ${tl.w - tlIR} ${tl.h}`);
  parts.push(`A ${tlIR} ${tlIR} 0 0 0 ${tl.w} ${tl.h - tlIR}`);
  parts.push(`L ${tl.w} ${TR}`);
  parts.push(`A ${TR} ${TR} 0 0 1 ${tl.w + TR} 0`);
  parts.push("Z");

  return parts.join(" ");
}
