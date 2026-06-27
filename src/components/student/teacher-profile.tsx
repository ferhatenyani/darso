"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Star,
  ShieldCheck,
  Wifi,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Languages,
  Clock,
  Share2,
  Flag,
  BookOpen,
  CheckCheck,
  Calendar,
  Heart,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CourseCard } from "@/components/student/course-card";
import { CheckoutDialog } from "@/components/booking/checkout-dialog";
import { ensureThread } from "@/lib/mock/chats";
import { coursesForTeacher } from "@/lib/mock/courses";
import { reviewsForTeacher } from "@/lib/mock/reviews";
import type { Teacher } from "@/lib/mock/teachers";
import { useCurrentUser } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { cn, formatPrice } from "@/lib/utils";

export function TeacherProfile({ teacher }: { teacher: Teacher }) {
  const t = useTranslations("student.teacherProfile");
  const tHome = useTranslations("home.teachers");
  const tBrowse = useTranslations("student.browse");
  const tBooking = useTranslations("booking");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const router = useRouter();
  const { show } = useToast();
  const { user } = useCurrentUser();
  const [, startMessageTransition] = useTransition();

  const teacherCourses = coursesForTeacher(teacher.id);
  const teacherReviews = reviewsForTeacher(teacher.id);
  const [favored, setFavored] = useState(false);

  // Picked slot drives a controlled CheckoutDialog so the grid can pre-fill
  // start/end. null when no slot selected; dialog is closed in that case.
  const [pickedSlot, setPickedSlot] = useState<
    | {
        start: string;
        end: string;
        label: { fr: string; ar: string };
      }
    | null
  >(null);

  // Default course used by "Apply to course" CTA. Picks the cheapest non-1to1
  // course as a sensible suggestion; falls back to the first course when none
  // match. If the teacher has no courses, the Apply CTA is hidden.
  const applyCourse =
    teacherCourses.find((c) => c.format !== "1to1") ?? teacherCourses[0] ?? null;

  const handleMessage = () => {
    // Anon-gate mirrors the CheckoutDialog pattern (Batch 4): toast + bounce
    // through sign-in with `?next=` so the student lands back here after.
    if (!user) {
      show({
        title: tBooking("toasts.signInRequired.title"),
        description: tBooking("toasts.signInRequired.desc"),
        variant: "warning",
      });
      const path = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/sign-in?next=${encodeURIComponent(path)}` as never);
      return;
    }
    startMessageTransition(() => {
      const threadId = ensureThread(teacher.slug, user.id);
      if (!threadId) {
        // Defensive — featuredTeachers always carries a slug, but if a
        // future surface passes an unknown slug we still want to land
        // the student somewhere useful instead of /messages/.
        router.push("/messages" as never);
        return;
      }
      show({
        title: tBooking("toasts.openingConversation.title"),
        description: tBooking("toasts.openingConversation.desc", {
          name: teacher.name[lang],
        }),
        variant: "default",
      });
      router.push(`/messages/${threadId}` as never);
    });
  };

  return (
    <>
      {/* HERO — editorial, large avatar + sliced background mark */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-sm opacity-50 [mask-image:radial-gradient(70%_60%_at_30%_0%,black,transparent_85%)]" />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-6 end-4 -z-10 select-none text-[160px] font-black leading-none tracking-tighter text-foreground/[0.04] md:text-[220px]"
        >
          {teacher.initials}
        </span>

        <div className="container-narrow grid gap-10 py-12 md:py-16 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Left: identity */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              <Link href="/teachers" className="hover:text-foreground">
                {t("tabAbout")}
              </Link>
              <span className="ink-rule h-[2px]" aria-hidden />
              <span>{teacher.subject[lang]}</span>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Avatar className="h-28 w-28 shadow-e2 sm:h-32 sm:w-32">
                <AvatarFallback className={cn("bg-gradient-to-br text-3xl text-white", teacher.accent)}>
                  {teacher.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[36px] font-bold leading-[1.02] tracking-tight text-foreground md:text-[44px]">
                    {teacher.name[lang]}
                  </h1>
                  {teacher.idVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10.5px] font-semibold text-success">
                      <ShieldCheck className="h-3 w-3" />
                      {t("verifiedId")}
                    </span>
                  )}
                  {teacher.topRated && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10.5px] font-semibold text-[#7a5610]">
                      <Sparkles className="h-3 w-3" />
                      {t("topRated")}
                    </span>
                  )}
                </div>
                <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-2 text-pretty">
                  {teacher.headline[lang]}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-semibold text-foreground tabular">{teacher.rating.toFixed(2)}</span>
                    <span className="text-ink-3">·</span>
                    <span>{tHome("reviews", { count: teacher.reviews })}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-ink-3" />
                    {teacher.city[lang]}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Languages className="h-4 w-4 text-ink-3" />
                    {t("speaks")}: {teacher.speaks[lang].join(" · ")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {teacher.mode === "online" ? (
                      <Wifi className="h-4 w-4 text-ink-3" />
                    ) : teacher.mode === "in-person" ? (
                      <MapPin className="h-4 w-4 text-ink-3" />
                    ) : (
                      <>
                        <Wifi className="h-4 w-4 text-ink-3" />
                        <MapPin className="h-4 w-4 text-ink-3" />
                      </>
                    )}
                    {teacher.mode === "online"
                      ? tBrowse("filterModeOnline")
                      : teacher.mode === "in-person"
                        ? tBrowse("filterModeInPerson")
                        : tBrowse("filterModeBoth")}
                  </span>
                </div>
              </div>
            </div>

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-2">
              <CheckoutDialog
                kind="1to1"
                subjectTitle={teacher.subject}
                teacherSlug={teacher.slug}
                teacherName={teacher.name}
                priceDzd={teacher.hourlyRate}
                trigger={
                  <Button variant="primary" size="lg">
                    <Calendar className="h-4 w-4" />
                    {t("stickyBook1to1")}
                    <Arrow className="h-4 w-4" />
                  </Button>
                }
              />
              <Button variant="outline" size="lg" onClick={handleMessage}>
                {t("stickyMessage")}
              </Button>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFavored((v) => !v)}
                      aria-label={t("stickyMessage")}
                      aria-pressed={favored}
                    >
                      <Heart className={cn("h-4 w-4", favored && "fill-danger text-danger")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{favored ? t("verifiedContact") : t("verifiedId")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label={t("shareLabel")}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("shareLabel")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="ms-auto inline-flex items-center gap-1.5 text-[11.5px] text-ink-3">
                <Clock className="h-3.5 w-3.5" />
                {t("lastActive", { min: 4 })}
              </span>
            </div>
          </div>

          {/* Right: numeric strip */}
          <aside className="rounded-[var(--radius-2xl)] border border-border-strong bg-card p-2 shadow-e1">
            <div className="border-b border-border bg-surface/40 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                {t("stickyStatsTitle")}
              </p>
            </div>
            <ul className="grid grid-cols-2 divide-x divide-y divide-border bg-background">
              <NumLi label={t("lessonsGiven", { count: teacher.lessons }).split(" ")[0]!} value={teacher.lessons.toLocaleString(locale === "ar" ? "ar-DZ" : "fr-DZ")} subtle={tHome("lessons", { count: teacher.lessons })} />
              <NumLi label={t("responseTime", { hours: teacher.responseHours }).split(" ")[0]!} value={`${teacher.responseHours}h`} subtle={t("responseTime", { hours: teacher.responseHours })} />
              <NumLi label={t("completion")} value="98%" subtle={t("verifiedContact")} />
              <NumLi label={t("stickyStartFrom")} value={formatPrice(teacher.hourlyRate, locale)} subtle={`${teacher.responseHours}h ${t("stickyPerHour")}`} highlight />
            </ul>
            <div className="grid gap-2 p-3">
              <CheckoutDialog
                kind="1to1"
                subjectTitle={teacher.subject}
                teacherSlug={teacher.slug}
                teacherName={teacher.name}
                priceDzd={teacher.hourlyRate}
                trigger={
                  <Button variant="primary" size="md">
                    {t("stickyBook1to1")}
                    <Arrow className="h-4 w-4" />
                  </Button>
                }
              />
              {applyCourse ? (
                <CheckoutDialog
                  kind="course"
                  subjectTitle={applyCourse.title}
                  teacherSlug={teacher.slug}
                  teacherName={teacher.name}
                  priceDzd={applyCourse.priceDzd}
                  scheduleLabel={applyCourse.dates[0]?.label}
                  trigger={
                    <Button variant="outline" size="md">
                      {t("stickyApplyCourse")}
                    </Button>
                  }
                />
              ) : (
                <Button variant="outline" size="md" disabled>
                  {t("stickyApplyCourse")}
                </Button>
              )}
            </div>
            <p className="flex items-start gap-1.5 border-t border-border bg-surface/40 px-4 py-3 text-[11px] text-ink-3">
              <ShieldCheck className="mt-0.5 h-3 w-3 text-success" />
              {t("stickyTrust")}
            </p>
          </aside>
        </div>
      </section>

      {/* CONTENT — tabs + sticky right rail on desktop */}
      <section className="bg-background">
        <div className="container-narrow grid gap-8 py-10 lg:grid-cols-[1fr_320px] lg:gap-12">
          <div>
            <Tabs defaultValue="about">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">{t("tabAbout")}</TabsTrigger>
                <TabsTrigger value="courses">{t("tabCourses", { count: teacherCourses.length })}</TabsTrigger>
                <TabsTrigger value="reviews">{t("tabReviews", { count: teacherReviews.length })}</TabsTrigger>
                <TabsTrigger value="availability">{t("tabAvailability")}</TabsTrigger>
              </TabsList>

              {/* About */}
              <TabsContent value="about" className="mt-6">
                <article className="grid gap-8 lg:grid-cols-2">
                  <section>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                      {t("aboutWhyMe")}
                    </p>
                    <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-foreground">
                      {teacher.headline[lang]}
                    </h2>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{t("aboutWhyMeBody")}</p>
                  </section>
                  <section>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                      {t("aboutEducation")}
                    </p>
                    <ol className="mt-3 grid gap-2.5">
                      {(t.raw("aboutEducationItems") as string[]).map((it, i) => (
                        <li key={i} className="grid grid-cols-[28px_1fr] items-start gap-3 border-s-2 border-border ps-3">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[14px] text-ink-2">{it}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="lg:col-span-2 rounded-[var(--radius-lg)] border border-border bg-card p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                      {t("aboutToolkit")}
                    </p>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{t("aboutToolkitBody")}</p>
                  </section>
                </article>
              </TabsContent>

              {/* Courses */}
              <TabsContent value="courses" className="mt-6">
                {teacherCourses.length === 0 ? (
                  <EmptyBlock label={t("coursesEmpty")} />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {teacherCourses.map((c, i) => (
                      <CourseCard key={c.id} course={c} index={i} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="mt-6">
                {teacherReviews.length === 0 ? (
                  <EmptyBlock label={t("reviewsEmpty")} />
                ) : (
                  <ol className="grid gap-3">
                    {teacherReviews.map((r, i) => (
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
                          <p className="mt-3 text-[14px] leading-relaxed text-ink-2 text-pretty">
                            {r.body[lang]}
                          </p>
                          {r.subjectTag && (
                            <div className="mt-3 inline-flex">
                              <Badge variant="primary">{r.subjectTag[lang]}</Badge>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </TabsContent>

              {/* Availability */}
              <TabsContent value="availability" className="mt-6">
                <p className="text-[14px] text-ink-2">{t("availabilityBody")}</p>
                <AvailabilityGrid onPick={setPickedSlot} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky rail (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 grid gap-4">
              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-e1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                  {t("stickyEyebrow")}
                </p>
                <p className="mt-2 text-[12.5px] text-ink-2">{t("stickyTrust")}</p>
                <Separator className="my-4" />
                <div className="grid gap-2">
                  <CheckoutDialog
                    kind="1to1"
                    subjectTitle={teacher.subject}
                    teacherSlug={teacher.slug}
                    teacherName={teacher.name}
                    priceDzd={teacher.hourlyRate}
                    trigger={
                      <Button variant="primary" size="md">
                        {t("stickyBook1to1")}
                        <Arrow className="h-4 w-4" />
                      </Button>
                    }
                  />
                  {applyCourse ? (
                    <CheckoutDialog
                      kind="course"
                      subjectTitle={applyCourse.title}
                      teacherSlug={teacher.slug}
                      teacherName={teacher.name}
                      priceDzd={applyCourse.priceDzd}
                      scheduleLabel={applyCourse.dates[0]?.label}
                      trigger={
                        <Button variant="outline" size="md">
                          {t("stickyApplyCourse")}
                        </Button>
                      }
                    />
                  ) : (
                    <Button variant="outline" size="md" disabled>
                      {t("stickyApplyCourse")}
                    </Button>
                  )}
                  <Button variant="ghost" size="md" onClick={handleMessage}>
                    {t("stickyMessage")}
                  </Button>
                </div>
                <Separator className="my-4" />
                <ul className="grid gap-2 text-[12.5px] text-ink-2">
                  <li className="flex items-center justify-between">
                    <span className="text-ink-3">{t("stickyStartFrom")}</span>
                    <span className="font-semibold tabular text-foreground">
                      {formatPrice(teacher.hourlyRate, locale)}
                      <span className="ms-0.5 text-[11px] text-ink-3">{t("stickyPerHour")}</span>
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-ink-3">{t("responseTime", { hours: teacher.responseHours })}</span>
                    <span className="font-semibold tabular text-foreground">{teacher.responseHours}h</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-ink-3">{t("completion")}</span>
                    <span className="font-semibold tabular text-foreground">98%</span>
                  </li>
                </ul>
              </div>

              <p className="px-2 text-[11px] text-ink-3">
                {t("publishedLabel", { label: t("publishedLabelValue") })}
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded px-2 text-[12px] text-ink-3 transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Flag className="h-3.5 w-3.5" aria-hidden />
                {t("reportLabel")}
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* Slot-prefilled checkout — controlled by AvailabilityGrid clicks. */}
      <CheckoutDialog
        kind="1to1"
        subjectTitle={teacher.subject}
        teacherSlug={teacher.slug}
        teacherName={teacher.name}
        priceDzd={teacher.hourlyRate}
        start={pickedSlot?.start}
        end={pickedSlot?.end}
        scheduleLabel={pickedSlot?.label}
        open={pickedSlot !== null}
        onOpenChange={(next) => {
          if (!next) setPickedSlot(null);
        }}
      />
    </>
  );
}

function NumLi({
  label,
  value,
  subtle,
  highlight = false,
}: {
  label: string;
  value: string;
  subtle: string;
  highlight?: boolean;
}) {
  return (
    <li
      className={cn(
        "px-4 py-4",
        highlight && "bg-accent-soft/40",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">{label}</p>
      <p className={cn("mt-0.5 text-[20px] font-bold tabular", highlight ? "text-accent" : "text-foreground")}>
        {value}
      </p>
      <p className="mt-0.5 text-[10.5px] text-ink-3 line-clamp-1">{subtle}</p>
    </li>
  );
}

function AvailabilityGrid({
  onPick,
}: {
  onPick: (slot: { start: string; end: string; label: { fr: string; ar: string } }) => void;
}) {
  const t = useTranslations("student.teacherProfile");
  const tBooking = useTranslations("booking");
  const { user } = useCurrentUser();
  const router = useRouter();
  const { show } = useToast();
  // mock availability — 7 days × 8 hour slots
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const hours = ["09", "11", "13", "15", "17", "18", "19", "20"];

  // pseudo-random booked map
  const isBooked = (di: number, hi: number) => (di * 31 + hi * 7) % 5 < 2;

  // Compute ISO start/end for a (dayIndex, hour) cell anchored to the current
  // week's Monday. Cheap demo math — doesn't claim TZ accuracy.
  const buildSlot = (di: number, hourStr: string) => {
    const hour = parseInt(hourStr, 10);
    const now = new Date();
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + di);
    const start = new Date(monday);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1, 0, 0, 0);
    return { start: start.toISOString(), end: end.toISOString() };
  };

  const dayLabels = {
    mon: { fr: "Lundi", ar: "الإثنين" },
    tue: { fr: "Mardi", ar: "الثلاثاء" },
    wed: { fr: "Mercredi", ar: "الأربعاء" },
    thu: { fr: "Jeudi", ar: "الخميس" },
    fri: { fr: "Vendredi", ar: "الجمعة" },
    sat: { fr: "Samedi", ar: "السبت" },
    sun: { fr: "Dimanche", ar: "الأحد" },
  } as const;

  const handlePick = (di: number, h: string) => {
    if (!user) {
      show({
        title: tBooking("toasts.signInRequired.title"),
        description: tBooking("toasts.signInRequired.desc"),
        variant: "warning",
      });
      const path = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/sign-in?next=${encodeURIComponent(path)}` as never);
      return;
    }
    const d = days[di]!;
    const { start, end } = buildSlot(di, h);
    onPick({
      start,
      end,
      label: {
        fr: `${dayLabels[d].fr} · ${h}:00 — ${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:00`,
        ar: `${dayLabels[d].ar} · ${h}:00 — ${(parseInt(h, 10) + 1).toString().padStart(2, "0")}:00`,
      },
    });
  };

  return (
    <div className="mt-5 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
      <ScrollArea className="w-full">
        <div className="grid min-w-[640px] grid-cols-[80px_repeat(7,minmax(70px,1fr))]">
          <div className="border-b border-border bg-surface/40 px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            {t("availabilityEyebrow").split(" ").slice(0, 2).join(" ")}
          </div>
          {days.map((d) => (
            <div
              key={d}
              className="border-b border-s border-border bg-surface/40 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3"
            >
              {t(`days.${d}` as never)}
            </div>
          ))}
          {hours.map((h, hi) => (
            <div key={h} className="contents">
              <div className="border-b border-border px-3 py-2 text-[11.5px] tabular text-ink-3">{h}:00</div>
              {days.map((d, di) => {
                const booked = isBooked(di, hi);
                return (
                  <button
                    key={d + h}
                    type="button"
                    disabled={booked}
                    onClick={booked ? undefined : () => handlePick(di, h)}
                    className={cn(
                      "border-b border-s border-border px-2 py-2 text-[11px] transition-colors",
                      "focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                      booked
                        ? "cursor-not-allowed bg-surface/40 text-ink-3"
                        : "bg-card text-accent hover:bg-accent-soft/60 cursor-pointer",
                    )}
                    aria-label={booked ? t("availabilityBooked") : t("availabilityFree")}
                  >
                    {booked ? "—" : <CheckCheck className="mx-auto h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="grid place-items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-10 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink-3">
        <BookOpen className="h-4 w-4" />
      </span>
      <p className="text-[13px] text-ink-2">{label}</p>
    </div>
  );
}
