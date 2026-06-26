"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/mock/calendar";

type MonthViewProps = {
  events: CalendarEvent[];
  /** YYYY-MM — the visible month */
  month: string;
};

function buildMonthGrid(month: string) {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(y!, m! - 1, 1);
  const last = new Date(y!, m!, 0);
  // Monday start: shift Sunday(0) → 6, Mon(1) → 0, etc.
  const startOffset = (first.getDay() + 6) % 7;
  const total = startOffset + last.getDate();
  const rows = Math.ceil(total / 7);
  const cells: { iso: string; date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < rows * 7; i++) {
    const dayNum = i - startOffset + 1;
    const d = new Date(y!, m! - 1, dayNum);
    cells.push({
      iso: d.toISOString().slice(0, 10),
      date: d,
      inMonth: d.getMonth() === m! - 1,
    });
  }
  return cells;
}

export function MonthView({ events, month }: MonthViewProps) {
  const t = useTranslations("app.calendar");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const weekdaysShort = t.raw("week.weekdaysShort") as string[];
  const cells = React.useMemo(() => buildMonthGrid(month), [month]);

  const byDay = React.useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const list = m.get(ev.date) ?? [];
      list.push(ev);
      m.set(ev.date, list);
    }
    return m;
  }, [events]);

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
      <div className="grid grid-cols-7 border-b border-border bg-surface/60">
        {weekdaysShort.map((w) => (
          <div
            key={w}
            className="border-e border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3 last:border-e-0"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((c, i) => {
          const dayEvents = byDay.get(c.iso) ?? [];
          const count = dayEvents.length;
          const isToday = c.iso === todayIso;
          return (
            <Popover key={`${c.iso}-${i}`}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "relative flex h-24 flex-col items-start justify-start border-e border-b border-border bg-background p-2 text-start outline-none transition-colors",
                    "hover:bg-surface focus-visible:bg-surface",
                    !c.inMonth && "bg-surface/50",
                    isToday && "bg-accent-soft/30",
                  )}
                >
                  <span
                    className={cn(
                      "tabular text-sm font-semibold",
                      !c.inMonth ? "text-ink-3" : "text-foreground",
                      isToday && "text-accent",
                    )}
                  >
                    {c.date.getDate()}
                  </span>
                  {isToday && (
                    <span
                      aria-hidden
                      className="absolute end-2 top-2 inline-block h-1.5 w-1.5 rounded-full bg-accent"
                    />
                  )}
                  {count > 0 && (
                    <div className="mt-auto flex w-full items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                      <span className="truncate text-[10px] font-medium text-ink-2">
                        {t("month.events", { n: count })}
                      </span>
                    </div>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <DayPopover events={dayEvents} date={c.date} lang={lang} />
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}

function DayPopover({
  events,
  date,
  lang,
}: {
  events: CalendarEvent[];
  date: Date;
  lang: "fr" | "ar";
}) {
  const t = useTranslations("app.calendar");
  const locale = useLocale();
  const label = new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);

  return (
    <div className="space-y-3">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3">
          {t("month.popoverTitle", { day: label })}
        </span>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-ink-3">{t("month.noEvents")}</p>
      ) : (
        <ul className="space-y-2">
          {events.map((ev) => (
            <li
              key={ev.id}
              className={cn(
                "group relative grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-2.5",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-full w-[3px] rounded-full",
                  ev.status === "booked" && "bg-accent",
                  ev.status === "available" && "bg-border-strong",
                  ev.status === "blocked" && "bg-ink-3/40",
                  ev.status === "pending" && "bg-warning",
                )}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{ev.title[lang]}</p>
                <p className="mt-0.5 text-xs text-ink-3 tabular">
                  {Math.floor(ev.startHour).toString().padStart(2, "0")}:
                  {((ev.startHour % 1) * 60).toString().padStart(2, "0")}
                  {" — "}
                  {Math.floor(ev.endHour).toString().padStart(2, "0")}:
                  {((ev.endHour % 1) * 60).toString().padStart(2, "0")}
                </p>
              </div>
              <Badge
                variant={
                  ev.status === "booked"
                    ? "accent"
                    : ev.status === "blocked"
                      ? "default"
                      : ev.status === "pending"
                        ? "warning"
                        : "outline"
                }
                className="shrink-0"
              >
                {t(`status.${ev.status}`)}
              </Badge>
            </li>
          ))}
        </ul>
      )}
      {events.some((e) => e.status === "booked") && (
        <Button asChild variant="ghost" size="sm" className="w-full">
          <Link href="/calendar">{t("popover.details")}</Link>
        </Button>
      )}
    </div>
  );
}
