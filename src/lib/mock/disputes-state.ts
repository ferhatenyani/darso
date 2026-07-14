/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/disputes                → seeds initial state for getDisputes
 *   GET    /api/disputes/:id            → getDisputeById(id)
 *   POST   /api/disputes                → addDispute(input)
 *   (subscribe maps to either SSE/WebSocket OR client-side polling)
 *
 * Shape: the backend should return Dispute[] matching the type below.
 * Cache invalidation: every mutation should invalidate the per-account snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * In-memory store for disputes opened in-session.
 *
 * Backs the "+ Start a dispute" CTA on the disputes shell and the
 * per-booking "Report a problem" action on /account → Recent bookings.
 *
 * Mirrors the calendar-state.ts / bookings-state.ts pattern: module-scoped
 * state, listener set, get/add/subscribe API consumed via
 * useSyncExternalStore. The store is seeded once on first read from the
 * static `disputes` export at src/lib/mock/disputes.ts so that the existing
 * mock catalogue stays the source of truth without mutating the import.
 *
 * Persistence: in-session only, per locked-in default 2 — mutations survive
 * client navigation but reset on full page reload.
 */
import {
  disputes as seedDisputes,
  type Dispute,
  type DisputeMessage,
  type DisputeState,
  type DisputeTimelineEntry,
} from "./disputes";
import { featuredTeachers, type LocalizedString, type Teacher } from "./teachers";

export type { Dispute } from "./disputes";

/**
 * Owner tagging — the seeded disputes are all opened by Lina M., so we
 * pin them to the demo student account. New disputes carry the actual
 * `accountId` from the caller.
 */
const SEED_OWNER_ID = "acc-lina";

type DisputeRecord = Dispute & {
  /** Owner of the dispute file (the party who opened it). */
  accountId: string;
};

let _seeded = false;
let _disputes: DisputeRecord[] = [];
const listeners = new Set<() => void>();

// Cache per-account snapshots so useSyncExternalStore's getSnapshot stays
// referentially stable between renders. Invalidated on every mutation.
const accountCache = new Map<string, readonly Dispute[]>();
let allCache: readonly Dispute[] | null = null;
const EMPTY: readonly Dispute[] = Object.freeze([]);

function ensureSeeded() {
  if (_seeded) return;
  _seeded = true;
  // Clone each seed dispute into our owned record. We don't mutate the
  // imported `disputes` array.
  _disputes = seedDisputes.map((d) => ({ ...d, accountId: SEED_OWNER_ID }));
}

function notify() {
  accountCache.clear();
  allCache = null;
  listeners.forEach((fn) => fn());
}

export function getDisputes(accountId?: string | null): readonly Dispute[] {
  ensureSeeded();
  if (!accountId) {
    if (allCache) return allCache;
    allCache = Object.freeze(_disputes.map(stripOwner));
    return allCache;
  }
  const cached = accountCache.get(accountId);
  if (cached) return cached;
  const snapshot = Object.freeze(
    _disputes.filter((d) => d.accountId === accountId).map(stripOwner),
  );
  accountCache.set(accountId, snapshot);
  return snapshot;
}

export function getDisputeById(id: string): Dispute | undefined {
  ensureSeeded();
  const found = _disputes.find((d) => d.id === id);
  if (!found) return undefined;
  return stripOwner(found);
}

function stripOwner(record: DisputeRecord): Dispute {
  const { accountId: _ignore, ...rest } = record;
  void _ignore;
  return rest;
}

export type DisputeReason =
  | "teacher-no-show"
  | "quality-issue"
  | "payment-issue"
  | "other";

export type AddDisputeInput = {
  accountId: string;
  /**
   * Which booking the dispute is about. May be a Booking id, or the
   * sentinel string `"other"` when the user picked the fallback subject.
   */
  bookingId?: string;
  /**
   * Optional human title for the subject row — when the caller has it
   * (e.g. opened from a prefilled booking), surface it on the timeline
   * entry. Falls back to a generic localized label otherwise.
   */
  subjectTitle?: LocalizedString;
  /**
   * Optional course / cohort label for the subject row. Mirrors the
   * `subject.course` field on the static catalogue.
   */
  subjectCourse?: LocalizedString;
  /**
   * Counterparty teacher slug, when known (prefilled bookings carry it).
   * Falls back to the first featured teacher so we always have an avatar
   * + accent to render in the list.
   */
  teacherSlug?: string;
  /** DZD amount in dispute — defaults to 0 when not provided by caller. */
  amountDzd?: number;
  reason: DisputeReason;
  description: string;
  /** ISO timestamp the dispute was opened in-session. */
  openedAt?: string;
  /** State — defaults to "open". */
  status?: DisputeState;
};

const REASON_TITLE: Record<DisputeReason, LocalizedString> = {
  "teacher-no-show": {
    fr: "Prof absent ou en retard",
    ar: "غياب الأستاذ أو تأخّره",
  },
  "quality-issue": {
    fr: "Problème de qualité",
    ar: "مشكلة في الجودة",
  },
  "payment-issue": {
    fr: "Problème de paiement",
    ar: "مشكلة في الدفع",
  },
  other: {
    fr: "Autre",
    ar: "أخرى",
  },
};

function fallbackTeacher(): Teacher {
  return featuredTeachers[0]!;
}

export function addDispute(input: AddDisputeInput): Dispute {
  ensureSeeded();
  const openedAt = input.openedAt ?? new Date().toISOString();
  const id = `DSP-${Date.now().toString(36).slice(-6).toUpperCase()}`;
  const teacher = input.teacherSlug
    ? (featuredTeachers.find((t) => t.slug === input.teacherSlug) ?? fallbackTeacher())
    : fallbackTeacher();

  const title: LocalizedString =
    input.subjectTitle ?? REASON_TITLE[input.reason];
  const course: LocalizedString =
    input.subjectCourse ?? title;

  const initialTimeline: DisputeTimelineEntry[] = [
    {
      id: `tl-${Date.now()}`,
      state: "open",
      at: openedAt,
      actor: "student",
      action: { fr: "Dossier ouvert", ar: "فتح الملفّ" },
      description: { fr: input.description, ar: input.description },
    },
  ];

  const initialMessages: DisputeMessage[] = [];

  const record: DisputeRecord = {
    id,
    accountId: input.accountId,
    state: input.status ?? "open",
    openedAt,
    lastActivityAt: openedAt,
    counterparty: teacher,
    subject: {
      course,
      sessionLabel: title,
    },
    title,
    claim: { fr: input.description, ar: input.description },
    amountDzd: input.amountDzd ?? 0,
    timeline: initialTimeline,
    messages: initialMessages,
  };

  // Newest first so list surfaces don't have to re-sort.
  _disputes = [record, ..._disputes];
  notify();
  return stripOwner(record);
}

export function subscribeDisputes(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Stable empty snapshot for useSyncExternalStore SSR fallback. */
export const EMPTY_DISPUTES: readonly Dispute[] = EMPTY;
