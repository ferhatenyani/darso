"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Search as SearchIcon,
  GraduationCap,
  BookOpen,
  CalendarClock,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { featuredTeachers, type Teacher } from "@/lib/mock/teachers";
import { courses, type Course } from "@/lib/mock/courses";
import { getTeacherEvents, type TeacherEvent } from "@/lib/mock/teacher-events-state";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------- */
/*  Hooks                                                                 */
/* --------------------------------------------------------------------- */

/** Debounce any value by `delayMs`. Returns the latest stable value. */
function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}

/* --------------------------------------------------------------------- */
/*  Types                                                                 */
/* --------------------------------------------------------------------- */

type Lang = "fr" | "ar";

const SUGGESTIONS = ["Maths", "IELTS", "Coran", "Piano", "React"];
const MAX_PER_GROUP = 6;

/* --------------------------------------------------------------------- */
/*  Island                                                                */
/* --------------------------------------------------------------------- */

export function GlobalSearch({ initialQuery }: { initialQuery: string }) {
  const t = useTranslations("search");
  const locale = useLocale();
  const lang: Lang = locale === "ar" ? "ar" : "fr";
  const router = useRouter();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const [query, setQuery] = React.useState(initialQuery);
  const debounced = useDebounced(query, 150);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus on mount.
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Reflect debounced query into the URL so results are shareable. We use
  // replace so the back button isn't polluted with intermediate keystrokes.
  React.useEffect(() => {
    const next = debounced.trim();
    const url = next
      ? `/search?q=${encodeURIComponent(next)}`
      : `/search`;
    router.replace(url as never);
  }, [debounced, router]);

  const trimmed = debounced.trim();
  const hasQuery = trimmed.length >= 2;
  const events = React.useMemo<readonly TeacherEvent[]>(() => getTeacherEvents(), []);

  const matches = React.useMemo(() => {
    if (!hasQuery) {
      return { teachers: [] as Teacher[], courses: [] as Course[], events: [] as TeacherEvent[] };
    }
    const q = trimmed.toLowerCase();
    return {
      teachers: featuredTeachers.filter((tc) =>
        tc.name[lang].toLowerCase().includes(q) ||
        tc.headline[lang].toLowerCase().includes(q) ||
        tc.subject[lang].toLowerCase().includes(q) ||
        tc.city[lang].toLowerCase().includes(q),
      ),
      courses: courses.filter((c) =>
        c.title[lang].toLowerCase().includes(q) ||
        c.subject[lang].toLowerCase().includes(q) ||
        c.teacher.name[lang].toLowerCase().includes(q),
      ),
      events: events.filter((ev) => {
        const inTitle =
          ev.title.fr.toLowerCase().includes(q) || ev.title.ar.toLowerCase().includes(q);
        const inDesc = ev.description?.toLowerCase().includes(q) ?? false;
        return inTitle || inDesc;
      }),
    };
  }, [hasQuery, trimmed, lang, events]);

  const totalCount =
    matches.teachers.length + matches.courses.length + matches.events.length;

  return (
    <div>
      {/* Sticky search header — the search input owns focus on mount and
          reflects into the URL so bookmarks / share sheets carry state. */}
      <section className="sticky top-[var(--site-header-h,64px)] z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-standard py-5 md:py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {t("eyebrow")}
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-lg)] border border-border-strong bg-card p-1.5 shadow-e1 transition-[border-color,box-shadow] focus-within:border-accent focus-within:shadow-e2">
            <span className="ms-1 grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-surface text-ink-2">
              <SearchIcon className="h-4 w-4" aria-hidden />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              aria-label={t("ariaLabel")}
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="h-11 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-ink-3 focus:outline-none"
            />
            {trimmed.length > 0 && (
              <span className="me-2 hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3 sm:inline tabular">
                {t("totalCount", { count: totalCount })}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="container-standard grid gap-10 py-10">
        {/* === No query / short query — jump links === */}
        {!hasQuery && (
          <article>
            <header className="mb-4 flex items-baseline justify-between">
              <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
                <span className="ink-rule" aria-hidden /> {t("empty.shortTitle")}
              </h2>
            </header>
            <p className="max-w-xl text-[14px] leading-relaxed text-ink-2">{t("empty.short")}</p>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
              {t("empty.jumpEyebrow")}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <JumpLink href={routes.teachers()} icon={<GraduationCap className="h-4 w-4" />} label={t("empty.jumpTeachers")} />
              <JumpLink href={routes.browse()} icon={<BookOpen className="h-4 w-4" />} label={t("empty.jumpCourses")} />
              <JumpLink href={routes.live()} icon={<CalendarClock className="h-4 w-4" />} label={t("empty.jumpLive")} />
              <JumpLink href={routes.requests()} icon={<Sparkles className="h-4 w-4" />} label={t("empty.jumpRequests")} />
            </div>
          </article>
        )}

        {/* === Has query, zero matches === */}
        {hasQuery && totalCount === 0 && (
          <article className="rounded-[var(--radius-lg)] border border-border bg-card p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
              {t("empty.noResultsTitle")}
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-foreground">
              {t("empty.noResults", { q: trimmed })}
            </p>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
              {t("empty.suggestionEyebrow")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </article>
        )}

        {/* === Has query, has matches — three grouped sections === */}
        {hasQuery && totalCount > 0 && (
          <>
            {matches.teachers.length > 0 && (
              <ResultGroup
                title={t("results.teachers")}
                count={matches.teachers.length}
                viewAll={{ href: "/teachers", label: t("results.viewAll"), Arrow }}
              >
                {matches.teachers.slice(0, MAX_PER_GROUP).map((tc) => (
                  <TeacherRow key={tc.id} teacher={tc} query={trimmed} lang={lang} />
                ))}
              </ResultGroup>
            )}

            {matches.courses.length > 0 && (
              <ResultGroup
                title={t("results.courses")}
                count={matches.courses.length}
                viewAll={{ href: "/browse", label: t("results.viewAll"), Arrow }}
              >
                {matches.courses.slice(0, MAX_PER_GROUP).map((c) => (
                  <CourseRow key={c.id} course={c} query={trimmed} lang={lang} />
                ))}
              </ResultGroup>
            )}

            {matches.events.length > 0 && (
              <ResultGroup
                title={t("results.events")}
                count={matches.events.length}
                viewAll={{ href: "/live", label: t("results.viewAll"), Arrow }}
              >
                {matches.events.slice(0, MAX_PER_GROUP).map((ev) => (
                  <EventRow key={ev.id} event={ev} query={trimmed} lang={lang} locale={locale} />
                ))}
              </ResultGroup>
            )}
          </>
        )}
      </section>
    </div>
  );
}

/* --------------------------------------------------------------------- */
/*  Subcomponents                                                         */
/* --------------------------------------------------------------------- */

function JumpLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href as never}
      className="group card-interactive flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-card p-4 shadow-e1"
    >
      <span className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-surface text-ink-2 transition-colors group-hover:bg-accent-soft group-hover:text-accent">
          {icon}
        </span>
        <span className="text-[14px] font-medium text-foreground">{label}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 text-ink-3 transition-colors group-hover:text-accent" />
    </Link>
  );
}

