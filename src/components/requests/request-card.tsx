"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, MapPin, Wifi, Layers, MessageSquare } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { LearningRequest } from "@/lib/mock/requests";
import { cn, formatPrice } from "@/lib/utils";
import { formatPostedAt, statusVariant, urgencyStripClass } from "./helpers";

type Variant = "wide" | "narrow" | "tall";

/**
 * Editorial "classified" card for a learning request.
 * Variants drive the asymmetric layout — not every card is the same size.
 */
export function RequestCard({
  request,
  index,
  variant = "narrow",
}: {
  request: LearningRequest;
  index: number;
  variant?: Variant;
}) {
  const t = useTranslations("requests");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const ModeIcon =
    request.mode === "online" ? Wifi : request.mode === "in-person" ? MapPin : Layers;
  const isWide = variant === "wide";
  const isTall = variant === "tall";

  const student = request.anonymous
    ? {
        name: t("shared.anonymous.name"),
        initials: t("shared.anonymous.initials"),
        accent: "from-ink-3 to-ink-2",
        city: request.city[lang],
      }
    : {
        name: request.student.name[lang],
        initials: request.student.initials,
        accent: request.student.accent,
        city: request.student.city[lang],
      };

  return (
    <article
      className={cn(
        "group relative isolate flex h-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card text-card-foreground transition-all",
        "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-e2",
        isWide ? "flex-col md:flex-row" : "flex-col",
      )}
    >
      {/* Urgency strip — vertical on the start edge, the marker that says "this is a classified" */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 start-0 w-1",
          urgencyStripClass(request.urgency),
        )}
      />

      {/* INDEX + META rail */}
      <header
        className={cn(
          "flex items-center justify-between gap-3 border-b border-border bg-surface/60 ps-5 pe-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3 tabular",
          isWide && "md:border-b-0 md:border-e md:flex-col md:items-start md:justify-between md:py-5 md:ps-5 md:pe-3 md:w-32",
        )}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-semibold tracking-[0.28em]">
            {t("browse.card.indexLabel")}
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            N°{String(index + 1).padStart(3, "0")}
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 normal-case tracking-normal",
            isWide && "md:mt-auto md:flex-col md:items-start md:gap-1",
          )}
        >
          <Badge variant={statusVariant(request.status)} className="font-mono text-[10px]">
            {t(`shared.status.${request.status}`)}
          </Badge>
          <span className="text-[10px] font-medium text-ink-3 normal-case tracking-wider">
            {formatPostedAt(request.postedAtHours, t)}
          </span>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 font-mono uppercase tracking-wider text-ink-2">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {request.subject[lang]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-ink-2">
            <ModeIcon className="h-3 w-3" />
            {t(
              request.mode === "online"
                ? "shared.modes.online"
                : request.mode === "in-person"
                  ? "shared.modes.inPerson"
                  : "shared.modes.both",
            )}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-ink-2">
            {request.city[lang]}
          </span>
        </div>

        {/* Title — editorial */}
        <Link
          href={`/requests/${request.slug}` as never}
          className="outline-none focus-visible:rounded-md"
        >
          <h3
            className={cn(
              "text-pretty font-semibold leading-tight tracking-tight text-foreground group-hover:text-accent",
              isWide || isTall ? "text-[20px] md:text-[22px]" : "text-[17px]",
            )}
          >
            {request.title[lang]}
          </h3>
        </Link>

        {/* Excerpt */}
        <p
          className={cn(
            "text-[13.5px] leading-relaxed text-ink-2",
            isTall ? "line-clamp-5" : "line-clamp-3",
          )}
        >
          {request.body[lang]}
        </p>

        {/* Bottom rail: student + budget + apps */}
        <footer className="mt-auto flex items-end justify-between gap-4 pt-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar className="h-9 w-9 shadow-e1">
              <AvatarFallback
                className={cn("bg-gradient-to-br text-xs text-white", student.accent)}
              >
                {student.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-medium text-foreground">
                {student.name}
              </p>
              <p className="truncate text-[11px] text-ink-3 font-mono tabular">
                {student.city} · {t("browse.card.deadlineLabel")}: {request.deadline[lang]}
              </p>
            </div>
          </div>
          <div className="text-end shrink-0">
            <p className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-ink-3">
              {t("browse.card.budgetLabel")}
            </p>
            <p className="font-semibold text-foreground tabular text-[15px]">
              {formatPrice(request.budgetDzd.min, locale)}
              <span className="px-1 text-ink-3">–</span>
              {formatPrice(request.budgetDzd.max, locale)}
            </p>
          </div>
        </footer>

        {/* Applications row */}
        <div className="flex items-center justify-between gap-3 border-t border-dashed border-border pt-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-2">
            <MessageSquare className="h-3.5 w-3.5 text-ink-3" />
            {request.applicationCount === 0 ? (
              <span className="text-ink-3">{t("browse.card.noApplicantsYet")}</span>
            ) : (
              <span>
                {t("browse.card.applicationCount", { count: request.applicationCount })}
              </span>
            )}
          </span>
          <Link
            href={`/requests/${request.slug}` as never}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-accent transition-opacity hover:opacity-80"
          >
            {t("browse.card.viewRequest")}
            <Arrow className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
