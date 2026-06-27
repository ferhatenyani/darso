/**
 * In-memory store for teacher-submitted "blocked time" windows.
 *
 * Lives next to the read-only mock so cross-component sync (Sheet on
 * mobile, sidebar on desktop) doesn't require lifting state through
 * CalendarShell. Same in-session-only persistence model as auth and
 * other mock mutators per locked-in default 2.
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

const blocks: BlockedRange[] = [];
const listeners = new Set<() => void>();

export function getBlocks(): readonly BlockedRange[] {
  return blocks;
}

export function addBlock(input: Omit<BlockedRange, "id" | "createdAt">): BlockedRange {
  const entry: BlockedRange = {
    ...input,
    id: `blk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  blocks.push(entry);
  listeners.forEach((fn) => fn());
  return entry;
}

export function subscribeBlocks(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
