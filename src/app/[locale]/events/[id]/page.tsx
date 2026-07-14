import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { EventDetail } from "@/components/student/event-detail";
import { courses, courseBySlug } from "@/lib/mock/courses";

export function generateStaticParams() {
  return courses
    .filter((c) => c.format === "event")
    .flatMap((c) => [
      { locale: "fr", id: c.id },
      { locale: "ar", id: c.id },
    ]);
}

export default async function EventPage({
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
        <EventDetail course={course} />
      </main>
      <SiteFooter />
    </>
  );
}
