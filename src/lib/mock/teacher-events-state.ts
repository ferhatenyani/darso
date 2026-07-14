/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/teacher/events          → seeds initial state for getTeacherEvents
 *   GET    /api/teacher/events/:id      → getEventById(id)
 *   POST   /api/teacher/events          → addEvent(input)
 *   PATCH  /api/teacher/events/:id      → updateEvent(id, patch)
 *   DELETE /api/teacher/events/:id      → deleteEvent(id)
 *   (subscribe maps to either SSE/WebSocket OR client-side polling)
 *
 * Shape: the backend should return TeacherEvent[] matching the type below.
 * Cache invalidation: every mutation should invalidate the per-account snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * In-memory store for teacher-owned events catalogue (live workshops,
 * cohorts, open houses, recording premieres).
 *
 * Wires the event wizard's Publish / Publish later buttons (Batch 7c)
 * AND the [id] edit page's Save / Delete actions into a single mock
 * source that /teach/events subscribes to so newly-published or edited
 * events appear immediately.
 *
 * Mirrors teacher-courses-state.ts / bookings-state.ts: module-scoped
 * state, listener set, get/add/update/delete/subscribe API consumed via
 * useSyncExternalStore. Per-account snapshot cache (frozen arrays) keeps
 * useSyncExternalStore's getSnapshot referentially stable. Mutations
 * survive in-session and reset on full page reload per locked-in default 2.
 *
 * Seed source: the existing `teacherEvents` constant in dashboard.ts is
 * a different shape (presentation-only date fragments) — we keep it for
 * the listing's "big date block" rendering but ALSO create normalized
 * `TeacherEvent` rows here tagged with `accountId: "acc-khalil"`.
 */
import { teacherEvents as legacyTeacherEvents } from "./dashboard";

export type TeacherEventFormat =
  | "live-workshop"
  | "cohort"
  | "open-house"
  | "recording-premiere";

export type TeacherEventStatus = "published" | "draft";

export type TeacherEvent = {
  id: string;
  accountId?: string;
  title: { fr: string; ar: string };
  format: TeacherEventFormat;
  description?: string;
  /** ISO start datetime. */
  start: string;
  /** ISO end datetime. */
  end?: string;
  /** Olson timezone string — defaults to Africa/Algiers. */
  timezone?: string;
  capacity: number;
  /** Mix of "students" | "parents" | "teachers" — open list for forward-compat. */
  targetAudience: string[];
  /** Locale code: fr | ar | en | mixed */
  language: string;
  priceDzd: number;
  isFree: boolean;
  /** Free-form refund policy id: "flexible" | "moderate" | "strict" | "none" */
  refundPolicy: string;
  status: TeacherEventStatus;
  createdAt: string;
};

/**
 * Convert legacy dashboard rows (presentation-only) into normalized seed
 * data. We synthesize an ISO start from `date.day` against the current
 * year so the events look "future-ish" without anchoring to a specific
 * past date.
 */
function seedFromLegacy(): TeacherEvent[] {
  const monthFrToIdx: Record<string, number> = {
    "janv": 0, "févr": 1, "mars": 2, "avril": 3, "mai": 4, "juin": 5,
    "juil": 6, "août": 7, "sept": 8, "oct": 9, "nov": 10, "déc": 11,
  };
  const year = new Date().getFullYear();
  return legacyTeacherEvents.map((ev, i) => {
    const monthKey = ev.date.monthFr.toLowerCase().slice(0, 4).replace(".", "");
    // Fallback: month from filename hint (e.g. "Juin" → "juin", "Sept" → "sept").
    let monthIdx = monthFrToIdx[monthKey];
    if (monthIdx == null) {
      const k2 = ev.date.monthFr.toLowerCase().slice(0, 3);
      monthIdx = monthFrToIdx[k2] ?? new Date().getMonth();
    }
    const day = Number.parseInt(ev.date.day, 10) || 1;
    const [hh = "10", mm = "00"] = (ev.hour || "10:00").split(":");
    const start = new Date(year, monthIdx, day, Number(hh), Number(mm)).toISOString();
    const end = new Date(year, monthIdx, day, Number(hh) + 2, Number(mm)).toISOString();
    const formats: TeacherEventFormat[] = ["live-workshop", "cohort", "open-house"];
    return {
      id: ev.id,
      accountId: "acc-khalil",
      title: ev.title,
      format: formats[i % formats.length],
      description: undefined,
      start,
      end,
      timezone: "Africa/Algiers",
      capacity: ev.capacity.total,
      targetAudience: ["students"],
      language: "fr",
      priceDzd: ev.priceDzd,
      isFree: ev.priceDzd === 0,
      refundPolicy: "moderate",
      status: ev.status === "draft" ? "draft" : "published",
      createdAt: new Date(Date.now() - (i + 1) * 86_400_000).toISOString(),
    };
  });
}

