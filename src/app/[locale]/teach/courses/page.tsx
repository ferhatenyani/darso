import { setRequestLocale, getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionIndex } from "@/components/teacher/section-index";
import { CoursesView } from "@/components/teacher/courses-view";

type Props = { params: Promise<{ locale: string }> };

export default async function CoursesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.courses");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionIndex num="00" label={t("title")} title={t("title")} description={t("subtitle")} />
        <Button asChild variant="primary" size="md">
          <Link href="/teach/courses/new">
            <Plus className="h-4 w-4" aria-hidden />
            {t("create")}
          </Link>
        </Button>
      </div>

      <CoursesView locale={locale as "fr" | "ar"} />
    </div>
  );
}
