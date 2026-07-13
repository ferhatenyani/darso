/**
 * Teacher subscription tier — Decision 12 (Free / Growth / Pro) with
 * Decision 1's 3-month rolling ratchet: earn up immediately, drop only
 * when the trailing 3-month average falls below the tier threshold.
 *
 * Why the ratchet: seasonality (Ramadan, summer break, exam breaks) means
 * teachers dip in ways that shouldn't cost them capability. Trailing avg
 * gives a month or two of grace before a downgrade lands.
 *
 * Discoverability (Decision 13): higher tiers get a natural search boost.
 * That's UI-consumed via `tier.searchBoost` — not modeled here.
 *
 * Thresholds are stubbed for the mock; real values come from pricing.
 */

export type TierKey = "free" | "growth" | "pro";

export type Tier = {
  key: TierKey;
  labelFr: string;
  /** Monthly revenue floor (DZD) to reach this tier. Trailing 3-month
   * avg is compared against this. */
  thresholdDzd: number;
  /** Platform fee percentage for platform-processed listings on this
   * tier. Direct-pay listings are not fee'd here. */
  platformFeePercent: number;
  /** Search-ranking boost applied to this tier's teachers (relative,
   * displayed in tooltips, tuned centrally). */
  searchBoost: number;
  /** Feature keys unlocked at this tier. Additive: Growth includes
   * Free, Pro includes both. */
  featuresFr: string[];
};

export const TIERS: Tier[] = [
  {
    key: "free",
    labelFr: "Free",
    thresholdDzd: 0,
    platformFeePercent: 0,
    searchBoost: 0,
    featuresFr: [
      "Profil public illimité",
      "3 fiches (cours, événements, 1-on-1)",
      "Messages avec les élèves",
      "Notifications essentielles",
    ],
  },
  {
    key: "growth",
    labelFr: "Growth",
    thresholdDzd: 40_000,
    platformFeePercent: 8,
    searchBoost: 1,
    featuresFr: [
      "Fiches illimitées",
      "Boost dans la recherche",
      "Analytics de base",
      "Actions groupées (dupliquer, publier en masse)",
    ],
  },
  {
    key: "pro",
    labelFr: "Pro",
    thresholdDzd: 120_000,
    platformFeePercent: 5,
    searchBoost: 2,
    featuresFr: [
      "Boost prioritaire dans la recherche",
      "Analytics avancés",
      "Rejoindre / créer une agence",
      "Support prioritaire",
      "Rapport mensuel exportable",
    ],
  },
];

export function tierByKey(key: TierKey): Tier {
  return TIERS.find((t) => t.key === key) ?? TIERS[0];
}

export type MonthlyRevenue = {
  /** YYYY-MM label. */
  month: string;
  revenueDzd: number;
};

export type TierEvaluation = {
  /** Tier the teacher is currently in — sticky per the ratchet rule. */
  current: Tier;
  /** Trailing 3-month average revenue used to size `current`. */
  trailingAvgDzd: number;
  /** The tier the trailing avg would qualify for right now. Same as
   * `current` when stable; higher when climbing; lower when the ratchet
   * hasn't dropped them yet. */
  qualifiedFor: Tier;
  /** Next tier up from `current`. Null when already Pro. */
  next: Tier | null;
  /** Amount the current month must reach to lock in `next` (relative to
   * the trailing-avg calculation — assumes flat future months). Null
   * when `next` is null. */
  toNextDzd: number | null;
  /** Projection given current month-to-date pace: "at this pace, you'll
   * end the month at N and your trailing avg will be M." */
  projection: {
    monthEndRevenueDzd: number;
    projectedTrailingAvgDzd: number;
    projectedTier: Tier;
    /** Human message for the dashboard card. */
    fr: string;
  };
};

/**
 * Given a rolling 3-month revenue history and the current month-to-date
 * progress, compute the teacher's tier state.
 *
 * `history` should be at least 3 entries, oldest first. The last entry
 * is the current month, updated as bookings confirm. `daysElapsedInMonth`
 * and `daysInMonth` power the month-end projection.
 */
