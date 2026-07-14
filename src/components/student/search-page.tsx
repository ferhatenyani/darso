"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TeacherCard } from "@/components/student/teacher-card";
import { CourseCard } from "@/components/student/course-card";
import { featuredTeachers } from "@/lib/mock/teachers";
import { courses } from "@/lib/mock/courses";

export function SearchPage({ initialQuery }: { initialQuery: string }) {
  const t = useTranslations("student.search");
  const tHome = useTranslations("home.hero");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const [query, setQuery] = useState(initialQuery);

  const suggestions = (tHome.raw("popularChips") as string[]) ?? [];

  const matchedTeachers = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return featuredTeachers.filter(
      (t) =>
        t.name[lang].toLowerCase().includes(q) ||
        t.subject[lang].toLowerCase().includes(q) ||
        t.headline[lang].toLowerCase().includes(q) ||
        t.city[lang].toLowerCase().includes(q),
    );
  }, [query, lang]);

  const matchedCourses = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return courses.filter(
      (c) =>
        c.title[lang].toLowerCase().includes(q) ||
        c.subject[lang].toLowerCase().includes(q) ||
        c.teacher.name[lang].toLowerCase().includes(q),
    );
  }, [query, lang]);

  const totalCount = matchedTeachers.length + matchedCourses.length;

  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="container-narrow py-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("title")}</p>
          <h1 className="mt-3 text-[36px] font-bold tracking-tight text-foreground md:text-[44px]">
            {query ? <>{t("title")} <span className="font-light italic text-ink-2">{t("query", { q: query })}</span></> : t("noQuery")}
          </h1>
          {query && <p className="mt-3 text-[14px] text-ink-2">{t("subtitle", { count: totalCount })}</p>}

          <div className="mt-6 flex max-w-2xl items-center gap-2 rounded-[var(--radius-xl)] border border-border-strong bg-card p-1.5 shadow-e1 focus-within:border-accent focus-within:shadow-e2">
            <span className="ms-2 grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-surface text-ink-2">
              <Search className="h-4 w-4" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tHome("searchPlaceholder")}
              className="h-10 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-ink-3 focus:outline-none"
              aria-label={t("title")}
              dir={locale === "ar" ? "rtl" : "ltr"}
            />
          </div>
        </div>
      </section>

      <section className="bg-surface/30">
        <div className="container-narrow grid gap-10 py-10">
          {!query ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">{t("suggestionsTitle")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-ink-2 hover:border-accent hover:bg-accent-soft/40 hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : totalCount === 0 ? (
            <p className="rounded-[var(--radius-lg)] border border-border bg-card p-10 text-center text-[14px] text-ink-3">{t("empty")}</p>
          ) : (
            <>
              {matchedTeachers.length > 0 && (
                <section>
                  <div className="mb-4 flex items-end justify-between">
                    <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
                      <span className="ink-rule" aria-hidden /> {t("sectionTeachers")}
                    </h2>
                    <Button asChild variant="link" size="sm">
                      <Link href="/teachers">
                        {t("viewAllTeachers")}
                        <Arrow className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {matchedTeachers.map((tc, i) => (
                      <TeacherCard key={tc.id} teacher={tc} index={i} />
                    ))}
                  </div>
                </section>
              )}
              {matchedCourses.length > 0 && (
                <section>
                  <Separator className="mb-8" />
                  <div className="mb-4 flex items-end justify-between">
                    <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
                      <span className="ink-rule" aria-hidden /> {t("sectionCourses")}
                    </h2>
                    <Button asChild variant="link" size="sm">
                      <Link href="/browse">
                        {t("viewAllCourses")}
                        <Arrow className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {matchedCourses.map((c, i) => (
                      <CourseCard key={c.id} course={c} index={i} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
