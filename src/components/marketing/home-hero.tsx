"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Compass } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { HeroVideoPlayer } from "./hero-video-player";

/**
 * Home hero — dark rounded container with inverted-radius notches.
 * Desktop (sm+) uses four notches: TL headline, TR compass, BL/BR CTAs.
 * Compact (below sm) collapses to two notches (TL + TR) and moves the
 * CTAs to a normal row beneath the card so they never collide.
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
  bl: { w: 210, h: 52 },
  br: { w: 190, h: 52 },
};

const COMPACT_QUERY = "(max-width: 639.98px)";
const INTRO_MS = 800;
/** Initial SSR clip — dimension-agnostic so the first paint isn't a bare rectangle. */
const INITIAL_CLIP = `inset(0 round ${CORNER_R}px)`;

function HeroCard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const trRef = useRef<HTMLAnchorElement>(null);
  const blRef = useRef<HTMLAnchorElement>(null);
  const brRef = useRef<HTMLAnchorElement>(null);
  const introDoneRef = useRef(false);

  const [compact, setCompact] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const sync = () => setCompact(mq.matches);
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
      const bl = measure(blRef.current, FALLBACK.bl);
      const br = measure(brRef.current, FALLBACK.br);

      // Cap headline notch so it never dominates the container.
      tl = {
        w: Math.min(tl.w, w * (compact ? 0.88 : 0.6)),
        h: Math.min(tl.h, h * (compact ? 0.58 : 0.45)),
      };

      return { w, h, tl, tr, bl, br };
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
        bl: scale(t.bl, p),
        br: scale(t.br, p),
      });
      shape.style.clipPath = `path("${path}")`;
      (shape.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath =
        `path("${path}")`;
    };

    let rafId: number | null = null;
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
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          introDoneRef.current = true;
          setRevealed(true);
        }
      };
      rafId = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => {
      if (!introDoneRef.current) return;
      const next = readTargets();
      if (next) writePath(next, 1);
    });
    ro.observe(wrapper);
    [tlRef, trRef, blRef, brRef].forEach((r) => {
      if (r.current) ro.observe(r.current);
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [compact]);

  const revealStyle = (delayMs: number) => ({
    opacity: revealed ? 1 : 0,
    transitionDelay: revealed ? `${delayMs}ms` : "0ms",
    pointerEvents: revealed ? undefined : ("none" as const),
  });

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

        {/* TL — headline */}
        <div
          ref={tlRef}
          className="absolute top-0 left-0 w-fit max-w-[85%] pr-0 pb-0 sm:max-w-[55%] transition-opacity duration-500 ease-out"
          style={revealStyle(0)}
        >
          <h1
            id="home-hero-heading"
            style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
            className="translate-y-1.5 text-start text-[15px] font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-[22px] md:text-[27px] lg:text-[32px] xl:text-[36px] text-balance"
          >
            Trouvez le prof
            <br />
            qui vous fait
            <br />
            <span className="inline-block bg-foreground px-[0.12em] py-[0.04em] text-[#F2ECDD]">
              progresser.
            </span>
          </h1>
        </div>

        {/* TR — guide compass button */}
        <Link
          ref={trRef}
          href={routes.help()}
          aria-label="Ouvrir le guide"
          className="group absolute top-0 right-0 grid h-11 w-11 place-items-center rounded-full bg-white text-foreground ring-1 ring-border shadow-[0_8px_22px_-10px_rgba(10,11,14,0.20),0_3px_8px_-4px_rgba(10,11,14,0.10)] transition-all duration-200 hover:-translate-y-[1px] hover:ring-border-strong focus-visible:outline-none focus-visible:shadow-focus md:h-12 md:w-12"
          style={revealStyle(120)}
        >
          <Compass
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-45 md:h-5 md:w-5"
            strokeWidth={1.8}
          />
        </Link>

        {/* BL — secondary CTA (shorter label on mobile) */}
        <Link
          ref={blRef}
          href={routes.teachLanding()}
          className="group absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full bg-white py-1.5 pl-2.5 pr-2 text-[11.5px] font-semibold text-foreground shadow-[0_10px_28px_-10px_rgba(10,11,14,0.22),0_4px_10px_-4px_rgba(10,11,14,0.12)] ring-1 ring-border transition-all duration-200 hover:-translate-y-[1px] hover:ring-border-strong focus-visible:outline-none focus-visible:shadow-focus sm:gap-2.5 sm:py-3 sm:pl-5 sm:pr-4 sm:text-[14px] md:py-3.5 md:pl-6 md:text-[14.5px]"
          style={revealStyle(220)}
        >
          <span className="sm:hidden">Enseigner</span>
          <span className="hidden sm:inline">Devenir enseignant</span>
          <span
            aria-hidden
            className="grid h-4 w-4 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:rotate-45 sm:h-7 sm:w-7"
          >
            <ArrowUpRight className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
          </span>
        </Link>

        {/* BR — primary CTA (shorter label on mobile) */}
        <Link
          ref={brRef}
          href={routes.browse()}
          className="group absolute bottom-0 right-0 inline-flex items-center gap-1.5 rounded-full bg-accent py-1.5 pl-2 pr-2.5 text-[11.5px] font-semibold text-accent-foreground shadow-[0_10px_28px_-10px_rgba(47,111,235,0.45),0_4px_10px_-4px_rgba(10,11,14,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-accent-hover focus-visible:outline-none focus-visible:shadow-focus sm:gap-2.5 sm:py-3 sm:pl-5 sm:pr-4 sm:text-[14px] md:py-3.5 md:pl-6 md:text-[14.5px]"
          style={revealStyle(280)}
        >
          <span
            aria-hidden
            className="grid h-4 w-4 place-items-center rounded-full bg-white/25 sm:h-7 sm:w-7"
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
  );
}

