"use client";

import * as React from "react";

/**
 * Custom three-line trend chart used in the revenue snapshot.
 * Not a generic sparkline — uses three offset paths to create a printed-graph feel.
 */
export function RevenueTrend({ values, ariaLabel }: { values: number[]; ariaLabel: string }) {
  const w = 220;
  const h = 64;
  const padding = 4;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = (w - padding * 2) / (values.length - 1);

  const toPath = (offset = 0) => {
    return values
      .map((v, i) => {
        const x = padding + i * stepX;
        const y = padding + (1 - (v - min) / range) * (h - padding * 2) + offset;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  // Latest point
  const lastX = padding + (values.length - 1) * stepX;
  const lastY = padding + (1 - (values[values.length - 1] - min) / range) * (h - padding * 2);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className="h-16 w-full"
      preserveAspectRatio="none"
    >
      {/* Grid baseline (low contrast) */}
      <line
        x1={padding}
        x2={w - padding}
        y1={h - padding}
        y2={h - padding}
        stroke="var(--border)"
        strokeDasharray="2 4"
        strokeWidth="0.6"
      />

      {/* Echo lines */}
      <path d={toPath(-2)} fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1.2" />
      <path d={toPath(2)} fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1.2" />

      {/* Main line */}
      <path d={toPath()} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Last point */}
      <circle cx={lastX} cy={lastY} r="3" fill="var(--background)" stroke="var(--accent)" strokeWidth="1.8" />
    </svg>
  );
}
