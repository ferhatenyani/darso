"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CalendarPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { EventRowActions } from "@/components/teacher/event-row-actions";
import { useCurrentUser } from "@/lib/auth/context";
import {
  getTeacherEvents,
  subscribeTeacherEvents,
  type TeacherEvent,
} from "@/lib/mock/teacher-events-state";
import { formatPrice } from "@/lib/utils";

/**
 * Client-side teacher events listing. Subscribes via useSyncExternalStore
 * so wizard-published events and edits/deletes surface immediately without
 * a navigation/refresh.
 */
export function EventsList({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.events");
  const tstatus = useTranslations("teacher.common.status");
  const { user } = useCurrentUser();
  const accountId = user?.id;

  const events = React.useSyncExternalStore(
    subscribeTeacherEvents,
    () => getTeacherEvents(accountId),
    () => getTeacherEvents(accountId),
  );

  if (events.length === 0) {
    return (
      <EmptyState
        icon={CalendarPlus}
        tone="accent"
        title={t("emptyState.title")}
        description={t("emptyState.body")}
        primary={{ label: t("emptyState.primary"), href: "/teach/events/new" }}
        secondary={{ label: t("emptyState.secondary"), href: "/calendar" }}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((ev) => {
        const taken = 0; // Mock store doesn't track reservations yet.
        const pct = ev.capacity > 0 ? (taken / ev.capacity) * 100 : 0;
        const { day, monthLabel, hour } = describeStart(ev.start, locale);

        return (
          <li
            key={ev.id}
            className="grid grid-cols-1 items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-4 transition-colors hover:bg-surface/40 sm:grid-cols-[auto_1fr_auto_auto_auto] sm:p-5"
          >
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-[var(--radius-lg)] bg-primary text-primary-foreground">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
                {monthLabel}
              </span>
              <span className="text-3xl font-semibold tabular leading-none">{day}</span>
              <span className="mt-1 text-[10px] tabular opacity-80">{hour}</span>
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold text-foreground">{ev.title[locale]}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge variant={ev.status === "published" ? "success" : "warning"}>
                  {tstatus(ev.status)}
                </Badge>
                {ev.isFree ? (
                  <span className="text-[12px] font-semibold text-success">
                    {locale === "ar" ? "مجاني" : "Gratuit"}
                  </span>
                ) : ev.priceDzd > 0 ? (
                  <span className="text-[12px] font-semibold tabular text-foreground">
                    {formatPrice(ev.priceDzd, locale)}
                  </span>
                ) : (
                  <span className="text-[12px] tabular text-ink-3">
                    {locale === "ar" ? "غير محدّد" : "À définir"}
                  </span>
                )}
              </div>
            </div>

            <div className="min-w-0 sm:w-44">
              <p className="text-[11px] tabular text-ink-3">
                {taken}/{ev.capacity} {locale === "ar" ? "مقعد" : "places"}
              </p>
              <Progress value={pct} className="mt-1.5 h-1" />
            </div>

            <div className="flex items-center gap-2">
              <EventRowActions eventId={ev.id} locale={locale} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const MONTH_FR = ["Janv", "Févr", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
const MONTH_AR = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function describeStart(iso: string, locale: "fr" | "ar") {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { day: "—", monthLabel: "—", hour: "" };
  }
  const day = String(d.getDate()).padStart(2, "0");
  const monthLabel = locale === "ar" ? MONTH_AR[d.getMonth()] : MONTH_FR[d.getMonth()];
  const hour = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return { day, monthLabel, hour };
}
