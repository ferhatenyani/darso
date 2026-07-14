"use client";

import { useLocale, useTranslations } from "next-intl";
import { Star, MapPin, Wifi, Sparkles, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Teacher } from "@/lib/mock/teachers";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Editorial teacher card.
 * Used in /browse and /favorites.
 * `index` is for the № rank in top-left corner.
 */
export function TeacherCard({ teacher, index = 0 }: { teacher: Teacher; index?: number }) {
  const t = useTranslations("home.teachers");
  const tc = useTranslations("student.common");
  const tBrowse = useTranslations("student.browse");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={`/teachers/${teacher.slug}` as never}
      className={cn(
        "group relative flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card transition-all",
        "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-e2",
      )}
    >
      {/* Top rail: rank + tier */}
      <div className="flex items-center justify-between border-b border-border bg-surface/60 px-5 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
          № {String(index + 1).padStart(2, "0")}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-3">
          <span className="inline-block h-1 w-1 rounded-full bg-accent" />
          {tBrowse("kindTeacher")}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-[auto_1fr] gap-4 p-5">
        <Avatar className="h-14 w-14 shadow-e1">
          <AvatarFallback className={cn("bg-gradient-to-br text-base text-white", teacher.accent)}>
            {teacher.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-semibold text-foreground tabular">{teacher.rating.toFixed(2)}</span>
            <span aria-hidden>·</span>
            <span>{t("reviews", { count: teacher.reviews })}</span>
            {teacher.topRated && (
              <>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1 text-warning">
                  <Sparkles className="h-3 w-3" />
                  {t("badges.topRated")}
                </span>
              </>
            )}
          </div>
          <h3 className="mt-1 text-base font-semibold text-foreground truncate">{teacher.name[lang]}</h3>
          <p className="mt-0.5 text-[13px] text-ink-2 line-clamp-2 leading-snug">{teacher.headline[lang]}</p>
        </div>
      </div>

      <div className="px-5">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="primary">{teacher.subject[lang]}</Badge>
          <Badge variant="default">
            {teacher.mode === "online" ? (
              <Wifi className="h-3 w-3" />
            ) : teacher.mode === "in-person" ? (
              <MapPin className="h-3 w-3" />
            ) : (
              <>
                <Wifi className="h-3 w-3" />
                <MapPin className="h-3 w-3" />
              </>
            )}
            {teacher.city[lang]}
          </Badge>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border px-5 py-3.5">
        <div className="flex items-center gap-1 text-[11px] text-ink-3">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          <span className="hidden sm:inline">{t("lessons", { count: teacher.lessons })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-end">
            <span className="text-[10px] uppercase tracking-wider text-ink-3 me-1">{tc("from")}</span>
            <span className="font-semibold text-foreground tabular">{formatPrice(teacher.hourlyRate, locale)}</span>
            <span className="text-xs text-ink-3">{tc("perHour")}</span>
          </div>
          <Arrow className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
