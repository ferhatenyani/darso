import type { LearningRequest, RequestStatus, RequestUrgency } from "@/lib/mock/requests";

/** Map status → Badge variant. */
export function statusVariant(
  status: RequestStatus,
): "success" | "warning" | "primary" | "default" {
  switch (status) {
    case "open":
      return "success";
    case "negotiating":
      return "warning";
    case "awarded":
      return "primary";
    case "closed":
      return "default";
  }
}

/** Map urgency → CSS class for the urgency strip on cards. */
export function urgencyStripClass(u: RequestUrgency): string {
  switch (u) {
    case "high":
      return "bg-danger";
    case "med":
      return "bg-warning";
    case "low":
      return "bg-success/70";
  }
}

/** Map urgency → label key segment. */
export function urgencyKey(u: RequestUrgency): "low" | "med" | "high" {
  return u;
}

/** Format a "hours ago" using the namespace translator. */
export function formatPostedAt(
  hours: number,
  t: (key: string, values?: Record<string, number | string>) => string,
): string {
  if (hours < 1) return t("shared.time.justNow");
  if (hours < 24) return t("shared.time.hoursAgo", { h: Math.round(hours) });
  return t("shared.time.daysAgo", { d: Math.floor(hours / 24) });
}

/** Light scoring for sorting. */
export function sortRequests(
  list: LearningRequest[],
  sortKey: string,
): LearningRequest[] {
  const arr = [...list];
  switch (sortKey) {
    case "urgent":
      return arr.sort((a, b) => {
        const u = { high: 3, med: 2, low: 1 } as const;
        if (u[a.urgency] !== u[b.urgency]) return u[b.urgency] - u[a.urgency];
        return a.postedAtHours - b.postedAtHours;
      });
    case "budgetHigh":
      return arr.sort((a, b) => b.budgetDzd.max - a.budgetDzd.max);
    case "fewestApps":
      return arr.sort((a, b) => a.applicationCount - b.applicationCount);
    case "newest":
    default:
      return arr.sort((a, b) => a.postedAtHours - b.postedAtHours);
  }
}
