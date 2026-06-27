/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/teacher/payouts           → seeds initial state for getPayouts / getPendingAmount
 *   GET    /api/teacher/payouts/method    → getPayoutMethod()
 *   PUT    /api/teacher/payouts/method    → setPayoutMethod(method)
 *   GET    /api/teacher/payouts/frequency → getPayoutFrequency()
 *   PUT    /api/teacher/payouts/frequency → setPayoutFrequency(freq)
 *   (subscribe maps to either SSE/WebSocket OR client-side polling)
 *
 * Shape: the backend should return Payout[] matching the type below;
 *   method/frequency endpoints return PayoutMethod / PayoutFrequency.
 * Cache invalidation: every mutation should invalidate the per-account snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * In-memory store for teacher payouts (RIB management + schedule + history).
 *
 * Mirrors bookings-state.ts / disputes-state.ts: module-scoped state,
 * listener set, get/set/subscribe API consumed via useSyncExternalStore.
 * Per-account snapshot cache keeps getSnapshot referentially stable
 * between renders. Mutations survive in-session and reset on full page
 * reload per locked-in default 2.
 *
 * Seeded data: 8 past payouts pinned to `acc-khalil` (the demo teacher
 * account) — mostly `paid`, with one `pending` and one `failed` so the
 * status badge variants are demoable. No payout method is set on
 * acc-khalil initially: the first-time RIB setup flow is the demo path.
 */

export type PayoutFrequency = "monthly" | "weekly" | "ondemand";

export type PayoutMethod = {
  /** Bank short code (e.g. "BNA", "CCP"). */
  bankName: string;
  /** Full legal name of the account holder. */
  accountHolder: string;
  /** 20-digit Algerian RIB (account number). */
  rib: string;
  /** Optional BIC / SWIFT for international wires. */
  bic?: string;
  /** Set to true once the micro-deposit verification has been confirmed. */
  verified: boolean;
  /** ISO timestamp the method was first added. */
  addedAt: string;
};

export type PayoutStatus = "paid" | "pending" | "failed";

export type Payout = {
  id: string;
  accountId: string;
  /** Human-readable reference like PAY-2025-001. */
  reference: string;
  /** ISO date (no time). */
  date: string;
  amountDzd: number;
  /** Masked method label, e.g. "BNA •••• 1234". */
  methodLabel: string;
  status: PayoutStatus;
};

/* ============================================================
 * State
 * ============================================================ */

const SEED_OWNER_ID = "acc-khalil";

// 8 past payouts spanning the last ~9 months. Newest first; the dashboard
// listing surfaces them in this exact order.
const _payouts: Payout[] = [
  { id: "po-001", accountId: SEED_OWNER_ID, reference: "PAY-2026-002", date: "2026-06-05", amountDzd: 64500, methodLabel: "BNA •••• 4218", status: "pending" },
  { id: "po-002", accountId: SEED_OWNER_ID, reference: "PAY-2026-001", date: "2026-05-05", amountDzd: 58200, methodLabel: "BNA •••• 4218", status: "paid" },
  { id: "po-003", accountId: SEED_OWNER_ID, reference: "PAY-2025-008", date: "2026-04-05", amountDzd: 71300, methodLabel: "BNA •••• 4218", status: "paid" },
  { id: "po-004", accountId: SEED_OWNER_ID, reference: "PAY-2025-007", date: "2026-03-05", amountDzd: 52000, methodLabel: "BNA •••• 4218", status: "paid" },
  { id: "po-005", accountId: SEED_OWNER_ID, reference: "PAY-2025-006", date: "2026-02-05", amountDzd: 47800, methodLabel: "BNA •••• 4218", status: "failed" },
  { id: "po-006", accountId: SEED_OWNER_ID, reference: "PAY-2025-005", date: "2026-01-05", amountDzd: 61400, methodLabel: "BNA •••• 4218", status: "paid" },
  { id: "po-007", accountId: SEED_OWNER_ID, reference: "PAY-2025-004", date: "2025-12-05", amountDzd: 55900, methodLabel: "BNA •••• 4218", status: "paid" },
  { id: "po-008", accountId: SEED_OWNER_ID, reference: "PAY-2025-003", date: "2025-11-05", amountDzd: 49250, methodLabel: "BNA •••• 4218", status: "paid" },
];

