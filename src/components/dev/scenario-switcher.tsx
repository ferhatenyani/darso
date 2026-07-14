"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { RotateCcw, X, Wrench, Ban, CheckCircle2, PlusCircle } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "@/lib/auth";
import {
  addBooking,
  cancelBooking,
  getBookings,
  resetBookings,
  subscribeBookings,
  type Booking,
} from "@/lib/mock/bookings-state";
import {
  getRequests,
  deleteRequest,
  resetRequests,
  subscribeRequests,
} from "@/lib/mock/learning-requests-state";
import { clearAllMockState, listMockKeys } from "@/lib/mock/persistence";
import { cn } from "@/lib/utils";

/**
 * Dev-only scenario switcher for flow validation. Toggled with Alt+D or by
 * appending `?debug=1` to any URL. Renders nothing in production builds.
 *
 * What it does:
 *   - Lists current mock state (bookings, requests) with quick actions
 *   - Cancels a booking, deletes a request
 *   - Resets all persisted mock data with one click
 *
 * What it will do (deferred to the core-loop page pass):
 *   - Approve / reject a pending booking (teacher-side simulation)
 *   - Fast-forward time (jump to session start, trigger 72h timeout)
 *   - Mark payment received (Case B direct-pay confirmation)
 *
 * Those actions need the expanded v3 state machine (pending_payment,
 * pending_teacher_confirmation, approved, rejected, expired, etc.) which
 * lands with the checkout + bookings pages.
 */

function useBookings(): readonly Booking[] {
  return useSyncExternalStore(subscribeBookings, getBookings, () => getBookings());
}

function useLearningRequests() {
  return useSyncExternalStore(subscribeRequests, getRequests, () => getRequests());
}

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function ScenarioSwitcher() {
  const [open, setOpen] = useState(false);
  const mounted = useIsMounted();
  const bookings = useBookings();
  const requests = useLearningRequests();
  const { user: currentUser } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    // URL param opens on boot
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("debug") === "1") setOpen(true);
    } catch {}
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onResetAll = useCallback(() => {
    resetBookings();
    resetRequests();
    clearAllMockState();
    if (typeof window !== "undefined") window.location.reload();
  }, []);

  const onCreateTestBooking = useCallback(() => {
    if (!currentUser) {
      window.location.href = "/sign-in";
      return;
    }
    const booking = addBooking({
      accountId: currentUser.id,
      kind: "course",
      subjectTitle: { fr: "Cours de test", ar: "درس اختباري" },
      teacherSlug: "leila-benali",
      teacherName: { fr: "Leïla Benali", ar: "ليلى بن علي" },
      priceDzd: 12000,
      status: "pending",
      stage: "pending_payment",
    });
    router.push(`/checkout/${booking.id}` as never);
  }, [currentUser, router]);

  if (!mounted) return null;

  return (
    <>
      {/* Toggle pill */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Dev scenario switcher (Alt+D)"
        className={cn(
          "fixed bottom-4 end-4 z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-card text-ink-2 shadow-e2 transition-all hover:bg-surface hover:text-foreground",
          open && "translate-x-2 opacity-0 pointer-events-none",
        )}
      >
        <Wrench className="h-[18px] w-[18px]" aria-hidden />
      </button>

      {/* Panel */}
      <aside
        className={cn(
          "fixed bottom-4 end-4 z-[60] flex max-h-[80vh] w-[360px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-card shadow-e3 transition-all",
          !open && "pointer-events-none translate-y-4 opacity-0",
        )}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-ink-2" aria-hidden />
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-2">
              Dev scenarios
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-2 hover:bg-background hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <p className="text-[12px] leading-relaxed text-ink-3">
            Toggle with <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">Alt+D</kbd> or <code className="rounded bg-background px-1 py-0.5 font-mono text-[10px]">?debug=1</code>.
          </p>

          {/* Quick actions */}
          <section>
            <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              Quick actions
            </h3>
            <button
              type="button"
              onClick={onCreateTestBooking}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-surface"
            >
              <PlusCircle className="h-4 w-4 text-accent" aria-hidden />
              Create test booking → /checkout
            </button>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
              Full teacher-side simulation (approve, reject, timeout, mark paid) will land as the /bookings pages roll out.
            </p>
          </section>

          {/* Bookings */}
          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                Bookings ({bookings.length})
              </h3>
              {bookings.length > 0 && (
                <button
                  type="button"
                  onClick={resetBookings}
                  className="text-[11px] font-medium text-danger hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            {bookings.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-background px-3 py-3 text-[12px] text-ink-3">
                No bookings yet.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {bookings.slice(0, 6).map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-foreground">
                        {b.subjectTitle.fr || b.subjectTitle.ar || b.id}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
                        <StatusDot status={b.status} />
                        {b.status} · {b.kind}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cancelBooking(b.id)}
                      disabled={b.status === "cancelled"}
                      aria-label="Cancel booking"
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-2 hover:bg-surface hover:text-danger disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
                {bookings.length > 6 && (
                  <li className="pt-1 text-[11px] text-ink-3">
                    +{bookings.length - 6} more
                  </li>
                )}
              </ul>
            )}
          </section>

          {/* Requests */}
          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                Requests ({requests.length})
              </h3>
              {requests.length > 0 && (
                <button
                  type="button"
                  onClick={resetRequests}
                  className="text-[11px] font-medium text-danger hover:underline"
                >
                  Reset to seed
                </button>
              )}
            </div>
            {requests.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-background px-3 py-3 text-[12px] text-ink-3">
                No requests.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {requests.slice(0, 5).map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-foreground">
                        {r.title.fr || r.title.ar || r.id}
                      </p>
                      <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
                        {r.status} · {r.applicationCount ?? 0} propositions
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteRequest(r.id)}
                      aria-label="Delete request"
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-2 hover:bg-surface hover:text-danger"
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
                {requests.length > 5 && (
                  <li className="pt-1 text-[11px] text-ink-3">
                    +{requests.length - 5} more
                  </li>
                )}
              </ul>
            )}
          </section>

          {/* Persisted keys */}
          <section>
            <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              Persisted (localStorage)
            </h3>
            <PersistedKeysList />
          </section>
        </div>

        <footer className="border-t border-border bg-surface px-4 py-3">
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-danger px-3 text-[13px] font-semibold text-danger-foreground transition-colors hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" />
            Reset all mock state & reload
          </button>
        </footer>
      </aside>
    </>
  );
}

function StatusDot({ status }: { status: Booking["status"] }) {
  const cls =
    status === "confirmed"
      ? "bg-success"
      : status === "cancelled"
        ? "bg-danger"
        : "bg-warning";
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", cls)} aria-hidden />;
}

function PersistedKeysList() {
  const [keys, setKeys] = useState<string[]>([]);
  useEffect(() => {
    setKeys(listMockKeys());
    const t = setInterval(() => setKeys(listMockKeys()), 1000);
    return () => clearInterval(t);
  }, []);
  if (keys.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border bg-background px-3 py-2 text-[12px] text-ink-3">
        No persisted keys.
      </p>
    );
  }
  return (
    <ul className="space-y-1">
      {keys.map((k) => (
        <li key={k} className="flex items-center gap-2 text-[12px] text-ink-2">
          <CheckCircle2 className="h-3 w-3 text-success" aria-hidden />
          <span className="font-mono">{k}</span>
        </li>
      ))}
    </ul>
  );
}
