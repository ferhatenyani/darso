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

export function subscribeBookings(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