function ResultGroup({
  title,
  count,
  viewAll,
  children,
}: {
  title: string;
  count: number;
  viewAll: { href: string; label: string; Arrow: React.ComponentType<{ className?: string }> };
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-foreground">
          <span className="ink-rule" aria-hidden /> {title}
          <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-semibold tabular text-ink-2">
            {count}
          </span>
        </h2>
        <Link
          href={viewAll.href as never}
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-2 hover:text-foreground"
        >
          {viewAll.label}
          <viewAll.Arrow className="h-3.5 w-3.5" />
        </Link>
      </header>
      <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
        {children}
      </ul>
    </section>
  );
}

/** Bold the matched substring(s) in a string. Plain string in / React in. */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  if (!lower.includes(needle)) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(needle, i);
    if (idx === -1) {
      parts.push(text.slice(i));
      break;
    }
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(
      <mark key={idx} className="rounded bg-foreground/10 px-0.5 font-semibold text-foreground">
        {text.slice(idx, idx + needle.length)}
      </mark>,
    );
    i = idx + needle.length;
  }
  return <>{parts}</>;
}

function TeacherRow({ teacher, query, lang }: { teacher: Teacher; query: string; lang: Lang }) {
  const t = useTranslations("search.row");
  return (
    <li>
      <Link
        href={`/teachers/${teacher.slug}` as never}
        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface"
      >
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white",
            `bg-gradient-to-br ${teacher.accent}`,
          )}
          aria-hidden
        >
          {teacher.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-foreground">
            <Highlight text={teacher.name[lang]} q={query} />
          </p>
          <p className="truncate text-[12.5px] text-ink-3">
            <Highlight
              text={t("teacherMeta", { subject: teacher.subject[lang], city: teacher.city[lang] })}
              q={query}
            />
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-3 transition-colors group-hover:text-foreground" />
      </Link>
    </li>
  );
}

function CourseRow({ course, query, lang }: { course: Course; query: string; lang: Lang }) {
  const t = useTranslations("search.row");
  return (
    <li>
      <Link
        href={`/courses/${course.slug}` as never}
        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface"
      >
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-md)] text-white",
            `bg-gradient-to-br ${course.accent}`,
          )}
          aria-hidden
        >
          <BookOpen className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-foreground">
            <Highlight text={course.title[lang]} q={query} />
          </p>
          <p className="truncate text-[12.5px] text-ink-3">
            <Highlight
              text={t("courseMeta", {
                subject: course.subject[lang],
                teacher: course.teacher.name[lang],
              })}
              q={query}
            />
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-3 transition-colors group-hover:text-foreground" />
      </Link>
    </li>
  );
}

function EventRow({
  event,
  query,
  lang,
  locale,
}: {
  event: TeacherEvent;
  query: string;
  lang: Lang;
  locale: string;
}) {
  const t = useTranslations("search.row");
  const title = event.title[lang] || event.title.fr;
  const date = formatEventDate(event.start, locale);
  return (
    <li>
      <Link
        href={routes.live()}
        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-md)] border border-border bg-surface text-ink-2">
          <CalendarClock className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-foreground">
            <Highlight text={title} q={query} />
          </p>
          <p className="truncate text-[12.5px] text-ink-3">
            {t("eventMeta", { format: event.format, date })}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-3 transition-colors group-hover:text-foreground" />
      </Link>
    </li>
  );
}

function formatEventDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}
