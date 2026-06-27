"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  Star,
  Share2,
  CheckCircle2,
  Clock,
  Languages,
  CircleDot,
  ShieldCheck,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckoutDialog } from "@/components/booking/checkout-dialog";
import { reviewsForTeacher } from "@/lib/mock/reviews";
import type { Course } from "@/lib/mock/courses";
import { useToast } from "@/lib/toast";
import { cn, formatPrice } from "@/lib/utils";

export function CourseDetail({ course }: { course: Course }) {
  const t = useTranslations("student.course");
  const tHome = useTranslations("home.teachers");
  const tBooking = useTranslations("booking");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const { show } = useToast();

  const handleAskQuestion = () => {
    show({
      title: tBooking("toasts.openingConversation.title"),
      description: tBooking("toasts.openingConversation.desc", {
        name: course.teacher.name[lang],
      }),
      variant: "default",
    });
    router.push(`/messages?to=${course.teacher.slug}` as never);
  };

  const [pickedDate, setPickedDate] = useState<string>(course.dates[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const current = course.dates.find((d) => d.id === pickedDate) ?? course.dates[0]!;
  const capacityPct = Math.round((current.spotsTaken / current.spotsTotal) * 100);
  const spotsLeft = current.spotsTotal - current.spotsTaken;
  const full = spotsLeft <= 0;

  const reviews = reviewsForTeacher(course.teacher.id).slice(0, 3);

  function share() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <>
      {/* HERO — editorial header strip with gradient */}
      <section
        className={cn(
          "relative isolate overflow-hidden bg-gradient-to-br text-white",
          course.accent,
        )}
      >
        <div aria-hidden className="absolute inset-0 bg-grid-sm opacity-[0.12]" />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-6 end-4 select-none text-[160px] font-black leading-none tracking-tighter text-white/[0.06] md:text-[240px]"
        >
          {course.subject[lang].slice(0, 3).toUpperCase()}
        </span>

        <div className="container-narrow grid gap-10 py-12 md:py-16 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div className="flex flex-col gap-5">
            <Link
              href="/browse"
              className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 transition-colors hover:text-white"
            >
              <Back className="h-3 w-3" />
              {t("backToBrowse")}
            </Link>

            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
              <span className="rounded-full bg-white/15 px-2 py-0.5">{t(`format.${course.format}` as never)}</span>
              <span aria-hidden>·</span>
              <span>{t(`level.${course.level}` as never)}</span>
              <span aria-hidden>·</span>
              <span>{course.durationLabel[lang]}</span>
            </div>

            <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight md:text-[48px]">
              <span className="block">{course.title[lang]}</span>
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-white/85 text-pretty">
              {course.subtitle[lang]}
            </p>

            <div className="mt-1 flex items-center gap-3 text-[13px] text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="font-semibold tabular">{course.rating.toFixed(2)}</span>
                <span>{t("ratingLabel", { rating: "", count: course.reviews })}</span>
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Languages className="h-3.5 w-3.5" />
                {course.language[lang].join(" / ")}
              </span>
            </div>

            {/* Teacher mini-card */}
            <div className="mt-3 inline-flex w-fit items-center gap-3 rounded-[var(--radius-lg)] bg-white/[0.08] p-2 backdrop-blur-sm">
              <Avatar className="h-10 w-10 ring-2 ring-white/15">
                <AvatarFallback className={cn("bg-gradient-to-br text-sm text-white", course.teacher.accent)}>
                  {course.teacher.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 pe-3">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {t("teacherCardEyebrow")}
                </p>
                <p className="text-[13.5px] font-semibold">{course.teacher.name[lang]}</p>
              </div>
              <Link
                href={`/teachers/${course.teacher.slug}` as never}
                className="me-1 inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-white/12 px-2 py-1 text-[11.5px] font-semibold text-white transition-colors hover:bg-white/20"
              >
                {t("viewTeacher")}
                <Arrow className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Hero side panel — quick CTA */}
          <aside className="rounded-[var(--radius-2xl)] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
              {t("totalLabel")}
            </p>
            <p className="mt-1 text-[40px] font-bold tabular">{formatPrice(course.priceDzd, locale)}</p>
            <p className="mt-1 text-[11.5px] text-white/65">{course.durationLabel[lang]}</p>
            <Separator className="my-4 bg-white/20" />
            <div className="grid gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">
                {t("datesPick")}
              </p>
              <Select value={pickedDate} onValueChange={setPickedDate}>
                <SelectTrigger className="h-11 bg-white/12 text-white">
                  <SelectValue placeholder={t("datesPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {course.dates.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.label[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid gap-1.5 rounded-[var(--radius-md)] bg-white/8 p-3">
                <div className="flex items-center justify-between text-[11px] text-white/80 tabular">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {t("datesCapacity", { taken: current.spotsTaken, total: current.spotsTotal })}
                  </span>
                  <span>
                    {full ? t("datesSpotsFull") : t("datesSpotsLeft", { left: spotsLeft })}
                  </span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-white/20">
                  <span
                    className={cn(
                      "absolute inset-y-0 start-0 rounded-full",
                      capacityPct >= 85 ? "bg-danger" : capacityPct >= 60 ? "bg-warning" : "bg-success",
                    )}
                    style={{ width: `${capacityPct}%` }}
                    aria-hidden
                  />
                </div>
              </div>

              <CheckoutDialog
                kind="course"
                subjectTitle={course.title}
                teacherSlug={course.teacher.slug}
                teacherName={course.teacher.name}
                priceDzd={course.priceDzd}
                start={current.startISO}
                scheduleLabel={current.label}
                trigger={
                  <Button variant="accent" size="lg" className="mt-1" disabled={full}>
                    {full ? t("reserveFull") : t("reserve")}
                    <Arrow className="h-4 w-4" />
                  </Button>
                }
              />
              <p className="flex items-start gap-1.5 text-[11px] text-white/65">
                <ShieldCheck className="mt-0.5 h-3 w-3" />
                {t("secureNote")}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-background">
        <div className="container-narrow grid gap-10 py-12 lg:grid-cols-[1fr_320px] lg:gap-12">
          <div className="grid gap-12">
            {/* Outcomes — marker rules, no generic check icons */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("outcomesEyebrow")}
              </p>
              <h2 className="mt-2 text-[26px] font-semibold tracking-tight text-foreground md:text-[30px]">
                {course.title[lang]}
              </h2>
              <ol className="mt-6 grid gap-4 md:grid-cols-2">
                {course.outcomes.map((o, i) => (
                  <li key={i} className="grid grid-cols-[44px_1fr] gap-3 border-s-2 border-accent/40 ps-4">
                    <span className="text-[24px] font-light italic text-accent/60 tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14.5px] leading-relaxed text-ink-2">{o[lang]}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Syllabus */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("syllabusEyebrow")}
              </p>
              <div className="mt-4 rounded-[var(--radius-lg)] border border-border bg-card">
                <Accordion type="multiple" defaultValue={["sec-0"]}>
                  {course.syllabus.map((sec, i) => (
                    <AccordionItem key={i} value={`sec-${i}`} className="border-b border-border px-5 last:border-b-0">
                      <AccordionTrigger>
                        <span className="flex items-center gap-3">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{sec.title[lang]}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="grid gap-2.5 ps-9">
                          {sec.items.map((it, k) => (
                            <li
                              key={k}
                              className="flex items-start gap-2 text-[13.5px] text-ink-2"
                            >
                              <CircleDot className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                              {it[lang]}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* Dates timeline */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("datesEyebrow")}
              </p>
              <ol className="mt-4 grid gap-3">
                {course.dates.map((d, i) => {
                  const pct = Math.round((d.spotsTaken / d.spotsTotal) * 100);
                  const left = d.spotsTotal - d.spotsTaken;
                  const dFull = left <= 0;
                  return (
                    <li
                      key={d.id}
                      className={cn(
                        "grid items-center gap-3 rounded-[var(--radius-lg)] border bg-card p-4 transition-colors md:grid-cols-[80px_1fr_220px_140px]",
                        d.id === pickedDate
                          ? "border-accent shadow-e1"
                          : "border-border hover:border-border-strong",
                      )}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-2 text-[14px] text-foreground">
                        <Calendar className="h-4 w-4 text-accent" />
                        {d.label[lang]}
                      </div>
                      <div className="grid gap-1">
                        <Progress value={pct} tone={pct >= 85 ? "danger" : pct >= 60 ? "warning" : "success"} />
                        <p className="flex items-center justify-between text-[11px] text-ink-3 tabular">
                          <span>{t("datesCapacity", { taken: d.spotsTaken, total: d.spotsTotal })}</span>
                          <span>{dFull ? t("datesSpotsFull") : t("datesSpotsLeft", { left })}</span>
                        </p>
                      </div>
                      {d.id === pickedDate ? (
                        <CheckoutDialog
                          kind="course"
                          subjectTitle={course.title}
                          teacherSlug={course.teacher.slug}
                          teacherName={course.teacher.name}
                          priceDzd={course.priceDzd}
                          start={d.startISO}
                          scheduleLabel={d.label}
                          trigger={
                            <Button
                              type="button"
                              variant="primary"
                              size="md"
                              disabled={dFull}
                            >
                              {t("reserve")}
                            </Button>
                          }
                        />
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={() => setPickedDate(d.id)}
                        >
                          {t("datesPick")}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Reviews */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t("reviewsEyebrow")}
              </p>
              {reviews.length === 0 ? (
                <p className="mt-3 text-[14px] text-ink-3">{t("reviewsEmpty")}</p>
              ) : (
                <ol className="mt-5 grid gap-3">
                  {reviews.map((r, i) => (
                    <li
                      key={r.id}
                      className="grid grid-cols-[44px_1fr] gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5"
                    >
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className={cn("bg-gradient-to-br text-sm text-white", r.studentAccent)}>
                          {r.studentInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="flex items-baseline gap-2">
                            <p className="text-[14.5px] font-semibold text-foreground">{r.studentName[lang]}</p>
                            <span className="text-[11px] uppercase tracking-[0.18em] text-ink-3 tabular">
                              № {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-ink-3 tabular">{r.date[lang]}</p>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-warning">
                          {Array.from({ length: r.rating }).map((_, k) => (
                            <Star key={k} className="h-3.5 w-3.5 fill-warning" />
                          ))}
                        </div>
                        <p className="mt-2 text-[14px] leading-relaxed text-ink-2 text-pretty">
                          {r.body[lang]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>

          {/* Sticky right rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 grid gap-4">
              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-e1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                  {t("includesEyebrow")}
                </p>
                <ul className="mt-4 grid gap-2.5">
                  {course.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-ink-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      {inc[lang]}
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                    {t("languageLabel")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {course.language[lang].map((l) => (
                      <Badge key={l} variant="primary">{l}</Badge>
                    ))}
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={share}>
                    <Share2 className="h-4 w-4" />
                    {copied ? t("shareCopied") : t("shareCopy")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAskQuestion}
                  >
                    {t("askQuestion")}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2 rounded-[var(--radius-lg)] border border-border bg-card p-4">
                <p className="flex items-center gap-1.5 text-[11px] text-ink-3">
                  <Clock className="h-3 w-3" />
                  {course.teacher.responseHours}h · {course.teacher.city[lang]}
                </p>
                <Link
                  href={`/teachers/${course.teacher.slug}` as never}
                  className="flex items-center gap-2.5"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn("bg-gradient-to-br text-sm text-white", course.teacher.accent)}>
                      {course.teacher.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13.5px] font-semibold text-foreground">{course.teacher.name[lang]}</p>
                    <p className="text-[11.5px] text-ink-3">{tHome("reviews", { count: course.teacher.reviews })}</p>
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
