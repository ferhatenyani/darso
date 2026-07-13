/**
 * localStorage-backed persistence for mock state modules.
 *
 * Why: the mock state stores (bookings, requests, disputes, etc.) live in
 * module-scoped variables so they reset on every full page reload. That
 * breaks flow validation demos — a student clicks "Reserve seat," hits
 * refresh, and the booking they just created is gone.
 *
 * How: state modules opt in by calling `loadPersisted` at boot to hydrate
 * their initial value and `savePersisted` inside their mutation path.
 * Everything is namespaced under `darso.mock.*` so `clearAllMockState`
 * can wipe just the mock data without touching auth or unrelated keys.
 *
 * SSR: all helpers no-op on the server. The module-scoped variable starts
 * with its seeded default on both server and client. On the client, the
 * first read after mount triggers hydration (via a lazy init flag exposed
 * by each state module).
 *
 * Known limitation for the v1 mock: server-rendered detail pages read the
 * seeded server-side state, not the client's persisted mutations. Deep-
 * links to newly-created mock entities work only via client navigation.
 * Real sessions/cookies fix this; out of scope for the mock.
 */

const KEY_PREFIX = "darso.mock.";

export function persistenceKey(name: string): string {
  return `${KEY_PREFIX}${name}`;
}

export function loadPersisted<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(persistenceKey(name));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function savePersisted<T>(name: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(persistenceKey(name), JSON.stringify(value));
  } catch {
    // Quota exceeded or serialization failure — silent by design.
    // Mock state degrades to in-memory only; no user-facing impact.
  }
}

export function clearMockState(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(persistenceKey(name));
  } catch {}
}

export function clearAllMockState(): void {
  if (typeof window === "undefined") return;
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(KEY_PREFIX)) toRemove.push(k);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {}
}

export function listMockKeys(): string[] {
  if (typeof window === "undefined") return [];
  const out: string[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(KEY_PREFIX)) out.push(k.slice(KEY_PREFIX.length));
    }
  } catch {}
  return out;
}