/* -------------------------------------------------------------------------- */

type NotchSize = { w: number; h: number };

/**
 * Build the container's clip-path outline going CW.
 * TL is always a notch. TR / BL / BR are optional — when null, that corner
 * uses the plain outer rounded corner instead.
 */
function buildHeroPath({
  w,
  h,
  transitionR,
  cornerR,
  innerR,
  tl,
  tr,
  bl,
  br,
}: {
  w: number;
  h: number;
  transitionR: number;
  cornerR: number;
  innerR: number;
  tl: NotchSize;
  tr: NotchSize | null;
  bl: NotchSize | null;
  br: NotchSize | null;
}) {
  const TR = transitionR;
  const CR = cornerR;
  const cap = (r: number, n: NotchSize) =>
    Math.min(r, Math.max(0, n.w - TR) * 0.5, Math.max(0, n.h - TR) * 0.5);
  const tlIR = cap(innerR, tl);
  const trIR = tr ? cap(innerR, tr) : 0;
  const blIR = bl ? cap(innerR, bl) : 0;
  const brIR = br ? cap(innerR, br) : 0;

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

  // ── Right edge → BR corner ───────────────────────────────────────────
  if (br) {
    parts.push(`L ${w} ${h - br.h - TR}`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${w - TR} ${h - br.h}`);
    parts.push(`L ${w - br.w + brIR} ${h - br.h}`);
    parts.push(`A ${brIR} ${brIR} 0 0 0 ${w - br.w} ${h - br.h + brIR}`);
    parts.push(`L ${w - br.w} ${h - TR}`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${w - br.w - TR} ${h}`);
  } else {
    parts.push(`L ${w} ${h - CR}`);
    parts.push(`A ${CR} ${CR} 0 0 1 ${w - CR} ${h}`);
  }

  // ── Bottom edge → BL corner ──────────────────────────────────────────
  if (bl) {
    parts.push(`L ${bl.w + TR} ${h}`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${bl.w} ${h - TR}`);
    parts.push(`L ${bl.w} ${h - bl.h + blIR}`);
    parts.push(`A ${blIR} ${blIR} 0 0 0 ${bl.w - blIR} ${h - bl.h}`);
    parts.push(`L ${TR} ${h - bl.h}`);
    parts.push(`A ${TR} ${TR} 0 0 1 0 ${h - bl.h - TR}`);
  } else {
    parts.push(`L ${CR} ${h}`);
    parts.push(`A ${CR} ${CR} 0 0 1 0 ${h - CR}`);
  }

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