let events: TeacherEvent[] = seedFromLegacy();

const listeners = new Set<() => void>();

const accountCache = new Map<string, readonly TeacherEvent[]>();
let allCache: readonly TeacherEvent[] | null = null;
const EMPTY: readonly TeacherEvent[] = Object.freeze([]);

function invalidate() {
  accountCache.clear();
  allCache = null;
  listeners.forEach((fn) => fn());
}

/**
 * Returns events owned by `accountId`. When no id is provided, returns
 * the full catalogue.
 */
export function getTeacherEvents(accountId?: string | null): readonly TeacherEvent[] {
  if (!accountId) {
    if (allCache) return allCache;
    allCache = Object.freeze(events.map((e) => ({ ...e })));
    return allCache;
  }
  const cached = accountCache.get(accountId);
  if (cached) return cached;
  const snapshot = Object.freeze(
    events.filter((e) => !e.accountId || e.accountId === accountId).map((e) => ({ ...e })),
  );
  accountCache.set(accountId, snapshot);
  return snapshot;
}

export function getEventById(id: string | null | undefined): TeacherEvent | undefined {
  if (!id) return undefined;
  const found = events.find((e) => e.id === id);
  return found ? { ...found } : undefined;
}

export type NewEventInput = {
  title: { fr: string; ar: string };
  format: TeacherEventFormat;
  description?: string;
  start: string;
  end?: string;
  timezone?: string;
  capacity: number;
  targetAudience: string[];
  language: string;
  priceDzd: number;
  isFree: boolean;
  refundPolicy: string;
  status: TeacherEventStatus;
  accountId?: string;
};

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "event"
  );
}

export function addEvent(input: NewEventInput): TeacherEvent {
  const seed = slugify(input.title.fr || input.title.ar || "event");
  const id = `e-${seed}-${Date.now().toString(36)}`;
  const entry: TeacherEvent = {
    id,
    accountId: input.accountId,
    title: input.title,
    format: input.format,
    description: input.description,
    start: input.start,
    end: input.end,
    timezone: input.timezone ?? "Africa/Algiers",
    capacity: input.capacity,
    targetAudience: input.targetAudience,
    language: input.language,
    priceDzd: input.isFree ? 0 : input.priceDzd,
    isFree: input.isFree,
    refundPolicy: input.refundPolicy,
    status: input.status,
    createdAt: new Date().toISOString(),
  };
  events = [entry, ...events];
  invalidate();
  return { ...entry };
}

export function updateEvent(id: string, patch: Partial<TeacherEvent>): TeacherEvent | undefined {
  let next: TeacherEvent | undefined;
  events = events.map((e) => {
    if (e.id !== id) return e;
    next = { ...e, ...patch, id: e.id, accountId: e.accountId };
    return next;
  });
  if (!next) return undefined;
  invalidate();
  return { ...next };
}

export function deleteEvent(id: string): boolean {
  const before = events.length;
  events = events.filter((e) => e.id !== id);
  if (events.length === before) return false;
  invalidate();
  return true;
}

export function subscribeTeacherEvents(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export const EMPTY_TEACHER_EVENTS = EMPTY;
