import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";

/**
 * Request detail wireframe. Mirrors: top breadcrumb strip, header section
 * with status/title/student card + meta grid (8/4 split), then the
 * applications list section.
 */
export default function RequestLoading() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Top breadcrumb / index strip */}
        <section className="border-b border-border bg-surface/40">
          <div className="container-narrow flex flex-wrap items-center justify-between gap-3 py-3">
            <Skeleton className="h-3 w-32 rounded-[var(--radius-xs)]" />
            <Skeleton className="h-3 w-20 rounded-[var(--radius-xs)]" />
          </div>
        </section>

        {/* Header */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-14">
            {/* Main column (8/12) */}
            <div className="lg:col-span-8 space-y-7">
              {/* Status strip */}
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-3 w-20 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-3 w-28 rounded-[var(--radius-xs)]" />
              </div>

              {/* Title block */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-full sm:h-12" />
                <Skeleton className="h-10 w-3/4 sm:h-12" />
              </div>

              {/* Student mini-card */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="min-w-0 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20 rounded-[var(--radius-xs)]" />
                </div>
              </div>

              {/* Meta grid */}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-5 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-2.5 w-16 rounded-[var(--radius-xs)]" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </dl>

              {/* Description block */}
              <div className="space-y-2.5">
                <Skeleton className="h-3.5 w-full rounded-[var(--radius-xs)]" />
                <Skeleton className="h-3.5 w-11/12 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-3.5 w-10/12 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-3.5 w-3/4 rounded-[var(--radius-xs)]" />
              </div>
            </div>

            {/* Side column (4/12) — action panel */}
            <aside className="lg:col-span-4">
              <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 space-y-4">
                <Skeleton className="h-2.5 w-20 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="h-px bg-border" />
                <Skeleton className="h-3 w-32 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-3 w-24 rounded-[var(--radius-xs)]" />
              </div>
            </aside>
          </div>
        </section>

        {/* Applications list */}
        <section className="bg-background">
          <div className="container-narrow py-10">
            <div className="mb-6 flex items-baseline justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-2.5 w-16 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-7 w-48" />
              </div>
              <Skeleton className="h-4 w-20 rounded-[var(--radius-xs)]" />
            </div>
            <ul className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  key={i}
                  className="rounded-[var(--radius-lg)] border border-border bg-card p-5"
                >
                  <div className="flex flex-wrap items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28 rounded-[var(--radius-xs)]" />
                      <Skeleton className="h-3 w-full max-w-xl rounded-[var(--radius-xs)]" />
                      <Skeleton className="h-3 w-3/4 max-w-md rounded-[var(--radius-xs)]" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
