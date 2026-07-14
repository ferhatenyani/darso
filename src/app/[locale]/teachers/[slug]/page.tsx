import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { TeacherProfile } from "@/components/student/teacher-profile";
import { featuredTeachers } from "@/lib/mock/teachers";

export function generateStaticParams() {
  return featuredTeachers.flatMap((t) => [
    { locale: "fr", slug: t.slug },
    { locale: "ar", slug: t.slug },
  ]);
}

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const teacher = featuredTeachers.find((t) => t.slug === slug);
  if (!teacher) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <TeacherProfile teacher={teacher} />
      </main>
      <SiteFooter />
    </>
  );
}
