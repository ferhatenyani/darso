"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Wifi, MapPin, BookOpen, CalendarX, Pencil, Trash2, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useToast } from "@/lib/toast";
import { useCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/mock/calendar";

type EventPopoverProps = {
  event: CalendarEvent;
  /**
   * Optional callback fired when the viewer wants to add a block at this
   * slot. CalendarShell wires this to open the existing block-form sheet
   * (teacher-only). When omitted, the "Add block" action is hidden.
   */
  onAddBlock?: (event: CalendarEvent) => void;
};

const fmtHour = (h: number) =>
  `${Math.floor(h).toString().padStart(2, "0")}:${Math.round((h % 1) * 60)
    .toString()
    .padStart(2, "0")}`;

export function EventPopover({ event, onAddBlock }: EventPopoverProps) {
  const t = useTranslations("app.calendar");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const router = useRouter();
  const { show } = useToast();
  const { user } = useCurrentUser();
  const isTeacher = user?.role === "teacher";

  const Mode = event.mode === "online" ? Wifi : MapPin;
  const dateLabel = React.useMemo(() => {
    const d = new Date(event.date);
    if (Number.isNaN(d.getTime())) return event.date;
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(d);
  }, [event.date, locale]);

  // Map status → display "kind" label
  const kindLabel = (() => {
    if (event.status === "blocked") return t("event.kind.blocked");
    if (event.status === "available") return t("event.kind.availability");
    return t("event.kind.booking");
  })();

  // Status badge variant aligned with week-view / month-view colors
  const statusVariant =
    event.status === "booked"
      ? ("accent" as const)
      : event.status === "pending"
        ? ("warning" as const)
        : event.status === "blocked"
          ? ("default" as const)
          : ("outline" as const);

  const handleOpenBooking = React.useCallback(() => {
    router.push("/account?tab=payments");
  }, [router]);

  const handleCancelBooking = React.useCallback(() => {
    show({
      title: t("event.toasts.cancelComingSoon.title"),
      description: t("event.toasts.cancelComingSoon.desc"),
    });
  }, [show, t]);

  const handleEditBlock = React.useCallback(() => {
    show({
      title: t("event.toasts.editComingSoon.title"),
      description: t("event.toasts.editComingSoon.desc"),
    });
  }, [show, t]);

  const handleRemoveBlock = React.useCallback(() => {
    // Deferred — would need a `removeBlock` mutator in calendar-state (Agent 3d
    // territory); for the mockup we surface the same "coming soon" toast.
    show({
      title: t("event.toasts.editComingSoon.title"),
      description: t("event.toasts.editComingSoon.desc"),
    });
  }, [show, t]);

  const handleAddBlock = React.useCallback(() => {
    if (onAddBlock) onAddBlock(event);
  }, [onAddBlock, event]);

  // Action row branches on status × role
  const renderActions = () => {
    if (event.status === "booked" || event.status === "pending") {
      // Student-side primary path; teachers viewing a booked slot get nothing
      // actionable (would need scheduling tools we don't have).
      if (isTeacher) return null;
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleOpenBooking}
            className="flex-1"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t("event.actions.openBooking")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCancelBooking}
          >
            <CalendarX className="h-3.5 w-3.5" />
            {t("event.actions.cancelBooking")}
          </Button>
        </div>
      );
    }
    if (event.status === "blocked") {
      if (!isTeacher) return null;
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleEditBlock}
            className="flex-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("event.actions.editBlock")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleRemoveBlock}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("event.actions.removeBlock")}
          </Button>
        </div>
      );
    }
    // status === "available"
    if (isTeacher && onAddBlock) {
      return (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddBlock}
          className="w-full"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("event.actions.addBlock")}
        </Button>
      );
    }
    return null;
  };

  const actions = renderActions();

  return (
    <div className="space-y-3">
      {/* Header: kind label + status */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          {kindLabel}
        </span>
        <Badge variant={statusVariant} className="shrink-0">
          {t(`status.${event.status}`)}
        </Badge>
      </div>

      {/* Title */}
      <div>
        <p
          className={cn(
            "font-serif text-base leading-snug text-foreground",
            event.status === "blocked" && "text-ink-2",
          )}
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          {event.title[lang]}
        </p>
        {event.teacher && (
          <p className="mt-1 text-xs text-ink-3">
            {t("withTeacher", { name: event.teacher.name[lang] })}
          </p>
        )}
      </div>

      {/* Time + mode chip */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-2">
        <span className="tabular">
          {dateLabel} · {fmtHour(event.startHour)} — {fmtHour(event.endHour)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-3">
          <Mode className="h-3 w-3" />
          {t(`mode.${event.mode}`)}
        </span>
      </div>

      {/* Optional location for in-person */}
      {event.location && (
        <p className="flex items-start gap-1.5 text-[11px] text-ink-3">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{event.location[lang]}</span>
        </p>
      )}

      {/* Format chip + sessions left */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-ink-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5">
          {t(`format.${event.format}`)}
        </span>
        {event.meta?.sessionsLeft != null && (
          <span className="text-ink-3 normal-case tracking-normal">
            {t("sessionsLeft", { n: event.meta.sessionsLeft })}
          </span>
        )}
      </div>

      {/* Actions */}
      {actions && <div className="border-t border-border pt-3">{actions}</div>}
    </div>
  );
}
