/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/teacher/analytics?period=30&scope=teacher
 *     → { kpis, bookingsSeries, revenueSeries, topCourses, topSubjects }
 *   GET    /api/teacher/analytics?period=30&scope=agency
 *     → same shape, server aggregates across `parentAgencyId` siblings.
 *   (no subscribe — analytics is request/response, optionally refetched on focus)
 *
 * Shape: the backend should return shapes matching AnalyticsKpi /
 *   TimeSeriesPoint[] / TopCourse[] / TopSubject[] defined below.
 * Cache invalidation: figures are pure derivations of (accountId, period, scope)
 *   so caching at the fetch layer is safe — invalidate when the underlying
 *   bookings / payouts stores mutate so totals stay consistent.
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

import { courses } from "./courses";
import type { LocalizedString } from "./teachers";

export type AnalyticsPeriod = 7 | 30 | 90 | 365;
export type AnalyticsScope = "teacher" | "agency";

export type AnalyticsKpi = {
  conversionRate: { current: number; previous: number };
  retention: { current: number; previous: number };
  refundRate: { current: number; previous: number };
  noShowRate: { current: number; previous: number };
};

export type TimeSeriesPoint = {
  /** ISO date (yyyy-mm-dd) at the start of the bucket. */
  date: string;
  value: number;
};

export type TopCourse = {
  courseId: string;
  /** Localized course title (caller picks `fr` or `ar`). */
  title: LocalizedString;
  bookings: number;
  revenueDzd: number;
  conversionRate: number;
};

export type TopSubject = {
  /** Subject label localized in both languages. */
  subject: LocalizedString;
  searches: number;
  bookings: number;
  conversionRate: number;
};

// ────────────────────────────────────────────────────────────────────────────
// Seeded PRNG — deterministic per (accountId, period, scope) tuple so the
// figures stay stable across re-renders and look the same in the demo every
// time. xmur3 → mulberry32 (cheap, well-distributed).
// ────────────────────────────────────────────────────────────────────────────

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngFor(accountId: string, period: AnalyticsPeriod, scope: AnalyticsScope, salt = ""): () => number {
  const seed = xmur3(`${accountId}|${period}|${scope}|${salt}`)();
  return mulberry32(seed);
}

/** Round to one decimal. */
const round1 = (n: number) => Math.round(n * 10) / 10;

// ────────────────────────────────────────────────────────────────────────────
// KPIs — four percentages with previous-period comparisons. The "scope =
// agency" path nudges figures slightly higher (more members → more bookings,
// better retention) so the comparison feels real.
// ────────────────────────────────────────────────────────────────────────────

