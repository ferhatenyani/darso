import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { categories } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";

export function CategoriesGrid() {
  const t = useTranslations("home.categories");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  // Hero category (first in the list) gets the editorial treatment; rest fits a tight grid
  const [hero, ...rest] = categories;

  return (
    <section className="border-b border-border">
      <div className="container-narrow py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Heading column with editorial vertical typography */}
          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              [{String(categories.length).padStart(2, "0")}]
            </p>
            <h2 className="mt-3 text-[34px] font-bold leading-[0.98] tracking-tight text-foreground md:text-[42px]">
              {t("title").split(" ").map((word, i, arr) => (
                <span key={i} className={cn("block", i === arr.length - 1 && "italic font-light text-ink-2")}>
                  {word}
                </span>
              ))}
            </h2>
            <p className="mt-4 text-sm text-ink-2 leading-relaxed">
              {t("subtitle")}
            </p>
            <Link
              href="/categories"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              {t("viewAll")}
              <Arrow className="h-4 w-4" />
            </Link>
          </div>

          {/* Asymmetric grid */}
          <div className="grid gap-2 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-6">
            {/* Big hero category — spans 4 cols × 2 rows on lg */}
            <Link
              href={`/browse?subject=${hero!.key}` as never}
              className="group relative col-span-full sm:col-span-2 sm:row-span-2 lg:col-span-4 lg:row-span-2 flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card p-6 transition-shadow hover:shadow-e2"
            >
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-grid opacity-50"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -end-6 -bottom-10 -z-10 text-[180px] font-black leading-none tracking-[-0.05em] text-primary/[0.04]"
              >
                01
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-primary text-primary-foreground shadow-e1">
                  <hero.icon className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                  {t("countLabel", { count: hero!.teacherCount })}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground md:text-3xl">
                  {t(`items.${hero!.key}.name` as never)}
                </h3>
                <p className="mt-2 max-w-md text-sm text-ink-2">
                  {t(`items.${hero!.key}.blurb` as never)}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  {t("viewAll")}
                  <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </div>
              </div>
            </Link>

            {/* Smaller categories */}
            {rest.map((cat, i) => (
              <Link
                key={cat.key}
                href={`/browse?subject=${cat.key}` as never}
                className="group relative flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-colors hover:border-accent/40"
              >
                <span className="absolute end-3 top-3 text-[10px] font-semibold tabular text-ink-3">
                  [{String(i + 2).padStart(2, "0")}]
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-surface text-primary transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                  <cat.icon className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-[15px] font-semibold text-foreground">
                    {t(`items.${cat.key}.name` as never)}
                  </h4>
                  <p className="mt-0.5 text-xs text-ink-3 line-clamp-1">
                    {t(`items.${cat.key}.blurb` as never)}
                  </p>
                </div>
                <p className="mt-auto text-[11px] font-medium text-ink-3">
                  <span className="tabular">{cat.teacherCount}</span> · {t("countLabel", { count: cat.teacherCount }).split(" ").slice(1).join(" ")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
