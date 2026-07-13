import { Clock, TrendingUp, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

// Public response-rate trust signals per Decision 9. Response rate is the
// share of approval-required requests the teacher accepts (or rejects)
// before the 72 h SLA expires. Real backend derives this from history;
// the mock uses a deterministic hash so different teachers look different.

export type ResponseSignals = {
  /** Percent of requests answered within SLA. */
  ratePercent: number;
  /** Median response time in hours. */
  medianHours: number;
  /** Bucket for coloring. */
  tier: "excellent" | "good" | "slow";
};

/**
 * Deterministic mock derivation so trust signals appear stable per teacher.
 * Real backend passes the actual computed values through.
 */
export function deriveResponseSignals(teacherId: string, seedHours = 3): ResponseSignals {
  let hash = 0;
  for (let i = 0; i < teacherId.length; i++) hash = (hash * 31 + teacherId.charCodeAt(i)) | 0;
  const absHash = Math.abs(hash);
  const ratePercent = 82 + (absHash % 18); // 82..99
  const medianHours = Math.max(1, seedHours - (absHash % 3));
  const tier = ratePercent >= 95 ? "excellent" : ratePercent >= 88 ? "good" : "slow";
  return { ratePercent, medianHours, tier };
}

export function ResponseSignalBadge({
  signals,
  className,
}: {
  signals: ResponseSignals;
  className?: string;
}) {
  const tone =
    signals.tier === "excellent"
      ? "border-success/25 bg-success/10 text-success"
      : signals.tier === "good"
        ? "border-accent/25 bg-accent/10 text-accent"
        : "border-warning/25 bg-warning/10 text-warning";
  const Icon = signals.tier === "slow" ? AlertTriangle : signals.tier === "excellent" ? TrendingUp : Clock;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em]",
        tone,
        className,
      )}
      title={`Répond à ${signals.ratePercent}% des demandes sous 72 h · médiane ${signals.medianHours} h`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      Répond à {signals.ratePercent}% · médiane {signals.medianHours} h
    </span>
  );
}
