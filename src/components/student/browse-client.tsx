"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Wifi,
  MapPin,
  X,
} from "lucide-react";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { categories, wilayaKeys } from "@/lib/mock/categories";
import { featuredTeachers, type Teacher } from "@/lib/mock/teachers";
import { courses, type Course, type CourseLevel } from "@/lib/mock/courses";
import { TeacherCard } from "@/components/marketing/teacher-card";
import { CourseCard } from "@/components/student/course-card";
import { cn, formatPrice } from "@/lib/utils";

type SortKey = "relevance" | "priceAsc" | "priceDesc" | "rating" | "newest" | "response";
type ModeKey = "online" | "in-person" | "both";
type Tab = "all" | "teachers" | "courses";

/**
 * Derive the canonical mode from two independent switch booleans.
 * Falls back to "both" when both are off so the result set isn't accidentally
 * emptied — users can still narrow by other filters.
 */
function deriveMode(online: boolean, inPerson: boolean): ModeKey {
  if (online && inPerson) return "both";
  if (online) return "online";
  if (inPerson) return "in-person";
  return "both";
}

export function BrowseClient({
  initialQuery,
  initialSubject,
  initialWilaya,
  initialMode,
}: {
  initialQuery: string;
  initialSubject: string;
  initialWilaya: string;
  initialMode: ModeKey;
}) {
  const t = useTranslations("student.browse");
  const tWilayas = useTranslations("search.wilayas");
  const tCats = useTranslations("home.categories.items");
  const tCourseFormat = useTranslations("student.course.format");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const router = useRouter();
  const pathname = usePathname();

  // ---- State -----------------------------------------------------------
  const [query, setQuery] = useState(initialQuery);
  const [subject, setSubject] = useState(initialSubject);
  const [wilaya, setWilaya] = useState(initialWilaya);
  const [mode, setMode] = useState<ModeKey>(initialMode);
  // Single DZD scale shared by teacher hourly rate AND course price.
  // Slider is 0–20 000 so both bands (teachers ~500–5 000, courses ~1 400–9 800) fit.
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [minRating, setMinRating] = useState<"any" | "5" | "4.5" | "4">("any");
  const [level, setLevel] = useState<CourseLevel | "any">("any");
  const [formats, setFormats] = useState<Record<string, boolean>>({
    cohort: true,
    event: true,
    "1to1": true,
    ondemand: true,
  });
  const [sort, setSort] = useState<SortKey>("relevance");
  const [tab, setTab] = useState<Tab>("all");
  // Controls the mobile bottom-sheet — we open/close programmatically so the
  // sticky "Apply" footer can dismiss on commit without hunting the trigger.
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ---- Derived: filtered teachers / courses ----------------------------
  const filteredTeachers = useMemo<Teacher[]>(() => {
    return featuredTeachers
      .filter((tch) => {
        if (query) {
          const q = query.toLowerCase();
          const hit =
            tch.name[lang].toLowerCase().includes(q) ||
            tch.subject[lang].toLowerCase().includes(q) ||
            tch.headline[lang].toLowerCase().includes(q) ||
            tch.city[lang].toLowerCase().includes(q);
          if (!hit) return false;
        }
        if (wilaya !== "any") {
          if (tch.city[lang].toLowerCase() !== tWilayas(wilaya as never).toLowerCase()) return false;
        }
        if (mode !== "both" && tch.mode !== "both" && tch.mode !== mode) return false;
        if (tch.hourlyRate < priceRange[0] || tch.hourlyRate > priceRange[1]) return false;
        if (minRating === "5" && tch.rating < 4.95) return false;
        if (minRating === "4.5" && tch.rating < 4.5) return false;
        if (minRating === "4" && tch.rating < 4.0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "priceAsc") return a.hourlyRate - b.hourlyRate;
        if (sort === "priceDesc") return b.hourlyRate - a.hourlyRate;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "response") return a.responseHours - b.responseHours;
        return 0;
      });
  }, [query, lang, wilaya, mode, priceRange, minRating, sort, tWilayas]);

  const filteredCourses = useMemo<Course[]>(() => {
    return courses
      .filter((c) => {
        if (!formats[c.format]) return false;
        if (level !== "any" && c.level !== level && c.level !== "any") return false;
        if (query) {
          const q = query.toLowerCase();
          const hit =
            c.title[lang].toLowerCase().includes(q) ||
            c.subject[lang].toLowerCase().includes(q) ||
            c.teacher.name[lang].toLowerCase().includes(q);
          if (!hit) return false;
        }
        if (c.priceDzd < priceRange[0] || c.priceDzd > priceRange[1]) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "priceAsc") return a.priceDzd - b.priceDzd;
        if (sort === "priceDesc") return b.priceDzd - a.priceDzd;
        if (sort === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [query, lang, formats, level, priceRange, sort]);

  const totalCount =
    tab === "teachers"
      ? filteredTeachers.length
      : tab === "courses"
        ? filteredCourses.length
        : filteredTeachers.length + filteredCourses.length;

  // ---- URL state sync --------------------------------------------------
  // Apply-button pattern: every filter (query, subject, wilaya, mode, rating,
  // level, formats, price) is pushed to the URL when the user clicks Apply
  // (or hits Enter in the search box). Nothing syncs on each keystroke.
  function commit() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (subject !== "any") params.set("subject", subject);
    if (wilaya !== "any") params.set("wilaya", wilaya);
    if (mode !== "both") params.set("mode", mode);
    if (minRating !== "any") params.set("rating", minRating);
    if (level !== "any") params.set("level", level);
    // Only serialise formats if at least one is disabled (default = all on).
    const formatKeys = ["cohort", "event", "1to1", "ondemand"] as const;
    const disabled = formatKeys.filter((f) => !formats[f]);
    if (disabled.length > 0) {
      const enabled = formatKeys.filter((f) => formats[f]);
      params.set("formats", enabled.join(","));
    }
    if (priceRange[0] !== 0) params.set("priceMin", String(priceRange[0]));
    if (priceRange[1] !== 20000) params.set("priceMax", String(priceRange[1]));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}` as never);
  }

  function resetAll() {
    setQuery("");
    setSubject("any");
    setWilaya("any");
    setMode("both");
    setPriceRange([0, 20000]);
    setMinRating("any");
    setLevel("any");
    setFormats({ cohort: true, event: true, "1to1": true, ondemand: true });
  }

  const activeFilterCount =
    (subject !== "any" ? 1 : 0) +
    (wilaya !== "any" ? 1 : 0) +
    (mode !== "both" ? 1 : 0) +
    (minRating !== "any" ? 1 : 0) +
    (level !== "any" ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 20000 ? 1 : 0);

  const sortLabel = t(`sort${sort.charAt(0).toUpperCase()}${sort.slice(1)}` as never);

  // ---- UI fragments ----------------------------------------------------
  // The filter body is used inside BOTH the desktop sidebar and the mobile
  // bottom-sheet. It intentionally does NOT include Apply/Reset — those live
  // in the respective surrounding chrome so each surface can style them
  // (sticky footer on mobile, inline row on desktop).
  const FilterBody = (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label>{t("filterSubject")}</Label>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger>
            <SelectValue placeholder={t("filterSubjectAny")} />
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

      <div className="grid gap-2">
        <Label>{t("filterWilaya")}</Label>
        <Select value={wilaya} onValueChange={setWilaya}>
          <SelectTrigger>
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
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-[13px] font-medium text-foreground">{t("filterMode")}</legend>
        <div className="grid divide-y divide-border rounded-[var(--radius-md)] border border-border">
          <ModeRow
            id="mode-online"
            label={t("filterModeOnline")}
            icon={<Wifi className="h-3.5 w-3.5" />}
            checked={mode === "online" || mode === "both"}
            onChange={(v) =>
              setMode(deriveMode(v, mode === "in-person" || mode === "both"))
            }
          />
          <ModeRow
            id="mode-inperson"
            label={t("filterModeInPerson")}
            icon={<MapPin className="h-3.5 w-3.5" />}
            checked={mode === "in-person" || mode === "both"}
            onChange={(v) =>
              setMode(deriveMode(mode === "online" || mode === "both", v))
            }
          />
        </div>
      </fieldset>

      <div className="grid gap-3">
        <div className="flex items-baseline justify-between">
          <Label>{t("filterPrice")}</Label>
          <span className="text-[11px] text-ink-3 tabular">
            {formatPrice(priceRange[0], locale)} — {formatPrice(priceRange[1], locale)}
          </span>
        </div>
        <Slider
          min={0}
          max={20000}
          step={500}
          value={priceRange}
          onValueChange={(v) => setPriceRange([v[0]!, v[1]!])}
          ariaLabel={t("filterPrice")}
          format={(n) => formatPrice(n, locale)}
        />
        <p className="text-[11px] text-ink-3">{t("filterPriceHint")}</p>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-[13px] font-medium text-foreground">{t("filterRating")}</legend>
        <div className="grid gap-2">
          {(["any", "5", "4.5", "4"] as const).map((r) => (
            <label key={r} className="flex items-center gap-2 text-[13px] text-ink-2">
              <Checkbox
                checked={minRating === r}
                onCheckedChange={(v) => v === true && setMinRating(r)}
                aria-label={r === "any" ? t("filterLevelAny") : t("filterRatingStar", { n: r })}
              />
              {r === "any" ? t("filterLevelAny") : t("filterRatingStar", { n: r })}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-[13px] font-medium text-foreground">{t("filterLevel")}</legend>
        <RadioGroup
          value={level}
          onValueChange={(v) => setLevel(v as CourseLevel | "any")}
          className="grid gap-1.5"
        >
          {(["any", "beginner", "intermediate", "advanced"] as const).map((lv) => (
            <label key={lv} className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-2">
              <RadioGroupItem value={lv} id={`lv-${lv}`} />
              <span>
                {lv === "any"
                  ? t("filterLevelAny")
                  : t(`filterLevel${lv.charAt(0).toUpperCase()}${lv.slice(1)}` as never)}
              </span>
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-[13px] font-medium text-foreground">{t("filterFormat")}</legend>
        <div className="grid gap-1.5">
          {(["cohort", "event", "1to1", "ondemand"] as const).map((f) => (
            <label key={f} className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-2">
              <Checkbox
                checked={formats[f]}
                onCheckedChange={(v) => setFormats((prev) => ({ ...prev, [f]: v === true }))}
              />
              {tCourseFormat(f as never)}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <>
      {/* ========== PAGE HEADER ========== */}
      <section className="relative isolate border-b border-border bg-background">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-border" />
        <div aria-hidden className="absolute start-4 top-0 h-[3px] w-16 bg-accent md:start-8" />
        <div className="container-standard py-8 md:py-12 lg:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {t("pageEyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl text-[28px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[34px] md:text-[42px]">
            {t("title")}{" "}
            <span className="font-light italic text-ink-2">{t("titleAccent")}</span>
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-2 md:text-[15px]">
            {t("subtitle")}
          </p>

          {/* Search bar */}
          <div className="mt-6 flex max-w-2xl items-center gap-2 rounded-[var(--radius-lg)] border border-border-strong bg-card p-1.5 shadow-e1 focus-within:border-accent focus-within:shadow-e2">
            <span className="ms-1 grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-surface text-ink-2">
              <Search className="h-4 w-4" aria-hidden />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              placeholder={t("searchPlaceholder")}
              className="h-11 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-ink-3 focus:outline-none"
              dir={locale === "ar" ? "rtl" : "ltr"}
              aria-label={t("searchPlaceholder")}
            />
            <Button size="md" variant="accent" onClick={commit} className="hidden sm:inline-flex">
              <Search className="h-4 w-4" aria-hidden />
              {t("filterApply")}
            </Button>
            <Button
              size="icon"
              variant="accent"
              onClick={commit}
              className="sm:hidden"
              aria-label={t("filterApply")}
            >
              <Search className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-3">
                {t("filterActive", { count: activeFilterCount })}
              </span>
              {subject !== "any" && (
                <ChipRemovable onRemove={() => { setSubject("any"); commit(); }}>
                  {tCats(`${subject}.name` as never)}
                </ChipRemovable>
              )}
              {wilaya !== "any" && (
                <ChipRemovable onRemove={() => { setWilaya("any"); commit(); }}>
                  {tWilayas(wilaya as never)}
                </ChipRemovable>
              )}
              {mode !== "both" && (
                <ChipRemovable onRemove={() => { setMode("both"); commit(); }}>
                  {mode === "online" ? t("filterModeOnline") : t("filterModeInPerson")}
                </ChipRemovable>
              )}
              {minRating !== "any" && (
                <ChipRemovable onRemove={() => { setMinRating("any"); commit(); }}>
                  {t("filterRatingStar", { n: minRating })}
                </ChipRemovable>
              )}
              {level !== "any" && (
                <ChipRemovable onRemove={() => { setLevel("any"); commit(); }}>
                  {t(`filterLevel${level.charAt(0).toUpperCase()}${level.slice(1)}` as never)}
                </ChipRemovable>
              )}
              <button
                type="button"
                onClick={() => { resetAll(); commit(); }}
                className="text-[12px] font-medium text-accent underline-offset-2 hover:underline"
              >
                {t("filterClearAll")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========== MOBILE STICKY FILTER BAR ========== */}
      {/* Under the site header, above the results. Shows the two hero chips
          per MASTER.md filter/sort UX for mobile. Hidden on lg+ since the
          desktop sidebar covers the same affordances. */}
      <div className="sticky top-[var(--site-header-h,64px)] z-30 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="container-standard flex items-center gap-2 py-2.5">
          {/* Sort trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-xs)] border border-border bg-card px-3 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none"
              >
                <span className="text-ink-3">{t("sortLabel")}:</span>
                <span className="max-w-[100px] truncate">{sortLabel}</span>
                <ChevronDown className="h-3.5 w-3.5 text-ink-3" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>{t("sortLabel")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(["relevance", "rating", "priceAsc", "priceDesc", "newest", "response"] as SortKey[]).map((s) => (
                <DropdownMenuItem key={s} onSelect={() => setSort(s)}>
                  {t(`sort${s.charAt(0).toUpperCase()}${s.slice(1)}` as never)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filters trigger — opens bottom sheet */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-xs)] border border-border bg-card px-3 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                {t("filterMobileOpen")}
                {activeFilterCount > 0 && (
                  <span className="ms-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[10.5px] font-semibold tabular text-accent-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="flex max-h-[92dvh] flex-col p-0"
            >
              {/* Grabber affordance — communicates draggable sheet */}
              <div className="flex justify-center pt-2 pb-1" aria-hidden>
                <span className="h-1 w-10 rounded-full bg-border-strong" />
              </div>
              <div className="border-b border-border px-5 py-3">
                <SheetTitle className="text-[15px] font-semibold text-foreground">
                  {t("filtersTitle")}
                </SheetTitle>
                <SheetDescription className="mt-0.5 text-[12.5px] text-ink-3">
                  {t("filtersIntro")}
                </SheetDescription>
              </div>
              <div className="scroll-thin flex-1 overflow-y-auto px-5 py-5">
                {FilterBody}
              </div>
              <div className="pb-safe sticky bottom-0 flex items-center gap-2 border-t border-border bg-background px-5 py-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={resetAll}
                >
                  {t("filterClearAll")}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="accent"
                  className="flex-[1.4]"
                  onClick={() => {
                    commit();
                    setMobileFiltersOpen(false);
                  }}
                >
                  {t("filterApply")}
                  {totalCount > 0 && (
                    <span className="tabular">· {totalCount}</span>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Result counter, right-aligned */}
          <span className="ms-auto text-[12px] tabular text-ink-3">
            {t("resultsCount", { count: totalCount })}
          </span>
        </div>
      </div>

      {/* ========== RESULTS BODY ========== */}
      <section className="bg-surface/40">
        <div className="container-standard grid gap-6 py-8 md:py-10 lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-[var(--radius-lg)] border border-border bg-card shadow-e1">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                    {t("filtersTitle")}
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => { resetAll(); commit(); }}
                      className="text-[12px] font-medium text-accent hover:underline"
                    >
                      {t("filterClearAll")}
                    </button>
                  )}
                </div>
                <div className="p-5">
                  {FilterBody}
                  <Button
                    type="button"
                    size="md"
                    variant="accent"
                    onClick={commit}
                    className="mt-6 w-full"
                  >
                    {t("filterApply")}
                    {activeFilterCount > 0 && totalCount > 0 && (
                      <span className="tabular">· {totalCount}</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Results column */}
          <div>
            {/* Desktop toolbar — hidden on mobile since sticky bar above covers it */}
            <div className="mb-4 hidden flex-wrap items-center gap-2 lg:flex">
              <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="me-auto">
                <TabsList>
                  <TabsTrigger value="all">{t("tabAll")}</TabsTrigger>
                  <TabsTrigger value="teachers">{t("tabTeachers")}</TabsTrigger>
                  <TabsTrigger value="courses">{t("tabCourses")}</TabsTrigger>
                </TabsList>
              </Tabs>

              <span className="text-[12.5px] tabular text-ink-3">
                {t("resultsCount", { count: totalCount })}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="md">
                    {t("sortLabel")}: {sortLabel}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("sortLabel")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(["relevance", "rating", "priceAsc", "priceDesc", "newest", "response"] as SortKey[]).map((s) => (
                    <DropdownMenuItem key={s} onSelect={() => setSort(s)}>
                      {t(`sort${s.charAt(0).toUpperCase()}${s.slice(1)}` as never)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile tabs — full-width row, below the sticky bar */}
            <div className="mb-4 lg:hidden">
              <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">{t("tabAll")}</TabsTrigger>
                  <TabsTrigger value="teachers" className="flex-1">{t("tabTeachers")}</TabsTrigger>
                  <TabsTrigger value="courses" className="flex-1">{t("tabCourses")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
              <TabsContent value="all" className="mt-0">
                <ResultGrid teachers={filteredTeachers} courses={filteredCourses} mixed />
              </TabsContent>
              <TabsContent value="teachers" className="mt-0">
                <ResultGrid teachers={filteredTeachers} courses={[]} />
              </TabsContent>
              <TabsContent value="courses" className="mt-0">
                <ResultGrid teachers={[]} courses={filteredCourses} />
              </TabsContent>
            </Tabs>

            {totalCount === 0 && (
              <EmptyState
                onClear={() => {
                  resetAll();
                  commit();
                }}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ModeRow({
  id,
  label,
  icon,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-[13px] text-ink-2">
      <span className="text-ink-3">{icon}</span>
      <span className="flex-1">{label}</span>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function ChipRemovable({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-border-strong bg-accent-soft/50 ps-2.5 pe-1 text-[12px] font-medium text-foreground">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Retirer"
        className="grid h-5 w-5 place-items-center rounded-full text-ink-3 transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none"
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
    </span>
  );
}

function ResultGrid({
  teachers,
  courses,
  mixed = false,
}: {
  teachers: Teacher[];
  courses: Course[];
  mixed?: boolean;
}) {
  if (teachers.length === 0 && courses.length === 0) {
    return null;
  }
  // Interleave on "all" tab so the mix doesn't clump by type — the pattern
  // (2 teachers, 1 course) reads better than 8 teachers then 8 courses.
  const items: ({ kind: "teacher"; data: Teacher } | { kind: "course"; data: Course })[] = [];
  if (mixed) {
    let ti = 0;
    let ci = 0;
    while (ti < teachers.length || ci < courses.length) {
      if (ti < teachers.length) items.push({ kind: "teacher", data: teachers[ti++]! });
      if (ti < teachers.length) items.push({ kind: "teacher", data: teachers[ti++]! });
      if (ci < courses.length) items.push({ kind: "course", data: courses[ci++]! });
    }
  } else {
    teachers.forEach((d) => items.push({ kind: "teacher", data: d }));
    courses.forEach((d) => items.push({ kind: "course", data: d }));
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((it, i) =>
        it.kind === "teacher" ? (
          <TeacherCard key={`t-${it.data.id}`} teacher={it.data} density="compact" />
        ) : (
          <CourseCard key={`c-${it.data.id}`} course={it.data} index={i} />
        ),
      )}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  const t = useTranslations("student.browse");
  return (
    <div className="mt-6 grid place-items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-ink-3">
        <Search className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="text-[16px] font-semibold text-foreground">{t("emptyTitle")}</h3>
      <p className="max-w-md text-[13px] text-ink-2 text-pretty">{t("emptyBody")}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="md" onClick={onClear}>
          {t("emptyClear")}
        </Button>
        <Button variant="primary" size="md" asChild>
          <Link href={"/requests/new" as never}>{t("emptyPostRequest")}</Link>
        </Button>
      </div>
    </div>
  );
}