// Per-account payout method (not seeded for acc-khalil so the first-time
// setup flow is the demo path).
const _methods = new Map<string, PayoutMethod>();

// Per-account payout cadence; defaults to "monthly" when unset.
const _frequencies = new Map<string, PayoutFrequency>([[SEED_OWNER_ID, "monthly"]]);

// Per-account pending amount (sum of confirmed-but-not-yet-paid earnings).
// Hard-coded so the schedule card has a number to display without coupling
// to the student-side bookings store.
const _pending = new Map<string, number>([[SEED_OWNER_ID, 64500]]);

const listeners = new Set<() => void>();

// Snapshot caches — keep useSyncExternalStore getSnapshot identity stable
// between renders. Invalidated on every mutation.
const payoutsCache = new Map<string, readonly Payout[]>();
const EMPTY: readonly Payout[] = Object.freeze([]);

function invalidate() {
  payoutsCache.clear();
  listeners.forEach((fn) => fn());
}

/* ============================================================
 * Reads
 * ============================================================ */

export function getPayouts(accountId: string | null | undefined): readonly Payout[] {
  if (!accountId) return EMPTY;
  const cached = payoutsCache.get(accountId);
  if (cached) return cached;
  const snapshot = Object.freeze(_payouts.filter((p) => p.accountId === accountId));
  payoutsCache.set(accountId, snapshot);
  return snapshot;
}

export function getPayoutMethod(accountId: string | null | undefined): PayoutMethod | null {
  if (!accountId) return null;
  return _methods.get(accountId) ?? null;
}

export function getPayoutFrequency(accountId: string | null | undefined): PayoutFrequency {
  if (!accountId) return "monthly";
  return _frequencies.get(accountId) ?? "monthly";
}

export function getPendingAmount(accountId: string | null | undefined): number {
  if (!accountId) return 0;
  return _pending.get(accountId) ?? 0;
}

/* ============================================================
 * Writes (mock — TODO backend)
 * ============================================================ */

export function setPayoutMethod(
  accountId: string,
  input: Omit<PayoutMethod, "verified" | "addedAt"> & { verified?: boolean },
): PayoutMethod {
  const existing = _methods.get(accountId);
  const method: PayoutMethod = {
    bankName: input.bankName,
    accountHolder: input.accountHolder,
    rib: input.rib,
    bic: input.bic,
    // First-time add starts unverified; subsequent edits keep the prior
    // verification flag unless the caller explicitly resets it.
    verified: input.verified ?? existing?.verified ?? false,
    addedAt: existing?.addedAt ?? new Date().toISOString(),
  };
  _methods.set(accountId, method);
  invalidate();
  return method;
}

export function setPayoutFrequency(accountId: string, freq: PayoutFrequency): PayoutFrequency {
  _frequencies.set(accountId, freq);
  invalidate();
  return freq;
}

export function subscribePayouts(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/* ============================================================
 * Helpers (exposed so the schedule card can compute the next 5th)
 * ============================================================ */

/**
 * Returns the next "5th of the month" from `from` (inclusive when
 * `from.getDate() <= 5`). The returned Date is at midnight local time.
 */
export function nextPayoutDate(from: Date = new Date()): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), 5);
  if (from.getDate() > 5) d.setMonth(d.getMonth() + 1);
  return d;
}

/** Masks a 20-digit RIB to `BANK •••• 1234` style label. */
export function maskRib(bankName: string, rib: string): string {
  const tail = rib.replace(/\D/g, "").slice(-4) || "----";
  return `${bankName} •••• ${tail}`;
}
