"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { categories } from "@/lib/mock/categories";
import { featuredTeachers } from "@/lib/mock/teachers";

/**
 * Full categories directory. Mirrors the homepage CategoryCarousel visual
 * language — flat card, hairline border, real teacher counts only, "Nouveau"
 * chip when 0. Deliberately drops the previous overlay-gradient tile so
 * cards feel consistent with the design system's flat + hairline surfaces.
 */
export function CategoriesPage() {
  const t = useTranslations("student.categories");
  const tCats = useTranslations("home.categories.items");
  const locale = useLocale();

  // Derive a real teacher count per category from the roster. Falls back to
  // the mock `teacherCount` (kept for legacy stats) but only surfaces the
  // count as "real" when we have an actual roster match — keeps the page
  // honest per MASTER.md rule "no fake stats".
  const rosterCount = (key: string): number => {
    const label = tCats(`${key}.name` as never).toLowerCase();
    return featuredTeachers.filter((tc) =>
      tc.subject.fr.toLowerCase().includes(label) ||
      tc.subject.fr.toLowerCase().split(" ").some((w) => label.includes(w)),
    ).length;
  };

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
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl text-[32px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[40px] md:text-[48px]">
            {t("title")}{" "}
            <span className="font-light italic text-ink-2">{t("titleAccent")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>
        </div>
      </section>

      {/* ========== GRID ========== */}
      <section className="bg-surface/40">
        <div className="container-standard py-8 md:py-12">
          <ul
            className={locale === "ar"
              // Keep RTL-friendly gap (no direction-sensitive tricks needed here).
              ? "grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4"
              : "grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4"}
          >
            {categories.map((c) => {
              const Icon = c.icon;
              const real = rosterCount(c.key);
              const hasReal = real > 0;
              return (
                <li key={c.key}>
                  <Link
                    href={`/browse?subject=${c.key}` as never}
                    className="group card-interactive flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1 focus-visible:outline-none"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        aria-hidden
                        className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-surface text-primary transition-colors group-hover:bg-accent-soft group-hover:text-accent"
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    </div>
                    <h3 className="mt-4 text-[16px] font-semibold text-foreground">
                      {tCats(`${c.key}.name` as never)}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink-3">
                      {tCats(`${c.key}.blurb` as never)}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-[12px]">
                      {hasReal ? (
                        <span className="tabular text-ink-2">
                          {t("teacherCountLabel", { count: real })}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                          {t("newChip")}
                        </span>
                      )}
                      <span className="text-[12.5px] font-medium text-accent transition-colors group-hover:underline">
                        {t("openCategory")}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
