"use client";

import * as React from "react";
import { FileText, Video, LayoutTemplate, Search, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast";

type Resource = {
  category: string;
  type: string;
  title: string;
  summary: string;
  meta: string;
  kind: "pdf" | "video" | "template";
};

type Labels = {
  all: string;
  searchPlaceholder: string;
  open: string;
  download: string;
  watch: string;
  tagToastTitle: string;
  tagToastBody: string;
  empty: string;
};

const kindIcon = {
  pdf: FileText,
  video: Video,
  template: LayoutTemplate,
} as const;

const kindAction = {
  pdf: "download",
  video: "watch",
  template: "open",
} as const;

export function ResourcesLibrary({
  resources,
  labels,
}: {
  resources: Resource[];
  labels: Labels;
}) {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>(labels.all);
  const { show } = useToast();

  const categories = React.useMemo(
    () => [labels.all, ...Array.from(new Set(resources.map((r) => r.category)))],
    [resources, labels.all],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (activeCategory !== labels.all && r.category !== activeCategory) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [resources, query, activeCategory, labels.all]);

  function onResourceClick(r: Resource) {
    show({
      title: labels.tagToastTitle,
      description: `${r.title} — ${labels.tagToastBody}`,
      variant: "default",
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-card ps-10 pe-3 text-[14px] text-foreground placeholder:text-ink-3 focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                activeCategory === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-ink-2 hover:border-accent hover:text-accent",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => {
          const Icon = kindIcon[r.kind];
          const actionKey = kindAction[r.kind];
          const actionLabel =
            actionKey === "download"
              ? labels.download
              : actionKey === "watch"
                ? labels.watch
                : labels.open;
          return (
            <li key={r.title}>
              <button
                type="button"
                onClick={() => onResourceClick(r)}
                className="group flex h-full w-full flex-col rounded-[var(--radius-xl)] border border-border bg-card p-6 text-start transition-shadow hover:shadow-e2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-foreground/5 text-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <Badge variant="outline" className="font-mono text-[10.5px]">
                    {r.type}
                  </Badge>
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                  {r.category}
                </p>
                <h3 className="mt-2 text-balance text-[16px] font-semibold leading-[1.25] tracking-tight text-foreground md:text-[17px]">
                  {r.title}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-2">{r.summary}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[12px]">
                  <span className="tabular text-ink-3">{r.meta}</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-accent transition-colors group-hover:text-foreground">
                    {actionLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-[var(--radius-lg)] border border-dashed border-border bg-card py-12 text-center text-[14px] text-ink-3">
          {labels.empty}
        </p>
      ) : null}
    </div>
  );
}
