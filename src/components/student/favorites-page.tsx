"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Heart } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TeacherCard } from "@/components/student/teacher-card";
import { CourseCard } from "@/components/student/course-card";
import { savedItems } from "@/lib/mock/students";
import { featuredTeachers } from "@/lib/mock/teachers";
import { courses } from "@/lib/mock/courses";

export function FavoritesPage() {
  const t = useTranslations("student.favorites");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [tab, setTab] = useState<"all" | "teachers" | "courses">("all");
  void locale;

  const teachers = savedItems
    .filter((s) => s.type === "teacher")
    .map((s) => featuredTeachers.find((t) => t.id === s.id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const coursesSaved = savedItems
    .filter((s) => s.type === "course")
    .map((s) => courses.find((c) => c.id === s.id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const empty = teachers.length === 0 && coursesSaved.length === 0;

  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="container-narrow py-10 md:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("title")}</p>
          <h1 className="mt-3 text-[36px] font-bold tracking-tight text-foreground md:text-[44px]">
            <span className="block">{t("title")}</span>
          </h1>
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>
        </div>
      </section>

      <section className="bg-surface/30">
        <div className="container-narrow py-10">
          {empty ? (
            <EmptyState
              icon={Heart}
              tone="accent"
              title={t("emptyState.title")}
              description={t("emptyState.body")}
              primary={{ label: t("emptyState.primary"), href: "/teachers" }}
              secondary={{ label: t("emptyState.secondary"), href: "/browse" }}
              hintsLabel={t("emptyState.hintsLabel")}
              hints={(tCommon.raw("hero.popularChips") as string[]).slice(0, 5).map((label) => ({
                label,
                href: `/browse?subject=${encodeURIComponent(label.toLowerCase())}`,
              }))}
              className="mx-auto max-w-2xl"
            />
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList>
                <TabsTrigger value="all">{t("tabAll")}</TabsTrigger>
                <TabsTrigger value="teachers">{t("tabTeachers")}</TabsTrigger>
                <TabsTrigger value="courses">{t("tabCourses")}</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {teachers.map((tc, i) => (
                    <TeacherCard key={tc.id} teacher={tc} index={i} />
                  ))}
                  {coursesSaved.map((c, i) => (
                    <CourseCard key={c.id} course={c} index={teachers.length + i} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="teachers">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {teachers.map((tc, i) => (
                    <TeacherCard key={tc.id} teacher={tc} index={i} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="courses">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {coursesSaved.map((c, i) => (
                    <CourseCard key={c.id} course={c} index={i} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </>
  );
}
