import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CourseWizard } from "@/components/teacher/course-wizard";

type Props = { params: Promise<{ locale: string }> };

export default async function NewCoursePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.newCourse");
  const tcommon = await getTranslations("teacher.common");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/teach/courses">
          <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
          {tcommon("back")}
        </Link>
      </Button>
      <header className="mb-8">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          <span className="ink-rule" aria-hidden />
          {t("title")}
        </p>
        <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-tight text-foreground sm:text-[42px]">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-xl text-[15px] text-ink-2">{t("subtitle")}</p>
      </header>

      <CourseWizard locale={locale as "fr" | "ar"} />
    </div>
  );
}
