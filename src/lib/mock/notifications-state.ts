/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/notifications           → seeds initial state for getNotifications / getUnreadCount
 *   PATCH  /api/notifications/:id/read  → markRead(id)
 *   POST   /api/notifications/read-all  → markAllRead()
 *   (subscribe maps to either SSE/WebSocket OR client-side polling — the
 *   bell should react to server-side activity, not just local mutations)
 *
 * Shape: the backend should return AppNotification[] matching the type below.
 * Cache invalidation: every mutation should invalidate the per-account snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * In-session store for app notifications.
 *
 * Backs both the student `/notifications` page and the teacher top-bar bell
 * so unread counts + mark-read mutations stay in sync across surfaces.
 * Seeded once on first read from the static `appNotifications` catalogue
 * at src/lib/mock/notifications.ts.
 *
 * Mirrors the disputes-state.ts / bookings-state.ts pattern: module-scoped
 * state, listener set, get/subscribe API consumed via useSyncExternalStore.
 * Per-account snapshot cache keeps `getSnapshot` referentially stable, and
 * the returned arrays are frozen so callers can't accidentally mutate the
 * shared list.
 *
 * Persistence: in-session only — mutations survive client navigation but
 * reset on full page reload.
 */
import { appNotifications, type AppNotification } from "./notifications";

type NotificationRecord = AppNotification & {
  /**
   * Owner of the notification. The seeded catalogue is for the demo
   * student account; new server-pushed notifications will carry the actual
   * recipient id.
   */
  accountId: string;
};

const SEED_OWNER_ID = "acc-lina";

let _seeded = false;
let _items: NotificationRecord[] = [];
const listeners = new Set<() => void>();

const accountCache = new Map<string, readonly AppNotification[]>();
let allCache: readonly AppNotification[] | null = null;
const EMPTY: readonly AppNotification[] = Object.freeze([]);

function ensureSeeded() {
  if (_seeded) return;
  _seeded = true;
  _items = appNotifications.map((n) => ({ ...n, accountId: SEED_OWNER_ID }));
}

function notify() {
  accountCache.clear();
  allCache = null;
  listeners.forEach((fn) => fn());
}

function stripOwner(record: NotificationRecord): AppNotification {
  const { accountId: _ignore, ...rest } = record;
  void _ignore;
  return rest;
}

/**
 * Returns the (frozen) notifications list. When `accountId` is omitted the
 * full list is returned — useful for surfaces that intentionally show the
 * seeded catalogue regardless of the signed-in user.
 */
export function getNotifications(accountId?: string | null): readonly AppNotification[] {
  ensureSeeded();
  if (!accountId) {
    if (allCache) return allCache;
    allCache = Object.freeze(_items.map(stripOwner));
    return allCache;
  }
  const cached = accountCache.get(accountId);
  if (cached) return cached;
  const snapshot = Object.freeze(
    _items.filter((n) => n.accountId === accountId).map(stripOwner),
  );
  accountCache.set(accountId, snapshot);
  return snapshot;
}

export function getUnreadCount(accountId?: string | null): number {
  ensureSeeded();
  if (!accountId) return _items.reduce((n, x) => n + (x.unread ? 1 : 0), 0);
  let count = 0;
  for (const item of _items) {
    if (item.accountId === accountId && item.unread) count++;
  }
  return count;
}

export function markRead(id: string): void {
  ensureSeeded();
  let changed = false;
  _items = _items.map((n) => {
    if (n.id !== id || !n.unread) return n;
    changed = true;
    return { ...n, unread: false };
  });
  if (changed) notify();
}

export function markAllRead(accountId?: string | null): void {
  ensureSeeded();
  let changed = false;
  _items = _items.map((n) => {
    if (!n.unread) return n;
    if (accountId && n.accountId !== accountId) return n;
    changed = true;
    return { ...n, unread: false };
  });
  if (changed) notify();
}

export function subscribeNotifications(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Stable empty snapshot for useSyncExternalStore SSR fallback. */
export const EMPTY_NOTIFICATIONS: readonly AppNotification[] = EMPTY;
