"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Languages,
  Users,
  CircleDot,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckoutDialog } from "@/components/booking/checkout-dialog";
import {
  ListingApprovalBadge,
  ListingApprovalExplainer,
  deriveApprovalMode,
} from "@/components/student/listing-mode-badges";
import { reviewsForTeacher } from "@/lib/mock/reviews";
import type { Course } from "@/lib/mock/courses";
import { cn, formatPrice } from "@/lib/utils";

export function EventDetail({ course }: { course: Course }) {
  const t = useTranslations("student.event");
  const tCourse = useTranslations("student.course");
  const tProfile = useTranslations("student.teacherProfile");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ChevronRight : ChevronLeft;
  const router = useRouter();

  const date = course.dates[0]!;
  const left = date.spotsTotal - date.spotsTaken;
  const pct = Math.round((date.spotsTaken / date.spotsTotal) * 100);
  const soldOut = left <= 0;

  const teacherReviews = reviewsForTeacher(course.teacher.id);
  const hasReviews = course.reviews > 0 && teacherReviews.length > 0;

  return (
    <>
      {/* Mobile back row */}
      <div className="border-b border-border bg-background lg:hidden">
        <div className="container-narrow flex h-11 items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus rounded-[var(--radius-xs)] -mx-1 px-1"
            aria-label={t("backToBrowse")}
          >
            <Back className="h-4 w-4" aria-hidden />
            {t("backToBrowse")}
          </button>
        </div>
      </div>

      {/* HERO — accent gradient signature for live events. Mobile-first stack. */}
      <section className={cn("relative isolate overflow-hidden bg-gradient-to-br text-white", course.accent)}>
        <div aria-hidden className="absolute inset-0 bg-grid-sm opacity-[0.12]" />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 end-4 select-none text-[120px] font-black leading-none tracking-tighter text-white/[0.06] md:text-[200px]"
        >
          {course.subject[lang].slice(0, 3).toUpperCase()}
        </span>
        <div className="container-narrow py-8 md:py-12 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
            <div className="flex flex-col gap-4">
              <Link
                href="/live"
                className="hidden lg:inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 transition-colors hover:text-white"
              >
                <Back className="h-3 w-3" aria-hidden />
                {t("backToBrowse")}
              </Link>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                  {tCourse(`format.${course.format}` as never)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-white/75">
                  <Clock className="h-3 w-3" aria-hidden />
                  {course.durationLabel[lang]}
                </span>
                {!hasReviews && (
                  <Badge variant="new" shape="square" className="bg-white/15 text-white border-white/25">
                    {tProfile("newChip")}
                  </Badge>
                )}
              </div>

              <h1 className="text-[28px] font-bold leading-[1.05] tracking-tight md:text-[36px] lg:text-[42px]">
                {course.title[lang]}
              </h1>
              <p className="max-w-2xl text-[14.5px] leading-relaxed text-white/85 text-pretty md:text-[15px]">
                {course.subtitle[lang]}
              </p>

              {/* Facts row */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {date.label[lang]}
                </span>
                <span aria-hidden className="text-white/40">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Languages className="h-3.5 w-3.5" aria-hidden />
                  {course.language[lang].join(" / ")}
                </span>
                <span aria-hidden className="text-white/40">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  <span className="tabular">
                    {date.spotsTaken}/{date.spotsTotal}
                  </span>
                </span>
              </div>
            </div>

            {/* Right — hero rail on desktop */}
            <aside className="hidden lg:block">
              <div className="rounded-[var(--radius-xl)] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
                  {t("starting")}
                </p>
                <p className="mt-1 text-[18px] font-semibold">{date.label[lang]}</p>
                <ul className="mt-4 grid gap-2 text-[12.5px] text-white/85">
                  <Row
                    icon={<Clock className="h-3.5 w-3.5" aria-hidden />}
                    label={t("duration")}
                    value={course.durationLabel[lang]}
                  />
                  <Row
                    icon={<Languages className="h-3.5 w-3.5" aria-hidden />}
                    label={t("language")}
                    value={course.language[lang].join(" / ")}
                  />
                  <Row
                    icon={<Users className="h-3.5 w-3.5" aria-hidden />}
                    label={t("capacityLabel")}
                    value={`${date.spotsTaken}/${date.spotsTotal}`}
                  />
                </ul>
                <div className="mt-3">
                  <Progress
                    value={pct}
                    tone={pct >= 85 ? "danger" : pct >= 60 ? "warning" : "success"}
                  />
                  <p className="mt-1 text-[11px] text-white/65 tabular">
                    {left > 0
                      ? `${left} ${tCourse("datesSpotsLeft", { left }).replace(/\d+\s*/, "")}`
                      : tCourse("datesSpotsFull")}
                  </p>
                </div>
                <Separator className="my-4 bg-white/20" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
                  {t("priceLabel")}
                </p>
                <p className="mt-0.5 text-[24px] font-bold tabular">
                  {formatPrice(course.priceDzd, locale)}
                </p>
                <div className="mt-2">
                  <ListingApprovalBadge mode={deriveApprovalMode(course.id)} size="sm" />
                </div>
                <CheckoutDialog
                  kind="event"
                  subjectTitle={course.title}
                  teacherSlug={course.teacher.slug}
                  teacherName={course.teacher.name}
                  priceDzd={course.priceDzd}
                  start={date.startISO}
                  scheduleLabel={date.label}
                  trigger={
                    <Button variant="accent" size="lg" className="mt-3" block disabled={soldOut}>
                      {t("reserveSpot")}
                      <Arrow className="h-4 w-4" aria-hidden />
                    </Button>
                  }
                />
                <div className="mt-3">
                  <ListingApprovalExplainer mode={deriveApprovalMode(course.id)} />
                </div>
                <p className="mt-3 flex items-start gap-1.5 text-[11px] text-white/65">
                  <ShieldCheck className="mt-0.5 h-3 w-3" aria-hidden />
                  {tCourse("secureNote")}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-background pb-24 lg:pb-16">
        <div className="container-narrow grid gap-8 py-8 lg:grid-cols-[1fr_320px] lg:gap-12 lg:py-12">
          <article className="grid gap-10 lg:gap-12">
            {/* Mobile-only starting/facts card — hero rail is desktop-only */}
            <section className="rounded-[var(--radius-lg)] border border-border bg-card p-4 lg:hidden">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("starting")}
              </p>
              <p className="mt-1 text-[16px] font-semibold text-foreground">{date.label[lang]}</p>
              <div className="mt-3 grid gap-1.5">
                <div className="flex items-center justify-between text-[11.5px] text-ink-2 tabular">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" aria-hidden />
                    {date.spotsTaken}/{date.spotsTotal}
                  </span>
                  <span className="text-ink-3">
                    {left > 0
                      ? `${left} ${tCourse("datesSpotsLeft", { left }).replace(/\d+\s*/, "")}`
                      : tCourse("datesSpotsFull")}
                  </span>
                </div>
                <Progress
                  value={pct}
                  tone={pct >= 85 ? "danger" : pct >= 60 ? "warning" : "success"}
                />
              </div>
              <div className="mt-3">
                <ListingApprovalBadge mode={deriveApprovalMode(course.id)} size="sm" />
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("speakers")}
              </p>
              <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback
                    className={cn("bg-gradient-to-br text-base text-white", course.teacher.accent)}
                  >
                    {course.teacher.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[14.5px] font-semibold text-foreground truncate">
                    {course.teacher.name[lang]}
                  </p>
                  <p className="text-[12px] text-ink-3 line-clamp-1">
                    {course.teacher.headline[lang]}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/teachers/${course.teacher.slug}` as never}>
                    {tCourse("viewTeacher")}
                  </Link>
                </Button>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("agendaTitle")}
              </p>
              <ol className="mt-4 grid gap-3">
                {course.syllabus.flatMap((sec, si) =>
                  sec.items.map((it, ii) => (
                    <li
                      key={`${si}-${ii}`}
                      className="grid grid-cols-[48px_1fr] gap-3 border-s-2 border-accent/40 ps-4"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                        {String(si * 10 + ii + 1).padStart(2, "0")}
                      </span>
                      <p className="flex items-start gap-2 text-[14px] text-ink-2">
                        <CircleDot className="mt-0.5 h-3 w-3 shrink-0 text-accent" aria-hidden />
                        {it[lang]}
                      </p>
                    </li>
                  )),
                )}
              </ol>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-info/30 bg-info/[0.06] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-info">
                {t("afterTitle")}
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{t("afterBody")}</p>
            </section>

            {/* Reviews — honest empty state per spec */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {tCourse("reviewsEyebrow")}
              </p>
              {!hasReviews && (
                <div className="mt-3 grid place-items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-8 text-center">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink-3">
                    <BookOpen className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="max-w-md text-[13px] leading-relaxed text-ink-2">
                    {tCourse("reviewsEmptyLong")}
                  </p>
                </div>
              )}
            </section>
          </article>

          {/* Sticky right rail — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {tCourse("includesEyebrow")}
              </p>
              <ul className="mt-4 grid gap-2.5 text-[13px] text-ink-2">
                {course.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CircleDot className="mt-0.5 h-3 w-3 shrink-0 text-accent" aria-hidden />
                    {inc[lang]}
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="grid gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                  {t("priceLabel")}
                </p>
                <p className="text-[22px] font-bold tabular text-foreground">
                  {formatPrice(course.priceDzd, locale)}
                </p>
              </div>
              <CheckoutDialog
                kind="event"
                subjectTitle={course.title}
                teacherSlug={course.teacher.slug}
                teacherName={course.teacher.name}
                priceDzd={course.priceDzd}
                start={date.startISO}
                scheduleLabel={date.label}
                trigger={
                  <Button variant="primary" size="md" className="mt-4" block disabled={soldOut}>
                    {t("reserveSpot")}
                    <Arrow className="h-4 w-4" aria-hidden />
                  </Button>
                }
              />
            </div>
          </aside>
        </div>
      </section>

      {/* Sticky bottom CTA — mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background pb-safe shadow-e3 lg:hidden">
        <div className="container-narrow flex h-16 items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("priceLabel")}
            </p>
            <p className="text-[15px] font-semibold tabular text-foreground">
              {formatPrice(course.priceDzd, locale)}
            </p>
          </div>
          <CheckoutDialog
            kind="event"
            subjectTitle={course.title}
            teacherSlug={course.teacher.slug}
            teacherName={course.teacher.name}
            priceDzd={course.priceDzd}
            start={date.startISO}
            scheduleLabel={date.label}
            trigger={
              <Button variant="accent" size="lg" className="ms-auto" disabled={soldOut}>
                {t("reserveSpot")}
                <Arrow className="h-4 w-4" aria-hidden />
              </Button>
            }
          />
        </div>
      </div>
    </>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between border-b border-white/10 pb-1.5 last:border-b-0 last:pb-0">
      <span className="inline-flex items-center gap-1.5 text-white/55">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </li>
  );
}
