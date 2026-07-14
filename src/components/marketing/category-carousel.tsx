"use client";

import { Link } from "@/i18n/navigation";
import { categories, type CategoryKey } from "@/lib/mock/categories";
import { ArrowUpRight } from "lucide-react";
import { MarketingCarousel } from "@/components/ui/marketing-carousel";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<CategoryKey, { name: string; blurb: string }> = {
  school: { name: "Soutien scolaire", blurb: "Primaire · CEM · Lycée · Bac" },
  languages: { name: "Langues", blurb: "Anglais · Français · Arabe" },
  code: { name: "Programmation", blurb: "Web · Mobile · Data · IA" },
  design: { name: "Design & créa", blurb: "Graphisme · UI/UX · Motion" },
  business: { name: "Business & carrière", blurb: "Marketing · Finance · Soft skills" },
  music: { name: "Musique", blurb: "Piano · Guitare · Oud · Chant" },
  religion: { name: "Sciences religieuses", blurb: "Coran · Tajwid · Fiqh" },
  exams: { name: "Examens & concours", blurb: "Bac · IELTS · TOEFL · ENS" },
};

export function CategoryCarousel() {
  return (
    <section aria-labelledby="cat-title" className="py-14 md:py-20 lg:py-24">
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Catégories
              </p>
              <h2
                id="cat-title"
                className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]"
              >
                Apprenez ce qui vous fait envie
              </h2>
              <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
                Du soutien scolaire à la programmation, en passant par la musique et les langues.
              </p>
            </div>
            <Link
              href={"/categories" as never}
              className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent"
            >
              <span className="accent-underline">Voir toutes les catégories</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-8 md:mt-10">
          <MarketingCarousel
            items={categories}
            keyFor={(c) => c.key}
            ariaLabel="Catégories populaires"
            slideClassName="w-[68vw] max-w-[280px] sm:w-[44vw] sm:max-w-[280px] md:w-[calc((100%-3rem)/3)] md:max-w-none lg:w-[calc((100%-4.5rem)/4)]"
            gap="gap-4"
            renderItem={(cat, i) => <CategoryTile cat={cat} index={i} />}
          />
        </Reveal>
      </div>
    </section>
  );
}

function CategoryTile({
  cat,
  index,
}: {
  cat: (typeof categories)[number];
  index: number;
}) {
  const label = CATEGORY_LABEL[cat.key];
  const Icon = cat.icon;
  const hasReal = cat.teacherCount > 0;

  return (
    <Link
      href={`/browse?category=${cat.key}` as never}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1 focus-visible:outline-none",
        "transition-[transform,box-shadow,border-color] duration-300",
        "hover:-translate-y-[3px] hover:border-border-strong hover:shadow-e2",
        "focus-visible:shadow-focus",
      )}
    >
      {/* Faint accent bar reveals on hover — no gradient, just a decisive rule */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-5 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-accent",
          "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100",
        )}
      />
      <div className="flex items-start justify-between">
        <span
          aria-hidden
          className={cn(
            "grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-surface text-primary",
            "transition-all duration-300 group-hover:bg-accent-soft group-hover:text-accent group-hover:rotate-[-4deg]",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <span
          aria-hidden
          className="tabular text-[10px] font-semibold text-ink-3"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-4 text-[15.5px] font-semibold text-foreground">{label.name}</h3>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-3">{label.blurb}</p>
      <div className="mt-auto pt-4 flex items-center justify-between">
        {hasReal ? (
          <span className="text-[12px] font-medium text-ink-2 tabular">
            {cat.teacherCount} enseignant·es
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
            Nouveau
          </span>
        )}
        <ArrowUpRight
          className="h-4 w-4 text-ink-3 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}
