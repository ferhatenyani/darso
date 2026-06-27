/**
 * Type-safe URL builders for every internal route on darso.
 *
 * Why centralize: refactors that move pages (e.g. the agency rip, the
 * /teach/(dashboard) group split) leave dangling string-literal hrefs
 * scattered across components. Funneling URL construction through this
 * single object means a rename only changes one return value and the
 * TypeScript compiler surfaces every consumer.
 *
 * All helpers return plain `string` (no locale prefix — `next-intl`'s
 * `Link` / `redirect` / `useRouter` from `@/i18n/navigation` add the
 * `/fr` or `/ar` prefix at navigation time). Helpers that take
 * `searchParams` build the query string with `URLSearchParams` to keep
 * encoding correct for Arabic values.
 *
 * Conventions:
 *   - Path-segment helpers use template-literal return types where it
 *     adds clarity (e.g. `\`/teachers/${string}\``), otherwise `string`.
 *   - Query-string helpers accept an optional record; falsy values
 *     (`null` / `undefined` / `""`) are dropped.
 *   - Helpers are pure — no I/O, safe to call from both server and
 *     client components.
 */

function qs(params: Record<string, string | number | boolean | null | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const out = search.toString();
  return out ? `?${out}` : "";
}

export const routes = {
  // ───────── marketing / public ─────────
  home: (): "/" => "/",
  about: (): "/about" => "/about",
  howItWorks: (): "/how-it-works" => "/how-it-works",
  press: (): "/press" => "/press",
  careers: (): "/careers" => "/careers",
  blog: (): "/blog" => "/blog",
  help: (): "/help" => "/help",
  trust: (): "/trust" => "/trust",
  contact: (): "/contact" => "/contact",
  legalTerms: (): "/legal/terms" => "/legal/terms",
  legalPrivacy: (): "/legal/privacy" => "/legal/privacy",
  legalCookies: (): "/legal/cookies" => "/legal/cookies",

  // ───────── auth ─────────
  signIn: (next?: string | null): string => `/sign-in${qs({ next })}`,
  signUp: (next?: string | null): string => `/sign-up${qs({ next })}`,
  forgot: (): "/forgot" => "/forgot",

  // ───────── discovery ─────────
  browse: (params?: {
    subject?: string | null;
    wilaya?: string | null;
    mode?: string | null;
    audience?: string | null;
    format?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
  }): string => `/browse${qs(params ?? {})}`,
  categories: (): "/categories" => "/categories",
  teachers: (): "/teachers" => "/teachers",
  teacher: (slug: string): `/teachers/${string}` => `/teachers/${slug}`,
  course: (slug: string): `/courses/${string}` => `/courses/${slug}`,
  event: (id: string): `/events/${string}` => `/events/${id}`,
  search: (q?: string | null): string => `/search${qs({ q })}`,
  favorites: (): "/favorites" => "/favorites",
  live: (): "/live" => "/live",

  // ───────── learner requests ─────────
  requests: (): "/requests" => "/requests",
  request: (id: string): `/requests/${string}` => `/requests/${id}`,
  requestEdit: (id: string): `/requests/${string}/edit` => `/requests/${id}/edit`,
  requestNew: (): "/requests/new" => "/requests/new",
  requestsMy: (): "/requests/my" => "/requests/my",

  // ───────── disputes ─────────
  disputes: (): "/disputes" => "/disputes",
  disputeDetail: (id: string): `/disputes/${string}` => `/disputes/${id}`,

  // ───────── account (student) ─────────
  account: (tab?: string | null): string => `/account${qs({ tab })}`,
  accountOnboarding: (): "/account/onboarding" => "/account/onboarding",
  accountInvoice: (id: string): `/account/invoices/${string}` => `/account/invoices/${id}`,

  // ───────── messaging / notifications / calendar ─────────
  messages: (): "/messages" => "/messages",
  messageThread: (id: string): `/messages/${string}` => `/messages/${id}`,
  notifications: (): "/notifications" => "/notifications",
  calendar: (): "/calendar" => "/calendar",

  // ───────── live session ─────────
  call: (sessionId: string): `/call/${string}` => `/call/${sessionId}`,

  // ───────── teach (public landing + onboarding + pricing) ─────────
  teachLanding: (): "/teach" => "/teach",
  teachOnboarding: (): "/teach/onboarding" => "/teach/onboarding",
  teachPricing: (): "/teach/pricing" => "/teach/pricing",
  teachResources: (): "/teach/resources" => "/teach/resources",

  // ───────── teach (dashboard) ─────────
  teachDashboard: (): "/teach/dashboard" => "/teach/dashboard",
  teachProfile: (): "/teach/profile" => "/teach/profile",
  teachReviews: (): "/teach/reviews" => "/teach/reviews",
  teachRequests: (): "/teach/requests" => "/teach/requests",
  teachApplications: (): "/teach/applications" => "/teach/applications",
  teachOndemand: (): "/teach/ondemand" => "/teach/ondemand",
  teachAnalytics: (): "/teach/analytics" => "/teach/analytics",
  teachSubscription: (): "/teach/subscription" => "/teach/subscription",
  teachPayouts: (): "/teach/payouts" => "/teach/payouts",

  // ───────── teach (dashboard) — courses ─────────
  teachCourses: (): "/teach/courses" => "/teach/courses",
  teachCourse: (id: string): `/teach/courses/${string}` => `/teach/courses/${id}`,
  teachCourseNew: (): "/teach/courses/new" => "/teach/courses/new",

  // ───────── teach (dashboard) — events ─────────
  teachEvents: (): "/teach/events" => "/teach/events",
  teachEvent: (id: string): `/teach/events/${string}` => `/teach/events/${id}`,
  teachEventNew: (): "/teach/events/new" => "/teach/events/new",

  // ───────── teach (dashboard) — agency ─────────
  teachAgency: (): "/teach/agency" => "/teach/agency",
  teachAgencyAnalytics: (): "/teach/agency/analytics" => "/teach/agency/analytics",
} as const;

export type Routes = typeof routes;
