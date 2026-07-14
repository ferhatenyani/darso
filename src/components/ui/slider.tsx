"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onValueChange?: (v: number[]) => void;
  className?: string;
  ariaLabel?: string;
  format?: (n: number) => string;
};

/** Single- or two-thumb slider, fully custom-styled, no native chrome. */
export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onValueChange,
  className,
  ariaLabel,
  format = (n) => String(n),
}: SliderProps) {
  const isRange = value.length === 2;
  const lo = isRange ? Math.min(value[0]!, value[1]!) : value[0]!;
  const hi = isRange ? Math.max(value[0]!, value[1]!) : value[0]!;
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  function setSingle(n: number) {
    onValueChange?.([n]);
  }
  function setLo(n: number) {
    onValueChange?.([Math.min(n, hi), hi]);
  }
  function setHi(n: number) {
    onValueChange?.([lo, Math.max(n, lo)]);
  }

  return (
    <div className={cn("relative grid w-full gap-2", className)}>
      <div className="relative h-9 w-full">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-surface" />
        {/* range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-accent"
          style={{
            insetInlineStart: `${pct(lo)}%`,
            insetInlineEnd: `${100 - pct(hi)}%`,
          }}
        />
        {/* native inputs (hidden visually, used for keyboard + a11y) */}
        {!isRange ? (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            aria-label={ariaLabel}
            onChange={(e) => setSingle(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        ) : (
          <>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value[0]}
              aria-label={`${ariaLabel} (min)`}
              onChange={(e) => setLo(Number(e.target.value))}
              className="pointer-events-auto absolute inset-0 w-full opacity-0 cursor-pointer"
            />
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value[1]}
              aria-label={`${ariaLabel} (max)`}
              onChange={(e) => setHi(Number(e.target.value))}
              className="pointer-events-auto absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </>
        )}
        {/* visual thumbs */}
        {!isRange ? (
          <Thumb x={pct(value[0]!)} />
        ) : (
          <>
            <Thumb x={pct(lo)} />
            <Thumb x={pct(hi)} />
          </>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-ink-3 tabular">
        <span>{format(isRange ? lo : value[0]!)}</span>
        {isRange && <span>{format(hi)}</span>}
      </div>
    </div>
  );
}

function Thumb({ x }: { x: number }) {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-accent bg-background shadow-e1 transition-transform hover:scale-110"
      style={{ insetInlineStart: `calc(${x}% - 10px)` }}
    />
  );
}