export function getKpis(
  accountId: string,
  period: AnalyticsPeriod,
  scope: AnalyticsScope = "teacher",
): AnalyticsKpi {
  const r = rngFor(accountId, period, scope, "kpis");
  const lift = scope === "agency" ? 1.18 : 1;

  const conversion = round1(8 + r() * 6 * lift); // 8-14% (teacher), up to ~16% (agency)
  const convPrev = round1(conversion - (r() * 3 - 1.2));

  const retention = round1(34 + r() * 18 * Math.min(lift, 1.12));
  const retPrev = round1(retention - (r() * 4 - 1.5));

  const refund = round1(1.2 + r() * 2.8);
  const refundPrev = round1(refund + (r() * 1.4 - 0.6));

  const noShow = round1(2.5 + r() * 3.5);
  const noShowPrev = round1(noShow + (r() * 1.6 - 0.4));

  return {
    conversionRate: { current: conversion, previous: Math.max(0, convPrev) },
    retention: { current: retention, previous: Math.max(0, retPrev) },
    refundRate: { current: refund, previous: Math.max(0, refundPrev) },
    noShowRate: { current: noShow, previous: Math.max(0, noShowPrev) },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Time series — bookings (count) + revenue (DZD). Bucket size adapts to the
// selected period so we always return 14-30 points (legible on a sparkline
// without bunching). The series shape is a gentle sine plus jitter — feels
// organic without screaming "AI demo".
// ────────────────────────────────────────────────────────────────────────────

function buildSeries(opts: {
  accountId: string;
  period: AnalyticsPeriod;
  scope: AnalyticsScope;
  salt: string;
  base: number;
  amplitude: number;
}): TimeSeriesPoint[] {
  const { accountId, period, scope, salt, base, amplitude } = opts;
  const r = rngFor(accountId, period, scope, salt);
  const { points, bucketDays } = bucketShape(period);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const phase = r() * Math.PI * 2;
  const drift = (r() - 0.5) * 0.4; // gentle trend up/down
  const scopeMul = scope === "agency" ? 3.4 : 1;

  return Array.from({ length: points }, (_, i) => {
    const bucketStart = new Date(today);
    bucketStart.setDate(today.getDate() - (points - 1 - i) * bucketDays);
    const t = i / Math.max(1, points - 1);
    const wave = Math.sin(phase + t * Math.PI * 2.2) * amplitude;
    const jitter = (r() - 0.5) * amplitude * 0.4;
    const trend = drift * amplitude * t;
    const value = Math.max(0, Math.round((base + wave + jitter + trend) * scopeMul));
    return { date: bucketStart.toISOString().slice(0, 10), value };
  });
}

function bucketShape(period: AnalyticsPeriod): { points: number; bucketDays: number } {
  switch (period) {
    case 7:
      return { points: 7, bucketDays: 1 }; // 7 daily buckets
    case 30:
      return { points: 15, bucketDays: 2 }; // 2-day buckets, 30 days
    case 90:
      return { points: 13, bucketDays: 7 }; // weekly, ~90 days
    case 365:
      return { points: 12, bucketDays: 30 }; // monthly, 1 year
  }
}

export function getBookingsSeries(
  accountId: string,
  period: AnalyticsPeriod,
  scope: AnalyticsScope = "teacher",
): TimeSeriesPoint[] {
  return buildSeries({
    accountId,
    period,
    scope,
    salt: "bookings",
    base: period === 7 ? 4 : period === 30 ? 7 : period === 90 ? 26 : 95,
    amplitude: period === 7 ? 2.2 : period === 30 ? 3.4 : period === 90 ? 9 : 28,
  });
}

export function getRevenueSeries(
  accountId: string,
  period: AnalyticsPeriod,
  scope: AnalyticsScope = "teacher",
): TimeSeriesPoint[] {
  // Roughly bookings × avg session price (≈1800 DZD).
  return buildSeries({
    accountId,
    period,
    scope,
    salt: "revenue",
    base: period === 7 ? 7200 : period === 30 ? 12600 : period === 90 ? 46800 : 171000,
    amplitude: period === 7 ? 3000 : period === 30 ? 5400 : period === 90 ? 14000 : 44000,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Top courses — picks the first N courses from the mock catalog and assigns
// them seeded bookings/revenue/conversion. Sorted by revenue desc.
// ────────────────────────────────────────────────────────────────────────────

export function getTopCourses(
  accountId: string,
  period: AnalyticsPeriod,
  scope: AnalyticsScope = "teacher",
  limit = 5,
): TopCourse[] {
  const r = rngFor(accountId, period, scope, "topCourses");
  const pool = scope === "agency" ? courses : courses.slice(0, 8);
  const periodMul = period === 7 ? 0.25 : period === 30 ? 1 : period === 90 ? 2.6 : 8.5;
  const scopeMul = scope === "agency" ? 2.4 : 1;

  return pool
    .slice(0, Math.min(pool.length, limit + 3))
    .map((c) => {
      const bookings = Math.max(1, Math.round((4 + r() * 14) * periodMul * scopeMul));
      const revenueDzd = Math.round(bookings * (c.priceDzd || 1800) * (0.85 + r() * 0.25));
      const conversionRate = round1(6 + r() * 12);
      return {
        courseId: c.id,
        title: c.title,
        bookings,
        revenueDzd,
        conversionRate,
      };
    })
    .sort((a, b) => b.revenueDzd - a.revenueDzd)
    .slice(0, limit);
}

// ────────────────────────────────────────────────────────────────────────────
// Top subjects — what students searched, and what fraction of those searches
// led to a booking. Catalog is small and locale-static (the demo isn't
// localizing the long tail of search terms).
// ────────────────────────────────────────────────────────────────────────────

const SUBJECT_POOL: LocalizedString[] = [
  { fr: "Mathématiques · Bac", ar: "الرياضيات · الباك" },
  { fr: "Anglais · IELTS", ar: "الإنجليزية · IELTS" },
  { fr: "Programmation · React", ar: "البرمجة · React" },
  { fr: "Physique · 3e année", ar: "الفيزياء · 3 ثانوي" },
  { fr: "Tajwid & Coran", ar: "التجويد والقرآن" },
  { fr: "Piano · débutants", ar: "البيانو · مبتدئون" },
  { fr: "Français · expression", ar: "الفرنسية · التعبير" },
  { fr: "Sciences · BEM", ar: "العلوم · BEM" },
];

export function getTopSubjects(
  accountId: string,
  period: AnalyticsPeriod,
  scope: AnalyticsScope = "teacher",
  limit = 6,
): TopSubject[] {
  const r = rngFor(accountId, period, scope, "topSubjects");
  const periodMul = period === 7 ? 0.3 : period === 30 ? 1 : period === 90 ? 2.4 : 7;
  const scopeMul = scope === "agency" ? 2.1 : 1;

  return SUBJECT_POOL
    .slice(0, Math.min(SUBJECT_POOL.length, limit + 2))
    .map((subject) => {
      const searches = Math.max(8, Math.round((40 + r() * 180) * periodMul * scopeMul));
      const conversion = 4 + r() * 14;
      const bookings = Math.max(1, Math.round((searches * conversion) / 100));
      return {
        subject,
        searches,
        bookings,
        conversionRate: round1(conversion),
      };
    })
    .sort((a, b) => b.searches - a.searches)
    .slice(0, limit);
}
