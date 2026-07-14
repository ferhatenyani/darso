import { TrendingUp, TrendingDown, Minus } from "lucide-react";

import { evaluateTier, type MonthlyRevenue } from "@/lib/mock/teacher-tier";
import { revenueTrend, revenueSnapshot } from "@/lib/mock/dashboard";
import { formatPrice, cn } from "@/lib/utils";

// Projection card for the dashboard — Decision 6 (rolling monthly with
// proactive projection). Reads the last 3 months of revenueTrend as the
// trailing history and extrapolates the current month linearly to give
// the teacher a "you'll end at X, your tier will move Y" line before
// month-end, so tier changes never surprise them.

function currentDayOfMonth(): { day: number; days: number } {
  const now = new Date();
  const day = now.getDate();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return { day, days };
}

export function TierProjectionCard() {
  const history: MonthlyRevenue[] = revenueTrend.slice(-3).map((r, i, arr) => ({
    month: `M-${arr.length - 1 - i}`,
    revenueDzd: r,
  }));
  // Overwrite the last entry with the "current month to date" value so
  // the projection accounts for how far into the month we are.
  history[history.length - 1] = {
    month: "M0",
    revenueDzd: revenueSnapshot.currentMonthDzd,
  };
  const { day, days } = currentDayOfMonth();
  const evaluation = evaluateTier(history, day, days);

  const rankDelta =
    evaluation.projection.projectedTier.key === evaluation.current.key
      ? 0
      : evaluation.projection.projectedTier.thresholdDzd > evaluation.current.thresholdDzd
        ? 1
        : -1;

  const TrendIcon = rankDelta > 0 ? TrendingUp : rankDelta < 0 ? TrendingDown : Minus;
  const trendTone =
    rankDelta > 0 ? "text-success" : rankDelta < 0 ? "text-warning" : "text-ink-2";

  return (
    <div className="mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
      <div className="grid gap-4 border-b border-border p-5 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Palier actuel — moyenne 3 mois
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-[26px] font-semibold tabular tracking-tight text-foreground">
              {evaluation.current.labelFr}
            </span>
            <span className="text-[13px] tabular text-ink-2">
              {formatPrice(evaluation.trailingAvgDzd, "fr")} / mois
            </span>
          </div>
        </div>
        <div className={cn("flex items-center gap-2 self-start rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium", trendTone)}>
          <TrendIcon className="h-3.5 w-3.5" aria-hidden />
          {rankDelta > 0
            ? `Vers ${evaluation.projection.projectedTier.labelFr}`
            : rankDelta < 0
              ? `Vers ${evaluation.projection.projectedTier.labelFr}`
              : "Stable"}
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-3">
        <ProjectionField
          label="Fin de mois projetée"
          value={formatPrice(evaluation.projection.monthEndRevenueDzd, "fr")}
        />
        <ProjectionField
          label="Nouvelle moyenne 3 mois"
          value={formatPrice(evaluation.projection.projectedTrailingAvgDzd, "fr")}
        />
        <ProjectionField
          label={evaluation.next ? `Il manque pour ${evaluation.next.labelFr}` : "Palier max atteint"}
          value={
            evaluation.next && evaluation.toNextDzd !== null
              ? formatPrice(evaluation.toNextDzd, "fr")
              : "—"
          }
        />
      </div>

      <p className={cn(
        "border-t border-border px-5 py-4 text-[13px] leading-relaxed",
        rankDelta > 0 ? "bg-success/8 text-success" : rankDelta < 0 ? "bg-warning/8 text-warning" : "bg-surface text-ink-2",
      )}>
        {evaluation.projection.fr}
      </p>
    </div>
  );
}

function ProjectionField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
        {label}
      </p>
      <p className="mt-1 text-[16px] font-semibold tabular tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
