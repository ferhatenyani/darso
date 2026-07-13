"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, BookOpen, Languages, Code2, Palette, Briefcase, Music, Moon, GraduationCap, Users, Calendar, PlayCircle, Library, MapPin, ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { categories, wilayaKeys } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";

const categoryIcons = { BookOpen, Languages, Code2, Palette, Briefcase, Music, Moon, GraduationCap };

export function DiscoverMenu() {
  const t = useTranslations("nav");
  const tCat = useTranslations("home.categories");
  const tWilaya = useTranslations("search.wilayas");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  // NOTE: BrowseClient reads `q`, `subject`, `wilaya`, `mode` (online|in-person|both).
  // Course-format (1to1/cohort/event/ondemand) and audience filters are internal-only
  // state inside BrowseClient and not URL-driven, so these links route to /browse
  // (default view) until URL support is added.
  const formats = [
    { key: "oneToOne", icon: Users, href: "/browse" },
    { key: "cohort", icon: Calendar, href: "/browse" },
    { key: "event", icon: PlayCircle, href: "/browse" },
    { key: "onDemand", icon: Library, href: "/browse" },
  ] as const;

  const audiences = [
    { key: "kids", href: "/browse" },
    { key: "lycee", href: "/browse" },
    { key: "students", href: "/browse" },
    { key: "adults", href: "/browse" },
  ] as const;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex h-10 items-center gap-1 rounded-[var(--radius-md)] px-3 text-[15px] font-medium text-ink-2 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            open && "text-foreground",
          )}
        >
          {t("browse")}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-ink-3 transition-transform duration-150",
              open && "rotate-180 text-accent",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={10}
        collisionPadding={16}
        className="w-screen max-w-[880px] p-0 rounded-[var(--radius-xl)] border-border-strong"
      >
        <div className="grid grid-cols-12">
          {/* Left rail: format + audience */}
          <aside className="col-span-4 rounded-s-[var(--radius-xl)] bg-surface p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("discoverEyebrow")}
            </p>

            <h4 className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              {t("discover.format")}
            </h4>
            <ul className="mt-2 grid gap-0.5">
              {formats.map((f) => (
                <li key={f.key}>
                  <Link
                    href={f.href as never}
                    onClick={() => setOpen(false)}
                    className="group/item flex items-start gap-3 rounded-[var(--radius-md)] p-2.5 transition-colors hover:bg-background"
                  >
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-background text-accent shadow-e1">
                      <f.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {t(`discover.formatItems.${f.key}.name` as never)}
                      </span>
                      <span className="block text-xs text-ink-3 leading-snug">
                        {t(`discover.formatItems.${f.key}.blurb` as never)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              {t("discover.audience")}
            </h4>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {audiences.map((a) => (
                <li key={a.key}>
                  <Link
                    href={a.href as never}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-ink-2 hover:border-accent hover:text-accent"
                  >
                    {t(`discover.audienceItems.${a.key}.name` as never)}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Subjects grid */}
          <div className="col-span-8 p-5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                {t("discover.subjects")}
              </h4>
              <Link
                href="/categories"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                {t("discover.viewSubjects")}
                <Arrow className="h-3 w-3" />
              </Link>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <li key={cat.key}>
                    <Link
                      href={`/browse?subject=${cat.key}` as never}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 rounded-[var(--radius-md)] p-2.5 transition-colors hover:bg-surface"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-surface text-primary group-hover:bg-background group-hover:shadow-e1">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground">
                          {tCat(`items.${cat.key}.name` as never)}
                        </span>
                        <span className="block text-[11px] text-ink-3 leading-tight truncate">
                          {tCat(`items.${cat.key}.blurb` as never)}
                        </span>
                      </span>
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium tabular text-ink-3 group-hover:bg-background">
                        {cat.teacherCount}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
              <MapPin className="h-4 w-4 text-ink-3" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 me-2">
                {t("discover.city")}
              </span>
              <ul className="flex flex-wrap gap-1">
                {wilayaKeys.slice(1, 7).map((w) => (
                  <li key={w}>
                    <Link
                      href={`/browse?wilaya=${w}` as never}
                      onClick={() => setOpen(false)}
                      className="rounded-full px-2 py-0.5 text-xs text-ink-2 hover:bg-surface hover:text-foreground"
                    >
                      {tWilaya(w as never)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/browse"
                    onClick={() => setOpen(false)}
                    className="rounded-full px-2 py-0.5 text-xs font-medium text-accent hover:underline"
                  >
                    {t("discover.viewCities")} →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
