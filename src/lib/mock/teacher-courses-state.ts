/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/teacher/courses         → seeds initial state for getTeacherCourses
 *   GET    /api/teacher/courses/:id     → getCourseById(id)
 *   POST   /api/teacher/courses         → addCourse(input)
 *   PATCH  /api/teacher/courses/:id     → updateCourse(id, patch)
 *   DELETE /api/teacher/courses/:id     → deleteCourse(id)
 *   (subscribe maps to either SSE/WebSocket OR client-side polling)
 *
 * Shape: the backend should return TeacherCourse[] matching the type below.
 * Cache invalidation: every mutation should invalidate the per-account snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * In-memory store for teacher-owned course catalogue.
 *
 * Wires the course wizard's Publish / Publish later buttons (Batch 5a)
 * AND the [id] edit page's Save / Delete actions into a single mock
 * source that the teacher /teach/courses listing subscribes to so newly-
 * published or edited courses appear immediately.
 *
 * Mirrors bookings-state.ts / calendar-state.ts: module-scoped state,
 * listener set, get/add/update/delete/subscribe API consumed via
 * useSyncExternalStore. Per-account snapshot cache (frozen arrays) keeps
 * useSyncExternalStore's getSnapshot referentially stable. Mutations
 * survive in-session and reset on full page reload per locked-in default 2.
 *
 * Seed source: copies the existing `teacherCourses` constant from
 * src/lib/mock/dashboard.ts ONCE at module load. We never mutate the
 * imported constant directly.
 */
import { teacherCourses as seedTeacherCourses, type TeacherCourse } from "./dashboard";

export type { TeacherCourse } from "./dashboard";

/**
 * Optional account ownership tag. The seeded teacher catalogue all
 * belongs to acc-khalil (the demo teacher account). New courses created
 * by the wizard get tagged with the publishing teacher's accountId so
 * /teach/courses can scope its listing.
 */
type StoredCourse = TeacherCourse & { accountId?: string };

let courses: StoredCourse[] = seedTeacherCourses.map((c) => ({ ...c, accountId: "acc-khalil" }));

const listeners = new Set<() => void>();

// Cache per-account snapshots so useSyncExternalStore stays referentially
// stable between renders. Invalidated on every mutation.
const accountCache = new Map<string, readonly TeacherCourse[]>();
let allCache: readonly TeacherCourse[] | null = null;
const EMPTY: readonly TeacherCourse[] = Object.freeze([]);

function invalidate() {
  accountCache.clear();
  allCache = null;
  listeners.forEach((fn) => fn());
}

/**
 * Returns courses owned by `accountId`. When no id is provided, returns
 * the full catalogue (used by surfaces that haven't yet been auth-gated
 * or that intentionally show every teacher's listings).
 */
export function getTeacherCourses(accountId?: string | null): readonly TeacherCourse[] {
  if (!accountId) {
    if (allCache) return allCache;
    allCache = Object.freeze(courses.map(stripInternal));
    return allCache;
  }
  const cached = accountCache.get(accountId);
  if (cached) return cached;
  const snapshot = Object.freeze(
    courses.filter((c) => !c.accountId || c.accountId === accountId).map(stripInternal),
  );
  accountCache.set(accountId, snapshot);
  return snapshot;
}

export function getCourseById(id: string | null | undefined): TeacherCourse | undefined {
  if (!id) return undefined;
  const found = courses.find((c) => c.id === id);
  return found ? stripInternal(found) : undefined;
}

/**
 * Input shape for `addCourse`. Wizard / edit flows supply at least
 * title + format + price + status; missing fields default to draft-y
 * zero values so the listing renders without blowing up.
 *
 * Optional wizard-collected fields (description / weeks / outcomes /
 * category / audience / language / summary / promoPct) flow through
 * untouched so the edit form can read them back later. None of them
 * influence the dashboard listing.
 */
export type NewCourseInput = {
  title: { fr: string; ar: string };
  format: TeacherCourse["format"];
  status: TeacherCourse["status"];
  priceDzd: number;
  capacity?: { taken: number; total: number };
  nextSession?: { fr: string; ar: string } | null;
  monthRevenueDzd?: number;
  studentCount?: number;
  accountId?: string;
  /** Optional client-supplied slug seed; defaults derived from title. */
  slug?: string;
  description?: string;
  weeks?: string[];
  outcomes?: string[];
  category?: TeacherCourse["category"];
  audience?: TeacherCourse["audience"];
  language?: TeacherCourse["language"];
  summary?: string;
  promoPct?: number;
};

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      // strip combining marks
      .replace(/[̀-ͯ]/g, "")
      // keep latin alphanumeric + dashes; Arabic falls through to empty
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "course"
  );
}

export function addCourse(input: NewCourseInput): TeacherCourse {
  const slugSeed = input.slug ?? slugify(input.title.fr || input.title.ar || "course");
  const id = `c-${slugSeed}-${Date.now().toString(36)}`;
  const entry: StoredCourse = {
    id,
    status: input.status,
    title: input.title,
    format: input.format,
    capacity: input.capacity ?? { taken: 0, total: input.format === "1to1" || input.format === "ondemand" ? 0 : 12 },
    nextSession: input.nextSession ?? null,
    monthRevenueDzd: input.monthRevenueDzd ?? 0,
    priceDzd: input.priceDzd,
    studentCount: input.studentCount ?? 0,
    accountId: input.accountId,
    // Wizard fields — undefined when caller doesn't supply, so the
    // existing edit form can still pull defaults from form state.
    description: input.description,
    weeks: input.weeks,
    outcomes: input.outcomes,
    category: input.category,
    audience: input.audience,
    language: input.language,
    summary: input.summary,
    promoPct: input.promoPct,
  };
  // Newest first so the listing surfaces don't have to re-sort.
  courses = [entry, ...courses];
  invalidate();
  return stripInternal(entry);
}

export function updateCourse(id: string, patch: Partial<TeacherCourse>): TeacherCourse | undefined {
  let next: StoredCourse | undefined;
  courses = courses.map((c) => {
    if (c.id !== id) return c;
    next = { ...c, ...patch, id: c.id, accountId: c.accountId };
    return next;
  });
  if (!next) return undefined;
  invalidate();
  return stripInternal(next);
}

export function deleteCourse(id: string): boolean {
  const before = courses.length;
  courses = courses.filter((c) => c.id !== id);
  if (courses.length === before) return false;
  invalidate();
  return true;
}

export function subscribeTeacherCourses(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Strip the private `accountId` tag from the public read shape so the
// rest of the codebase keeps working with the existing TeacherCourse type.
function stripInternal(c: StoredCourse): TeacherCourse {
  const { accountId: _drop, ...pub } = c;
  void _drop;
  return pub;
}

// Re-export EMPTY just so test code / debug surfaces can compare identity
// without having to construct a fresh frozen array each call.
export const EMPTY_TEACHER_COURSES = EMPTY;
