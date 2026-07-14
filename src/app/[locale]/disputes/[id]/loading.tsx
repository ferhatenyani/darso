import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dispute detail wireframe. Mirrors: back rail, editorial header, claim
 * summary card, then a 1fr/320px two-column body with timeline + messages
 * on the left and a sticky parties/actions panel on the right.
 */
export default function DisputeLoading() {
  return (
    <section className="container-narrow py-8">
      {/* Back rail */}
      <div className="mb-6">
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Editorial header */}
      <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-2.5 w-24 rounded-[var(--radius-xs)]" />
            <Skeleton className="h-2.5 w-16 rounded-[var(--radius-xs)]" />
          </div>
          <Skeleton className="h-10 w-full max-w-2xl sm:h-12" />
          <Skeleton className="h-10 w-3/4 max-w-xl sm:h-12" />
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-3.5 w-32 rounded-[var(--radius-xs)]" />
            <Skeleton className="h-3.5 w-20 rounded-[var(--radius-xs)]" />
            <Skeleton className="h-3.5 w-24 rounded-[var(--radius-xs)]" />
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </header>

      {/* Claim summary card */}
      <div className="mb-8 grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5 md:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-20 rounded-[var(--radius-xs)]" />
            <Skeleton className="h-3.5 w-16 rounded-[var(--radius-xs)]" />
            <Skeleton className="h-2.5 w-24 rounded-[var(--radius-xs)]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-24 rounded-[var(--radius-xs)]" />
          <Skeleton className="h-3.5 w-full rounded-[var(--radius-xs)]" />
          <Skeleton className="h-3.5 w-4/5 rounded-[var(--radius-xs)]" />
        </div>
      </div>

      {/* Two cols: timeline + sticky actions */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          {/* Timeline card */}
          <section className="rounded-[var(--radius-lg)] border border-border bg-card p-6">
            <header className="mb-6 flex items-baseline gap-4">
              <Skeleton className="h-2.5 w-6 rounded-[var(--radius-xs)]" />
              <Skeleton className="h-3.5 w-24 rounded-[var(--radius-xs)]" />
              <span className="h-px flex-1 bg-border" />
            </header>
            <ol className="space-y-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex gap-4">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-2.5 w-28 rounded-[var(--radius-xs)]" />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Messages card */}
          <section className="rounded-[var(--radius-lg)] border border-border bg-card p-6">
            <header className="mb-4 flex items-baseline gap-4">
              <Skeleton className="h-2.5 w-6 rounded-[var(--radius-xs)]" />
              <Skeleton className="h-3.5 w-24 rounded-[var(--radius-xs)]" />
              <span className="h-px flex-1 bg-border" />
            </header>
            <ul className="space-y-3">
              {[
                { mine: false, w: "w-3/4" },
                { mine: true, w: "w-1/2" },
                { mine: false, w: "w-2/3" },
              ].map((m, i) => (
                <li
                  key={i}
                  className={`flex ${m.mine ? "justify-end" : "justify-start"}`}
                >
                  <Skeleton className={`h-14 ${m.w} rounded-[var(--radius-lg)]`} />
                </li>
              ))}
            </ul>
            <div className="mt-4 grid gap-2 border-t border-border pt-4">
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </section>
        </div>

        {/* Sticky action panel */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-5">
            {/* Parties */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <Skeleton className="mb-3 h-2.5 w-20 rounded-[var(--radius-xs)]" />
              <ul className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-24 rounded-[var(--radius-xs)]" />
                      <Skeleton className="h-2.5 w-16 rounded-[var(--radius-xs)]" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 space-y-3">
              <Skeleton className="h-2.5 w-20 rounded-[var(--radius-xs)]" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
