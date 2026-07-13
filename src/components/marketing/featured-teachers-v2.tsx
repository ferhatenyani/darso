import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { TeacherCard } from "@/components/marketing/teacher-card";
import { featuredTeachers } from "@/lib/mock/teachers";
import { routes } from "@/lib/routes";

export function FeaturedTeachersV2() {
  // Real data: pick top-rated first, then verified, cap at 8.
  const teachers = [...featuredTeachers]
    .sort((a, b) => {
      const scoreA = (a.topRated ? 2 : 0) + (a.idVerified ? 1 : 0) + a.rating / 10;
      const scoreB = (b.topRated ? 2 : 0) + (b.idVerified ? 1 : 0) + b.rating / 10;
      return scoreB - scoreA;
    })
    .slice(0, 8);

  const hasTeachers = teachers.length > 0;

  return (
    <section aria-labelledby="feat-title" className="py-14 md:py-20 lg:py-24">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Enseignants recommandés
            </p>
            <h2 id="feat-title" className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]">
              Des enseignants vérifiés, des retours réels
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
              Identité, diplômes, disponibilité — chaque profil affiche uniquement ce qui est vérifiable.
            </p>
          </div>
          <Link
            href={routes.teachers()}
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-accent hover:underline"
          >
            Tous les enseignants
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        {hasTeachers ? (
          <>
            {/* Mobile: horizontal snap carousel */}
            <div className="mt-8 sm:hidden">
              <div className="snap-x-carousel gap-3 -mx-4 px-4">
                {teachers.map((t) => (
                  <TeacherCard key={t.id} teacher={t} className="w-[78vw] max-w-[320px]" />
                ))}
              </div>
            </div>
            {/* Tablet+: responsive grid */}
            <div className="mt-8 hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {teachers.map((t) => (
                <TeacherCard key={t.id} teacher={t} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-[var(--radius-lg)] border border-dashed border-border bg-card p-10 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              Bientôt sur darso
            </p>
            <h3 className="mt-3 text-[20px] font-semibold text-foreground">
              Vous voulez être parmi nos premiers enseignants ?
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
              La plateforme démarre. Les premiers profils bénéficient d'une visibilité privilégiée.
            </p>
            <Link
              href={routes.teachLanding()}
              className="mt-5 inline-flex h-11 items-center rounded-[var(--radius-xs)] bg-primary px-5 text-[14px] font-semibold text-primary-foreground hover:bg-primary-dark"
            >
              Devenir enseignant
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
