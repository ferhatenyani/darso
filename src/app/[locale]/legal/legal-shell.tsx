"use client";

import * as React from "react";
import { ArrowUp, List, Mail } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export type TocItem = { id: string; label: string };

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  /** Optional table (used only on the cookies page). */
  table?: {
    headers: string[];
    rows: Array<{
      name: string;
      category: string;
      purpose: string;
      duration: string;
    }>;
  };
};

type Props = {
  toc: TocItem[];
  sections: LegalSection[];
  labels: {
    tocTitle: string;
    tocMobileOpen: string;
    tocMobileClose: string;
    backToTop: string;
    lastUpdated: string;
    questions: string;
    questionsBody: string;
    contactDpo: string;
    contactEmail: string;
  };
};

/**
 * Editorial layout for long-form legal documents: sticky TOC on desktop,
 * floating Sheet-trigger on mobile, generous reading column (max 72ch),
 * back-to-top anchor, and a contact-DPO callout at the foot.
 *
 * Pure presentational + client-side scrollspy. No design-token violations:
 * no border-l accent, no bento, just `border-border` + `bg-card`.
 */
export function LegalShell({ toc, sections, labels }: Props) {
  const [activeId, setActiveId] = React.useState<string>(toc[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Scrollspy: track which section is currently in view.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const observers: IntersectionObserver[] = [];
    const visible = new Set<string>();

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(item.id);
            else visible.delete(item.id);
          }
          // Pick the first TOC id present in the visible set.
          const next = toc.find((t) => visible.has(t.id));
          if (next) setActiveId(next.id);
        },
        { rootMargin: "-30% 0% -55% 0%", threshold: [0, 1] },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [toc]);

  const onTocClick = React.useCallback(
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      setMobileOpen(false);
      // update hash without jumping
      history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
        {/* DESKTOP TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-3">
              {labels.tocTitle}
            </p>
            <nav aria-label="Table of contents" className="mt-3">
              <ol className="space-y-px border-s border-border ps-4">
                {toc.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={onTocClick(item.id)}
                        aria-current={active ? "true" : undefined}
                        className={
                          "block rounded-sm py-1.5 text-[13px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
                          (active
                            ? "text-accent font-medium"
                            : "text-ink-2 hover:text-foreground")
                        }
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
            <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-ink-3">
              {labels.lastUpdated}
            </p>
          </div>
        </aside>

        {/* MOBILE TOC TRIGGER (floating-but-discrete, NOT bento) */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="md" className="w-full">
                <List className="h-4 w-4" />
                {labels.tocMobileOpen}
              </Button>
            </SheetTrigger>
            <SheetContent side="end" className="w-[85vw] max-w-sm p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-3">
                {labels.tocTitle}
              </p>
              <nav aria-label="Table of contents" className="mt-4">
                <ol className="space-y-px border-s border-border ps-4">
                  {toc.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={onTocClick(item.id)}
                          aria-current={active ? "true" : undefined}
                          className={
                            "block py-2 text-[14px] transition-colors " +
                            (active
                              ? "text-accent font-medium"
                              : "text-ink-2 hover:text-foreground")
                          }
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-ink-3">
                {labels.lastUpdated}
              </p>
              <SheetClose asChild>
                <Button variant="ghost" size="sm" className="mt-6 w-full">
                  {labels.tocMobileClose}
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>

        {/* CONTENT */}
        <article className="min-w-0">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              className="scroll-mt-24 border-t border-border py-10 first:border-t-0 first:pt-0"
            >
              <h2
                id={`${s.id}-title`}
                className="group text-[22px] font-semibold tracking-tight text-foreground md:text-[26px]"
              >
                <a
                  href={`#${s.id}`}
                  onClick={onTocClick(s.id)}
                  className="hover:underline"
                >
                  {s.title}
                </a>
              </h2>

              {s.paragraphs ? (
                <div className="mt-4 max-w-[72ch] space-y-4">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="text-[15px] leading-[1.7] text-ink-2">
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}

              {s.table ? (
                <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
                      <thead>
                        <tr className="bg-surface text-start text-ink-2">
                          {s.table.headers.map((h, i) => (
                            <th
                              key={i}
                              scope="col"
                              className="border-b border-border px-4 py-3 text-start text-[11px] font-semibold uppercase tracking-[0.14em]"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map((row, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="px-4 py-3 font-mono text-[12.5px] text-foreground">
                              {row.name}
                            </td>
                            <td className="px-4 py-3 text-ink-2">{row.category}</td>
                            <td className="px-4 py-3 text-ink-2">{row.purpose}</td>
                            <td className="px-4 py-3 tabular text-ink-2">{row.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </section>
          ))}

          {/* Contact DPO callout */}
          <aside className="mt-12 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1 md:p-8">
            <div className="grid gap-4 md:grid-cols-[1.4fr_auto] md:items-center md:gap-8">
              <div>
                <h2 className="text-[18px] font-semibold tracking-tight text-foreground md:text-[20px]">
                  {labels.questions}
                </h2>
                <p className="mt-2 max-w-[60ch] text-[14px] leading-relaxed text-ink-2">
                  {labels.questionsBody}
                </p>
              </div>
              <Button asChild variant="primary" size="md">
                <a href={`mailto:${labels.contactEmail}`}>
                  <Mail className="h-4 w-4" />
                  {labels.contactDpo}
                </a>
              </Button>
            </div>
          </aside>

          <div className="mt-10 flex items-center justify-between text-[12px] text-ink-3">
            <span>{labels.lastUpdated}</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden />
              {labels.backToTop}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
