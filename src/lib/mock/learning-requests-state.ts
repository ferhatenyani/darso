/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/requests                → seeds initial state for getRequests / getRequestsByOwner
 *   GET    /api/requests/:id            → getRequestById(id)
 *   POST   /api/requests                → addRequest(input)
 *   PATCH  /api/requests/:id            → updateRequest(id, patch)
 *   DELETE /api/requests/:id            → deleteRequest(id)
 *   (subscribe maps to either SSE/WebSocket OR client-side polling)
 *
 * Shape: the backend should return LearningRequest[] matching the type below.
 * Cache invalidation: every mutation should invalidate the per-account snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * In-memory store for learner-posted requests.
 *
 * Wires the request wizard's Publish button (Batch 5b) AND the
 * /requests/[id]/edit page's Save / Delete actions into a single mock
 * source that browse-client, my-client and detail-client subscribe to so
 * newly-published or edited requests appear immediately.
 *
 * Mirrors bookings-state.ts / calendar-state.ts / teacher-courses-state.ts:
 * module-scoped state, listener set, get/add/update/delete/subscribe API
 * consumed via useSyncExternalStore. Per-owner snapshot cache (frozen
 * arrays) keeps useSyncExternalStore's getSnapshot referentially stable.
 * Mutations survive in-session and reset on full page reload per locked-in
 * default 2.
 *
 * Seed source: copies the existing `learningRequests` constant from
 * src/lib/mock/requests.ts ONCE at module load. We never mutate the
 * imported constant directly.
 */
import { learningRequests as seedRequests } from "./requests";
import type {
  LearningRequest,
  RequestStudent,
  RequestStatus,
  RequestMode,
  RequestUrgency,
  RequestAudience,
} from "./requests";
import { loadPersisted, savePersisted } from "./persistence";

export type { LearningRequest } from "./requests";

const PERSIST_KEY = "requests";

/**
 * Optional account ownership tag. The seeded requests use the existing
 * `ownedByCurrentUser` flag (true for two `mockStudents.lina` rows). New
 * requests created by the wizard get tagged with the publishing account's
 * id so /requests/my can scope its listing.
 */
type StoredRequest = LearningRequest & { ownedBy?: string };

const SEEDED: StoredRequest[] = seedRequests.map((r) => ({
  ...r,
  // Tag seeded "owned" rows to the demo student account so /requests/my
  // continues to show them when the demo account is signed in.
  ownedBy: r.ownedByCurrentUser ? "acc-lina" : undefined,
}));

let requests: StoredRequest[] = SEEDED;
let hydrated = false;

const listeners = new Set<() => void>();

// Cache per-owner snapshots so useSyncExternalStore stays referentially
// stable between renders. Invalidated on every mutation.
const ownerCache = new Map<string, readonly LearningRequest[]>();
let allCache: readonly LearningRequest[] | null = null;
const EMPTY: readonly LearningRequest[] = Object.freeze([]);

// Client-only lazy hydration. Merges persisted user-created requests on
// top of the seeded catalogue so demo seeds stay visible after refresh.
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const persistedExtras = loadPersisted<StoredRequest[]>(PERSIST_KEY, []);
  if (persistedExtras.length) {
    const seedIds = new Set(SEEDED.map((r) => r.id));
    const extras = persistedExtras.filter((r) => !seedIds.has(r.id));
    requests = [...extras, ...SEEDED];
    ownerCache.clear();
    allCache = null;
    listeners.forEach((fn) => fn());
  }
}

function persist() {
  // Only persist non-seed rows so we don't rehydrate stale copies of the
  // seeded catalogue after seeds evolve.
  const seedIds = new Set(SEEDED.map((r) => r.id));
  const extras = requests.filter((r) => !seedIds.has(r.id));
  savePersisted(PERSIST_KEY, extras);
}

function invalidate() {
  ownerCache.clear();
  allCache = null;
  persist();
  listeners.forEach((fn) => fn());
}

/** Returns every request in the store (used by browse). */
export function getRequests(): readonly LearningRequest[] {
  ensureHydrated();
  if (allCache) return allCache;
  allCache = Object.freeze(requests.map(stripInternal));
  return allCache;
}

/**
 * Returns the requests owned by `accountId`. When no id is provided,
 * returns the empty array — owners-only views should never fall back to
 * the full catalog.
 */
