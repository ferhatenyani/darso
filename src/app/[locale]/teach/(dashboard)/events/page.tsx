import { setRequestLocale, getTranslations } from "next-intl/server";
import { CalendarPlus } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionIndex } from "@/components/teacher/section-index";
import { EventsList } from "@/components/teacher/events-list";

type Props = { params: Promise<{ locale: string }> };

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.events");
  const loc = locale as "fr" | "ar";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionIndex num="01" label={t("title")} title={t("title")} description={t("subtitle")} />
        <Button asChild variant="primary" size="md">
          <Link href="/teach/events/new">
            <CalendarPlus className="h-4 w-4" aria-hidden />
            {t("create")}
          </Link>
        </Button>
      </div>

      <EventsList locale={loc} />
    </div>
  );
}
