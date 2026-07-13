/**
 * Teacher preferences that drive per-listing defaults and account-wide
 * behavior. Locked-in v1 decisions this store operationalizes:
 *
 * - Decision 2 (payment routing default): teacher-level default with
 *   per-listing override at creation time. `defaultPaymentRouting` is
 *   the account-wide setting; each listing may override via a per-item
 *   flag.
 * - Decision 3 (approval mode default): teacher-level default with
 *   per-listing override. `defaultApprovalMode` = "instant" or "approval".
 * - Decision 14 (vacation mode): account-wide pause with optional date
 *   range. When active, new bookings on all listings are blocked;
 *   existing confirmed sessions still run.
 * - Decision 15 (notification defaults): category-driven (financial +
 *   approval events real-time, rest batched). Teacher can override per
 *   category.
 *
 * Persistence: same client-hydrated pattern as bookings-state — module-
 * scoped variable, localStorage rehydration on first client read.
 * Server-side reads see the seeded defaults.
 */

import { loadPersisted, savePersisted } from "./persistence";

const PERSIST_KEY = "teacher-settings";

export type PaymentRouting = "platform" | "direct";
export type ApprovalMode = "instant" | "approval";

export type VacationMode = {
  active: boolean;
  /** ISO date the vacation started. */
  startsAt?: string;
  /** ISO date the vacation ends (optional — open-ended if omitted). */
  endsAt?: string;
  /** Optional message shown to students who try to book while paused. */
  message?: string;
};

export type NotificationCategory =
  | "approvals" // pending join/proposal approvals
  | "financial" // payouts, payments received, refunds
  | "messages" // new chat messages
  | "reviews" // new reviews received
  | "marketing"; // platform updates, promotions

export type NotificationDelivery = "realtime" | "digest" | "off";

export type TeacherSettings = {
  /** Account-wide default routing for new listings. Per-listing override
   * still applies. */
  defaultPaymentRouting: PaymentRouting;
  /** Account-wide default approval mode for new listings. Per-listing
   * override still applies. */
  defaultApprovalMode: ApprovalMode;
  /** Vacation state. When `active`, new bookings across all listings are
   * blocked; confirmed sessions still run. */
  vacation: VacationMode;
  /** Category-driven notification preferences per decision 15. Defaults
   * favor real-time for financial + approvals, digest for the rest. */
  notifications: Record<NotificationCategory, NotificationDelivery>;
  /** Whether returning students bypass the approval gate on approval-
   * required listings (decision from the UX directives). */
  autoApproveReturning: boolean;
};

const DEFAULTS: TeacherSettings = {
  defaultPaymentRouting: "direct",
  defaultApprovalMode: "instant",
  vacation: { active: false },
  notifications: {
    approvals: "realtime",
    financial: "realtime",
    messages: "realtime",
    reviews: "digest",
    marketing: "digest",
  },
  autoApproveReturning: true,
};

let settings: TeacherSettings = DEFAULTS;
let hydrated = false;
const listeners = new Set<() => void>();

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const persisted = loadPersisted<Partial<TeacherSettings>>(PERSIST_KEY, {});
  // Shallow-merge so new fields added later still fall back to DEFAULTS.
  settings = { ...DEFAULTS, ...persisted, vacation: { ...DEFAULTS.vacation, ...(persisted.vacation ?? {}) }, notifications: { ...DEFAULTS.notifications, ...(persisted.notifications ?? {}) } };
  listeners.forEach((fn) => fn());
}

function persist() {
  savePersisted(PERSIST_KEY, settings);
}

export function getTeacherSettings(): TeacherSettings {
  ensureHydrated();
  return settings;
}

export function updateTeacherSettings(patch: Partial<TeacherSettings>): TeacherSettings {
  ensureHydrated();
  settings = { ...settings, ...patch };
  persist();
  listeners.forEach((fn) => fn());
  return settings;
}

export function updateVacation(patch: Partial<VacationMode>): VacationMode {
  ensureHydrated();
  settings = { ...settings, vacation: { ...settings.vacation, ...patch } };
  persist();
  listeners.forEach((fn) => fn());
  return settings.vacation;
}

export function updateNotificationPreference(
  category: NotificationCategory,
  delivery: NotificationDelivery,
): void {
  ensureHydrated();
  settings = {
    ...settings,
    notifications: { ...settings.notifications, [category]: delivery },
  };
  persist();
  listeners.forEach((fn) => fn());
}

export function subscribeTeacherSettings(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function resetTeacherSettings(): void {
  settings = DEFAULTS;
  persist();
  listeners.forEach((fn) => fn());
}
