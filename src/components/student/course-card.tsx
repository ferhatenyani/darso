"use client";

import { useLocale, useTranslations } from "next-intl";
import { Calendar, Users, ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/mock/courses";
import { cn, formatPrice } from "@/lib/utils";

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const tc = useTranslations("student.course");
  const tCommon = useTranslations("student.common");
  const tBrowse = useTranslations("student.browse");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const next = course.dates[0];
  const capacityPct = next ? Math.round((next.spotsTaken / next.spotsTotal) * 100) : 0;

  return (
    <Link
      href={`/courses/${course.id}` as never}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-all",
        "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-e2",
      )}
    >
      {/* Editorial header strip with gradient */}
      <div
        className={cn(
          "relative h-28 bg-gradient-to-br p-4 text-white",
          course.accent,
        )}
      >
        {/* Background mark */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 end-2 select-none text-[78px] font-black leading-none tracking-tighter text-white/[0.12]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative flex items-start justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
            <span className="inline-block h-1 w-1 rounded-full bg-white" />
            {tBrowse("kindCourse")}
          </span>
          <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {tc(`format.${course.format}` as never)}
          </span>
        </div>
        <p className="relative mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
          {course.subject[lang]}
        </p>
        <h3 className="relative mt-1 line-clamp-2 text-[15px] font-semibold leading-snug">
          {course.title[lang]}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Teacher row */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7">
            <AvatarFallback className={cn("bg-gradient-to-br text-[10px] text-white", course.teacher.accent)}>
              {course.teacher.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{course.teacher.name[lang]}</p>
            <p className="truncate text-[11px] text-ink-3">{course.teacher.city[lang]}</p>
          </div>
        </div>

        {/* Date + capacity row */}
        {next && (
          <div className="grid gap-2 rounded-[var(--radius-md)] border border-border bg-surface/60 p-3">
            <div className="flex items-center gap-1.5 text-[11.5px] text-ink-2">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              <span className="truncate">{next.label[lang]}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[11px] text-ink-3 tabular">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {next.spotsTaken}/{next.spotsTotal}
              </span>
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-border" aria-hidden>
                <span
                  className={cn(
                    "absolute inset-y-0 start-0 rounded-full",
                    capacityPct >= 85 ? "bg-danger" : capacityPct >= 60 ? "bg-warning" : "bg-success",
                  )}
                  style={{ width: `${capacityPct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <Badge variant="default">{tc(`level.${course.level}` as never)}</Badge>
          <div className="flex items-center gap-2">
            <div className="text-end">
              <span className="text-[10px] uppercase tracking-wider text-ink-3 me-1">{tCommon("from")}</span>
              <span className="font-semibold text-foreground tabular">{formatPrice(course.priceDzd, locale)}</span>
            </div>
            <Arrow className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
