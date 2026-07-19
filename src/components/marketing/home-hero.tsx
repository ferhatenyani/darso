"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Compass } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { HeroVideoPlayer } from "./hero-video-player";

/**
 * Home hero — single dominant dark container with 4 inverted-radius notches,
 * one at each corner. All four notches use the same structural pattern:
 *
 *   container edge → convex bump → straight segment → interior rounded corner
 *                  → straight segment → convex bump → container edge
 *
 * Content lives inside each notch, sitting on the page bg (which shows
 * through the carve-outs). The container's outline is a JS-generated
 * clip-path that resizes on any measurement change (ResizeObserver).
 *
 *   TL — headline + eyebrow chip (rectangular content)
 *   TR — guide compass button (small, app-wide guide entry point)
 *   BL — secondary CTA "Devenir enseignant"
 *   BR — primary CTA "Trouver un cours"
 */
export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate bg-background pt-3 pb-14 md:pt-4 md:pb-20"
    >
      <div className="container-wide">
        <HeroCard />
      </div>
    </section>
  );
}

/* --- design tokens ------------------------------------------------------- */

/** Padding between content and the notch's interior edge (px). */
const NOTCH_PAD = 14;
/** Convex bump radius where each notch meets the container edge (px). */
const TRANSITION_R = 22;
/** Interior rounded corner radius for each notch (px). */
const INNER_R = 40;
/** Outer container corner radius — the "flat" corners between notches. */
const CORNER_R = 48;
/** Fallback dimensions used before ResizeObserver fires. */
const FALLBACK = {
  tl: { w: 480, h: 240 },
  tr: { w: 72, h: 72 },
  bl: { w: 240, h: 60 },
  br: { w: 220, h: 60 },
};

