"use client";

import { useLocale, useTranslations } from "next-intl";
import { Wifi, MapPin, ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/lib/mock/calendar";
import { cn } from "@/lib/utils";

export function ListView({ events }: { events: CalendarEvent[] }) {
  const t = useTranslations("app.calendar");
  const tc = useTranslations("app.common");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  // Sort + filter to upcoming
  const now = new Date();
  const upcoming = events
    .filter((ev) => {
      const d = new Date(ev.date);
      d.setHours(Math.floor(ev.endHour), (ev.endHour % 1) * 60, 0, 0);
      return d.getTime() >= now.getTime() - 60 * 60 * 1000;
    })
    .sort((a, b) => {
      const da = new Date(a.date).getTime() + a.startHour * 3.6e6;
      const db = new Date(b.date).getTime() + b.startHour * 3.6e6;
      return da - db;
    });

  if (upcoming.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-ink-2">{t("list.empty")}</p>
        <Button asChild variant="outline" size="md" className="mt-4">
          <Link href="/browse">{t("list.exploreCta")}</Link>
        </Button>
      </div>
    );
  }

  // Group by day
  const byDay = new Map<string, CalendarEvent[]>();
  for (const ev of upcoming) {
    const list = byDay.get(ev.date) ?? [];
    list.push(ev);
    byDay.set(ev.date, list);
  }

  const fmtDay = new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-8">
      {Array.from(byDay.entries()).map(([iso, dayEvents], dayIdx) => {
        const date = new Date(iso);
        return (
          <section key={iso}>
            <header className="mb-3 flex items-baseline gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                {String(dayIdx + 1).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 bg-border" aria-hidden />
              <h3 className="text-sm font-medium text-foreground">{fmtDay.format(date)}</h3>
            </header>
            <ul className="space-y-2">
              {dayEvents.map((ev) => {
                const Mode = ev.mode === "online" ? Wifi : MapPin;
                return (
                  <li
                    key={ev.id}
                    className={cn(
                      "group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[var(--radius-md)] border border-border bg-card p-4 transition-colors",
                      "hover:border-accent/40 hover:bg-surface/30",
                    )}
                  >
                    <div className="flex flex-col items-center justify-center rounded-[var(--radius-sm)] bg-surface px-3 py-2 tabular">
                      <span className="text-xs text-ink-3">
                        {Math.floor(ev.startHour).toString().padStart(2, "0")}:
                        {((ev.startHour % 1) * 60).toString().padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-ink-3">
                        →{" "}
                        {Math.floor(ev.endHour).toString().padStart(2, "0")}:
                        {((ev.endHour % 1) * 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-foreground">{ev.title[lang]}</p>
                        <Badge variant="outline" className="hidden md:inline-flex">
                          {t(`format.${ev.format}`)}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-ink-3">
                        {ev.teacher && (
                          <span className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className={cn("bg-gradient-to-br text-[9px] text-white", ev.teacher.accent)}>
                                {ev.teacher.initials}
                              </AvatarFallback>
                            </Avatar>
                            {t("withTeacher", { name: ev.teacher.name[lang] })}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Mode className="h-3 w-3" />
                          {t(`mode.${ev.mode}`)}
                        </span>
                      </div>
                    </div>
                    <span className="flex items-center gap-2">
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
                      >
                        {t(`status.${ev.status}`)}
                      </Badge>
                      <Arrow className="hidden h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5 sm:inline rtl:group-hover:-translate-x-0.5" />
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
