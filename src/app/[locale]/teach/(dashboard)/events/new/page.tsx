import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionIndex } from "@/components/teacher/section-index";
import { EventWizard } from "@/components/teacher/event-wizard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "ar" ? "إنشاء حدث" : "Créer un événement" };
}

export default async function NewEventPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events.wizard");
  const tcommon = await getTranslations("teacher.common");
  const loc = locale as "fr" | "ar";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/teach/events">
          <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
          {tcommon("back")}
        </Link>
      </Button>

      <div className="mb-8">
        <SectionIndex
          num="01"
          label={t("eyebrow")}
          title={t("pageTitle")}
          description={t("pageSubtitle")}
        />
      </div>

      <EventWizard locale={loc} />
    </div>
  );
}
