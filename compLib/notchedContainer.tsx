"use client";

/**
 * NotchedContainer — a container with an "inverted-radius" notch carved at any
 * of its four corners. Each notch's outline follows the same 5-segment pattern:
 *
 *   container edge → small convex bump → straight segment → interior rounded
 *   corner → straight segment → small convex bump → container edge
 *
 * That pattern is what gives the shape the reverse-radius / puzzle-piece feel
 * (small outward bulges bookending an inward dip). Every notch is sized from
 * the actual DOM measurement of whatever you drop into that corner slot, so
 * the shape wraps its content responsively via ResizeObserver.
 *
 * The container is a `clip-path: path(...)` applied to a positioned div. That
 * div's background is whatever you pass as `children` (a video, image, canvas,
 * gradient, etc). Content in each corner slot sits ON the page behind the
 * container — i.e., the page bg shows through each notch's carved hole.
 *
 * Usage
 * -----
 *   <NotchedContainer
 *     topLeft={<Headline />}
 *     topRight={<GuideButton />}
 *     bottomLeft={<SecondaryCTA />}
 *     bottomRight={<PrimaryCTA />}
 *     className="h-[calc(100dvh-140px)]"
 *   >
 *     <video src="hero.mp4" autoPlay muted loop />
 *   </NotchedContainer>
 *
 * Portability notes
 * -----------------
 *   - Zero framework imports. React + inline styles + optional Tailwind classes
 *     you pass in via `className` / `slotClassName`.
 *   - Requires ResizeObserver (available in every browser 2020+).
 *   - Empty corner slots become normal rounded corners (radius `cornerRadius`).
 *   - Drop-shadow is a CSS filter on the shape element and follows the
 *     compound outline, so shadow traces the notch shape for free.
 */

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */

export type NotchedContainerProps = {
  /** Content rendered as the container's background (video, image, etc). */
  children?: ReactNode;

  /** Content that sits inside each corner notch. Omit to skip that notch. */
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;

  /** Extra class on the outer wrapper (usually for sizing: h-*, min-h-*, w-*). */
  className?: string;
  style?: CSSProperties;

  /** Class applied to each slot wrapper; useful for padding / max-width. */
  slotClassName?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };

  /* --- design tokens (all px) ------------------------------------------ */

  /** Outer container corner radius when there is no notch. Default 48. */
  cornerRadius?: number;
  /** Interior rounded corner radius inside each notch. Default 40. */
  notchInnerRadius?: number;
  /** Small convex bump radius at each notch/edge junction. Default 22. */
  transitionRadius?: number;
  /** Padding between slot content and the notch's interior edges. Default 14. */
  notchPadding?: number;

  /** Container background color. Default a near-black charcoal. */
  backgroundColor?: string;
  /** CSS drop-shadow filter (traces the notched outline). */
  dropShadow?: string;

  /**
   * Optional per-notch dimension caps as fractions of the container size.
   * Prevents a very long headline from consuming the whole container. Default
   * 55% width / 45% height for TL and TR; 60% / 30% for BL and BR (CTAs).
   */
  maxNotch?: {
    tl?: { w?: number; h?: number };
    tr?: { w?: number; h?: number };
    bl?: { w?: number; h?: number };
    br?: { w?: number; h?: number };
  };
};

/* -------------------------------------------------------------------------- */

const DEFAULT_MAX = {
  tl: { w: 0.55, h: 0.45 },
  tr: { w: 0.35, h: 0.35 },
  bl: { w: 0.6, h: 0.3 },
  br: { w: 0.6, h: 0.3 },
};

const DEFAULT_SHADOW =
  "drop-shadow(0 30px 60px rgba(10, 11, 14, 0.18)) drop-shadow(0 8px 16px rgba(10, 11, 14, 0.08))";

const FALLBACK_NOTCH = { w: 160, h: 60 };

/* -------------------------------------------------------------------------- */

