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
  MessageCircle,
  ChevronLeft,
  ChevronRight,
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
import {
  ResponseSignalBadge,
  deriveResponseSignals,
} from "@/components/student/response-signals";
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
  const Back = locale === "ar" ? ChevronRight : ChevronLeft;
  const router = useRouter();
  const { show } = useToast();
  const { user } = useCurrentUser();
  const [, startMessageTransition] = useTransition();

  const teacherCourses = coursesForTeacher(teacher.id);
  const teacherReviews = reviewsForTeacher(teacher.id);
  const hasReviews = teacher.reviews > 0 && teacherReviews.length > 0;
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
      {/* Mobile back row — sticky under nav to preserve orientation. */}
      <div className="border-b border-border bg-background lg:hidden">
        <div className="container-narrow flex h-11 items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus rounded-[var(--radius-xs)] -mx-1 px-1"
            aria-label={t("backLabel")}
          >
            <Back className="h-4 w-4" aria-hidden />
            {t("backLabel")}
          </button>
        </div>
      </div>

      {/* HERO — mobile-first identity block. Sits above tabs. */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-grid-sm opacity-40 [mask-image:radial-gradient(70%_60%_at_30%_0%,black,transparent_85%)]"
        />

        <div className="container-narrow grid gap-8 py-8 md:py-12 lg:grid-cols-[1fr_320px] lg:gap-10 lg:py-14">
          {/* Left column — identity */}
          <div className="flex flex-col gap-5">
            {/* Breadcrumb — desktop-only, mobile has the back row above */}
            <nav
              aria-label="Breadcrumb"
              className="hidden lg:flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3"
            >
              <Link href="/browse" className="transition-colors hover:text-foreground">
                {tBrowse("pageEyebrow")}
              </Link>
              <span aria-hidden>›</span>
              <span className="text-ink-2">{teacher.subject[lang]}</span>
              <span aria-hidden>›</span>
              <span className="text-foreground">{teacher.name[lang]}</span>
            </nav>

            {/* Identity — stacked on mobile, side-by-side on sm+ */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <Avatar className="h-20 w-20 shadow-e2 sm:h-24 sm:w-24 md:h-28 md:w-28">
                <AvatarFallback
                  className={cn("bg-gradient-to-br text-2xl text-white md:text-3xl", teacher.accent)}
                >
                  {teacher.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  <h1 className="text-[26px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[30px] md:text-[36px]">
                    {teacher.name[lang]}
                  </h1>
                  {teacher.idVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10.5px] font-semibold text-success">
                      <ShieldCheck className="h-3 w-3" aria-hidden />
                      {t("verifiedId")}
                    </span>
                  )}
                  {teacher.topRated && hasReviews && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10.5px] font-semibold text-[#7a5610]">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      {t("topRated")}
                    </span>
                  )}
                  {!hasReviews && (
                    <Badge variant="new" shape="square">
                      {t("newChip")}
                    </Badge>
                  )}
                </div>

                <p className="mt-2 text-[15px] leading-relaxed text-ink-2 text-pretty md:mt-3 md:text-[16px]">
                  {teacher.headline[lang]}
                </p>

                {/* Chip row — subject · city · languages · mode. Scrolls horizontally on xs. */}
                <div className="mt-4 -mx-4 overflow-x-auto scroll-none px-4 sm:mx-0 sm:overflow-visible sm:px-0">
                  <ul className="flex w-max flex-nowrap items-center gap-1.5 text-[12.5px] text-ink-2 sm:w-auto sm:flex-wrap">
                    <li>
                      <Chip icon={<BookOpen className="h-3.5 w-3.5" aria-hidden />}>
                        {teacher.subject[lang]}
                      </Chip>
                    </li>
                    <li>
                      <Chip icon={<MapPin className="h-3.5 w-3.5" aria-hidden />}>
                        {teacher.city[lang]}
                      </Chip>
                    </li>
                    <li>
                      <Chip icon={<Languages className="h-3.5 w-3.5" aria-hidden />}>
                        {teacher.speaks[lang].join(" · ")}
                      </Chip>
                    </li>
                    <li>
                      <Chip
                        icon={
                          teacher.mode === "online" ? (
                            <Wifi className="h-3.5 w-3.5" aria-hidden />
                          ) : teacher.mode === "in-person" ? (
                            <MapPin className="h-3.5 w-3.5" aria-hidden />
                          ) : (
                            <Wifi className="h-3.5 w-3.5" aria-hidden />
                          )
                        }
                      >
                        {teacher.mode === "online"
                          ? tBrowse("filterModeOnline")
                          : teacher.mode === "in-person"
                            ? tBrowse("filterModeInPerson")
                            : tBrowse("filterModeBoth")}
                      </Chip>
                    </li>
                    {hasReviews && (
                      <li>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-foreground">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden />
                          <span className="tabular">{teacher.rating.toFixed(2)}</span>
                          <span className="text-ink-3">·</span>
                          <span className="text-ink-3 tabular">
                            {tHome("reviews", { count: teacher.reviews })}
                          </span>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Desktop action row — hidden on mobile since sticky bottom bar handles CTAs. */}
            <div className="hidden lg:flex flex-wrap items-center gap-2">
              <CheckoutDialog
                kind="1to1"
                subjectTitle={teacher.subject}
                teacherSlug={teacher.slug}
                teacherName={teacher.name}
                priceDzd={teacher.hourlyRate}
                trigger={
                  <Button variant="primary" size="lg">
                    <Calendar className="h-4 w-4" aria-hidden />
                    {t("stickyBook1to1")}
                    <Arrow className="h-4 w-4" aria-hidden />
                  </Button>
                }
              />
              <Button variant="outline" size="lg" onClick={handleMessage}>
                <MessageCircle className="h-4 w-4" aria-hidden />
                {t("stickyMessage")}
              </Button>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-lg"
                      onClick={() => setFavored((v) => !v)}
                      aria-label={favored ? t("verifiedContact") : t("verifiedId")}
                      aria-pressed={favored}
                    >
                      <Heart
                        className={cn("h-4 w-4", favored && "fill-danger text-danger")}
                        aria-hidden
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{favored ? t("verifiedContact") : t("verifiedId")}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon-lg" aria-label={t("shareLabel")}>
                      <Share2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("shareLabel")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="ms-auto inline-flex items-center gap-1.5 text-[11.5px] text-ink-3">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {t("lastActive", { min: 4 })}
              </span>
            </div>

            {/* Mobile secondary — small ghost row for Message / Fav / Share. Primary lives in sticky bar. */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button variant="outline" size="md" onClick={handleMessage} className="flex-1">
                <MessageCircle className="h-4 w-4" aria-hidden />
                {t("stickyMessage")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setFavored((v) => !v)}
                aria-label={favored ? t("verifiedContact") : t("verifiedId")}
                aria-pressed={favored}
              >
                <Heart
                  className={cn("h-4 w-4", favored && "fill-danger text-danger")}
                  aria-hidden
                />
              </Button>
              <Button type="button" variant="outline" size="icon" aria-label={t("shareLabel")}>
                <Share2 className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>

          {/* Right column — sticky rail (desktop only). Duplicated below in tabs section for content-adjacent stickiness. */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 grid gap-3">
              <RightRail
                teacher={teacher}
                applyCourse={applyCourse}
                onMessage={handleMessage}
                onScrollToAvailability={() => {
                  if (typeof document !== "undefined") {
                    document.getElementById("availability")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            </div>
          </aside>
        </div>
      </section>

      {/* CONTENT — Tabs. Tab bar sticks under the nav on mobile. */}
      <section className="bg-background pb-24 lg:pb-16">
        <div className="container-narrow py-8 lg:py-10">
          <Tabs defaultValue="about">
            {/* Sticky tab strip on mobile so the user always sees where they are */}
            <div className="sticky top-14 z-20 -mx-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 px-4 md:top-[68px] lg:static lg:mx-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
              <TabsList className="w-full justify-start overflow-x-auto scroll-none rounded-none border-0 bg-transparent p-0 lg:justify-start lg:rounded-[var(--radius-md)] lg:border lg:border-border lg:bg-surface lg:p-1">
                <TabTrigger value="about">{t("tabAbout")}</TabTrigger>
                <TabTrigger value="courses">
                  {t("tabCourses", { count: teacherCourses.length })}
                </TabTrigger>
                <TabTrigger value="availability">{t("tabAvailability")}</TabTrigger>
                <TabTrigger value="reviews">
                  {t("tabReviews", { count: teacherReviews.length })}
                </TabTrigger>
              </TabsList>
            </div>

            {/* About */}
            <TabsContent value="about" className="mt-6">
              <article className="grid gap-8 lg:grid-cols-2">
                <section>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                    {t("aboutWhyMe")}
                  </p>
                  <h2 className="mt-2 text-[20px] font-semibold tracking-tight text-foreground md:text-[22px]">
                    {teacher.headline[lang]}
                  </h2>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
                    {t("aboutWhyMeBody")}
                  </p>
                </section>
                <section>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                    {t("aboutEducation")}
                  </p>
                  <ol className="mt-3 grid gap-2.5">
                    {(t.raw("aboutEducationItems") as string[]).map((it, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[28px_1fr] items-start gap-3 border-s-2 border-border ps-3"
                      >
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
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
                    {t("aboutToolkitBody")}
                  </p>
                </section>

                {/* Trust strip — moved from hero for cleaner scan */}
                <section className="lg:col-span-2 flex items-center gap-2.5 rounded-[var(--radius-lg)] border border-border bg-surface/50 p-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-success/10 text-success">
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="text-[12.5px] leading-relaxed text-ink-2">{t("stickyTrust")}</p>
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

            {/* Availability */}
            <TabsContent value="availability" className="mt-6" id="availability">
              <p className="text-[14px] text-ink-2">{t("availabilityBody")}</p>
              <AvailabilityGrid onPick={setPickedSlot} />
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="mt-6">
              {!hasReviews ? (
                <EmptyBlock label={t("reviewsEmptyLong")} />
              ) : (
                <>
                  {/* Rating summary — only rendered when we have real reviews */}
                  <div className="mb-5 flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[28px] font-bold tabular text-foreground">
                        {teacher.rating.toFixed(2)}
                      </span>
                      <span className="text-[12px] text-ink-3 tabular">/ 5</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-0.5 text-warning">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star
                            key={k}
                            className={cn(
                              "h-3.5 w-3.5",
                              k < Math.round(teacher.rating)
                                ? "fill-warning"
                                : "text-border-strong",
                            )}
                            aria-hidden
                          />
                        ))}
                      </div>
                      <p className="text-[12px] text-ink-3 tabular">
                        {tHome("reviews", { count: teacher.reviews })}
                      </p>
                    </div>
                  </div>

                  <ol className="grid gap-3">
                    {teacherReviews.map((r, i) => (
                      <li
                        key={r.id}
                        className="grid grid-cols-[44px_1fr] gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5"
                      >
                        <Avatar className="h-11 w-11">
                          <AvatarFallback
                            className={cn("bg-gradient-to-br text-sm text-white", r.studentAccent)}
                          >
                            {r.studentInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <div className="flex items-baseline gap-2">
                              <p className="text-[14.5px] font-semibold text-foreground">
                                {r.studentName[lang]}
                              </p>
                              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-3 tabular">
                                № {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <p className="text-[11.5px] text-ink-3 tabular">{r.date[lang]}</p>
                          </div>
                          <div className="mt-1 flex items-center gap-0.5 text-warning">
                            {Array.from({ length: r.rating }).map((_, k) => (
                              <Star key={k} className="h-3.5 w-3.5 fill-warning" aria-hidden />
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
                </>
              )}
            </TabsContent>
          </Tabs>

          {/* Report / published — small footer strip. */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-[11.5px] text-ink-3">
            <span>{t("publishedLabel", { label: t("publishedLabelValue") })}</span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] px-1 -mx-1 transition-colors hover:text-danger focus-visible:outline-none focus-visible:shadow-focus"
            >
              <Flag className="h-3.5 w-3.5" aria-hidden />
              {t("reportLabel")}
            </button>
          </div>
        </div>
      </section>

      {/* Sticky bottom CTA — mobile only. Elevated shadow-e3, respects safe area. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background pb-safe shadow-e3 lg:hidden">
        <div className="container-narrow flex h-16 items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("stickyPriceLabel")}
            </p>
            <p className="text-[15px] font-semibold tabular text-foreground">
              {formatPrice(teacher.hourlyRate, locale)}
              <span className="ms-0.5 text-[11px] font-normal text-ink-3">
                {t("stickyPerHour")}
              </span>
            </p>
          </div>
          <CheckoutDialog
            kind="1to1"
            subjectTitle={teacher.subject}
            teacherSlug={teacher.slug}
            teacherName={teacher.name}
            priceDzd={teacher.hourlyRate}
            trigger={
              <Button variant="primary" size="lg" className="ms-auto">
                {t("stickyBook1to1")}
                <Arrow className="h-4 w-4" aria-hidden />
              </Button>
            }
          />
        </div>
      </div>

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

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function RightRail({
  teacher,
  applyCourse,
  onMessage,
  onScrollToAvailability,
}: {
  teacher: Teacher;
  applyCourse: ReturnType<typeof coursesForTeacher>[number] | null;
  onMessage: () => void;
  onScrollToAvailability: () => void;
}) {
  const t = useTranslations("student.teacherProfile");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const hasReviews = teacher.reviews > 0;

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card shadow-e1">
      {/* Price header */}
      <div className="border-b border-border bg-surface/40 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          {t("stickyStartFrom")}
        </p>
        <p className="mt-0.5 text-[22px] font-bold tabular text-foreground">
          {formatPrice(teacher.hourlyRate, locale)}
          <span className="ms-1 text-[13px] font-normal text-ink-3">{t("stickyPerHour")}</span>
        </p>
        <div className="mt-2">
          <ResponseSignalBadge
            signals={deriveResponseSignals(teacher.id, teacher.responseHours)}
          />
        </div>
      </div>

      {/* CTA stack */}
      <div className="grid gap-2 p-4">
        <CheckoutDialog
          kind="1to1"
          subjectTitle={teacher.subject}
          teacherSlug={teacher.slug}
          teacherName={teacher.name}
          priceDzd={teacher.hourlyRate}
          trigger={
            <Button variant="primary" size="md" block>
              {t("stickyBook1to1")}
              <Arrow className="h-4 w-4" aria-hidden />
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
              <Button variant="outline" size="md" block>
                {t("stickyApplyCourse")}
              </Button>
            }
          />
        ) : (
          <Button variant="outline" size="md" block disabled>
            {t("stickyApplyCourse")}
          </Button>
        )}
        <Button variant="ghost" size="md" block onClick={onMessage}>
          <MessageCircle className="h-4 w-4" aria-hidden />
          {t("stickyMessage")}
        </Button>
        <button
          type="button"
          onClick={onScrollToAvailability}
          className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-xs)] text-[12.5px] font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:shadow-focus"
        >
          {t("stickySeeAvailability")}
          <Arrow className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {/* Availability preview + stats */}
      <Separator />
      <ul className="grid gap-2 px-4 py-3 text-[12.5px] text-ink-2">
        <li className="flex items-center justify-between">
          <span className="text-ink-3">{t("responseTime", { hours: teacher.responseHours })}</span>
          <span className="font-semibold tabular text-foreground">{teacher.responseHours}h</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-ink-3">{t("completion")}</span>
          <span className="font-semibold tabular text-foreground">98%</span>
        </li>
        {hasReviews && (
          <li className="flex items-center justify-between">
            <span className="text-ink-3">{t("tabReviews", { count: teacher.reviews })}</span>
            <span className="inline-flex items-center gap-1 font-semibold tabular text-foreground">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden />
              {teacher.rating.toFixed(2)}
            </span>
          </li>
        )}
      </ul>

      {/* Trust footer */}
      <p className="flex items-start gap-1.5 border-t border-border bg-surface/40 px-4 py-3 text-[11px] leading-relaxed text-ink-3">
        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-success" aria-hidden />
        {t("stickyTrust")}
      </p>
    </div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-ink-2">
      {icon}
      {children}
    </span>
  );
}

function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        // Mobile look — underline pill, no bg
        "relative h-11 shrink-0 rounded-none border-b-2 border-transparent bg-transparent px-3 text-[13.5px] text-ink-2 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none",
        // Desktop reverts to the shell's pill treatment
        "lg:h-8 lg:rounded-[var(--radius-xs)] lg:border-b-0 lg:px-3 lg:data-[state=active]:bg-background lg:data-[state=active]:shadow-e1",
      )}
    >
      {children}
    </TabsTrigger>
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
              <div className="border-b border-border px-3 py-2 text-[11.5px] tabular text-ink-3">
                {h}:00
              </div>
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
                    {booked ? "—" : <CheckCheck className="mx-auto h-3.5 w-3.5" aria-hidden />}
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
        <BookOpen className="h-4 w-4" aria-hidden />
      </span>
      <p className="max-w-md text-[13px] leading-relaxed text-ink-2">{label}</p>
    </div>
  );
}
