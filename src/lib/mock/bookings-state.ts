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
export type BookingStatus = "confirmed" | "pending" | "cancelled";

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
  status: BookingStatus;
  /** Optional payment method label cached at checkout time. */
  paymentLabel?: string;
  /** ISO timestamp the booking was confirmed in-session. */
  bookedAt: string;
  /** Optional invoice link — kept as a stub for parity with seeded history rows. */
  invoiceUrl?: string;
};

let bookings: Booking[] = [];
const listeners = new Set<() => void>();

// Cache per-account snapshots so useSyncExternalStore's getSnapshot stays
// referentially stable between renders. Invalidated on every mutation.
const accountCache = new Map<string, readonly Booking[]>();
const EMPTY: readonly Booking[] = Object.freeze([]);

export function getBookings(): readonly Booking[] {
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
  const b = bookings.find((x) => x.id === id) ?? null;
  if (!b) return null;
  if (accountId && b.accountId !== accountId) return null;
  return b;
}

export function getBookingsForAccount(accountId: string | null | undefined): readonly Booking[] {
  if (!accountId) return EMPTY;
  const cached = accountCache.get(accountId);
  if (cached) return cached;
  const snapshot = Object.freeze(bookings.filter((b) => b.accountId === accountId));
  accountCache.set(accountId, snapshot);
  return snapshot;
}

export function addBooking(input: Omit<Booking, "id" | "bookedAt">): Booking {
  const entry: Booking = {
    ...input,
    id: `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    bookedAt: new Date().toISOString(),
  };
  // Newest first so the writeback surfaces don't have to re-sort.
  bookings = [entry, ...bookings];
  accountCache.clear();
  listeners.forEach((fn) => fn());
  return entry;
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
  listeners.forEach((fn) => fn());
  return updated;
}

export function subscribeBookings(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
