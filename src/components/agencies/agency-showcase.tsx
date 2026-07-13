import {
  ArrowRight,
  Users,
  Sparkles,
  Star,
  MapPin,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { AgencyMember, agency as agencyType } from "@/lib/mock/agency";
import type { Teacher } from "@/lib/mock/teachers";
import { cn } from "@/lib/utils";

// Public agency page. Layout leans editorial: masthead with a big lockup,
// mission narrative, roster grid linking to individual teacher profiles,
// reviews aggregate, and a CTA that funnels prospects into either "invite
// a teacher" (from a specific card) or "post an open request tagged for
// the agency." Both paths converge on the same booking flow — the agency
// itself is never the counterparty.

type Agency = typeof agencyType;

type Props = {
  agency: Agency;
  members: AgencyMember[];
  teachers: Teacher[];
};

export function AgencyShowcase({ agency, members, teachers }: Props) {
  const avgRating = teachers.length
    ? Math.round((teachers.reduce((s, t) => s + t.rating, 0) / teachers.length) * 10) / 10
    : null;
  const totalReviews = teachers.reduce((s, t) => s + t.reviews, 0);
  const totalLessons = teachers.reduce((s, t) => s + t.lessons, 0);

  return (
    <>
      {/* MASTHEAD */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_15%,black,transparent_80%)]"
        />
        <p
          aria-hidden
          className="pointer-events-none absolute -top-10 end-6 -z-10 select-none text-[140px] font-black leading-none tracking-tighter text-foreground/[0.04] md:text-[220px]"
        >
          {agency.name.fr.split(" ").pop()}
        </p>

        <div className="container-narrow pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="ink-rule" aria-hidden />
            Agence darso
          </div>
          <h1 className="mt-5 max-w-4xl text-balance text-[36px] font-bold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[48px] md:text-[64px] lg:text-[76px]">
            {agency.name.fr}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-[15.5px] leading-relaxed text-ink-2 md:text-[17px]">
            {agency.bio.fr}
          </p>

          {/* Editorial facts strip */}
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6 sm:grid-cols-4">
            <Fact label="Fondée" value={`${agency.joinedMonthsAgo} mois`} />
            <Fact label="Professeurs" value={String(agency.memberCount)} />
            {avgRating !== null && (
              <Fact
                label="Note moyenne"
                value={
                  <span className="inline-flex items-baseline gap-1">
                    <span>{avgRating.toFixed(1)}</span>
                    <Star className="h-[14px] w-[14px] fill-warning text-warning" aria-hidden />
                  </span>
                }
              />
            )}
            <Fact
              label="Sessions"
              value={new Intl.NumberFormat("fr-DZ").format(totalLessons)}
            />
          </dl>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-b border-border bg-background">
        <div className="container-narrow grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              Notre approche
            </p>
            <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
              Un collectif, pas une agence de placement.
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-pretty text-[16px] leading-[1.7] text-ink-2 md:text-[18px]">
              {agency.name.fr} regroupe des professeurs qui partagent des méthodes de préparation, échangent leurs élèves quand le sujet dépasse leur spécialité, et se relaient pendant les périodes de forte demande (bac, IELTS, rentrée). Vous réservez toujours avec un professeur individuel — l'agence est simplement le tissu qui rend l'expérience plus fluide.
            </p>
          </div>
        </div>
      </section>

      {/* ROSTER */}
      <section className="border-b border-border bg-background">
        <div className="container-narrow py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                L'équipe
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                Les professeurs de l'agence
              </h2>
            </div>
            <Button asChild variant="ghost">
              <Link href="/teachers">
                Explorer tous les professeurs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {teachers.length > 0 ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teachers.map((t) => (
                <li key={t.id}>
                  <TeacherCard teacher={t} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m) => (
                <li key={m.id}>
                  <MemberCardFallback member={m} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* REVIEWS aggregate */}
      {avgRating !== null && (
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-20">
            <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8 text-center shadow-e1 lg:min-w-[240px]">
                <p className="text-[64px] font-bold leading-none tabular tracking-tighter text-foreground">
                  {avgRating.toFixed(1)}
                </p>
                <div className="mt-3 inline-flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i <= Math.round(avgRating)
                          ? "fill-warning text-warning"
                          : "text-ink-3",
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="mt-3 text-[13px] text-ink-2">
                  {new Intl.NumberFormat("fr-DZ").format(totalReviews)} avis vérifiés
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  Ce que disent les élèves
                </p>
                <h2 className="mt-3 text-balance text-[26px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[36px]">
                  Une réputation portée par les résultats.
                </h2>
                <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-2">
                  Chaque avis provient d'un élève ayant terminé au moins une session. Les avis apparaissent après une double validation (élève et professeur) ou sous 14 jours, quelle que soit la note.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="ghost">
                    <Link href="/teachers">
                      Voir les fiches complètes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-background">
        <div className="container-narrow py-16 md:py-24">
          <div className="rounded-[var(--radius-xl)] border border-border bg-primary p-8 text-primary-foreground md:p-14">
            <div className="grid gap-6 md:grid-cols-[1.6fr_auto] md:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
                  Commencer avec {agency.name.fr}
                </p>
                <h2 className="mt-3 max-w-xl text-balance text-[28px] font-semibold leading-[1.1] tracking-tight md:text-[40px]">
                  Un objectif précis ? Décrivez-le, ils vous répondent.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] text-primary-foreground/80 md:text-[16px]">
                  Publiez une demande et l'un des professeurs de l'agence vous fera une proposition sous 72 h.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg">
                  <Link href="/requests/new">
                    Publier une demande
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="border border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/teachers">Parcourir les professeurs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
        {label}
      </dt>
      <dd className="mt-1 text-[18px] font-semibold tabular tracking-tight text-foreground md:text-[20px]">
        {value}
      </dd>
    </div>
  );
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Link
      href={`/teachers/${teacher.slug}` as never}
      className="group flex h-full flex-col justify-between rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-shadow hover:shadow-e2"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-background">
          <AvatarFallback
            className={cn(
              "bg-gradient-to-br text-sm font-semibold text-white",
              teacher.accent,
            )}
          >
            {teacher.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold tracking-tight text-foreground">
            {teacher.name.fr}
          </p>
          <p className="truncate text-[12.5px] text-ink-3">{teacher.subject.fr}</p>
        </div>
        {teacher.topRated && (
          <Sparkles className="ms-auto h-4 w-4 shrink-0 text-warning" aria-hidden />
        )}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-[12.5px]">
        <div>
          <dt className="text-ink-3">Note</dt>
          <dd className="mt-0.5 inline-flex items-center gap-1 font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden />
            {teacher.rating.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt className="text-ink-3">Ville</dt>
          <dd className="mt-0.5 inline-flex items-center gap-1 font-medium text-foreground">
            <MapPin className="h-3 w-3 text-ink-3" aria-hidden />
            {teacher.city.fr}
          </dd>
        </div>
      </dl>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[12px] text-ink-2">
        <span className="inline-flex items-center gap-1">
          {teacher.idVerified && <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden />}
          {teacher.tier === "top-rated" ? "Top" : teacher.tier === "verified" ? "Vérifié" : "En vue"}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:text-accent">
          Voir la fiche
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function MemberCardFallback({ member }: { member: AgencyMember }) {
  // Fallback rendering when no matching Teacher row exists. Displays the
  // roster row without linking off to a profile.
  return (
    <div className="flex h-full items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <Avatar className="h-12 w-12 ring-2 ring-background">
        <AvatarFallback
          className={cn(
            "bg-gradient-to-br text-sm font-semibold text-white",
            member.accent,
          )}
        >
          {member.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold tracking-tight text-foreground">
          {member.name.fr}
        </p>
        <p className="truncate text-[12.5px] text-ink-3">{member.subject.fr}</p>
      </div>
      {member.topRated && (
        <Sparkles className="ms-auto h-4 w-4 shrink-0 text-warning" aria-hidden />
      )}
    </div>
  );
}
