"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Sliders,
  Plus,
  CalendarRange,
  Wifi,
  MapPin,
  CalendarClock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WeekView } from "@/components/app/calendar/week-view";
import { MonthView } from "@/components/app/calendar/month-view";
import { ListView } from "@/components/app/calendar/list-view";
import { EventPopover } from "@/components/app/calendar/event-popover";
import { Link } from "@/i18n/navigation";
import { weekEvents, monthEvents, type CalendarEvent } from "@/lib/mock/calendar";
import { useCurrentUser } from "@/lib/auth";
import {
  getBookingsForAccount,
  subscribeBookings,
  type Booking,
} from "@/lib/mock/bookings-state";
import { getHiddenEventIds, subscribeBlocks } from "@/lib/mock/calendar-state";
import { cn } from "@/lib/utils";
import { BlockTimeForm, Legend } from "./block-form";

// Stable empty snapshot for useSyncExternalStore SSR fallback.
const EMPTY_BOOKINGS: readonly Booking[] = Object.freeze([]);
const EMPTY_HIDDEN: ReadonlySet<string> = new Set();

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // Monday-start
  d.setDate(d.getDate() - day);
  return d;
}

export function CalendarShell() {
  const t = useTranslations("app.calendar");
  const locale = useLocale();
  const [tab, setTab] = React.useState<"week" | "month" | "list">("week");
  const [anchor, setAnchor] = React.useState<Date>(() => new Date());
  const { user } = useCurrentUser();
  const isStudent = user?.role !== "teacher";

  const weekStart = React.useMemo(() => startOfWeek(anchor).toISOString().slice(0, 10), [anchor]);
  const month = React.useMemo(
    () => `${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, "0")}`,
    [anchor],
  );

  // Subscribe to student-side bookings; teachers see availability blocks only.
  const accountId = user?.id ?? null;
  const getSnapshot = React.useCallback(
    () => (isStudent ? getBookingsForAccount(accountId) : EMPTY_BOOKINGS),
    [accountId, isStudent],
  );
  const sessionBookings = React.useSyncExternalStore<readonly Booking[]>(
    subscribeBookings,
    getSnapshot,
    () => EMPTY_BOOKINGS,
  );

  // Hidden static event ids — `removeBlock` tags seeded `ev-*` block ids
  // here so the teacher can dismiss them in-session without us having to
  // mutate the imported `weekEvents`/`monthEvents` constants.
  const hiddenEventIds = React.useSyncExternalStore<ReadonlySet<string>>(
    subscribeBlocks,
    getHiddenEventIds,
    () => EMPTY_HIDDEN,
  );

  const bookingEvents = React.useMemo<CalendarEvent[]>(
    () =>
      isStudent
        ? bookingsToCalendarEvents(sessionBookings)
        : [],
    [isStudent, sessionBookings],
  );

  const mergedWeekEvents = React.useMemo(
    () =>
      [...weekEvents, ...bookingEvents].filter((e) => !hiddenEventIds.has(e.id)),
    [bookingEvents, hiddenEventIds],
  );
  const mergedMonthEvents = React.useMemo(
    () =>
      [...monthEvents, ...bookingEvents].filter((e) => !hiddenEventIds.has(e.id)),
    [bookingEvents, hiddenEventIds],
  );

  const monthLabel = new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    month: "long",
    year: "numeric",
  }).format(anchor);

  const RightChevron = locale === "ar" ? ChevronLeft : ChevronRight;
  const LeftChevron = locale === "ar" ? ChevronRight : ChevronLeft;

  function shift(direction: -1 | 1) {
    setAnchor((d) => {
      const next = new Date(d);
      if (tab === "month") next.setMonth(d.getMonth() + direction);
      else next.setDate(d.getDate() + direction * 7);
      return next;
    });
  }

  return (
    <section className="container-narrow py-10">
      {/* Editorial header */}
      <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-3">
            <span className="ink-rule" aria-hidden />
            <span>{t("eyebrow")}</span>
          </div>
          <h1
            className="mt-3 font-serif text-4xl text-foreground sm:text-5xl"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            <span className="text-balance">{t("title")} </span>
            <span className="italic text-accent">·</span>{" "}
            <span className="italic text-ink-2 text-balance">{monthLabel}</span>
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-[15px] text-ink-2">{t("subtitle")}</p>
        </div>

        {/* Right-edge controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => shift(-1)}
            aria-label={tab === "month" ? t("previousMonth") : t("previousWeek")}
            title={tab === "month" ? t("previousMonth") : t("previousWeek")}
          >
            <LeftChevron className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAnchor(new Date())}>
            <CalendarRange className="h-4 w-4" />
            {t("today")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => shift(1)}
            aria-label={tab === "month" ? t("nextMonth") : t("nextWeek")}
            title={tab === "month" ? t("nextMonth") : t("nextWeek")}
          >
            <RightChevron className="h-4 w-4" />
          </Button>
          {!isStudent && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="primary" size="sm" className="lg:hidden">
                  <Plus className="h-4 w-4" />
                  {t("block.openSheet")}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[88dvh] rounded-t-[var(--radius-2xl)]">
                <SheetHeader>
                  <SheetTitle>{t("block.title")}</SheetTitle>
                  <SheetDescription>{t("block.subtitle")}</SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <BlockTimeForm />
                </SheetBody>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>

      {/* Decorative ruled line */}
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
          {tab === "month" ? monthLabel : t("week.headerNote", { weekNumber: weekNumber(anchor) })}
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>

      {/* Two columns: main + rail */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              <TabsTrigger value="week">{t("tabs.week")}</TabsTrigger>
              <TabsTrigger value="month">{t("tabs.month")}</TabsTrigger>
              <TabsTrigger value="list">{t("tabs.list")}</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="mt-4">
              <WeekView events={mergedWeekEvents} weekStart={weekStart} />
            </TabsContent>
            <TabsContent value="month" className="mt-4">
              <MonthView events={mergedMonthEvents} month={month} />
            </TabsContent>
            <TabsContent value="list" className="mt-4">
              <ListView events={mergedWeekEvents} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right rail — desktop only */}
        <aside className="hidden flex-col gap-5 lg:flex">
          <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
              <Sliders className="h-3.5 w-3.5" />
              {t("legend")}
            </div>
            <Legend />
          </div>

          {isStudent ? (
            <StudentBookingsRail
              bookings={sessionBookings}
              bookingEvents={bookingEvents}
            />
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
              <h2 className="mb-1 font-serif text-lg" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                <span className="italic text-accent">·</span> {t("block.title")}
              </h2>
              <p className="mb-4 text-xs text-ink-3">{t("block.subtitle")}</p>
              <BlockTimeForm />
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

/**
 * Right-rail card for students: lists their confirmed bookings (sorted
 * earliest first), with each row opening the shared EventPopover for full
 * details and actions. Empty state nudges back to the marketplace.
 */
function StudentBookingsRail({
  bookings,
  bookingEvents,
}: {
  bookings: readonly Booking[];
  bookingEvents: CalendarEvent[];
}) {
  const t = useTranslations("app.calendar");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  // Pair confirmed bookings to their projected CalendarEvent (by id) so the
  // popover gets the same shape as week/month-view cells.
  const eventById = React.useMemo(() => {
    const m = new Map<string, CalendarEvent>();
    for (const ev of bookingEvents) m.set(ev.id, ev);
    return m;
  }, [bookingEvents]);

  // Confirmed-only, soonest-first; bookings without a start sort to the bottom.
  const upcoming = React.useMemo(
    () =>
      bookings
        .filter((b) => b.status === "confirmed")
        .slice()
        .sort((a, b) => {
          const at = a.start ? new Date(a.start).getTime() : Number.POSITIVE_INFINITY;
          const bt = b.start ? new Date(b.start).getTime() : Number.POSITIVE_INFINITY;
          return at - bt;
        }),
    [bookings],
  );

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
        <CalendarClock className="h-3.5 w-3.5" />
        {t("studentRail.title")}
      </div>

      {upcoming.length === 0 ? (
        <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface/40 px-4 py-5 text-start">
          <p className="text-[13px] font-semibold text-foreground">
            {t("studentRail.emptyState.title")}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-2">
            {t("studentRail.emptyState.body")}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link href="/teachers">{t("studentRail.emptyState.primary")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {upcoming.map((b) => {
            const ev = eventById.get(b.id);
            const start = b.start ? new Date(b.start) : null;
            const dateLabel = start
              ? new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(start)
              : null;

            const KindIcon =
              b.kind === "1to1" || b.kind === "course" || b.kind === "live"
                ? Wifi
                : MapPin;

            const row = (
              <button
                type="button"
                className={cn(
                  "group flex w-full items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-3 text-start outline-none transition-colors",
                  "hover:bg-surface focus-visible:bg-surface",
                )}
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent"
                >
                  <KindIcon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="accent" className="text-[10px]">
                      {t(`format.${b.kind === "course" ? "cohort" : b.kind === "event" ? "event" : "1to1"}`)}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-foreground">
                    {b.subjectTitle[lang]}
                  </p>
                  {dateLabel && (
                    <p className="mt-0.5 text-[11px] text-ink-3 tabular">{dateLabel}</p>
                  )}
                  <p className="mt-0.5 truncate text-[11px] text-ink-3">
                    {b.teacherName[lang]}
                  </p>
                </div>
              </button>
            );

            // If we have a projected CalendarEvent for this booking, wrap in
            // a popover that surfaces the shared EventPopover details.
            return (
              <li key={b.id}>
                {ev ? (
                  <Popover>
                    <PopoverTrigger asChild>{row}</PopoverTrigger>
                    <PopoverContent align="start" className="w-80">
                      <EventPopover event={ev} />
                    </PopoverContent>
                  </Popover>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
        <Link href="/account?tab=payments">{t("studentRail.viewAll")}</Link>
      </Button>
    </div>
  );
}

function weekNumber(date: Date) {
  const s = startOfWeek(date);
  const start = new Date(s.getFullYear(), 0, 1);
  const diff = (s.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.ceil((diff + start.getDay() + 1) / 7);
}

/**
 * Project student bookings onto the calendar event shape. Bookings with no
 * start time fall back to "today @ 18:00" so the entry still surfaces (the
 * student gets a confirmation visible somewhere in the week view).
 */
function bookingsToCalendarEvents(bookings: readonly Booking[]): CalendarEvent[] {
  return bookings
    .filter((b) => b.status === "confirmed")
    .map<CalendarEvent>((b) => {
      const start = b.start ? new Date(b.start) : new Date();
      const end = b.end ? new Date(b.end) : new Date(start.getTime() + 60 * 60 * 1000);
      const date = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;
      const format: CalendarEvent["format"] =
        b.kind === "1to1" ? "1to1" : b.kind === "course" ? "cohort" : "event";
      return {
        id: b.id,
        date,
        startHour,
        endHour,
        status: "booked",
        mode: "online",
        title: b.subjectTitle,
        format,
      };
    });
}
