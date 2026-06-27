"use client";

import { useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { X, SlidersHorizontal } from "lucide-react";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn, formatPrice } from "@/lib/utils";

const SUBJECT_KEYS = [
  "school",
  "languages",
  "code",
  "design",
  "business",
  "music",
  "religion",
  "exams",
] as const;
const MODE_KEYS = ["online", "inPerson", "both"] as const;
const URGENCY_KEYS = ["high", "med", "low"] as const;
const AUDIENCE_KEYS = ["kids", "lycee", "students", "adults"] as const;
const CITY_KEYS = [
  "alger",
  "oran",
  "constantine",
  "annaba",
  "blida",
  "setif",
  "batna",
  "tlemcen",
  "tiziOuzou",
  "bejaia",
] as const;

const SORT_KEYS = ["newest", "urgent", "budgetHigh", "fewestApps"] as const;

export function FilterBar({ matchedCount }: { matchedCount: number }) {
  const t = useTranslations("requests");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const filters = useMemo(
    () => ({
      subject: search.get("subject") ?? "",
      mode: search.get("mode") ?? "",
      urgency: search.get("urgency") ?? "",
      audience: search.get("audience") ?? "",
      city: search.get("city") ?? "",
      budgetMax: Number(search.get("budgetMax") ?? 5000),
      sort: search.get("sort") ?? "newest",
    }),
    [search],
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(search.toString());
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
      router.replace(`${pathname}?${params.toString()}` as never, { scroll: false });
    },
    [router, pathname, search],
  );

  const activeChipKeys = (
    ["subject", "mode", "urgency", "audience", "city"] as const
  ).filter((k) => filters[k]);
  const hasActive = activeChipKeys.length > 0 || filters.budgetMax !== 5000;

  function clearAll() {
    router.replace(pathname as never, { scroll: false });
  }

  function clearOne(k: string) {
    setParam(k, "");
  }

  const chipCluster = (
    <>
      {/* Subject */}
      <FilterChipSelect
        label={t("browse.filters.subject")}
        allLabel={t("browse.filters.subjectAll")}
        value={filters.subject || "all"}
        onChange={(v) => setParam("subject", v === "all" ? "" : v)}
        options={SUBJECT_KEYS.map((k) => ({
          value: k,
          label: t(`shared.subjects.${k}`),
        }))}
      />
      {/* Mode */}
      <FilterChipSelect
        label={t("browse.filters.mode")}
        allLabel={t("browse.filters.modeAll")}
        value={filters.mode || "all"}
        onChange={(v) => setParam("mode", v === "all" ? "" : v)}
        options={MODE_KEYS.map((k) => ({
          value: k === "inPerson" ? "in-person" : k,
          label: t(`shared.modes.${k}`),
        }))}
      />
      {/* Urgency */}
      <FilterChipSelect
        label={t("browse.filters.urgency")}
        allLabel={t("browse.filters.urgencyAll")}
        value={filters.urgency || "all"}
        onChange={(v) => setParam("urgency", v === "all" ? "" : v)}
        options={URGENCY_KEYS.map((k) => ({
          value: k,
          label: t(`shared.urgency.${k}`),
        }))}
      />
      {/* Audience */}
      <FilterChipSelect
        label={t("browse.filters.audience")}
        allLabel={t("browse.filters.audienceAll")}
        value={filters.audience || "all"}
        onChange={(v) => setParam("audience", v === "all" ? "" : v)}
        options={AUDIENCE_KEYS.map((k) => ({
          value: k,
          label: t(`shared.audience.${k}`),
        }))}
      />
      {/* City */}
      <FilterChipSelect
        label={t("browse.filters.city")}
        allLabel={t("browse.filters.cityAll")}
        value={filters.city || "all"}
        onChange={(v) => setParam("city", v === "all" ? "" : v)}
        options={CITY_KEYS.map((k) => ({
          value: k,
          label: t(`shared.cities.${k}`),
        }))}
      />

      {/* Budget popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="group inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background ps-3 pe-3.5 text-[12px] font-medium text-ink-2 transition-colors hover:border-border-strong hover:text-foreground data-[active=true]:border-accent data-[active=true]:bg-accent-soft/40 data-[active=true]:text-accent"
            data-active={filters.budgetMax !== 5000}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="font-mono uppercase tracking-wider text-[10.5px]">
              {t("browse.filters.budget")}
            </span>
            <span className="font-semibold tabular">
              ≤ {formatPrice(filters.budgetMax, locale)}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-4">
          <Label className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
            {t("browse.filters.budget")}
          </Label>
          <Slider
            className="mt-3"
            min={500}
            max={5000}
            step={100}
            value={[filters.budgetMax]}
            onValueChange={(v) =>
              setParam("budgetMax", v[0] === 5000 ? "" : String(v[0]))
            }
            ariaLabel={t("browse.filters.budget")}
            format={(n) => formatPrice(n, locale)}
          />
        </PopoverContent>
      </Popover>
    </>
  );

  // Count of chips currently set (excludes budget which has its own indicator)
  const chipSetCount = (
    ["subject", "mode", "urgency", "audience", "city"] as const
  ).filter((k) => filters[k]).length;

  return (
    <div className="space-y-3">
      {/* Desktop / tablet — chips inline */}
      <div className="hidden flex-wrap items-end gap-2 sm:flex">
        {chipCluster}

        {/* Sort */}
        <div className="ms-auto inline-flex items-center gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
            {t("browse.sort.label")}
          </span>
          <Select
            value={filters.sort}
            onValueChange={(v) => setParam("sort", v === "newest" ? "" : v)}
          >
            <SelectTrigger size="sm" className="h-9 min-w-[10.5rem] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {t(`browse.sort.${k}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile — collapse chips into a Sheet, keep sort outside */}
      <div className="flex items-center gap-2 sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-3 text-[12px] font-medium text-ink-2 transition-colors hover:border-border-strong hover:text-foreground"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="font-mono uppercase tracking-wider text-[10.5px]">
                {t("browse.filters.subject")}
              </span>
              {chipSetCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10.5px] font-semibold tabular text-accent-foreground">
                  {chipSetCount}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto p-5">
            <SheetHeader className="text-start">
              <SheetTitle className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
                {t("browse.filters.applyCount", { count: matchedCount })}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-wrap gap-2">{chipCluster}</div>
          </SheetContent>
        </Sheet>

        <Select
          value={filters.sort}
          onValueChange={(v) => setParam("sort", v === "newest" ? "" : v)}
        >
          <SelectTrigger size="sm" className="h-9 min-w-0 flex-1 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_KEYS.map((k) => (
              <SelectItem key={k} value={k}>
                {t(`browse.sort.${k}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips + result count */}
      <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
          {t("browse.filters.applyCount", { count: matchedCount })}
        </span>
        {hasActive && (
          <>
            <span className="text-ink-3" aria-hidden>
              ·
            </span>
            {activeChipKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => clearOne(key)}
                className="group inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>{t(`browse.filters.${key}`)}</span>
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.budgetMax !== 5000 && (
              <button
                type="button"
                onClick={() => clearOne("budgetMax")}
                className="group inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="tabular">
                  ≤ {formatPrice(filters.budgetMax, locale)}
                </span>
                <X className="h-3 w-3" />
              </button>
            )}
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 px-2">
              {t("browse.filters.clear")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function FilterChipSelect({
  label,
  allLabel,
  value,
  onChange,
  options,
}: {
  label: string;
  allLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const isActive = value && value !== "all";
  return (
    <div className="inline-flex items-center">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          size="sm"
          className={cn(
            "h-9 min-w-[7.5rem] rounded-full border-border bg-background px-3 text-[12px]",
            isActive && "border-accent bg-accent-soft/40 text-accent",
          )}
        >
          <span className="me-1.5 font-mono uppercase tracking-wider text-[10.5px] text-ink-3">
            {label}
          </span>
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
