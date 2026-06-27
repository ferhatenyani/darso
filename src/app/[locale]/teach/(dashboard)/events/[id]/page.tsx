import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventEditForm } from "@/components/teacher/event-edit-form";
import { getEventById } from "@/lib/mock/teacher-events-state";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: locale === "ar" ? "تحرير الحدث" : "Modifier l'événement" };
}

export default async function EditEventPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events.edit");
  const tcommon = await getTranslations("teacher.common");
  const tstatus = await getTranslations("teacher.common.status");

  const event = getEventById(id);
  if (!event) notFound();

  const loc = locale as "fr" | "ar";
  const title = event.title[loc] || event.title.fr;

  // TODO(backend): wire to a real public event detail route once it exists.
  // For now we omit the "Open public page" link so we don't dead-link.

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/teach/events">
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
              variant={event.status === "published" ? "success" : "warning"}
              className="ms-1"
            >
              {tstatus(event.status)}
            </Badge>
          </p>
          <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-tight text-foreground sm:text-[42px]">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-ink-2">{t("subtitle")}</p>
        </div>
      </header>

      <EventEditForm event={event} locale={loc} />
    </div>
  );
}
