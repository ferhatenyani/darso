"use client";

import { Quote } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { IllustrationSlot } from "./illustration-slot";

const VALUES = [
  {
    title: "Zéro intermédiaire.",
    body: "Ce que l'élève paie, c'est ce que le prof reçoit, moins une commission qu'on assume et qui commence à zéro.",
  },
  {
    title: "Zéro barrière à l'entrée.",
    body: "Pas de diplôme requis pour enseigner. Un savoir, un profil clair, quelques élèves — et c'est parti.",
  },
  {
    title: "Zéro publicité déguisée.",
    body: "Personne ne paie pour remonter dans les résultats. Vous voyez les meilleurs, pas les mieux placés.",
  },
];

export function TeamManifesto() {
  return (
    <section
      aria-labelledby="manifesto-title"
      className="relative isolate px-3 pt-8 sm:px-4 sm:pt-12 md:pt-16"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <article className="relative overflow-hidden rounded-[2rem] bg-ink px-5 py-9 text-white shadow-[0_30px_60px_-40px_rgba(10,11,14,0.55)] sm:rounded-[2.5rem] sm:px-8 sm:py-14 md:rounded-[3.5rem] md:px-14 md:py-20 lg:px-20">
            {/* Subtle grid backdrop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.06]"
            />
            {/* Warm corner light */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#F0A014]/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -bottom-24 -z-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
            />

            <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-14 lg:gap-20">
              {/* Quote column */}
              <div className="md:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-[#F0A014]"
                  />
                  Un mot de l'équipe
                </span>

                {/* Big quote */}
                <div className="relative mt-6">
                  <Quote
                    aria-hidden
                    className="absolute -left-2 -top-3 h-8 w-8 text-[#F0A014]/70 sm:-left-3 sm:-top-4 sm:h-10 sm:w-10"
                    strokeWidth={1.6}
                  />
                  <h2
                    id="manifesto-title"
                    style={{
                      fontFamily:
                        "var(--font-cabinet), system-ui, sans-serif",
                    }}
                    className="pl-6 text-[26px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white text-balance sm:pl-8 sm:text-[34px] md:text-[42px] lg:text-[48px]"
                  >
                    On a connu des profs qui ont tout changé.
                    <br className="hidden sm:block" /> Et un système qui les a
                    faits partir.
                    <br className="hidden sm:block" />{" "}
                    <span className="text-[#F0A014]">
                      Darso, c'est notre réponse.
                    </span>
                  </h2>
                </div>

                <p className="mt-6 max-w-lg pl-6 text-[14.5px] leading-relaxed text-white/80 sm:pl-8 sm:text-[15.5px]">
                  Un lieu où le savoir circule sans intermédiaire, où le prof
                  fixe son tarif, où l'élève choisit vraiment ce qu'il vient
                  chercher.
                </p>

                {/* Signature line */}
                <div className="mt-8 flex items-center gap-4 pl-6 sm:pl-8">
                  {/* Avatar cluster placeholder */}
                  <div className="flex -space-x-2">
                    {["Y", "S", "A"].map((initial, i) => (
                      <span
                        key={i}
                        aria-hidden
                        className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-white/10 text-[12px] font-bold text-white backdrop-blur-sm"
                        style={{
                          background:
                            i === 0
                              ? "linear-gradient(135deg,#F0A014,#7A4E00)"
                              : i === 1
                                ? "linear-gradient(135deg,#2F6FEB,#1E58C7)"
                                : "linear-gradient(135deg,#2E8B6B,#1A5C46)",
                        }}
                      >
                        {initial}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily:
                          "var(--font-cabinet), system-ui, sans-serif",
                      }}
                      className="text-[14px] font-bold text-white sm:text-[15px]"
                    >
                      L'équipe darso
                    </p>
                    <p className="text-[11.5px] text-white/60">
                      Alger, pour toute l'Algérie
                    </p>
                  </div>
                </div>
              </div>

              {/* Values column — desktop */}
              <div className="md:col-span-5">
                <Reveal delay={140} direction="scale">
                  <IllustrationSlot
                    label="Portrait éditorial de l'équipe darso au studio d'Alger."
                    caption="Séquence de portraits · 4 s"
                    aspect="aspect-[4/5] sm:aspect-square"
                    accent="cream"
                    wireframe="avatar"
                    className="border-white/30 bg-white/[0.04]"
                  />
                </Reveal>
              </div>
            </div>

            {/* Values strip */}
            <ul className="mt-10 grid gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:mt-14 sm:grid-cols-3 sm:gap-x-8 sm:pt-10">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={120 + i * 90} direction="up">
                  <li className="flex flex-col gap-2 sm:border-l sm:border-white/10 sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
                    <h3
                      style={{
                        fontFamily:
                          "var(--font-cabinet), system-ui, sans-serif",
                      }}
                      className="text-[18px] font-bold tracking-tight text-[#F0A014] sm:text-[20px]"
                    >
                      {v.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-white/80 sm:text-[13.5px]">
                      {v.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
