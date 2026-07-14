import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { CourseDetail } from "@/components/student/course-detail";
import { courseBySlug, courses } from "@/lib/mock/courses";
import { teacherCourseToPublicCourse } from "@/lib/mock/course-adapter";
import { getCourseById } from "@/lib/mock/teacher-courses-state";

// Public detail page tries the curated `courses` catalog first (rich
// fields: outcomes, syllabus, dates, includes, accent) and falls back
// to the wizard-published `teacher-courses-state` store via the
// `course-adapter`. Wizard courses render with minimal data; curated
// courses keep their richer presentation — acceptable for the mock.

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

  // Primary read — curated catalog. Cheap and seed-stable.
  const curated = courseBySlug(id);
  if (curated) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1">
          <CourseDetail course={curated} />
        </main>
        <SiteFooter />
      </>
    );
  }

  // Fallback — wizard-published courses live in `teacher-courses-state`.
  // The adapter projects them onto the public `Course` shape with empty
  // arrays for the fields the wizard doesn't collect (syllabus items,
  // dates, includes). Note: this only resolves on the server within the
  // same session a wizard publish happened — mock state isn't shared
  // across deploys / requests, which is fine for the mock.
  const draft = getCourseById(id);
  if (draft) {
    const adapted = teacherCourseToPublicCourse(draft);
    return (
      <>
        <SiteHeader />
        <main className="flex-1">
          <CourseDetail course={adapted} />
        </main>
        <SiteFooter />
      </>
    );
  }

  notFound();
}
