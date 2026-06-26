import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { teacherCourses } from "@/lib/mock/dashboard";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function EditCoursePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.editCourse");
  const tnew = await getTranslations("teacher.newCourse");
  const tstatus = await getTranslations("teacher.common.status");
  const tcommon = await getTranslations("teacher.common");

  const course = teacherCourses.find((c) => c.id === id);
  if (!course) notFound();

  const loc = locale as "fr" | "ar";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/teach/courses">
          <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
          {tcommon("back")}
        </Link>
      </Button>

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            <span className="ink-rule" aria-hidden />
            {t("title")}
            <Badge
              variant={course.status === "published" ? "success" : course.status === "draft" ? "warning" : "default"}
              className="ms-1"
            >
              {tstatus(course.status)}
            </Badge>
          </p>
          <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-tight text-foreground sm:text-[42px]">
            {course.title[loc]}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-ink-2">{t("subtitle")}</p>
        </div>
        <Button asChild variant="outline" size="md">
          <Link href={`/courses/${course.id}`}>
            <ExternalLink className="h-4 w-4 rtl-flip" aria-hidden />
            {t("viewPublic")}
          </Link>
        </Button>
      </header>

      <Tabs defaultValue="basics">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-surface p-1">
          <TabsTrigger value="basics">{tnew("steps.basics")}</TabsTrigger>
          <TabsTrigger value="details">{tnew("steps.details")}</TabsTrigger>
          <TabsTrigger value="format">{tnew("steps.format")}</TabsTrigger>
          <TabsTrigger value="pricing">{tnew("steps.pricing")}</TabsTrigger>
        </TabsList>
        <TabsContent value="basics">
          <EditPanel locale={loc} title={course.title[loc]} />
        </TabsContent>
        <TabsContent value="details">
          <EditPanel locale={loc} title={tnew("steps.details")} />
        </TabsContent>
        <TabsContent value="format">
          <EditPanel locale={loc} title={tnew("steps.format")} />
        </TabsContent>
        <TabsContent value="pricing">
          <EditPanel locale={loc} title={tnew("steps.pricing")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EditPanel({ locale, title }: { locale: "fr" | "ar"; title: string }) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6">
      <p className="text-sm text-ink-3">
        {locale === "ar"
          ? `هنا تعدّل قسم « ${title} ». الحقول مثل ما في معالج الإنشاء.`
          : `Édition du panneau « ${title} ». Les champs sont identiques au wizard de création.`}
      </p>
    </div>
  );
}
