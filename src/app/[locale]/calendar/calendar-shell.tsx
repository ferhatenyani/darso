"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Sliders, Plus, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { weekEvents, monthEvents } from "@/lib/mock/calendar";
import { BlockTimeForm, Legend } from "./block-form";

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

  const weekStart = React.useMemo(() => startOfWeek(anchor).toISOString().slice(0, 10), [anchor]);
  const month = React.useMemo(
    () => `${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, "0")}`,
    [anchor],
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
              <WeekView events={weekEvents} weekStart={weekStart} />
            </TabsContent>
            <TabsContent value="month" className="mt-4">
              <MonthView events={monthEvents} month={month} />
            </TabsContent>
            <TabsContent value="list" className="mt-4">
              <ListView events={weekEvents} />
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

          <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
            <h2 className="mb-1 font-serif text-lg" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
              <span className="italic text-accent">·</span> {t("block.title")}
            </h2>
            <p className="mb-4 text-xs text-ink-3">{t("block.subtitle")}</p>
            <BlockTimeForm />
          </div>
        </aside>
      </div>
    </section>
  );
}

function weekNumber(date: Date) {
  const s = startOfWeek(date);
  const start = new Date(s.getFullYear(), 0, 1);
  const diff = (s.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.ceil((diff + start.getDay() + 1) / 7);
}
