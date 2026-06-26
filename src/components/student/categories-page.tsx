"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { categories } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";

export function CategoriesPage() {
  const t = useTranslations("student.categories");
  const tCats = useTranslations("home.categories.items");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <>
      <section className="relative isolate border-b border-border bg-background">
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid-sm opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_80%)]" />
        <div className="container-narrow py-12 md:py-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">{t("title")}</p>
          <h1 className="mt-3 text-[40px] font-bold tracking-tight text-foreground md:text-[52px]">
            <span className="block">{t("title")}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>
        </div>
      </section>

      <section className="bg-surface/30">
        <div className="container-narrow py-12">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <li key={c.key}>
                  <Link
                    href={`/browse?subject=${c.key}` as never}
                    className={cn(
                      "group relative grid h-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-all",
                      "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-e2",
                    )}
                  >
                    <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br opacity-100", c.accent)} />
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-background text-foreground shadow-e1">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-12">
                      <h3 className="text-[18px] font-semibold tracking-tight text-foreground">
                        {tCats(`${c.key}.name` as never)}
                      </h3>
                      <p className="mt-1 text-[12.5px] leading-snug text-ink-2">
                        {tCats(`${c.key}.blurb` as never)}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-3 text-[11.5px] text-ink-3">
                      <span>{t("teacherCountLabel", { count: c.teacherCount })}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-accent">
                        {t("openCategory")}
                        <Arrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
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
