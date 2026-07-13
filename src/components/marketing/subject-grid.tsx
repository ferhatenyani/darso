import { Link } from "@/i18n/navigation";
import { featuredTeachers } from "@/lib/mock/teachers";

/**
 * Real subject distribution derived from the teacher roster.
 * Only shows subjects that actually have at least one teacher.
 */
function computeSubjects() {
  const map = new Map<string, { name: string; count: number; slug: string }>();
  for (const t of featuredTeachers) {
    const name = t.subject.fr;
    // Normalize into a short slug for the browse URL.
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const cur = map.get(name);
    if (cur) {
      cur.count += 1;
    } else {
      map.set(name, { name, count: 1, slug });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function SubjectGrid() {
  const subjects = computeSubjects();

  return (
    <section aria-labelledby="subj-title" className="border-y border-border bg-primary py-14 md:py-20 lg:py-24">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Matières populaires
          </p>
          <h2 id="subj-title" className="mt-2 text-[26px] font-bold tracking-tight text-primary-foreground md:text-[32px] lg:text-[38px]">
            {subjects.length} matières, {featuredTeachers.length} enseignants
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-primary-foreground/70">
            Chaque matière affiche uniquement le nombre réel d'enseignants disponibles aujourd'hui.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:mt-10 md:grid-cols-4 md:gap-3 lg:grid-cols-5">
          {subjects.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/browse?q=${encodeURIComponent(s.name)}` as never}
                className="group flex h-full flex-col justify-between rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-accent hover:bg-white/[0.06] focus-visible:outline-none focus-visible:shadow-focus"
              >
                <span className="text-[13.5px] font-semibold text-primary-foreground line-clamp-2">
                  {s.name}
                </span>
                <span className="mt-3 flex items-center justify-between text-[11px] text-primary-foreground/60">
                  <span className="tabular">
                    {s.count} enseignant{s.count > 1 ? "·es" : ""}
                  </span>
                  <span className="text-accent transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
