import { Search, MessageSquare, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Search,
    title: "Cherchez ou publiez",
    body: "Parcourez les enseignants et cours, ou publiez votre demande — les enseignants viendront à vous.",
  },
  {
    num: "02",
    icon: MessageSquare,
    title: "Comparez et discutez",
    body: "Consultez les profils, comparez les tarifs, échangez avant de vous engager.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Réservez, payez, apprenez",
    body: "Paiement sécurisé, retenu jusqu'à la fin du cours. Changez de professeur si nécessaire.",
  },
];

export function HowItWorksV2() {
  return (
    <section aria-labelledby="how-title" className="border-y border-border bg-surface py-14 md:py-20 lg:py-24">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Comment ça marche
          </p>
          <h2 id="how-title" className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]">
            Trois étapes claires, aucune surprise
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
            Pas de forfait piégé, pas d'engagement caché. Vous ne payez que ce que vous décidez de suivre.
          </p>
        </div>

        {/* Mobile: vertical stepper with connecting rule. md+: 3-col grid. */}
        <div className="relative mt-10 md:mt-14">
          {/* Vertical connecting line on mobile only */}
          <div
            aria-hidden
            className="absolute inset-y-6 start-6 -z-10 w-px bg-border md:hidden"
          />
          <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
            {STEPS.map((s) => (
              <li key={s.num} className="relative rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-primary text-primary-foreground"
                  >
                    <span className="text-[15px] font-bold tabular">{s.num}</span>
                  </span>
                  <s.icon className="h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mt-5 text-[17px] font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
