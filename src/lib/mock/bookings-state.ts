/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/bookings                → seeds initial state for getBookings / getBookingsForAccount
 *   POST   /api/bookings                → addBooking(input)
 *   POST   /api/bookings/:id/cancel     → cancelBooking(id)
 *   (subscribe maps to either SSE/WebSocket OR client-side polling)
 *
 * Shape: the backend should return Booking[] matching the Booking type below.
 * Cache invalidation: every mutation should invalidate the per-account snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * In-memory store for student-confirmed bookings.
 *
 * Wires the Reserve / Book / Apply / Join CTAs across teacher-profile,
 * course-detail, event-detail and live-page into a single mock checkout
 * funnel whose writebacks surface on /account payments and /calendar.
 *
 * Mirrors the calendar-state.ts pattern: module-scoped state, listener
 * set, get/add/subscribe API consumed via useSyncExternalStore. Same
 * in-session-only persistence model as auth and the calendar block store
 * per locked-in default 2 — mutations survive client navigation but
 * reset on full page reload.
 */
export type BookingKind = "1to1" | "course" | "event" | "live";

/**
 * Legacy display status. Kept for backward compat with account/invoice/
 * calendar surfaces built before the v3 stage machine landed. Derived from
 * `stage` by `stageToStatus`.
 */
export type BookingStatus = "confirmed" | "pending" | "cancelled";

/**
 * v3 booking stage machine.
 *
 * Catalog listings (pay-first):
 *   pending_payment → pending_teacher_confirmation → confirmed → completed
 *
 * Custom listings (approve-then-pay):
 *   requested → approved → pending_payment → pending_teacher_confirmation → confirmed → completed
 *   requested → rejected | expired (terminal)
 *
 * Post-confirmed branches:
 *   confirmed → removed_by_teacher (24h roster review, catalog only)
 *   completed → reviewed | disputed | cancelled
 *   disputed → refunded | dismissed
 */
export type BookingStage =
  | "requested"
  | "approved"
  | "rejected"
  | "expired"
  | "pending_payment"
  | "pending_teacher_confirmation"
  | "confirmed"
  | "removed_by_teacher"
  | "completed"
  | "reviewed"
  | "disputed"
  | "refunded"
  | "dismissed"
  | "cancelled";

/**
 * Map a stage to the legacy status enum consumed by pre-v3 surfaces
 * (account/invoices, calendar, dashboards). Anything not-yet-confirmed is
 * "pending"; anything terminated adversely is "cancelled".
 */
export function stageToStatus(stage: BookingStage): BookingStatus {
  switch (stage) {
    case "confirmed":
    case "completed":
    case "reviewed":
      return "confirmed";
    case "rejected":
    case "expired":
    case "cancelled":
    case "removed_by_teacher":
    case "refunded":
    case "dismissed":
      return "cancelled";
    default:
      return "pending";
  }
}

export type Booking = {
  id: string;
  /** Owner account id — bookings are filtered by current user on display. */
  accountId: string;
  kind: BookingKind;
  /** Localized human title shown in receipts / calendar tiles. */
  subjectTitle: { fr: string; ar: string };
  /** Slug of the teacher being booked (e.g. for routing back to profile). */
  teacherSlug: string;
  /** Teacher display name (cached so writeback surfaces don't have to look it up). */
  teacherName: { fr: string; ar: string };
  priceDzd: number;
  /** ISO start time when known (1to1 slot, scheduled event, cohort date). */
  start?: string;
  /** ISO end time when known. */
  end?: string;
  /** Legacy display status — always derived from `stage` on write. */
  status: BookingStatus;
  /** v3 stage machine. Missing on the oldest legacy rows. */
  stage?: BookingStage;
  /** ISO timestamp the current stage was entered. Drives 48h/72h timers. */
  stageEnteredAt?: string;
  /** Optional payment method label cached at checkout time. */
  paymentLabel?: string;
  /** ISO timestamp the booking was created. */
  bookedAt: string;
  /** Optional invoice link — kept as a stub for parity with seeded history rows. */
  invoiceUrl?: string;
};

import { loadPersisted, savePersisted } from "./persistence";

const PERSIST_KEY = "bookings";

