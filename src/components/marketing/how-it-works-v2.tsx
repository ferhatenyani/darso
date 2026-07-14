"use client";

import { Search, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    num: "01",
    icon: Search,
    title: "Cherchez ou publiez",
    body: "Parcourez les enseignants et cours, ou publiez votre demande — les enseignants viendront à vous.",
    kicker: "Étape 1",
  },
  {
    num: "02",
    icon: MessageSquare,
    title: "Comparez et discutez",
    body: "Consultez les profils, comparez les tarifs, échangez avant de vous engager.",
    kicker: "Étape 2",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Réservez, payez, apprenez",
    body: "Paiement sécurisé, retenu jusqu'à la fin du cours. Changez de professeur si nécessaire.",
    kicker: "Étape 3",
  },
];

export function HowItWorksV2() {
  return (
    <section
      aria-labelledby="how-title"
      className="border-y border-border bg-surface py-14 md:py-20 lg:py-24"
    >
      <div className="container-wide">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Comment ça marche
            </p>
            <h2
              id="how-title"
              className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]"
            >
              Trois étapes claires, aucune surprise
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
              Pas de forfait piégé, pas d'engagement caché. Vous ne payez que ce que vous décidez de suivre.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-12 md:mt-16">
          {/* Horizontal connecting rule on md+ that grows on reveal */}
          <Reveal
            direction="fade"
            duration={1100}
            delay={200}
            className="pointer-events-none absolute inset-x-8 top-6 hidden md:block"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border-strong to-transparent" />
          </Reveal>

          <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={80 + i * 110}>
                <li className="group relative flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1 transition-all duration-500 hover:-translate-y-1 hover:shadow-e2">
                  {/* Step marker */}
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="relative grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-primary text-primary-foreground shadow-e1"
                    >
                      <span className="text-[15px] font-bold tabular">{s.num}</span>
                      <span
                        aria-hidden
                        className="absolute -inset-1 rounded-[calc(var(--radius-md)+4px)] border border-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-border bg-background text-accent transition-colors group-hover:border-accent">
                      <s.icon className="h-4.5 w-4.5" strokeWidth={1.75} aria-hidden />
                    </span>
                  </div>

                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                    {s.kicker}
                  </p>
                  <h3 className="mt-1 text-[18px] font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{s.body}</p>

                  {/* Arrow that only appears on the last step, faint hover promote */}
                  {i === STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      Vous êtes prêt·e
                      <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                    </span>
                  ) : (
                    <span aria-hidden className="mt-6 h-[18px]" />
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