export function getRequestsByOwner(
  accountId: string | null | undefined,
): readonly LearningRequest[] {
  ensureHydrated();
  if (!accountId) return EMPTY;
  const cached = ownerCache.get(accountId);
  if (cached) return cached;
  const snapshot = Object.freeze(
    requests
      .filter((r) => r.ownedBy === accountId || (r.ownedByCurrentUser && accountId === "acc-lina"))
      .map((r) => stripInternal({ ...r, ownedByCurrentUser: true })),
  );
  ownerCache.set(accountId, snapshot);
  return snapshot;
}

/** Look up by slug OR id (mirrors the existing getRequestBySlug helper). */
export function getRequestById(id: string | null | undefined): LearningRequest | undefined {
  ensureHydrated();
  if (!id) return undefined;
  const found = requests.find((r) => r.slug === id || r.id === id);
  return found ? stripInternal(found) : undefined;
}

/**
 * Input shape for `addRequest`. Wizard supplies title + subject + body +
 * mode + budget at minimum; remaining fields default to sensible empty
 * values so the listing surfaces render without blowing up.
 */
export type NewRequestInput = {
  title: { fr: string; ar: string };
  subject: { fr: string; ar: string };
  body: { fr: string; ar: string };
  categoryKey: string;
  level: { fr: string; ar: string };
  audience: RequestAudience;
  budgetDzd: { min: number; max: number };
  mode: RequestMode;
  city: { fr: string; ar: string };
  deadline: { fr: string; ar: string };
  urgency: RequestUrgency;
  anonymous?: boolean;
  /** The account id of the publisher (so /requests/my can filter). */
  ownedBy: string;
  /** Optional student card override; defaults to a placeholder card. */
  student?: RequestStudent;
  /** Optional initial status (defaults to "open"). */
  status?: RequestStatus;
};

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      // strip combining marks
      .replace(/[̀-ͯ]/g, "")
      // keep latin alphanumeric + dashes; non-latin falls through to dashes
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "request"
  );
}

const PLACEHOLDER_STUDENT: RequestStudent = {
  id: "u-anon",
  name: { fr: "Nouveau membre", ar: "عضو جديد" },
  initials: "NM",
  accent: "from-[#1C3A5E] to-[#2F6BFF]",
  city: { fr: "—", ar: "—" },
  joinedYear: new Date().getFullYear(),
};

export function addRequest(input: NewRequestInput): LearningRequest {
  const slugSeed = slugify(input.title.fr || input.title.ar || "request");
  const idStamp = Date.now().toString(36);
  const id = `r-${idStamp}`;
  const slug = `${slugSeed}-${idStamp.slice(-4)}`;

  const entry: StoredRequest = {
    id,
    slug,
    student: input.student ?? PLACEHOLDER_STUDENT,
    anonymous: input.anonymous,
    title: input.title,
    body: input.body,
    subject: input.subject,
    categoryKey: input.categoryKey,
    level: input.level,
    audience: input.audience,
    budgetDzd: input.budgetDzd,
    mode: input.mode,
    city: input.city,
    postedAtHours: 0,
    deadline: input.deadline,
    status: input.status ?? "open",
    urgency: input.urgency,
    applicationCount: 0,
    applications: [],
    ownedByCurrentUser: true,
    ownedBy: input.ownedBy,
  };
  // Newest first so the listing surfaces don't have to re-sort.
  requests = [entry, ...requests];
  invalidate();
  return stripInternal(entry);
}

export function updateRequest(
  id: string,
  patch: Partial<LearningRequest>,
): LearningRequest | undefined {
  let next: StoredRequest | undefined;
  requests = requests.map((r) => {
    if (r.id !== id && r.slug !== id) return r;
    next = { ...r, ...patch, id: r.id, slug: r.slug, ownedBy: r.ownedBy };
    return next;
  });
  if (!next) return undefined;
  invalidate();
  return stripInternal(next);
}

export function deleteRequest(id: string): boolean {
  const before = requests.length;
  requests = requests.filter((r) => r.id !== id && r.slug !== id);
  if (requests.length === before) return false;
  invalidate();
  return true;
}

export function subscribeRequests(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Strip the private `ownedBy` tag from the public read shape so the rest
// of the codebase keeps working with the existing LearningRequest type.
function stripInternal(r: StoredRequest): LearningRequest {
  const { ownedBy: _drop, ...pub } = r;
  void _drop;
  return pub;
}

// Re-export EMPTY just so test code / debug surfaces can compare identity
// without having to construct a fresh frozen array each call.
export const EMPTY_REQUESTS = EMPTY;

/**
 * Wipe the persisted user-created requests. Called from the dev scenario
 * switcher; seeded catalogue rows are preserved.
 */
export function resetRequests(): void {
  requests = SEEDED;
  ownerCache.clear();
  allCache = null;
  persist();
  listeners.forEach((fn) => fn());
}
