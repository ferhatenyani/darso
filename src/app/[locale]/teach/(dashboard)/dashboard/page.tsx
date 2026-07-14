import { setRequestLocale, getTranslations } from "next-intl/server";
import { Play, Sparkles } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectionIndex } from "@/components/teacher/section-index";
import { Stars } from "@/components/teacher/stars";
import { RevenueTrend } from "@/components/teacher/revenue-trend";
import { TeacherChecklist } from "@/components/teacher/checklist";
import { UnifiedActionQueue } from "@/components/teacher/unified-action-queue";
import { TierProjectionCard } from "@/components/teacher/tier-projection-card";
import {
  currentTeacher,
  todaySessions,
  recentRequests,
  revenueSnapshot,
  revenueTrend,
  recentDashboardReviews,
  actionItems,
} from "@/lib/mock/dashboard";
import { formatPrice, formatCompact, cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export default async function TeachHome({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("teacher.home");
  const loc = locale as "fr" | "ar";

  const liveCount = todaySessions.filter((s) => s.state === "live").length;
  const upcomingCount = todaySessions.filter((s) => s.state === "upcoming").length;
  const pendingCount = recentRequests.filter((r) => r.status === "pending").length;
  const delta = revenueSnapshot.currentMonthDzd - revenueSnapshot.lastMonthDzd;
  const toNext = revenueSnapshot.nextTierThresholdDzd - revenueSnapshot.currentMonthDzd;
  const progressToNext = Math.min(
    100,
    Math.round((revenueSnapshot.currentMonthDzd / revenueSnapshot.nextTierThresholdDzd) * 100),
  );

  const dateLabel = new Intl.DateTimeFormat(loc === "ar" ? "ar-DZ" : "fr-DZ", {
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {/* Hero — editorial greeting */}
      <section className="relative mb-10 lg:mb-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-ink-3">
              <span className="ink-rule" aria-hidden />
              {dateLabel}
            </p>
            <h1 className="text-balance text-[28px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[36px] md:text-[44px] lg:text-[52px]">
              {t("greetingDay")},
              <br />
              <span className="text-ink-2">{currentTeacher.name[loc]}.</span>
            </h1>
            <p className="max-w-2xl text-pretty text-[15px] text-ink-2 sm:text-base">
              {t("pulse", { live: liveCount, upcoming: upcomingCount, pending: pendingCount })}
            </p>
          </div>

          {/* Tiny stat card — asymmetric, not a grid */}
          <div className="lg:w-72">
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                  {t("revenue.title")}
                </span>
                <span className="text-[10px] tabular text-ink-3">
                  {revenueSnapshot.currentTierLabel[loc]}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tabular tracking-tight text-foreground">
                  {formatPrice(revenueSnapshot.currentMonthDzd, locale)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[12px] tabular">
                <span className={cn("font-semibold", delta >= 0 ? "text-success" : "text-danger")}>
                  {delta >= 0 ? "+" : "−"}
                  {formatCompact(Math.abs(delta), locale)}
                </span>
                <span className="text-ink-3">{loc === "ar" ? "مقارنة بالشهر الماضي" : "vs mois passé"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial grid — asymmetric */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7">
        {/* Today panel — spans 2 cols (8/12) */}
        <section className="lg:col-span-8">
          <SectionIndex
            num={t("today.indexNum")}
            label={t("indexLabel")}
            title={t("today.title")}
            description={t("today.subtitle")}
          />
          <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
            <ul className="divide-y divide-border">
              {todaySessions.map((s, i) => {
                const isLive = s.state === "live";
                return (
                  <li
                    key={s.id}
                    className={cn(
                      "relative grid grid-cols-[auto_1fr_auto] items-center gap-4 p-5 transition-colors hover:bg-surface/50",
                      isLive && "bg-danger/[0.03]",
                    )}
                  >
                    {/* Time block */}
                    <div className="flex w-20 flex-col items-start">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 text-base font-semibold tabular text-foreground">
                        {s.startTime[loc].split("·")[1]?.trim() ?? s.startTime[loc]}
                      </span>
                      <span className="text-[11px] text-ink-3">{t("today.duration", { min: s.durationMin })}</span>
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {isLive ? (
                          <Badge variant="danger" className="h-[18px] gap-1 px-1.5 text-[10px] leading-3">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inset-0 rounded-full bg-danger live-dot" />
                              <span className="relative h-1.5 w-1.5 rounded-full bg-danger" />
                            </span>
                            {t("today.live")}
                          </Badge>
                        ) : (
                          <Badge variant="default" className="h-[18px] px-1.5 text-[10px] leading-3">
                            {t("today.startsIn", { min: s.startsInMin })}
                          </Badge>
                        )}
                        <span className="text-[11px] tabular text-ink-3">
                          {t("today.capacity", { taken: s.capacity.taken, total: s.capacity.total })}
                        </span>
                      </div>
                      <h3 className="mt-1.5 truncate text-[15px] font-semibold text-foreground">
                        {s.title[loc]}
                      </h3>
                    </div>

                    {/* Action */}
                    <div>
                      {isLive ? (
                        <Button asChild variant="primary" size="sm">
                          <Link href={s.href}>
                            <Play className="h-3.5 w-3.5" aria-hidden />
                            {t("today.start")}
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild variant="outline" size="sm">
                          <Link href={s.href}>{t("today.prepare")}</Link>
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Unified action queue — 4/12 col.
            Replaces the standalone Pending Requests inbox and merges
            approvals, direct invites, proposal opportunities and payment
            confirmations into one time-urgency-sorted list. */}
        <section className="lg:col-span-4">
          <SectionIndex
            num={t("inbox.indexNum")}
            label={t("indexLabel")}
            title="File d'action unifiée"
            description="Approbations, invitations, opportunités et paiements — triés par urgence."
          />
          <UnifiedActionQueue />
        </section>

        {/* Revenue + Trend — 5/12 col */}
        <section className="lg:col-span-5">
          <SectionIndex
            num={t("revenue.indexNum")}
            label={t("indexLabel")}
            title={t("revenue.title")}
            description={t("revenue.subtitle", {
              threshold: formatCompact(revenueSnapshot.nextTierThresholdDzd, locale),
            })}
          />
          <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
            <div className="border-b border-border p-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                    {t("revenue.tier", {
                      tier: revenueSnapshot.currentTierLabel[loc],
                      rate: Math.round(revenueSnapshot.rate * 100),
                    })}
                  </p>
                  <p className="mt-1 text-4xl font-semibold tabular tracking-tight text-foreground">
                    {formatPrice(revenueSnapshot.currentMonthDzd, locale)}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular",
                    delta >= 0 ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/10 text-danger",
                  )}
                >
                  {delta >= 0
                    ? t("revenue.deltaUp", { value: formatCompact(Math.abs(delta), locale) })
                    : t("revenue.deltaDown", { value: formatCompact(Math.abs(delta), locale) })}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] tabular">
                  <span className="text-ink-3">
                    {t("revenue.toNext", {
                      amount: formatPrice(toNext, locale),
                      tier: revenueSnapshot.nextTierLabel[loc],
                    })}
                  </span>
                  <span className="font-semibold text-ink-2">{progressToNext}%</span>
                </div>
                <Progress value={progressToNext} tone="accent" />
              </div>
            </div>

            <div className="p-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                {t("revenue.weeks")}
              </p>
              <RevenueTrend values={revenueTrend} ariaLabel={t("revenue.weeks")} />
            </div>
          </div>

          {/* Tier projection — decision 6 (rolling monthly with proactive
              projection). Shows current trailing avg + month-end forecast
              so the teacher never gets surprised by a tier change. */}
          <TierProjectionCard />
        </section>

        {/* Recent reviews — 4/12 col */}
        <section className="lg:col-span-4">
          <SectionIndex
            num={t("reviews.indexNum")}
            label={t("indexLabel")}
            title={t("reviews.title")}
            description={t("reviews.subtitle")}
          />
          <div className="mt-6 space-y-3">
            {recentDashboardReviews.map((rv) => (
              <article key={rv.id} className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
                <header className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-[11px] font-semibold text-primary">
                        {rv.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">{rv.studentName[loc]}</p>
                      <p className="text-[10px] text-ink-3 tabular">{rv.postedAt[loc]}</p>
                    </div>
                  </div>
                  <Stars value={rv.rating} size={12} />
                </header>
                <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-ink-2">{rv.excerpt[loc]}</p>
                {rv.hasReply ? (
                  <p className="mt-2 text-[11px] font-medium text-success">{t("reviews.replied")}</p>
                ) : (
                  <Link
                    href="/teach/reviews"
                    className="mt-2 inline-flex text-[11px] font-medium text-accent underline-offset-2 hover:underline"
                  >
                    {t("reviews.reply")} →
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Action items — full width row */}
        <section className="lg:col-span-3">
          <SectionIndex
            num={t("checklist.indexNum")}
            label={t("indexLabel")}
            title={t("checklist.title")}
            description={t("checklist.subtitle")}
          />
          <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
            <TeacherChecklist items={actionItems} locale={loc} goLabel={t("checklist.go")} />
          </div>
          <div className="mt-4 rounded-[var(--radius-lg)] border border-dashed border-accent/30 bg-accent-soft/40 p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <p className="text-[12px] leading-relaxed text-ink-2">
                {loc === "ar"
                  ? "نصيحة: الردّ في أقل من 30 دقيقة يضاعف فرص الحجز."
                  : "Astuce : répondre en moins de 30 min double le taux d'acceptation."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer rule */}
      <div className="mt-12 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-ink-3">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span className="tabular">v 1.0</span>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>
    </div>
  );
}
