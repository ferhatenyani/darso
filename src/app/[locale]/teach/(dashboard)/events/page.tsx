import { setRequestLocale, getTranslations } from "next-intl/server";
import { CalendarPlus } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectionIndex } from "@/components/teacher/section-index";
import { EventRowActions } from "@/components/teacher/event-row-actions";
import { teacherEvents } from "@/lib/mock/dashboard";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.events");
  const tstatus = await getTranslations("teacher.common.status");
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

      <ul className="space-y-3">
        {teacherEvents.map((ev) => {
          const pct = ev.capacity.total > 0 ? (ev.capacity.taken / ev.capacity.total) * 100 : 0;
          return (
            <li
              key={ev.id}
              className="grid grid-cols-1 items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-4 transition-colors hover:bg-surface/40 sm:grid-cols-[auto_1fr_auto_auto_auto] sm:p-5"
            >
              {/* Big date block */}
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-[var(--radius-lg)] bg-primary text-primary-foreground">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
                  {loc === "ar" ? ev.date.monthAr : ev.date.monthFr}
                </span>
                <span className="text-3xl font-semibold tabular leading-none">{ev.date.day}</span>
                <span className="mt-1 text-[10px] tabular opacity-80">{ev.hour}</span>
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-semibold text-foreground">{ev.title[loc]}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Badge
                    variant={ev.status === "published" ? "success" : ev.status === "draft" ? "warning" : "default"}
                  >
                    {tstatus(ev.status)}
                  </Badge>
                  {ev.priceDzd > 0 ? (
                    <span className="text-[12px] font-semibold tabular text-foreground">
                      {formatPrice(ev.priceDzd, locale)}
                    </span>
                  ) : (
                    <span className="text-[12px] tabular text-ink-3">
                      {loc === "ar" ? "غير محدّد" : "À définir"}
                    </span>
                  )}
                </div>
              </div>

              <div className="min-w-0 sm:w-44">
                <p className="text-[11px] tabular text-ink-3">
                  {ev.capacity.taken}/{ev.capacity.total} {loc === "ar" ? "مقعد" : "places"}
                </p>
                <Progress value={pct} className="mt-1.5 h-1" />
              </div>

              <EventRowActions eventId={ev.id} locale={loc} />
            </li>
          );
        })}
      </ul>

      {teacherEvents.length === 0 && (
        <p className="rounded-[var(--radius-xl)] border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-ink-3">
          {t("empty")}
        </p>
      )}
    </div>
  );
}
