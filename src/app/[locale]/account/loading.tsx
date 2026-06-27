import { Skeleton } from "@/components/ui/skeleton";

/**
 * Account-shell wireframe. Mirrors: header strip (avatar + title block),
 * then a 240px / 1fr two-column body with sidebar nav and content cards.
 */
export default function AccountLoading() {
  return (
    <>
      {/* Header strip */}
      <section className="border-b border-border bg-background">
        <div className="container-narrow py-10">
          <Skeleton className="h-2.5 w-24 rounded-[var(--radius-xs)]" />
          <div className="mt-3 flex flex-wrap items-end gap-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-3 w-40 rounded-[var(--radius-xs)]" />
              <Skeleton className="h-3 w-32 rounded-[var(--radius-xs)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Body: sidebar + content */}
      <section className="bg-background">
        <div className="container-narrow grid gap-8 py-10 lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Sidebar nav */}
          <nav>
            <div className="grid gap-1 rounded-[var(--radius-lg)] border border-border bg-card p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5"
                >
                  <Skeleton className="h-4 w-4 rounded-[var(--radius-xs)]" />
                  <Skeleton className="h-3.5 flex-1 rounded-[var(--radius-xs)]" />
                  <Skeleton className="h-3.5 w-3.5 rounded-[var(--radius-xs)]" />
                </div>
              ))}
            </div>
            <div className="my-5 h-px bg-border" />
            <Skeleton className="h-10 w-full" />
          </nav>

          {/* Content card stack */}
          <div className="grid gap-8">
            {/* Header */}
            <header className="border-b border-border pb-4">
              <Skeleton className="h-2.5 w-20 rounded-[var(--radius-xs)]" />
              <Skeleton className="mt-2 h-7 w-48" />
              <Skeleton className="mt-2 h-3 w-72 rounded-[var(--radius-xs)]" />
            </header>

            {/* Form blocks */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid gap-3">
                <Skeleton className="h-3 w-24 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            {/* Two-column row */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-3">
                <Skeleton className="h-3 w-20 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-3">
                <Skeleton className="h-3 w-20 rounded-[var(--radius-xs)]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Textarea block */}
            <div className="grid gap-3">
              <Skeleton className="h-3 w-16 rounded-[var(--radius-xs)]" />
              <Skeleton className="h-28 w-full" />
            </div>

            {/* Submit row */}
            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
