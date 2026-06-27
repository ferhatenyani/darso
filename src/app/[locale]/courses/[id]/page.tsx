import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { CourseDetail } from "@/components/student/course-detail";
import { courseBySlug, courses } from "@/lib/mock/courses";

// Public detail page is intentionally limited to the curated `courses`
// catalogue (`src/lib/mock/courses.ts`): the public `Course` shape carries
// rich fields the wizard never collects (outcomes, syllabus, dates, teacher
// record, language list, includes, accent). Wizard-published teacher courses
// (Batch 5a — `teacher-courses-state.ts`) deliberately stay scoped to
// `/teach/courses/[id]` (teacher edit page) until that shape grows enough to
// also satisfy the public CourseDetail component.

export function generateStaticParams() {
  return courses.flatMap((c) => [
    { locale: "fr", id: c.id },
    { locale: "ar", id: c.id },
    { locale: "fr", id: c.slug },
    { locale: "ar", id: c.slug },
  ]);
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const course = courseBySlug(id);
  if (!course) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <CourseDetail course={course} />
      </main>
      <SiteFooter />
    </>
  );
}
