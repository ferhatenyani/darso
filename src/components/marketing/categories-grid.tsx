import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { categories } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";

export function CategoriesGrid() {
  const t = useTranslations("home.categories");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

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

          {/* Uniform tile grid (no bento spans). Hierarchy is carried by the
              heading column + numbered indices, not by tile size variation. */}
          <div className="grid gap-2 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.key}
                href={`/browse?subject=${cat.key}` as never}
                className="group relative flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-colors hover:border-accent/40"
              >
                <span className="absolute end-3 top-3 font-mono text-[10px] tabular text-ink-3">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-surface text-primary transition-colors group-hover:bg-accent-soft group-hover:text-accent">
                  <cat.icon className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-[15px] font-semibold text-foreground">
                    {t(`items.${cat.key}.name` as never)}
                  </h4>
                  <p className="mt-0.5 text-xs text-ink-3 line-clamp-2">
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
