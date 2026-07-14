"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Pencil, Copy, Archive, ArchiveRestore, Send, BookText, ExternalLink } from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/lib/auth/context";
import type { TeacherCourse } from "@/lib/mock/dashboard";
import {
  addCourse,
  getTeacherCourses,
  subscribeTeacherCourses,
  updateCourse,
} from "@/lib/mock/teacher-courses-state";
import { useToast } from "@/lib/toast";
import { formatPrice, cn } from "@/lib/utils";

type Filter = "all" | "published" | "draft" | "archived";

export function CoursesView({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.courses");
  const { user } = useCurrentUser();
  const accountId = user?.id ?? null;
  const [filter, setFilter] = React.useState<Filter>("all");

  // Subscribe to the shared teacher-courses store so newly-published
  // wizard courses + saves from the edit page show up here immediately.
  // Per-account snapshot cache keeps getSnapshot referentially stable so
  // useSyncExternalStore doesn't trigger an infinite update loop.
  const getSnapshot = React.useCallback(
    () => getTeacherCourses(accountId),
    [accountId],
  );
  const serverSnapshot = React.useMemo<readonly TeacherCourse[]>(() => [], []);
  const courses = React.useSyncExternalStore(
    subscribeTeacherCourses,
    getSnapshot,
    () => serverSnapshot,
  );

  const filtered = courses.filter((c) => filter === "all" || c.status === filter);

  const updateStatus = React.useCallback(
    (id: string, status: TeacherCourse["status"]) => {
      updateCourse(id, { status });
    },
    [],
  );

  const duplicateCourse = React.useCallback(
    (id: string) => {
      const orig = courses.find((c) => c.id === id);
      if (!orig) return;
      const copySuffix = locale === "ar" ? " · نسخة" : " · copie";
      addCourse({
        title: { fr: orig.title.fr + copySuffix, ar: orig.title.ar + copySuffix },
        format: orig.format,
        status: "draft",
        priceDzd: orig.priceDzd,
        capacity: { taken: 0, total: orig.capacity.total },
        nextSession: null,
        monthRevenueDzd: 0,
        studentCount: 0,
        accountId: accountId ?? undefined,
      });
    },
    [accountId, courses, locale],
  );

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
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-ink-2 hover:bg-surface",
              )}
            >
              {t(`filters.${f}`)}
              <span className={cn("ms-1.5 tabular text-[11px]", active ? "opacity-80" : "text-ink-3")}>
                {courses.filter((c) => f === "all" || c.status === f).length}
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
              <CourseCard
                key={c.id}
                course={c}
                locale={locale}
                onUpdateStatus={updateStatus}
                onDuplicate={duplicateCourse}
              />
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card md:block">
            <div className="grid grid-cols-[2.5fr_1fr_1.2fr_1.5fr_1fr_88px] gap-4 border-b border-border bg-surface/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
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
                    className="grid grid-cols-[2.5fr_1fr_1.2fr_1.5fr_1fr_88px] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface/40"
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
                    <div className="flex items-center justify-end gap-2">
                      <ViewPublicLink courseId={c.id} />
                      <CourseActions
                        courseId={c.id}
                        status={c.status}
                        onUpdateStatus={updateStatus}
                        onDuplicate={duplicateCourse}
                      />
                    </div>
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

function CourseCard({
  course,
  locale,
  onUpdateStatus,
  onDuplicate,
}: {
  course: TeacherCourse;
  locale: "fr" | "ar";
  onUpdateStatus: (id: string, status: TeacherCourse["status"]) => void;
  onDuplicate: (id: string) => void;
}) {
  const t = useTranslations("teacher.courses");
  const pct = course.capacity.total > 0 ? (course.capacity.taken / course.capacity.total) * 100 : 0;
  return (
    <li className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/teach/courses/${course.id}`} className="text-[15px] font-semibold text-foreground">
          {course.title[locale]}
        </Link>
        <div className="flex items-center gap-2">
          <ViewPublicLink courseId={course.id} />
          <CourseActions
            courseId={course.id}
            status={course.status}
            onUpdateStatus={onUpdateStatus}
            onDuplicate={onDuplicate}
          />
        </div>
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

function CourseActions({
  courseId,
  status,
  onUpdateStatus,
  onDuplicate,
}: {
  courseId: string;
  status: TeacherCourse["status"];
  onUpdateStatus: (id: string, status: TeacherCourse["status"]) => void;
  onDuplicate: (id: string) => void;
}) {
  const t = useTranslations("teacher.courses.actions");
  const tt = useTranslations("teacher.courses.toasts");
  const { show } = useToast();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={t("more")}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            show({
              title: tt("editing.title"),
              description: tt("editing.desc"),
              variant: "default",
            });
            // Course edit page is a Batch 5 rebuild; for now navigate to the existing stub.
            router.push(`/teach/courses/${courseId}`);
          }}
        >
          <Pencil className="h-4 w-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            onDuplicate(courseId);
            show({
              title: tt("duplicated.title"),
              description: tt("duplicated.desc"),
              variant: "success",
            });
          }}
        >
          <Copy className="h-4 w-4" />
          {t("duplicate")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {status === "draft" && (
          <DropdownMenuItem
            onSelect={() => {
              onUpdateStatus(courseId, "published");
              show({
                title: tt("published.title"),
                description: tt("published.desc"),
                variant: "success",
              });
            }}
          >
            <Send className="h-4 w-4" />
            {t("publish")}
          </DropdownMenuItem>
        )}
        {status === "archived" ? (
          <DropdownMenuItem
            onSelect={() => {
              onUpdateStatus(courseId, "published");
              show({
                title: tt("unarchived.title"),
                description: tt("unarchived.desc"),
                variant: "success",
              });
            }}
          >
            <ArchiveRestore className="h-4 w-4" />
            {t("unarchive")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-danger focus:text-danger"
            onSelect={() => {
              onUpdateStatus(courseId, "archived");
              show({
                title: tt("archived.title"),
                description: tt("archived.desc"),
                variant: "warning",
              });
            }}
          >
            <Archive className="h-4 w-4" />
            {t("archive")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Per-row "View public" anchor — opens the public course page in a new tab.
 * Read-only affordance distinct from the kebab menu; sits next to it so
 * teachers can preview without leaving the dashboard.
 */
function ViewPublicLink({ courseId }: { courseId: string }) {
  const t = useTranslations("teacher.courses.actions");
  return (
    <Button
      asChild
      variant="ghost"
      size="icon-sm"
      aria-label={t("viewPublic")}
      title={t("viewPublic")}
    >
      <a href={`/courses/${courseId}`} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-4 w-4 rtl-flip" aria-hidden />
      </a>
    </Button>
  );
}

function EmptyCourses() {
  const t = useTranslations("teacher.courses.empty");
  return (
    <EmptyState
      icon={BookText}
      tone="accent"
      title={t("title")}
      description={t("subtitle")}
      primary={{ label: t("primary"), href: "/teach/courses/new" }}
      secondary={{ label: t("secondary"), href: "/teach/resources" }}
    />
  );
}