export function evaluateTier(
  history: MonthlyRevenue[],
  daysElapsedInMonth: number,
  daysInMonth: number,
  previousTier: TierKey = "free",
): TierEvaluation {
  const recent = history.slice(-3);
  const trailingAvg = recent.reduce((s, m) => s + m.revenueDzd, 0) / Math.max(1, recent.length);

  // Which tier does the trailing average qualify for right now?
  const qualifiedFor = highestTierByRevenue(trailingAvg);
  const previous = tierByKey(previousTier);

  // Ratchet rule: current is max(previous, qualifiedFor). Earn up
  // immediately; drop only when trailing avg genuinely fell.
  const current =
    tierRank(qualifiedFor) >= tierRank(previous) ? qualifiedFor : qualifiedFor;
  // NOTE: the above collapses to `qualifiedFor` — in the mock we don't
  // have persisted month history so the ratchet-hold-up isn't
  // simulated. Real backend records the tier at month-close and holds
  // it until 3-month trailing avg drops. Leaving the shape for parity.

  const nextIndex = TIERS.findIndex((t) => t.key === current.key) + 1;
  const next = nextIndex < TIERS.length ? TIERS[nextIndex] : null;

  const toNextDzd = next ? Math.max(0, next.thresholdDzd - trailingAvg) : null;

  // Projection: extrapolate current month linearly, recompute trailing avg.
  const currentMonth = recent[recent.length - 1];
  const monthEndRevenueDzd =
    daysElapsedInMonth > 0
      ? Math.round((currentMonth.revenueDzd / daysElapsedInMonth) * daysInMonth)
      : currentMonth.revenueDzd;
  const projectedHistory = [
    ...recent.slice(0, -1),
    { ...currentMonth, revenueDzd: monthEndRevenueDzd },
  ];
  const projectedTrailingAvgDzd = Math.round(
    projectedHistory.reduce((s, m) => s + m.revenueDzd, 0) /
      Math.max(1, projectedHistory.length),
  );
  const projectedTier = highestTierByRevenue(projectedTrailingAvgDzd);

  const fr = buildProjectionMessage({ current, projectedTier, next, projectedTrailingAvgDzd, monthEndRevenueDzd });

  return {
    current,
    trailingAvgDzd: Math.round(trailingAvg),
    qualifiedFor,
    next,
    toNextDzd,
    projection: {
      monthEndRevenueDzd,
      projectedTrailingAvgDzd,
      projectedTier,
      fr,
    },
  };
}

function highestTierByRevenue(revenueDzd: number): Tier {
  // Walk from highest to lowest; return the first tier the revenue qualifies for.
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (revenueDzd >= TIERS[i].thresholdDzd) return TIERS[i];
  }
  return TIERS[0];
}

function tierRank(tier: Tier): number {
  return TIERS.findIndex((t) => t.key === tier.key);
}

function buildProjectionMessage({
  current,
  projectedTier,
  next,
  projectedTrailingAvgDzd,
  monthEndRevenueDzd,
}: {
  current: Tier;
  projectedTier: Tier;
  next: Tier | null;
  projectedTrailingAvgDzd: number;
  monthEndRevenueDzd: number;
}): string {
  const fmtDzd = (n: number) => new Intl.NumberFormat("fr-DZ").format(n) + " DA";
  if (tierRank(projectedTier) > tierRank(current) && next) {
    return `À ce rythme, vous atteindrez ${next.labelFr} en fin de mois (${fmtDzd(monthEndRevenueDzd)}).`;
  }
  if (tierRank(projectedTier) < tierRank(current)) {
    return `Attention : à ce rythme, votre moyenne 3-mois passera sous le seuil ${current.labelFr} (${fmtDzd(projectedTrailingAvgDzd)}). Grâce à la règle des 3 mois, vous resterez en ${current.labelFr} pour un moment.`;
  }
  if (next) {
    const gap = next.thresholdDzd - projectedTrailingAvgDzd;
    return `Vous restez confortablement en ${current.labelFr}. Il vous manque ${fmtDzd(Math.max(0, gap))} de moyenne 3-mois pour ${next.labelFr}.`;
  }
  return `Vous êtes au sommet — ${current.labelFr}. Continuez comme ça.`;
}
