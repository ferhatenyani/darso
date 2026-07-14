"use client";

import { Link } from "@/i18n/navigation";
import { Reveal, Stagger } from "@/components/ui/reveal";
import { featuredTeachers } from "@/lib/mock/teachers";

function computeSubjects() {
  const map = new Map<string, { name: string; count: number; slug: string }>();
  for (const t of featuredTeachers) {
    const name = t.subject.fr;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const cur = map.get(name);
    if (cur) cur.count += 1;
    else map.set(name, { name, count: 1, slug });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function SubjectGrid() {
  const subjects = computeSubjects();
  const total = featuredTeachers.length;

  return (
    <section
      aria-labelledby="subj-title"
      className="relative isolate overflow-hidden border-y border-border bg-primary py-14 text-primary-foreground md:py-20 lg:py-24"
    >
      {/* Subtle background layer */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.05]" />
      <div
        aria-hidden
        className="absolute -end-40 bottom-0 -z-10 h-80 w-80 rounded-full bg-accent/12 blur-[110px]"
      />

      <div className="container-wide">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Matières populaires
            </p>
            <h2
              id="subj-title"
              className="mt-2 text-[26px] font-bold tracking-tight text-primary-foreground md:text-[32px] lg:text-[38px]"
            >
              <span className="tabular text-accent">{subjects.length}</span>{" "}
              matières,{" "}
              <span className="tabular text-accent">{total}</span>{" "}
              enseignants
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-primary-foreground/75">
              Chaque matière affiche uniquement le nombre réel d'enseignants disponibles aujourd'hui.
            </p>
          </div>
        </Reveal>

        <Stagger
          as="ul"
          step={45}
          initialDelay={100}
          className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:mt-12 md:grid-cols-4 md:gap-3 lg:grid-cols-5"
        >
          {subjects.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/browse?q=${encodeURIComponent(s.name)}` as never}
                className="group flex h-full flex-col justify-between rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-[2px] hover:border-accent/60 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:shadow-focus"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13.5px] font-semibold text-primary-foreground line-clamp-2">
                    {s.name}
                  </span>
                  <span
                    aria-hidden
                    className="tabular text-[10px] font-semibold text-primary-foreground/40"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-3 flex items-center justify-between text-[11px] text-primary-foreground/70">
                  <span className="tabular">
                    {s.count} enseignant{s.count > 1 ? "·es" : ""}
                  </span>
                  <span
                    aria-hidden
                    className="text-accent transition-transform duration-300 group-hover:translate-x-1 rtl-flip"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