export function NotchedContainer({
  children,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className,
  style,
  slotClassName,
  cornerRadius = 48,
  notchInnerRadius = 40,
  transitionRadius = 22,
  notchPadding = 14,
  backgroundColor = "#0E1116",
  dropShadow = DEFAULT_SHADOW,
  maxNotch,
}: NotchedContainerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const trRef = useRef<HTMLDivElement>(null);
  const blRef = useRef<HTMLDivElement>(null);
  const brRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const shape = shapeRef.current;
    if (!wrapper || !shape) return;

    const measure = (el: HTMLElement | null): NotchSize | null => {
      if (!el || el.offsetHeight === 0) return null;
      return {
        w: el.offsetWidth + 2 * notchPadding,
        h: el.offsetHeight + 2 * notchPadding,
      };
    };

    const cap = (n: NotchSize | null, w: number, h: number, key: keyof typeof DEFAULT_MAX) => {
      if (!n) return null;
      const wCap = maxNotch?.[key]?.w ?? DEFAULT_MAX[key].w;
      const hCap = maxNotch?.[key]?.h ?? DEFAULT_MAX[key].h;
      return {
        w: Math.min(n.w, w * wCap),
        h: Math.min(n.h, h * hCap),
      };
    };

    const update = () => {
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      if (w === 0 || h === 0) return;

      const hasTL = !!topLeft;
      const hasTR = !!topRight;
      const hasBL = !!bottomLeft;
      const hasBR = !!bottomRight;

      const tl = hasTL ? cap(measure(tlRef.current) ?? FALLBACK_NOTCH, w, h, "tl") : null;
      const tr = hasTR ? cap(measure(trRef.current) ?? FALLBACK_NOTCH, w, h, "tr") : null;
      const bl = hasBL ? cap(measure(blRef.current) ?? FALLBACK_NOTCH, w, h, "bl") : null;
      const br = hasBR ? cap(measure(brRef.current) ?? FALLBACK_NOTCH, w, h, "br") : null;

      const path = buildNotchedPath({
        w,
        h,
        cornerR: cornerRadius,
        transitionR: transitionRadius,
        innerR: notchInnerRadius,
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
  }, [
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    cornerRadius,
    notchInnerRadius,
    transitionRadius,
    notchPadding,
    maxNotch,
  ]);

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative", ...style }}>
      <div
        ref={shapeRef}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          borderRadius: cornerRadius,
          backgroundColor,
          filter: dropShadow,
        }}
      >
        {children}
      </div>

      {topLeft && (
        <div
          ref={tlRef}
          className={slotClassName?.topLeft}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {topLeft}
        </div>
      )}
      {topRight && (
        <div
          ref={trRef}
          className={slotClassName?.topRight}
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          {topRight}
        </div>
      )}
      {bottomLeft && (
        <div
          ref={blRef}
          className={slotClassName?.bottomLeft}
          style={{ position: "absolute", bottom: 0, left: 0 }}
        >
          {bottomLeft}
        </div>
      )}
      {bottomRight && (
        <div
          ref={brRef}
          className={slotClassName?.bottomRight}
          style={{ position: "absolute", bottom: 0, right: 0 }}
        >
          {bottomRight}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type NotchSize = { w: number; h: number };

/**
 * Builds an SVG path for the container outline going CW. Each corner is one of:
 *   - normal rounded corner (if the notch is null)
 *   - inverted-radius notch (convex bump → straight → interior arc → straight
 *     → convex bump), sized from the passed notch dimensions
 *
 * Sweep flags: `1` = clockwise (convex bumps and normal corners),
 *              `0` = counter-clockwise (interior rounded corners of notches).
 */
export function buildNotchedPath({
  w,
  h,
  cornerR,
  transitionR,
  innerR,
  tl,
  tr,
  bl,
  br,
}: {
  w: number;
  h: number;
  cornerR: number;
  transitionR: number;
  innerR: number;
  tl: NotchSize | null;
  tr: NotchSize | null;
  bl: NotchSize | null;
  br: NotchSize | null;
}) {
  const CR = cornerR;
  const TR = transitionR;

  const cap = (n: NotchSize) =>
    Math.min(
      innerR,
      Math.max(0, n.w - TR) * 0.5,
      Math.max(0, n.h - TR) * 0.5,
    );
  const tlIR = tl ? cap(tl) : 0;
  const trIR = tr ? cap(tr) : 0;
  const blIR = bl ? cap(bl) : 0;
  const brIR = br ? cap(br) : 0;

  const parts: string[] = [];

  // ---- top-left corner: notch or normal ------------------------------
  if (tl) {
    parts.push(`M ${tl.w + TR} 0`);
  } else {
    parts.push(`M ${CR} 0`);
  }

  // ---- top edge to top-right corner ---------------------------------
  if (tr) {
    parts.push(`L ${w - tr.w - TR} 0`);
    // TR convex bump
    parts.push(`A ${TR} ${TR} 0 0 1 ${w - tr.w} ${TR}`);
    // TR left side going down
    parts.push(`L ${w - tr.w} ${tr.h - trIR}`);
    // TR interior rounded corner (concave from container side)
    parts.push(`A ${trIR} ${trIR} 0 0 0 ${w - tr.w + trIR} ${tr.h}`);
    // TR bottom going right
    parts.push(`L ${w - TR} ${tr.h}`);
    // TR convex bump back to right edge
    parts.push(`A ${TR} ${TR} 0 0 1 ${w} ${tr.h + TR}`);
  } else {
    parts.push(`L ${w - CR} 0`);
    parts.push(`A ${CR} ${CR} 0 0 1 ${w} ${CR}`);
  }

  // ---- right edge to bottom-right corner ----------------------------
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

  // ---- bottom edge to bottom-left corner ----------------------------
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

  // ---- left edge to top-left corner ---------------------------------
  if (tl) {
    parts.push(`L 0 ${tl.h + TR}`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${TR} ${tl.h}`);
    parts.push(`L ${tl.w - tlIR} ${tl.h}`);
    parts.push(`A ${tlIR} ${tlIR} 0 0 0 ${tl.w} ${tl.h - tlIR}`);
    parts.push(`L ${tl.w} ${TR}`);
    parts.push(`A ${TR} ${TR} 0 0 1 ${tl.w + TR} 0`);
  } else {
    parts.push(`L 0 ${CR}`);
    parts.push(`A ${CR} ${CR} 0 0 1 ${CR} 0`);
  }

  parts.push("Z");
  return parts.join(" ");
}

/* -------------------------------------------------------------------------- *
 * Example usage (drop into any React project)
 * -------------------------------------------------------------------------- *
 *
 * import { NotchedContainer } from "./notchedContainer";
 *
 * export function Hero() {
 *   return (
 *     <NotchedContainer
 *       className="h-[calc(100dvh-140px)] min-h-[520px] w-full"
 *       topLeft={
 *         <div className="max-w-[52%] pr-8 pb-6">
 *           <h1 className="text-5xl font-bold">Welcome</h1>
 *         </div>
 *       }
 *       topRight={
 *         <button className="grid h-14 w-14 place-items-center rounded-full bg-white shadow">
 *           <CompassIcon />
 *         </button>
 *       }
 *       bottomLeft={<button className="rounded-full bg-white px-5 py-3">Secondary</button>}
 *       bottomRight={<button className="rounded-full bg-blue-500 px-5 py-3 text-white">Primary</button>}
 *     >
 *       <video src="hero.mp4" autoPlay muted loop className="h-full w-full object-cover" />
 *     </NotchedContainer>
 *   );
 * }
 *
 * -------------------------------------------------------------------------- */
