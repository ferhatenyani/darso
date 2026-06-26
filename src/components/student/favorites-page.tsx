"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TeacherCard } from "@/components/student/teacher-card";
import { CourseCard } from "@/components/student/course-card";
import { savedItems } from "@/lib/mock/students";
import { featuredTeachers } from "@/lib/mock/teachers";
import { courses } from "@/lib/mock/courses";

export function FavoritesPage() {
  const t = useTranslations("student.favorites");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const [tab, setTab] = useState<"all" | "teachers" | "courses">("all");

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
            <div className="mx-auto grid max-w-md place-items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-ink-3">
                <Heart className="h-5 w-5" />
              </span>
              <h2 className="text-[16px] font-semibold text-foreground">{t("empty")}</h2>
              <p className="text-[13px] text-ink-2">{t("emptyHint")}</p>
              <Button asChild variant="primary" size="md" className="mt-2">
                <Link href="/browse">
                  {t("exploreNow")}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
            </div>
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
