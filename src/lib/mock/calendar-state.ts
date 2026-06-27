/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/calendar/blocks         → seeds initial state for getBlocks
 *   POST   /api/calendar/blocks         → addBlock(input)
 *   PATCH  /api/calendar/blocks/:id     → updateBlock(id, patch)
 *   DELETE /api/calendar/blocks/:id     → removeBlock(id)
 *   POST   /api/calendar/events/:id/hide → hideEvent(id)
 *   (subscribe maps to either SSE/WebSocket OR client-side polling)
 *
 * Shape: the backend should return BlockedRange[] matching the type below.
 * Cache invalidation: every mutation should invalidate the per-account snapshot
 *   cache (mirror the current pattern — caches are read by useSyncExternalStore
 *   subscribers, so identity must change on every mutation).
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * In-memory store for teacher-submitted "blocked time" windows.
 *
 * Lives next to the read-only mock so cross-component sync (Sheet on
 * mobile, sidebar on desktop) doesn't require lifting state through
 * CalendarShell. Same in-session-only persistence model as auth and
 * other mock mutators per locked-in default 2.
 *
 * Beyond the recurring HH:MM blocks created by `BlockTimeForm`, this
 * store also tracks a set of "hidden" calendar event ids so the popover
 * "Remove block" action can suppress the seeded static blocks defined
 * in `src/lib/mock/calendar.ts` without having to mutate that read-only
 * constant. `removeBlock(id)` does both jobs: removes the matching
 * in-session block when found, otherwise tags the id as hidden so the
 * shell can filter it out at display time.
 */

export type BlockedRange = {
  id: string;
  /** "HH:MM" 24h */
  start: string;
  /** "HH:MM" 24h */
  end: string;
  reason?: string;
  recurring: boolean;
  /** ISO timestamp the block was submitted */
  createdAt: string;
};

let blocks: BlockedRange[] = [];
const hiddenEventIds = new Set<string>();
const listeners = new Set<() => void>();

// Cache the frozen snapshot so `useSyncExternalStore`'s `getSnapshot`
// stays referentially stable across renders until the next mutation.
let blocksCache: readonly BlockedRange[] | null = null;
let hiddenCache: ReadonlySet<string> | null = null;

function invalidate() {
  blocksCache = null;
  hiddenCache = null;
  listeners.forEach((fn) => fn());
}

export function getBlocks(): readonly BlockedRange[] {
  if (blocksCache) return blocksCache;
  blocksCache = Object.freeze(blocks.slice());
  return blocksCache;
}

/**
 * Returns the snapshot of calendar event ids the teacher has removed
 * in-session. The calendar shell unions this with its server-seeded event
 * list and filters them out before rendering.
 */
export function getHiddenEventIds(): ReadonlySet<string> {
  if (hiddenCache) return hiddenCache;
  hiddenCache = new Set(hiddenEventIds);
  return hiddenCache;
}

export function addBlock(input: Omit<BlockedRange, "id" | "createdAt">): BlockedRange {
  const entry: BlockedRange = {
    ...input,
    id: `blk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  blocks = [...blocks, entry];
  invalidate();
  return entry;
}

/**
 * Remove a block. The popover passes the `CalendarEvent.id`, which may
 * be either an in-session `blk-*` id (a block created via the form) or
 * a seeded `ev-*` id from the static `weekEvents`/`monthEvents` array.
 *
 * - For in-session blocks we splice them out of the store.
 * - For seeded static blocks we tag the id as hidden so the shell can
 *   filter it out at display time without mutating the imported const.
 *
 * Returns true when either path successfully removed/hid a block.
 */
export function removeBlock(id: string): boolean {
  const before = blocks.length;
  blocks = blocks.filter((b) => b.id !== id);
  if (blocks.length !== before) {
    invalidate();
    return true;
  }
  // Not an in-session block — treat as a seeded calendar event id and
  // hide it for the remainder of the session.
  if (hiddenEventIds.has(id)) return false;
  hiddenEventIds.add(id);
  invalidate();
  return true;
}

/**
 * Merge-patch an in-session block. Returns the updated record, or null
 * when no block with that id exists. Seeded static blocks are read-only
 * — callers that want to "edit" a seeded block should hide it via
 * `removeBlock` and `addBlock` a replacement.
 */
export function updateBlock(
  id: string,
  patch: Partial<Omit<BlockedRange, "id">>,
): BlockedRange | null {
  let updated: BlockedRange | null = null;
  blocks = blocks.map((b) => {
    if (b.id !== id) return b;
    updated = { ...b, ...patch, id: b.id };
    return updated;
  });
  if (!updated) return null;
  invalidate();
  return updated;
}

/**
 * Tag an arbitrary calendar event id as hidden — used when the user
 * "cancels" a seeded `ev-*` booking that doesn't live in the bookings
 * store. The calendar shell's hidden-id filter applies uniformly so
 * the static event disappears alongside any in-session blocks.
 */
export function hideEvent(id: string): void {
  if (hiddenEventIds.has(id)) return;
  hiddenEventIds.add(id);
  invalidate();
}

export function subscribeBlocks(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
