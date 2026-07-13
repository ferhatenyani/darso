"use client";

/**
 * Teachers directory — refreshed to a mobile-first hero + chip filter + grid
 * layout that reuses the marketing TeacherCard (the newer densified variant).
 * The historic "leaderboard table" export name is preserved so the page
 * import stays stable during redesign.
 */

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, MapPin, ShieldCheck } from "lucide-react";

import { TeacherCard } from "@/components/marketing/teacher-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { featuredTeachers, type Teacher } from "@/lib/mock/teachers";
import { categories, wilayaKeys } from "@/lib/mock/categories";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type SortKey = "rating" | "newest" | "priceAsc" | "response";
type QuickChip = "all" | "verified" | "topRated" | "fast" | "online" | "inPerson";

export function TeachersLeaderboard() {
  const t = useTranslations("student.teachers");
  const tCats = useTranslations("home.categories.items");
  const tWilayas = useTranslations("search.wilayas");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  const [sort, setSort] = useState<SortKey>("rating");
  const [subject, setSubject] = useState<string>("any");
  const [wilaya, setWilaya] = useState<string>("any");
  const [chip, setChip] = useState<QuickChip>("all");

  const ranked = useMemo<Teacher[]>(() => {
    return [...featuredTeachers]
      .filter((tc) =>
        subject === "any" ||
        tc.subject[lang].toLowerCase().includes(tCats(`${subject}.name` as never).toLowerCase()),
      )
      .filter((tc) => wilaya === "any" || tc.city[lang].toLowerCase() === tWilayas(wilaya as never).toLowerCase())
      .filter((tc) => {
        if (chip === "verified") return tc.idVerified && tc.contactVerified;
        if (chip === "topRated") return Boolean(tc.topRated);
        if (chip === "fast") return tc.responseHours <= 3;
        if (chip === "online") return tc.mode === "online" || tc.mode === "both";
        if (chip === "inPerson") return tc.mode === "in-person" || tc.mode === "both";
        return true;
      })
      .sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "priceAsc") return a.hourlyRate - b.hourlyRate;
        if (sort === "response") return a.responseHours - b.responseHours;
        return b.lessons - a.lessons;
      });
  }, [sort, subject, wilaya, chip, lang, tCats, tWilayas]);

  const wilayaCount = new Set(ranked.map((tc) => tc.city[lang])).size;

  const chips: { key: QuickChip; label: string }[] = [
    { key: "all", label: t("filterSubjectAny") },
    { key: "verified", label: t("verifiedChip") },
    { key: "topRated", label: t("topRatedChip") },
    { key: "fast", label: t("fastChip") },
    { key: "online", label: t("modeOnline") },
    { key: "inPerson", label: t("modeInPerson") },
  ];

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative isolate border-b border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dots opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_80%)]"
        />
        <div aria-hidden className="absolute start-4 top-0 -z-10 h-[3px] w-16 bg-accent md:start-8" />
        <div className="container-standard py-10 md:py-14 lg:py-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {t("pageEyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl text-[32px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[40px] md:text-[48px]">
            {t("title")}{" "}
            <span className="font-light italic text-ink-2">{t("titleAccent")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>

          {/* Real, non-fabricated summary line — count + wilaya count only */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink-3">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden />
              <span className="tabular text-foreground">{ranked.length}</span>{" "}
              {t("summaryTeachers")}
            </span>
            <span aria-hidden className="h-3 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-ink-3" aria-hidden />
              <span className="tabular text-foreground">{wilayaCount}</span>{" "}
              {t("summaryWilayas")}
            </span>
          </div>
        </div>
      </section>

      {/* ========== FILTER STRIP ========== */}
      <div className="sticky top-[var(--site-header-h,64px)] z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-standard py-3">
          {/* Row 1: selects + sort */}
          <div className="flex flex-wrap items-center gap-2">
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
                    {t("sortLabel")}:{" "}
                    <span>
                      {t(`sort${sort.charAt(0).toUpperCase()}${sort.slice(1)}` as never)}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("sortLabel")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(["rating", "newest", "priceAsc", "response"] as SortKey[]).map((s) => (
                    <DropdownMenuItem key={s} onSelect={() => setSort(s)}>
                      {t(`sort${s.charAt(0).toUpperCase()}${s.slice(1)}` as never)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Row 2: horizontal-scroll quick chips (mobile-first) */}
          <div className="scroll-none -mx-4 mt-2.5 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            {chips.map((c) => {
              const active = chip === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setChip(c.key)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-[12.5px] font-medium transition-colors focus-visible:outline-none",
                    active
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border bg-card text-ink-2 hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========== GRID ========== */}
      <section className="bg-surface/40">
        <div className="container-standard py-8 md:py-12">
          {ranked.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {ranked.map((teacher) => (
                <li key={teacher.id}>
                  <TeacherCard teacher={teacher} density="compact" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  const t = useTranslations("student.teachers");
  return (
    <div className="grid place-items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-10 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
        {t("emptyEyebrow")}
      </p>
      <h3 className="text-[18px] font-semibold text-foreground">{t("emptyTitle")}</h3>
      <p className="max-w-md text-[13.5px] leading-relaxed text-ink-2 text-pretty">
        {t("emptyBody")}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button variant="primary" size="md" asChild>
          <Link href={routes.teachLanding()}>{t("emptyCta")}</Link>
        </Button>
      </div>
    </div>
  );
}
