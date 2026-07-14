"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/toast";

type Props = {
  placeholder: string;
  ctaLabel: string;
  popularLabel: string;
  popular: string[];
  toastTitle: string;
  /** Translation template containing `{query}` (raw, since ICU `{}` substitution is done client-side). */
  toastDescriptionTemplate: string;
};

export function HelpSearch({
  placeholder,
  ctaLabel,
  popularLabel,
  popular,
  toastTitle,
  toastDescriptionTemplate,
}: Props) {
  const [query, setQuery] = React.useState("");
  const { show } = useToast();

  const fire = React.useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      show({
        variant: "default",
        title: toastTitle,
        description: toastDescriptionTemplate.replace("{query}", trimmed),
      });
    },
    [show, toastTitle, toastDescriptionTemplate],
  );

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fire(query);
        }}
        className="relative flex items-stretch gap-2"
        role="search"
      >
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-12 ps-10 pe-3 text-[15px]"
          />
        </div>
        <Button type="submit" variant="primary" size="lg">
          {ctaLabel}
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px]">
        <span className="font-semibold uppercase tracking-[0.16em] text-ink-3">
          {popularLabel}
        </span>
        <ul className="flex flex-wrap gap-2">
          {popular.map((p) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => {
                  setQuery(p);
                  fire(p);
                }}
                className="rounded-full border border-border bg-card px-3 py-1 text-[12px] text-ink-2 transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
