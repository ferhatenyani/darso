import { Link } from "@/i18n/navigation";
import { categories, type CategoryKey } from "@/lib/mock/categories";
import { ArrowUpRight } from "lucide-react";

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
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Catégories
            </p>
            <h2 id="cat-title" className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]">
              Apprenez ce qui vous fait envie
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
              Du soutien scolaire à la programmation, en passant par la musique et les langues.
            </p>
          </div>
          <Link
            href={"/categories" as never}
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-accent hover:underline"
          >
            Voir toutes les catégories
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        {/* Mobile: horizontal snap carousel. md+: grid. */}
        <div className="mt-8 md:hidden">
          <div className="snap-x-carousel gap-3 -mx-4 px-4">
            {categories.map((cat) => (
              <CategoryTile key={cat.key} cat={cat} className="w-[68vw] max-w-[280px]" />
            ))}
          </div>
        </div>
        <div className="mt-8 hidden md:grid md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">
          {categories.map((cat) => (
            <CategoryTile key={cat.key} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({
  cat,
  className,
}: {
  cat: (typeof categories)[number];
  className?: string;
}) {
  const label = CATEGORY_LABEL[cat.key];
  const Icon = cat.icon;
  const hasReal = cat.teacherCount > 0;

  return (
    <Link
      href={`/browse?category=${cat.key}` as never}
      className={
        "group card-interactive relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1 focus-visible:outline-none " +
        (className ?? "")
      }
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
      <h3 className="mt-4 text-[15.5px] font-semibold text-foreground">{label.name}</h3>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-3">{label.blurb}</p>
      <div className="mt-4 flex items-center gap-2">
        {hasReal ? (
          <span className="text-[12px] font-medium text-ink-2 tabular">
            {cat.teacherCount} enseignant·es
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
            Nouveau
          </span>
        )}
      </div>
    </Link>
  );
}
