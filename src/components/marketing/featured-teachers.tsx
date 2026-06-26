import { useLocale, useTranslations } from "next-intl";
import { Star, ShieldCheck, ArrowRight, ArrowLeft, Wifi, MapPin, Sparkles } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { featuredTeachers, type Teacher } from "@/lib/mock/teachers";
import { cn, formatPrice } from "@/lib/utils";

function TeacherCard({ teacher, index }: { teacher: Teacher; index: number }) {
  const t = useTranslations("home.teachers");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  return (
    <Link
      href={`/teachers/${teacher.slug}` as never}
      className="group relative flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-e2"
    >
      {/* Top bar: index + tier */}
      <div className="flex items-center justify-between border-b border-border bg-surface/60 px-5 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
          № {String(index + 1).padStart(2, "0")}
        </span>
        {teacher.topRated ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-warning">
            <Sparkles className="h-3 w-3" />
            {t("badges.topRated")}
          </span>
        ) : teacher.tier === "rising" ? (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
            {t("badges.newRising")}
          </span>
        ) : null}
      </div>

      <div className="grid flex-1 grid-cols-[auto_1fr] gap-4 p-5">
        <Avatar className="h-16 w-16 shadow-e1">
          <AvatarFallback className={cn("bg-gradient-to-br text-lg text-white", teacher.accent)}>
            {teacher.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-semibold text-foreground tabular">{teacher.rating.toFixed(2)}</span>
            <span>·</span>
            <span>{t("reviews", { count: teacher.reviews })}</span>
          </div>
          <h3 className="mt-1 text-base font-semibold text-foreground truncate">
            {teacher.name[lang]}
          </h3>
          <p className="mt-0.5 text-sm text-ink-2 line-clamp-2 leading-snug">
            {teacher.headline[lang]}
          </p>
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
        <div className="text-end">
          <span className="text-[10px] uppercase tracking-wider text-ink-3 me-1">{t("from")}</span>
          <span className="font-semibold text-foreground tabular">
            {formatPrice(teacher.hourlyRate, locale)}
          </span>
          <span className="text-xs text-ink-3">{t("perHour")}</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedTeachers() {
  const t = useTranslations("home.teachers");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="border-b border-border bg-surface">
      <div className="container-narrow py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-[36px] font-bold leading-[0.98] tracking-tight text-foreground md:text-[42px]">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
              {t("subtitle")}
            </p>
            <Link
              href="/teachers"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              {t("viewAll")}
              <Arrow className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
            {featuredTeachers.slice(0, 6).map((teacher, i) => (
              <TeacherCard key={teacher.id} teacher={teacher} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
