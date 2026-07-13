"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Clock, Users } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckoutDialog } from "@/components/booking/checkout-dialog";
import { upcomingSessions } from "@/lib/mock/sessions";
import { useToast } from "@/lib/toast";
import { cn, formatPrice } from "@/lib/utils";

export function LivePanel() {
  const t = useTranslations("home.livePanel");
  const tBooking = useTranslations("booking");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const { show } = useToast();

  const sessions = upcomingSessions.slice(0, 4);

  const handleJoinLive = (title: string) => {
    show({
      title: tBooking("toasts.joiningLive.title"),
      description: tBooking("toasts.joiningLive.desc", { title }),
      variant: "default",
    });
  };

  return (
    <aside
      aria-label={t("eyebrow")}
      className="relative rounded-[var(--radius-xl)] border border-border-strong bg-card p-2 shadow-e3"
    >
      <header className="flex items-center justify-between px-3 pt-3 pb-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            {t("eyebrow")}
          </p>
          <p className="mt-0.5 text-[13px] text-ink-2">{t("subtitle")}</p>
        </div>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-danger/10 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-danger">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-danger live-dot" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-danger" />
          </span>
          live
        </span>
      </header>

      <ol className="grid gap-2">
        {sessions.map((s) => {
          const isLive = s.state === "live";
          const isSoon = s.state === "soon";
          const rowInner = (
            <>
              {/* Time rail (vertical pill on start) */}
              <div className="grid w-14 shrink-0 grid-rows-2 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface text-center">
                <div
                  className={cn(
                    "flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider",
                    isLive ? "bg-danger text-danger-foreground" : isSoon ? "bg-accent text-accent-foreground" : "bg-primary/8 text-primary",
                  )}
                >
                  {isLive ? t("live") : isSoon ? "soon" : s.format === "event" ? "event" : "cohort"}
                </div>
                <div className="flex items-center justify-center text-xs font-semibold text-foreground">
                  {s.startsAt[lang].split("·").pop()?.trim().replace("h", ":") ?? ""}
                </div>
              </div>

              <div className="min-w-0 flex-1 text-start">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] text-ink-3 line-clamp-1">
                    {s.startsAt[lang]}
                    {isSoon && s.startsInMin && (
                      <span className="ms-1.5 inline-flex items-center gap-1 rounded-full bg-accent/12 px-1.5 py-px text-[10px] font-semibold text-accent">
                        <Clock className="h-2.5 w-2.5" />
                        {t("inMin", { min: s.startsInMin })}
                      </span>
                    )}
                  </p>
                  <span className="shrink-0 text-[11px] font-semibold tabular text-ink-2 group-hover:text-accent">
                    {formatPrice(s.priceDzd, locale)}
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-semibold text-foreground line-clamp-1 group-hover:text-accent">
                  {s.title[lang]}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className={cn("bg-gradient-to-br text-[9px] text-white", s.teacher.accent)}>
                      {s.teacher.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] text-ink-2 truncate">
                    {s.teacher.name[lang]}
                  </span>
                  <span className="ms-auto inline-flex items-center gap-1 text-[11px] text-ink-3 tabular">
                    <Users className="h-3 w-3" />
                    {t("places", { taken: s.capacity.taken, total: s.capacity.total })}
                  </span>
                </div>
              </div>
            </>
          );
          const rowClass = cn(
            "group relative flex w-full gap-3 rounded-[var(--radius-lg)] border border-border bg-background p-3 text-start transition-all",
            "hover:border-accent/40 hover:shadow-e1",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            isLive && "border-danger/30 bg-gradient-to-br from-danger/[0.04] to-transparent",
          );
          return (
            <li key={s.id}>
              {isLive ? (
                <button
                  type="button"
                  className={rowClass}
                  onClick={() => handleJoinLive(s.title[lang])}
                >
                  {rowInner}
                </button>
              ) : (
                <CheckoutDialog
                  kind="live"
                  subjectTitle={s.title}
                  teacherSlug={s.teacher.slug}
                  teacherName={s.teacher.name}
                  priceDzd={s.priceDzd}
                  scheduleLabel={s.startsAt}
                  trigger={
                    <button type="button" className={rowClass}>
                      {rowInner}
                    </button>
                  }
                />
              )}
            </li>
          );
        })}
      </ol>

      <Link
        href="/live"
        className="mt-2 flex items-center justify-between rounded-[var(--radius-lg)] bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
      >
        {t("viewAll")}
        <Arrow className="h-4 w-4" />
      </Link>
    </aside>
  );
}
