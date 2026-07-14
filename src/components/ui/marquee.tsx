"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
  children: React.ReactNode;
}

const SPEED: Record<NonNullable<MarqueeProps["speed"]>, string> = {
  slow: "44s",
  normal: "30s",
  fast: "18s",
};

/**
 * A marquee that duplicates its content once and animates a translate.
 * Pause on hover, fade edges optional, reduced-motion aware via CSS.
 */
export function Marquee({
  speed = "normal",
  pauseOnHover = true,
  reverse = false,
  fade = true,
  className,
  children,
  ...rest
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]",
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          "flex shrink-0 gap-10 whitespace-nowrap",
          reverse ? "animate-marquee-r" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: SPEED[speed] }}
        aria-hidden={false}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex shrink-0 gap-10 whitespace-nowrap",
          reverse ? "animate-marquee-r" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: SPEED[speed] }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}
