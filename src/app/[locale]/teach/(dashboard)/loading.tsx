import { Skeleton } from "@/components/ui/skeleton";

/**
 * Editorial wireframe for the teacher dashboard while server data resolves.
 * Mirrors the page layout: greeting hero + tiny stat card, then the 8/4 +
 * 5/4/3 asymmetric grid of cards.
 */
export default function TeachDashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {/* Hero greeting */}
      <section className="mb-10 lg:mb-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
          <div className="space-y-3">
            <Skeleton className="h-3 w-32 rounded-[var(--radius-xs)]" />
            <Skeleton className="h-14 w-3/4 sm:h-16 md:h-20 lg:h-[72px]" />
            <Skeleton className="h-14 w-2/3 sm:h-16 md:h-20 lg:h-[72px]" />
            <Skeleton className="h-4 w-full max-w-2xl rounded-[var(--radius-xs)]" />
          </div>

          {/* Tiny stat card */}
          <div className="lg:w-72">
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <Skeleton className="h-3 w-20 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-2.5 w-10 rounded-[var(--radius-xs)]" />
              </div>
              <Skeleton className="mt-3 h-8 w-32" />
              <Skeleton className="mt-2 h-3 w-40 rounded-[var(--radius-xs)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7">
        {/* Today panel — 8 cols */}
        <section className="lg:col-span-8">
          <SectionHeader />
          <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
            <ul className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-5"
                >
                  <div className="flex w-20 flex-col items-start gap-1.5">
                    <Skeleton className="h-2.5 w-6 rounded-[var(--radius-xs)]" />
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-2.5 w-12 rounded-[var(--radius-xs)]" />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-24 rounded-[var(--radius-xs)]" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Inbox — 4 cols */}
        <section className="lg:col-span-4">
          <SectionHeader />
          <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
            <ul className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full rounded-[var(--radius-xs)]" />
                  <Skeleton className="h-3 w-2/3 rounded-[var(--radius-xs)]" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Revenue — 5 cols */}
        <section className="lg:col-span-5">
          <SectionHeader />
          <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
            <div className="space-y-4 border-b border-border p-5">
              <div className="flex items-baseline justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-2.5 w-28 rounded-[var(--radius-xs)]" />
                  <Skeleton className="h-10 w-40" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <div className="p-5">
              <Skeleton className="h-2.5 w-16 rounded-[var(--radius-xs)]" />
              <Skeleton className="mt-3 h-24 w-full" />
            </div>
          </div>
        </section>

        {/* Reviews — 4 cols */}
        <section className="lg:col-span-4">
          <SectionHeader />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <article
                key={i}
                className="rounded-[var(--radius-lg)] border border-border bg-card p-4"
              >
                <header className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-24 rounded-[var(--radius-xs)]" />
                      <Skeleton className="h-2.5 w-16 rounded-[var(--radius-xs)]" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-16 rounded-[var(--radius-xs)]" />
                </header>
                <div className="mt-2 space-y-1.5">
                  <Skeleton className="h-3 w-full rounded-[var(--radius-xs)]" />
                  <Skeleton className="h-3 w-5/6 rounded-[var(--radius-xs)]" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Action items — 3 cols */}
        <section className="lg:col-span-3">
          <SectionHeader />
          <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
            <ul className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="h-4 w-4 rounded-[var(--radius-xs)]" />
                  <Skeleton className="h-3 flex-1 rounded-[var(--radius-xs)]" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader() {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <Skeleton className="h-2.5 w-6 rounded-[var(--radius-xs)]" />
        <Skeleton className="h-2.5 w-20 rounded-[var(--radius-xs)]" />
      </div>
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-3 w-56 rounded-[var(--radius-xs)]" />
    </div>
  );
}
