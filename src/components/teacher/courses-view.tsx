"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Pencil, Copy, Archive, ArchiveRestore, Send, BookText } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { teacherCourses, type TeacherCourse } from "@/lib/mock/dashboard";
import { formatPrice, cn } from "@/lib/utils";

type Filter = "all" | "published" | "draft" | "archived";

export function CoursesView({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.courses");
  const [filter, setFilter] = React.useState<Filter>("all");

  const filtered = teacherCourses.filter((c) => filter === "all" || c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "published", "draft", "archived"] as const).map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-[13px] font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-ink-2 hover:bg-surface",
              )}
            >
              {t(`filters.${f}`)}
              <span className={cn("ms-1.5 tabular text-[11px]", active ? "opacity-80" : "text-ink-3")}>
                {teacherCourses.filter((c) => f === "all" || c.status === f).length}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyCourses />
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} locale={locale} />
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card md:block">
            <div className="grid grid-cols-[2.5fr_1fr_1.2fr_1.5fr_1fr_48px] gap-4 border-b border-border bg-surface/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              <span>{t("thead.title")}</span>
              <span>{t("thead.format")}</span>
              <span>{t("thead.capacity")}</span>
              <span>{t("thead.next")}</span>
              <span className="text-end">{t("thead.revenue")}</span>
              <span className="sr-only">{t("thead.actions")}</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((c, i) => {
                const pct = c.capacity.total > 0 ? (c.capacity.taken / c.capacity.total) * 100 : 0;
                return (
                  <li
                    key={c.id}
                    className="grid grid-cols-[2.5fr_1fr_1.2fr_1.5fr_1fr_48px] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface/40"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="mt-0.5 font-mono text-[10px] font-semibold tabular text-ink-3">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/teach/courses/${c.id}`}
                          className="block truncate text-[14px] font-semibold text-foreground hover:text-accent"
                        >
                          {c.title[locale]}
                        </Link>
                        <p className="mt-0.5 text-[11px] tabular text-ink-3">
                          {formatPrice(c.priceDzd, locale)} · {c.studentCount} {locale === "ar" ? "طالب" : "élèves"}
                        </p>
                      </div>
                    </div>
                    <FormatBadge format={c.format} />
                    <div className="min-w-0">
                      {c.capacity.total > 0 ? (
                        <>
                          <p className="text-[12px] tabular text-ink-2">
                            {c.capacity.taken}/{c.capacity.total}
                          </p>
                          <Progress value={pct} className="mt-1.5 h-1" tone={pct >= 100 ? "warning" : "accent"} />
                        </>
                      ) : (
                        <span className="text-[12px] text-ink-3">—</span>
                      )}
                    </div>
                    <div className="text-[12px] text-ink-2">
                      {c.nextSession ? c.nextSession[locale] : <span className="text-ink-3">{t("noNext")}</span>}
                    </div>
                    <div className="text-end font-semibold tabular text-foreground">
                      {c.monthRevenueDzd > 0 ? formatPrice(c.monthRevenueDzd, locale) : <span className="font-normal text-ink-3">—</span>}
                    </div>
                    <CourseActions status={c.status} />
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function CourseCard({ course, locale }: { course: TeacherCourse; locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.courses");
  const pct = course.capacity.total > 0 ? (course.capacity.taken / course.capacity.total) * 100 : 0;
  return (
    <li className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/teach/courses/${course.id}`} className="text-[15px] font-semibold text-foreground">
          {course.title[locale]}
        </Link>
        <CourseActions status={course.status} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <FormatBadge format={course.format} />
        <StatusBadge status={course.status} />
      </div>
      {course.capacity.total > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] tabular text-ink-3">
            <span>
              {course.capacity.taken}/{course.capacity.total}
            </span>
            <span>{formatPrice(course.monthRevenueDzd, locale)}</span>
          </div>
          <Progress value={pct} className="mt-1 h-1" />
        </div>
      )}
      {course.nextSession && (
        <p className="mt-3 text-[12px] text-ink-2">
          {t("thead.next")}: <span className="font-medium text-foreground">{course.nextSession[locale]}</span>
        </p>
      )}
    </li>
  );
}

function FormatBadge({ format }: { format: TeacherCourse["format"] }) {
  const t = useTranslations("teacher.courses.format");
  const map = { cohort: t("cohort"), "1to1": t("oneToOne"), event: t("event"), ondemand: t("ondemand") } as const;
  const tone = {
    cohort: "primary",
    "1to1": "accent",
    event: "warning",
    ondemand: "info",
  } as const;
  return <Badge variant={tone[format] as any}>{map[format]}</Badge>;
}

function StatusBadge({ status }: { status: TeacherCourse["status"] }) {
  const t = useTranslations("teacher.common.status");
  const tone = { draft: "warning", published: "success", archived: "default" } as const;
  return <Badge variant={tone[status] as any}>{t(status)}</Badge>;
}

function CourseActions({ status }: { status: TeacherCourse["status"] }) {
  const t = useTranslations("teacher.courses.actions");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={t("edit")}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil className="h-4 w-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="h-4 w-4" />
          {t("duplicate")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {status === "draft" && (
          <DropdownMenuItem>
            <Send className="h-4 w-4" />
            {t("publish")}
          </DropdownMenuItem>
        )}
        {status === "archived" ? (
          <DropdownMenuItem>
            <ArchiveRestore className="h-4 w-4" />
            {t("unarchive")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="text-danger focus:text-danger">
            <Archive className="h-4 w-4" />
            {t("archive")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyCourses() {
  const t = useTranslations("teacher.courses.empty");
  return (
    <div className="grid place-items-center rounded-[var(--radius-xl)] border border-dashed border-border bg-card px-6 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-ink-3">
        <BookText className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">{t("title")}</h3>
      <p className="mt-1 max-w-xs text-[13px] text-ink-3">{t("subtitle")}</p>
    </div>
  );
}
