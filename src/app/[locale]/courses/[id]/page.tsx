import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { CourseDetail } from "@/components/student/course-detail";
import { courseBySlug, courses } from "@/lib/mock/courses";

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
