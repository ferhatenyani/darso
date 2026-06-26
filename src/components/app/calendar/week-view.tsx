"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Wifi, MapPin } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { dayStartHour, dayEndHour, type CalendarEvent } from "@/lib/mock/calendar";

type WeekViewProps = {
  events: CalendarEvent[];
  /** Anchor date — Monday of the displayed week, YYYY-MM-DD */
  weekStart: string;
};

/**
 * Build a 7-day list starting from weekStart. Returns iso date + Date.
 */
function buildWeekDays(weekStartIso: string): { iso: string; date: Date }[] {
  const start = new Date(weekStartIso);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { iso: d.toISOString().slice(0, 10), date: d };
  });
}

const hourLabel = (h: number, locale: string) =>
  new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(2000, 0, 1, h, 0));

export function WeekView({ events, weekStart }: WeekViewProps) {
  const t = useTranslations("app.calendar");
  const locale = useLocale();
  const days = React.useMemo(() => buildWeekDays(weekStart), [weekStart]);
  const hours = React.useMemo(
    () => Array.from({ length: dayEndHour - dayStartHour + 1 }).map((_, i) => dayStartHour + i),
    [],
  );

  // Group events by day for quick lookup
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
  const ROW_PX = 56; // height per hour
  const totalHeight = hours.length * ROW_PX;

  const weekdaysShort = t.raw("week.weekdaysShort") as string[];

  // Compute week number (ISO-like, naive)
  const weekNumber = React.useMemo(() => {
    const d = new Date(weekStart);
    const start = new Date(d.getFullYear(), 0, 1);
    const diff = (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil((diff + start.getDay() + 1) / 7);
  }, [weekStart]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
      {/* Editorial header note */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/60 px-5 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
          {t("week.headerNote", { weekNumber })}
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-3">
          <span className="inline-block h-1 w-1 rounded-full bg-accent" />
          {t("eyebrow")}
        </span>
      </div>

      {/* Distinctive weekday header: big number + tiny day label */}
      <div className="grid grid-cols-[68px_repeat(7,minmax(0,1fr))] border-b border-border bg-background">
        <div aria-hidden className="border-e border-border bg-surface/40" />
        {days.map((d, i) => {
          const isToday = d.iso === todayIso;
          const dayNum = d.date.getDate();
          return (
            <div
              key={d.iso}
              className={cn(
                "relative border-e border-border last:border-e-0 px-3 py-3 text-start",
                isToday && "bg-accent-soft/40",
              )}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                {weekdaysShort[i]}
              </span>
              <span
                className={cn(
                  "block font-serif text-[28px] leading-[1.1] tabular",
                  isToday ? "text-accent italic" : "text-foreground",
                )}
                style={{ fontFamily: "ui-serif, Georgia, serif" }}
              >
                {dayNum}
              </span>
              {isToday && (
                <span
                  aria-hidden
                  className="absolute inset-x-3 bottom-1 block h-[2px] bg-accent"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Grid body */}
      <div className="relative grid grid-cols-[68px_repeat(7,minmax(0,1fr))]">
        {/* Hour axis */}
        <div className="border-e border-border bg-surface/40">
          {hours.map((h) => (
            <div
              key={h}
              style={{ height: ROW_PX }}
              className="flex items-start justify-end pe-2 pt-1.5 text-[10px] font-medium text-ink-3 tabular"
            >
              {hourLabel(h, locale)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((d) => {
          const dayEvents = byDay.get(d.iso) ?? [];
          const isToday = d.iso === todayIso;
          return (
            <div
              key={d.iso}
              className={cn(
                "relative border-e border-border last:border-e-0",
                isToday && "bg-accent-soft/15",
              )}
              style={{ height: totalHeight }}
            >
              {/* hour separators */}
              {hours.map((h, i) => (
                <div
                  key={h}
                  className={cn(
                    "absolute inset-x-0 border-t border-border/60",
                    i === 0 && "border-transparent",
                  )}
                  style={{ top: i * ROW_PX, height: ROW_PX }}
                />
              ))}
              {/* events */}
              {dayEvents.map((ev) => (
                <EventBlock key={ev.id} event={ev} rowPx={ROW_PX} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventBlock({ event, rowPx }: { event: CalendarEvent; rowPx: number }) {
  const t = useTranslations("app.calendar");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  const top = (event.startHour - dayStartHour) * rowPx;
  const height = Math.max((event.endHour - event.startHour) * rowPx - 4, 26);
  const isBlocked = event.status === "blocked";
  const isAvailable = event.status === "available";
  const isPending = event.status === "pending";

  const Mode = event.mode === "online" ? Wifi : MapPin;

  return (
    <div
      role="button"
      tabIndex={0}
      style={{ top, height }}
      className={cn(
        "absolute inset-x-1 overflow-hidden rounded-[var(--radius-sm)] px-2 py-1.5 text-start transition-shadow focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--ring-soft)]",
        // Booked — accent card
        event.status === "booked" &&
          "bg-card border border-accent/30 shadow-e1 hover:shadow-e2 [&_.bar]:bg-accent",
        // Pending — warning card
        isPending &&
          "bg-card border border-warning/40 shadow-e1 hover:shadow-e2 [&_.bar]:bg-warning",
        // Available — dashed outline only
        isAvailable &&
          "bg-background border border-dashed border-border-strong/70 text-ink-3 hover:border-accent/60 [&_.bar]:bg-border-strong",
        // Blocked — neutral muted, diagonal hatch via bg-dots
        isBlocked &&
          "bg-surface border border-border text-ink-3 bg-dots [&_.bar]:bg-ink-3/40",
      )}
    >
      {/* Marker-rule indicator on the start side */}
      <span className="bar absolute inset-y-0 start-0 w-[3px]" aria-hidden />

      <div className="flex items-start gap-2 ps-2">
        {event.teacher && !isAvailable && !isBlocked && (
          <Avatar className="h-6 w-6 shrink-0">
            <AvatarFallback className={cn("bg-gradient-to-br text-[10px] text-white", event.teacher.accent)}>
              {event.teacher.initials}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold leading-snug text-foreground">
            {event.title[lang]}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-ink-3 tabular">
            <Mode className="h-3 w-3" aria-hidden />
            <span>
              {Math.floor(event.startHour).toString().padStart(2, "0")}:
              {((event.startHour % 1) * 60).toString().padStart(2, "0")}
              {" — "}
              {Math.floor(event.endHour).toString().padStart(2, "0")}:
              {((event.endHour % 1) * 60).toString().padStart(2, "0")}
            </span>
          </p>
          {isPending && (
            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-[#7a5610]">
              {t("status.pending")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