function HeroCard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const trRef = useRef<HTMLAnchorElement>(null);
  const blRef = useRef<HTMLAnchorElement>(null);
  const brRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const shape = shapeRef.current;
    if (!wrapper || !shape) return;

    const update = () => {
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      if (w === 0 || h === 0) return;

      const measure = (
        el: HTMLElement | null,
        fallback: { w: number; h: number },
      ) => {
        if (!el || el.offsetHeight === 0) return fallback;
        return {
          w: el.offsetWidth + 2 * NOTCH_PAD,
          h: el.offsetHeight + 2 * NOTCH_PAD,
        };
      };

      let tl = measure(tlRef.current, FALLBACK.tl);
      const tr = measure(trRef.current, FALLBACK.tr);
      const bl = measure(blRef.current, FALLBACK.bl);
      const br = measure(brRef.current, FALLBACK.br);

      // Cap headline notch so it never dominates the container.
      const isMobile = w < 640;
      tl = {
        w: Math.min(tl.w, w * (isMobile ? 0.9 : 0.55)),
        h: Math.min(tl.h, h * (isMobile ? 0.55 : 0.45)),
      };

      const path = buildHeroPath({
        w,
        h,
        transitionR: TRANSITION_R,
        innerR: INNER_R,
        tl,
        tr,
        bl,
        br,
      });

      shape.style.clipPath = `path("${path}")`;
      (shape.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath =
        `path("${path}")`;
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(wrapper);
    [tlRef, trRef, blRef, brRef].forEach((r) => {
      if (r.current) ro.observe(r.current);
    });
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[calc(100dvh-140px)] min-h-[520px] max-h-[720px] lg:max-h-[820px]"
    >
      {/* Dark container — the Remotion composition is the background. */}
      <div
        ref={shapeRef}
        className="absolute inset-0 overflow-hidden bg-[#0E1116]"
        style={{
          borderRadius: CORNER_R,
          filter:
            "drop-shadow(0 30px 60px rgba(10, 11, 14, 0.18)) drop-shadow(0 8px 16px rgba(10, 11, 14, 0.08))",
        }}
      >
        <div className="absolute inset-0">
          <HeroVideoPlayer />
        </div>
      </div>

      {/* TL — headline + eyebrow */}
      <div
        ref={tlRef}
        className="absolute top-0 left-0 max-w-[82%] pr-6 pb-5 sm:max-w-[52%] sm:pr-8 sm:pb-6 md:pr-10 md:pb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-1 text-[11px] font-medium text-ink-2 md:text-[12px]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          La marketplace de l'apprentissage
        </div>
        <h1
          id="home-hero-heading"
          className="mt-4 text-[28px] font-bold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-[38px] md:text-[46px] lg:text-[54px] xl:text-[60px] text-balance"
        >
          Apprenez tout,
          <br />
          avec les <span className="relative inline-block">
            meilleurs
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[8px] rounded-full bg-accent/80"
            />
          </span>
          <br className="hidden md:block" />
          professeurs.
        </h1>
      </div>

      {/* TR — guide compass button (app-wide entry point) */}
      <Link
        ref={trRef}
        href={routes.help()}
        aria-label="Ouvrir le guide"
        className="group absolute top-0 right-0 grid h-14 w-14 place-items-center rounded-full bg-white text-foreground ring-1 ring-border shadow-[0_10px_28px_-10px_rgba(10,11,14,0.20),0_4px_10px_-4px_rgba(10,11,14,0.10)] transition-all duration-200 hover:-translate-y-[1px] hover:ring-border-strong focus-visible:outline-none focus-visible:shadow-focus md:h-[60px] md:w-[60px]"
      >
        <Compass className="h-[22px] w-[22px] transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.8} />
      </Link>

      {/* BL — secondary CTA */}
      <Link
        ref={blRef}
        href={routes.teachLanding()}
        className="group absolute bottom-0 left-0 inline-flex items-center gap-2 rounded-full bg-white py-3 pl-5 pr-4 text-[13.5px] font-semibold text-foreground shadow-[0_10px_28px_-10px_rgba(10,11,14,0.20),0_4px_10px_-4px_rgba(10,11,14,0.10)] ring-1 ring-border transition-all duration-200 hover:-translate-y-[1px] hover:ring-border-strong focus-visible:outline-none focus-visible:shadow-focus"
      >
        Devenir enseignant
        <span
          aria-hidden
          className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:rotate-45"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      {/* BR — primary CTA */}
      <Link
        ref={brRef}
        href={routes.browse()}
        className="group absolute bottom-0 right-0 inline-flex items-center gap-2 rounded-full bg-accent py-3 pl-5 pr-4 text-[13.5px] font-semibold text-accent-foreground shadow-[0_10px_28px_-10px_rgba(47,111,235,0.45),0_4px_10px_-4px_rgba(10,11,14,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-accent-hover focus-visible:outline-none focus-visible:shadow-focus"
      >
        <span
          aria-hidden
          className="grid h-6 w-6 place-items-center rounded-full bg-white/25 text-accent-foreground"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </span>
        Trouver un cours
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type NotchSize = { w: number; h: number };

/**
 * Builds the container's SVG clip-path outline going CW.
 * Every corner uses the SAME structural pattern:
 *   convex bump → straight → interior rounded corner → straight → convex bump
 *
 * Convex bumps (sweep=1) turn direction 90° between container edge and
 * notch's straight segment. The interior rounded corner (sweep=0) turns
 * direction 90° between the two straight segments inside the notch.
 */
function buildHeroPath({
  w,
  h,
  transitionR,
  innerR,
  tl,
  tr,
  bl,
  br,
}: {
  w: number;
  h: number;
  transitionR: number;
  innerR: number;
  tl: NotchSize;
  tr: NotchSize;
  bl: NotchSize;
  br: NotchSize;
}) {
  const TR = transitionR;
  // Per-notch interior radii, capped to notch size so the arc is valid.
  const cap = (r: number, n: NotchSize) =>
    Math.min(r, Math.max(0, n.w - TR) * 0.5, Math.max(0, n.h - TR) * 0.5);
  const tlIR = cap(innerR, tl);
  const trIR = cap(innerR, tr);
  const blIR = cap(innerR, bl);
  const brIR = cap(innerR, br);

  const parts: string[] = [
    // Top edge, starting past TL notch's convex bump
    `M ${tl.w + TR} 0`,
    `L ${w - tr.w - TR} 0`,
    // TR notch — convex bump into notch
    `A ${TR} ${TR} 0 0 1 ${w - tr.w} ${TR}`,
    // TR notch left side going down
    `L ${w - tr.w} ${tr.h - trIR}`,
    // TR notch interior rounded corner (concave from container's side)
    `A ${trIR} ${trIR} 0 0 0 ${w - tr.w + trIR} ${tr.h}`,
    // TR notch bottom going right
    `L ${w - TR} ${tr.h}`,
    // TR notch — convex bump back to right edge
    `A ${TR} ${TR} 0 0 1 ${w} ${tr.h + TR}`,
    // Right edge going down
    `L ${w} ${h - br.h - TR}`,
    // BR notch — convex bump into notch
    `A ${TR} ${TR} 0 0 1 ${w - TR} ${h - br.h}`,
    // BR notch top going left
    `L ${w - br.w + brIR} ${h - br.h}`,
    // BR notch interior rounded corner
    `A ${brIR} ${brIR} 0 0 0 ${w - br.w} ${h - br.h + brIR}`,
    // BR notch left going down
    `L ${w - br.w} ${h - TR}`,
    // BR notch — convex bump back to bottom edge
    `A ${TR} ${TR} 0 0 1 ${w - br.w - TR} ${h}`,
    // Bottom edge going left
    `L ${bl.w + TR} ${h}`,
    // BL notch — convex bump into notch
    `A ${TR} ${TR} 0 0 1 ${bl.w} ${h - TR}`,
    // BL notch right going up
    `L ${bl.w} ${h - bl.h + blIR}`,
    // BL notch interior rounded corner
    `A ${blIR} ${blIR} 0 0 0 ${bl.w - blIR} ${h - bl.h}`,
    // BL notch top going left
    `L ${TR} ${h - bl.h}`,
    // BL notch — convex bump back to left edge
    `A ${TR} ${TR} 0 0 1 0 ${h - bl.h - TR}`,
    // Left edge going up
    `L 0 ${tl.h + TR}`,
    // TL notch — convex bump into notch
    `A ${TR} ${TR} 0 0 1 ${TR} ${tl.h}`,
    // TL notch bottom going right
    `L ${tl.w - tlIR} ${tl.h}`,
    // TL notch interior rounded corner
    `A ${tlIR} ${tlIR} 0 0 0 ${tl.w} ${tl.h - tlIR}`,
    // TL notch right going up
    `L ${tl.w} ${TR}`,
    // TL notch — convex bump back to top edge
    `A ${TR} ${TR} 0 0 1 ${tl.w + TR} 0`,
    "Z",
  ];

  return parts.join(" ");
}
