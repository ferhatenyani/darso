"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronDown,
  ChevronRight,
  Star,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Wifi,
  MapPin,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { featuredTeachers, type Teacher } from "@/lib/mock/teachers";
import { categories, wilayaKeys } from "@/lib/mock/categories";
import { coursesForTeacher } from "@/lib/mock/courses";
import { cn, formatPrice } from "@/lib/utils";

type SortKey = "rating" | "newest" | "priceAsc" | "response";

export function TeachersLeaderboard() {
  const t = useTranslations("student.teachers");
  const tHome = useTranslations("home.teachers");
  const tCommon = useTranslations("student.common");
  const tCats = useTranslations("home.categories.items");
  const tWilayas = useTranslations("search.wilayas");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const [sort, setSort] = useState<SortKey>("rating");
  const [subject, setSubject] = useState<string>("any");
  const [wilaya, setWilaya] = useState<string>("any");
  const [expanded, setExpanded] = useState<string | null>(null);

  const ranked = useMemo<Teacher[]>(() => {
    return [...featuredTeachers]
      .filter((t) => subject === "any" || t.subject[lang].toLowerCase().includes(tCats(`${subject}.name` as never).toLowerCase()))
      .filter((t) => wilaya === "any" || t.city[lang].toLowerCase() === tWilayas(wilaya as never).toLowerCase())
      .sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "priceAsc") return a.hourlyRate - b.hourlyRate;
        if (sort === "response") return a.responseHours - b.responseHours;
        return b.lessons - a.lessons; // "newest" stand-in
      });
  }, [sort, subject, wilaya, lang, tCats, tWilayas]);

  const wilayaCount = new Set(ranked.map((t) => t.city[lang])).size;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate border-b border-border bg-background">
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-sm opacity-50 [mask-image:radial-gradient(80%_70%_at_80%_0%,black,transparent_80%)]" />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-4 end-6 -z-10 select-none text-[140px] font-black leading-none tracking-tighter text-foreground/[0.04] md:text-[200px]"
        >
          TOP
        </span>
        <div className="container-narrow grid gap-8 py-12 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              {t("pageEyebrow")}
            </p>
            <h1 className="mt-3 text-[40px] font-bold leading-[1.02] tracking-tight text-foreground md:text-[54px]">
              <span className="block">{t("title")}</span>
              <span className="block font-light italic text-ink-2">{t("titleAccent")}</span>
            </h1>
            <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>
          </div>

          {/* Right rail summary */}
          <div className="rounded-[var(--radius-xl)] border border-border-strong bg-card p-5 shadow-e1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              {t("leaderboardEyebrow")}
            </p>
            <p className="mt-2 text-[14px] text-foreground">
              {t("leaderboardLine", { count: ranked.length, wilayaCount })}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-md)] bg-border">
              <Stat value={ranked.length.toString()} label={t("teacherCol")} />
              <Stat
                value={(ranked.reduce((s, t) => s + t.rating, 0) / Math.max(ranked.length, 1)).toFixed(2)}
                label={t("ratingCol")}
              />
              <Stat
                value={(ranked.reduce((s, t) => s + t.responseHours, 0) / Math.max(ranked.length, 1)).toFixed(1) + "h"}
                label={t("responseCol")}
              />
            </div>
          </div>
        </div>

        {/* Filter row */}
        <div className="border-t border-border bg-surface/40">
          <div className="container-narrow flex flex-wrap items-center gap-2 py-4">
            <div className="flex items-center gap-2">
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3 sm:inline">
                {t("filterSubjectAny")}
              </span>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger size="sm" className="min-w-0 flex-1 sm:min-w-44 sm:flex-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("filterSubjectAny")}</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {tCats(`${c.key}.name` as never)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={wilaya} onValueChange={setWilaya}>
              <SelectTrigger size="sm" className="min-w-0 flex-1 sm:min-w-44 sm:flex-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {wilayaKeys.map((w) => (
                  <SelectItem key={w} value={w}>
                    {tWilayas(w as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ms-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {t("sortLabel")}: {t(`sort${sort.charAt(0).toUpperCase()}${sort.slice(1)}` as never)}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(["rating", "newest", "priceAsc", "response"] as SortKey[]).map((s) => (
                    <DropdownMenuItem key={s} onSelect={() => setSort(s)}>
                      {t(`sort${s.charAt(0).toUpperCase()}${s.slice(1)}` as never)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard table */}
      <section className="bg-background">
        <div className="container-narrow py-10">
          {/* Header row */}
          <div className="hidden lg:grid grid-cols-[60px_minmax(220px,2.2fr)_120px_120px_140px_140px_120px_40px] items-center gap-3 border-b border-border bg-surface/40 px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            <span>{t("rankLabel")}</span>
            <span>{t("teacherCol")}</span>
            <span>{t("ratingCol")}</span>
            <span>{t("lessonsCol")}</span>
            <span>{t("priceCol")}</span>
            <span>{t("responseCol")}</span>
            <span>{t("modeCol") || "Mode"}</span>
            <span aria-hidden />
          </div>

          <ul className="grid divide-y divide-border rounded-b-[var(--radius-lg)] border-s border-e border-b border-border bg-card">
            {ranked.map((teacher, i) => {
              const isOpen = expanded === teacher.id;
              return (
                <li key={teacher.id} className="group relative">
                  <div className="grid grid-cols-[60px_1fr_auto] items-center gap-3 px-4 py-3 lg:grid-cols-[60px_minmax(220px,2.2fr)_120px_120px_140px_140px_120px_40px] lg:px-5">
                    {/* Rank */}
                    <span className="text-[15px] font-bold tabular text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Teacher cell */}
                    <Link
                      href={`/teachers/${teacher.slug}` as never}
                      className="flex min-w-0 items-center gap-3 outline-none focus-visible:rounded-md"
                    >
                      <Avatar className="h-11 w-11 shadow-e1">
                        <AvatarFallback className={cn("bg-gradient-to-br text-sm text-white", teacher.accent)}>
                          {teacher.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[14.5px] font-semibold text-foreground group-hover:text-accent">
                            {teacher.name[lang]}
                          </p>
                          {teacher.idVerified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden />
                          )}
                          {teacher.topRated && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-warning">
                              · {tHome("badges.topRated")}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[12px] text-ink-2">
                          {teacher.subject[lang]} · {teacher.city[lang]}
                        </p>
                      </div>
                    </Link>

                    {/* Rating */}
                    <div className="hidden lg:flex items-center gap-1 text-[13px]">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="font-semibold tabular text-foreground">{teacher.rating.toFixed(2)}</span>
                      <span className="text-ink-3">·{teacher.reviews}</span>
                    </div>

                    {/* Lessons */}
                    <div className="hidden lg:block text-[13px] tabular text-ink-2">{teacher.lessons.toLocaleString(locale === "ar" ? "ar-DZ" : "fr-DZ")}</div>

                    {/* Price */}
                    <div className="hidden lg:block text-[13px] font-semibold tabular text-foreground">
                      {formatPrice(teacher.hourlyRate, locale)}
                      <span className="ms-0.5 text-[11px] text-ink-3">{t("perHour")}</span>
                    </div>

                    {/* Response */}
                    <div className="hidden lg:block text-[13px] tabular text-ink-2">
                      {t("responseHours", { hours: teacher.responseHours })}
                    </div>

                    {/* Mode */}
                    <div className="hidden lg:flex items-center gap-1 text-[12px] text-ink-2">
                      {teacher.mode === "online" ? (
                        <Wifi className="h-3.5 w-3.5" />
                      ) : teacher.mode === "in-person" ? (
                        <MapPin className="h-3.5 w-3.5" />
                      ) : (
                        <>
                          <Wifi className="h-3.5 w-3.5" />
                          <MapPin className="h-3.5 w-3.5" />
                        </>
                      )}
                      <span className="hidden xl:inline">
                        {teacher.mode === "online" ? t("modeOnline") : teacher.mode === "in-person" ? t("modeInPerson") : t("modeBoth")}
                      </span>
                    </div>

                    {/* Expand toggle (desktop only — mobile expands by tap on row) */}
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : teacher.id)}
                      className={cn(
                        "hidden lg:grid h-8 w-8 place-items-center rounded-[var(--radius-sm)] text-ink-3 transition-colors",
                        "hover:bg-surface hover:text-foreground",
                      )}
                      aria-label={isOpen ? t("collapseRow") : t("expandRow")}
                      aria-expanded={isOpen}
                    >
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isOpen && "rotate-90",
                        )}
                      />
                    </button>

                    {/* Mobile: price + arrow */}
                    <div className="lg:hidden text-end">
                      <p className="text-[13px] font-semibold tabular text-foreground">
                        {formatPrice(teacher.hourlyRate, locale)}
                        <span className="ms-0.5 text-[11px] text-ink-3">{t("perHour")}</span>
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-0.5 text-[11px] text-ink-3">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="tabular text-foreground">{teacher.rating.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Expanded panel (desktop) */}
                  {isOpen && (
                    <div className="hidden lg:block border-t border-border bg-surface/30 px-5 py-4">
                      <div className="grid gap-6 md:grid-cols-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                            {tHome("badges.topRated")}
                          </p>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{teacher.headline[lang]}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                            {t("speaksLabel")}
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {teacher.speaks[lang].map((sp) => (
                              <Badge key={sp} variant="default">
                                {sp}
                              </Badge>
                            ))}
                          </div>
                          <p className="mt-3 text-[11.5px] text-ink-3">
                            {coursesForTeacher(teacher.id).length} {t("lessonsCol")}
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="md">
                            <Link href={`/teachers/${teacher.slug}` as never}>{t("openProfile")}</Link>
                          </Button>
                          <Button asChild variant="primary" size="md">
                            <Link href={`/teachers/${teacher.slug}` as never}>
                              {tCommon("view")}
                              <Arrow className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {ranked.length === 0 && (
            <p className="mt-8 text-center text-sm text-ink-3">{t("noResults")}</p>
          )}

          <p className="mt-4 text-center text-[11px] text-ink-3">{t("tableHelp")}</p>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-card px-3 py-3 text-start">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">{label}</p>
      <p className="mt-1 text-[18px] font-bold text-foreground tabular">{value}</p>
    </div>
  );
}
