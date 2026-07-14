"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketingCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyFor: (item: T, index: number) => string;
  ariaLabel: string;
  slideClassName?: string;
  gap?: string;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  edgeFade?: boolean;
}

/**
 * Real carousel primitive: native scroll snap for physics, edge overlay arrow
 * buttons for discrete navigation, dot pagination on mobile, keyboard arrows
 * for a11y, IntersectionObserver to track active index. Respects reduced-motion.
 */
export function MarketingCarousel<T>({
  items,
  renderItem,
  keyFor,
  ariaLabel,
  slideClassName = "w-[78vw] max-w-[320px] sm:w-[62vw] md:w-[46%] lg:w-[32%] xl:w-[24%]",
  gap = "gap-4",
  showArrows = true,
  showDots = true,
  className,
  edgeFade = true,
}: MarketingCarouselProps<T>) {
  const scrollerRef = React.useRef<HTMLUListElement | null>(null);
  const rtlRef = React.useRef(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const prefersReducedMotion = React.useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  React.useEffect(() => {
    rtlRef.current = document.documentElement.dir === "rtl";
  }, []);

  const updateEdges = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setCanScrollLeft(pos > 2);
    setCanScrollRight(pos < max - 2);
  }, []);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();

    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });

    const resizeObs = new ResizeObserver(() => updateEdges());
    resizeObs.observe(el);

    const slides = Array.from(el.querySelectorAll<HTMLLIElement>("[data-slide]"));
    if (slides.length === 0) {
      return () => {
        el.removeEventListener("scroll", onScroll);
        resizeObs.disconnect();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = Number((entry.target as HTMLElement).dataset.index);
          }
        });
        if (bestRatio > 0.6 && bestIdx >= 0) setActiveIndex(bestIdx);
      },
      { root: el, threshold: [0.4, 0.6, 0.8, 1] },
    );
    slides.forEach((s) => io.observe(s));

    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObs.disconnect();
      io.disconnect();
    };
  }, [updateEdges, items.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLLIElement>("[data-slide]");
    const step = slide ? slide.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({
      left: dir * step * (rtlRef.current ? -1 : 1),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const scrollTo = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLLIElement>(`[data-index="${idx}"]`);
    if (!target) return;
    const gap = 16;
    const left = target.offsetLeft - gap;
    el.scrollTo({ left, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy(rtlRef.current ? -1 : 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy(rtlRef.current ? 1 : -1);
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollTo(items.length - 1);
    }
  };

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      {/* Scroller wrapped so overlay arrows sit at its edges (never overlap the section header) */}
      <div className="relative">
        <div
          className={cn(
            "relative -mx-4 sm:-mx-6 lg:mx-0",
            edgeFade &&
              "lg:[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]",
          )}
        >
          <ul
            ref={scrollerRef}
            className={cn(
              "flex snap-x snap-mandatory overflow-x-auto scroll-none px-4 sm:px-6 lg:px-0",
              gap,
            )}
            tabIndex={0}
            aria-label={`${ariaLabel} — utilisez les flèches pour naviguer`}
            style={{
              scrollBehavior: prefersReducedMotion ? "auto" : "smooth",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {items.map((item, i) => (
              <li
                key={keyFor(item, i)}
                data-slide
                data-index={i}
                aria-roledescription="slide"
                aria-label={`${i + 1} sur ${items.length}`}
                className={cn(
                  "flex shrink-0 snap-start flex-col",
                  slideClassName,
                )}
              >
                {renderItem(item, i)}
              </li>
            ))}
          </ul>
        </div>

        {/* Edge overlay arrows — desktop only, tucked over the scroller edges */}
        {showArrows ? (
          <>
            <button
              type="button"
              aria-label="Précédent"
              onClick={() => scrollBy(-1)}
              className={cn(
                "pointer-events-auto absolute start-0 top-1/2 -translate-y-1/2 hidden lg:grid",
                "h-11 w-11 place-items-center rounded-full border border-border bg-background/90 text-ink-2 shadow-e2 backdrop-blur",
                "transition-all duration-300",
                "hover:border-border-strong hover:bg-background hover:text-foreground hover:scale-105",
                "focus-visible:outline-none focus-visible:shadow-focus",
                canScrollLeft
                  ? "opacity-100 -translate-x-3"
                  : "opacity-0 pointer-events-none translate-x-0",
              )}
              aria-hidden={!canScrollLeft}
              tabIndex={canScrollLeft ? 0 : -1}
            >
              <ChevronLeft className="h-4 w-4 rtl-flip" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Suivant"
              onClick={() => scrollBy(1)}
              className={cn(
                "pointer-events-auto absolute end-0 top-1/2 -translate-y-1/2 hidden lg:grid",
                "h-11 w-11 place-items-center rounded-full border border-border bg-background/90 text-ink-2 shadow-e2 backdrop-blur",
                "transition-all duration-300",
                "hover:border-border-strong hover:bg-background hover:text-foreground hover:scale-105",
                "focus-visible:outline-none focus-visible:shadow-focus",
                canScrollRight
                  ? "opacity-100 translate-x-3"
                  : "opacity-0 pointer-events-none translate-x-0",
              )}
              aria-hidden={!canScrollRight}
              tabIndex={canScrollRight ? 0 : -1}
            >
              <ChevronRight className="h-4 w-4 rtl-flip" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {/* Dots pagination — mobile visible; on desktop use the arrows */}
      {showDots && items.length > 1 ? (
        <div
          role="tablist"
          aria-label="Pagination du carrousel"
          className="mt-5 flex items-center justify-center gap-1.5 md:hidden"
        >
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Aller au slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:shadow-focus",
                i === activeIndex
                  ? "w-6 bg-accent"
                  : "w-1.5 bg-border-strong hover:bg-ink-3",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