let bookings: Booking[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

// Cache per-account snapshots so useSyncExternalStore's getSnapshot stays
// referentially stable between renders. Invalidated on every mutation.
const accountCache = new Map<string, readonly Booking[]>();
const EMPTY: readonly Booking[] = Object.freeze([]);

// Client-only lazy hydration. On the first read after client mount, pull
// persisted bookings from localStorage into the module state. Server reads
// (SSR) always see the empty seed — known mock limitation, deep-links to
// newly-created bookings require client navigation.
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const persisted = loadPersisted<Booking[]>(PERSIST_KEY, []);
  if (persisted.length) {
    bookings = persisted;
    accountCache.clear();
    listeners.forEach((fn) => fn());
  }
}

function persist() {
  savePersisted(PERSIST_KEY, bookings);
}

export function getBookings(): readonly Booking[] {
  ensureHydrated();
  return bookings;
}

/**
 * Lookup helper for invoice / receipt routes. Returns the booking if its id
 * matches AND it belongs to the given account (when provided). The accountId
 * scope keeps the in-memory store safe to read from auth-gated server pages
 * without leaking a record across accounts.
 */
export function findBookingByIdForAccount(
  id: string,
  accountId: string | null | undefined,
): Booking | null {
  ensureHydrated();
  const b = bookings.find((x) => x.id === id) ?? null;
  if (!b) return null;
  if (accountId && b.accountId !== accountId) return null;
  return b;
}

export function getBookingsForAccount(accountId: string | null | undefined): readonly Booking[] {
  ensureHydrated();
  if (!accountId) return EMPTY;
  const cached = accountCache.get(accountId);
  if (cached) return cached;
  const snapshot = Object.freeze(bookings.filter((b) => b.accountId === accountId));
  accountCache.set(accountId, snapshot);
  return snapshot;
}

export function addBooking(input: Omit<Booking, "id" | "bookedAt">): Booking {
  const now = new Date().toISOString();
  const stage = input.stage;
  const entry: Booking = {
    ...input,
    // Legacy surfaces read `status`; keep it in sync when a stage is set.
    status: stage ? stageToStatus(stage) : input.status,
    stageEnteredAt: stage ? now : input.stageEnteredAt,
    id: `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    bookedAt: now,
  };
  // Newest first so the writeback surfaces don't have to re-sort.
  bookings = [entry, ...bookings];
  accountCache.clear();
  persist();
  listeners.forEach((fn) => fn());
  return entry;
}

/**
 * Move a booking through the v3 stage machine. Also updates the derived
 * `status` field so legacy surfaces stay in sync, and stamps the transition
 * time for downstream 48h/72h timers. Returns the updated booking or null.
 */
export function advanceBookingStage(id: string, stage: BookingStage): Booking | null {
  ensureHydrated();
  let updated: Booking | null = null;
  const now = new Date().toISOString();
  bookings = bookings.map((b) => {
    if (b.id !== id) return b;
    updated = {
      ...b,
      stage,
      stageEnteredAt: now,
      status: stageToStatus(stage),
    };
    return updated;
  });
  if (!updated) return null;
  accountCache.clear();
  persist();
  listeners.forEach((fn) => fn());
  return updated;
}

/**
 * Flip a confirmed booking to "cancelled". Returns the updated record,
 * or `null` when no booking with that id exists. Invalidates the
 * per-account snapshot cache and notifies subscribers so the calendar
 * + /account payments surfaces re-render with the new status.
 */
export function cancelBooking(id: string): Booking | null {
  let updated: Booking | null = null;
  bookings = bookings.map((b) => {
    if (b.id !== id) return b;
    if (b.status === "cancelled") {
      updated = b;
      return b;
    }
    updated = { ...b, status: "cancelled" as const };
    return updated;
  });
  if (!updated) return null;
  accountCache.clear();
  persist();
  listeners.forEach((fn) => fn());
  return updated;
}

/**
 * Wipe the persisted booking store. Called from the dev scenario switcher
 * to reset the mock for demos. Also notifies subscribers so any live view
 * reflects the empty state immediately.
 */
export function resetBookings(): void {
  bookings = [];
  accountCache.clear();
  persist();
  listeners.forEach((fn) => fn());
}

export function subscribeBookings(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
