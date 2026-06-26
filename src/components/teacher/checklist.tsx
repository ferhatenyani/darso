"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ActionItem } from "@/lib/mock/dashboard";

export function TeacherChecklist({
  items,
  locale,
  goLabel,
}: {
  items: ActionItem[];
  locale: "fr" | "ar";
  goLabel: string;
}) {
  const [state, setState] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(items.map((i) => [i.id, i.done])),
  );

  return (
    <ul className="divide-y divide-border">
      {items.map((item, idx) => {
        const checked = !!state[item.id];
        return (
          <li
            key={item.id}
            className={cn(
              "flex items-start gap-3 p-4 transition-colors",
              checked ? "bg-surface/40" : "bg-card hover:bg-surface/40",
            )}
          >
            <Checkbox
              id={`act-${item.id}`}
              checked={checked}
              onCheckedChange={(v) => setState((s) => ({ ...s, [item.id]: v === true }))}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] font-semibold tabular text-ink-3">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <label
                  htmlFor={`act-${item.id}`}
                  className={cn(
                    "text-[13px] leading-snug",
                    checked ? "text-ink-3 line-through" : "text-foreground",
                  )}
                >
                  {item.label[locale]}
                </label>
              </div>
            </div>
            <Link
              href={item.href}
              aria-label={goLabel}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-surface hover:text-foreground"
            >
              <ArrowUpRight className="h-3.5 w-3.5 rtl-flip" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
