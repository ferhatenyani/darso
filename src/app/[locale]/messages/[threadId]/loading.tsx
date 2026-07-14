import { Skeleton } from "@/components/ui/skeleton";

/**
 * Thread pane wireframe. Mirrors the messages route: 340px inbox column +
 * thread pane with header bar and 5 alternating message bubbles.
 */
export default function ThreadLoading() {
  return (
    <section className="container-narrow py-8">
      <div className="grid h-[min(80vh,860px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-e1 md:grid-cols-[340px_1fr]">
        {/* Inbox list (desktop only) */}
        <div className="hidden border-e border-border md:block">
          <div className="border-b border-border p-4">
            <Skeleton className="h-9 w-full" />
          </div>
          <ul className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-start gap-3 p-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <Skeleton className="h-3.5 w-28 rounded-[var(--radius-xs)]" />
                    <Skeleton className="h-2.5 w-10 rounded-[var(--radius-xs)]" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-[var(--radius-xs)]" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Thread pane */}
        <div className="flex min-w-0 flex-col">
          {/* Header bar */}
          <header className="flex items-center gap-3 border-b border-border px-5 py-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24 rounded-[var(--radius-xs)]" />
            </div>
            <Skeleton className="h-9 w-9 rounded-[var(--radius-md)]" />
            <Skeleton className="h-9 w-9 rounded-[var(--radius-md)]" />
          </header>

          {/* Message stream — 5 alternating bubbles */}
          <div className="flex-1 space-y-4 overflow-hidden px-5 py-6">
            <div className="flex justify-center">
              <Skeleton className="h-3 w-20 rounded-[var(--radius-xs)]" />
            </div>
            {[
              { mine: false, width: "w-2/3" },
              { mine: true, width: "w-1/2" },
              { mine: false, width: "w-3/5" },
              { mine: true, width: "w-2/5" },
              { mine: false, width: "w-3/4" },
            ].map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.mine ? "flex-row-reverse" : ""}`}
              >
                {!m.mine && <Skeleton className="h-8 w-8 shrink-0 rounded-full" />}
                <div
                  className={`max-w-[70%] space-y-1.5 ${m.width}`}
                >
                  <Skeleton
                    className={`h-16 ${m.mine ? "rounded-[var(--radius-lg)] rounded-tr-sm" : "rounded-[var(--radius-lg)] rounded-tl-sm"}`}
                  />
                  <Skeleton
                    className={`h-2.5 w-12 rounded-[var(--radius-xs)] ${m.mine ? "ms-auto" : ""}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="border-t border-border p-4">
            <div className="flex items-end gap-2">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 w-11 rounded-[var(--radius-md)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
