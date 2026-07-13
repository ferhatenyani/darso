"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Languages,
  Users,
  CircleDot,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CheckoutDialog } from "@/components/booking/checkout-dialog";
import {
  ListingApprovalBadge,
  ListingApprovalExplainer,
  deriveApprovalMode,
} from "@/components/student/listing-mode-badges";
import type { Course } from "@/lib/mock/courses";
import { cn, formatPrice } from "@/lib/utils";

export function EventDetail({ course }: { course: Course }) {
  const t = useTranslations("student.event");
  const tCourse = useTranslations("student.course");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;

  const date = course.dates[0]!;
  const left = date.spotsTotal - date.spotsTaken;
  const pct = Math.round((date.spotsTaken / date.spotsTotal) * 100);

  return (
    <>
      <section
        className={cn(
          "relative isolate overflow-hidden bg-gradient-to-br text-white",
          course.accent,
        )}
      >
        <div aria-hidden className="absolute inset-0 bg-grid-sm opacity-[0.12]" />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 end-4 select-none text-[160px] font-black leading-none tracking-tighter text-white/[0.06] md:text-[220px]"
        >
          {course.subject[lang].slice(0, 3).toUpperCase()}
        </span>
        <div className="container-narrow grid gap-10 py-12 md:py-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Link
              href="/live"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 hover:text-white"
            >
              <Back className="h-3 w-3" />
              {t("backToBrowse")}
            </Link>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
              {tCourse(`format.${course.format}` as never)}
            </p>
            <h1 className="mt-2 text-[36px] font-bold leading-[1.02] tracking-tight md:text-[46px]">
              {course.title[lang]}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/85 text-pretty">
              {course.subtitle[lang]}
            </p>
          </div>

          <aside className="rounded-[var(--radius-2xl)] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
              {t("starting")}
            </p>
            <p className="mt-1 text-[20px] font-semibold">{date.label[lang]}</p>
            <ul className="mt-4 grid gap-2 text-[12.5px] text-white/85">
              <Row icon={<Clock className="h-3.5 w-3.5" />} label={t("duration")} value={course.durationLabel[lang]} />
              <Row icon={<Languages className="h-3.5 w-3.5" />} label={t("language")} value={course.language[lang].join(" / ")} />
              <Row
                icon={<Users className="h-3.5 w-3.5" />}
                label={t("capacityLabel")}
                value={`${date.spotsTaken}/${date.spotsTotal}`}
              />
            </ul>
            <div className="mt-3">
              <Progress value={pct} tone={pct >= 85 ? "danger" : pct >= 60 ? "warning" : "success"} />
              <p className="mt-1 text-[11px] text-white/65 tabular">
                {left > 0 ? `${left} ${tCourse("datesSpotsLeft", { left }).replace(/\d+\s*/, "")}` : tCourse("datesSpotsFull")}
              </p>
            </div>
            <p className="mt-4 text-[18px] font-bold tabular">{formatPrice(course.priceDzd, locale)}</p>
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
                <Button variant="accent" size="lg" className="mt-3 w-full" disabled={left <= 0}>
                  {t("reserveSpot")}
                  <Arrow className="h-4 w-4" />
                </Button>
              }
            />
            <div className="mt-3">
              <ListingApprovalExplainer mode={deriveApprovalMode(course.id)} />
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-narrow grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
          <article className="grid gap-10">
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("speakers")}</p>
              <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={cn("bg-gradient-to-br text-base text-white", course.teacher.accent)}>
                    {course.teacher.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-[14.5px] font-semibold text-foreground">{course.teacher.name[lang]}</p>
                  <p className="text-[12px] text-ink-3">{course.teacher.headline[lang]}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/teachers/${course.teacher.slug}` as never}>{tCourse("viewTeacher")}</Link>
                </Button>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("agendaTitle")}</p>
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
                        <CircleDot className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                        {it[lang]}
                      </p>
                    </li>
                  )),
                )}
              </ol>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-info/30 bg-info/[0.06] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-info">{t("afterTitle")}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{t("afterBody")}</p>
            </section>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-e1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {tCourse("includesEyebrow")}
              </p>
              <ul className="mt-4 grid gap-2.5 text-[13px] text-ink-2">
                {course.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CircleDot className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                    {inc[lang]}
                  </li>
                ))}
              </ul>
              <CheckoutDialog
                kind="event"
                subjectTitle={course.title}
                teacherSlug={course.teacher.slug}
                teacherName={course.teacher.name}
                priceDzd={course.priceDzd}
                start={date.startISO}
                scheduleLabel={date.label}
                trigger={
                  <Button variant="primary" size="md" className="mt-5 w-full" disabled={left <= 0}>
                    {t("reserveSpot")}
                    <Arrow className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
