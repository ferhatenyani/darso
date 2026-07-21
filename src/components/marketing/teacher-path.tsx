"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  ChartBar,
  Wallet,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { Reveal } from "@/components/ui/reveal";
import { IllustrationSlot } from "./illustration-slot";

const PILLARS = [
  {
    icon: Wallet,
    title: "Vous fixez le prix.",
    body: "Aucun barème imposé. Vos tarifs suivent votre réputation, pas la nôtre.",
  },
  {
    icon: CalendarClock,
    title: "Vous choisissez l'agenda.",
    body: "Deux créneaux par semaine ou trente. Pause d'été. Vacances. On s'adapte.",
  },
  {
    icon: BadgeCheck,
    title: "On garantit le paiement.",
    body: "Les fonds sont bloqués avant la séance et vous arrivent sous 48 h.",
  },
  {
    icon: ChartBar,
    title: "On gère l'ennuyeux.",
    body: "Facturation, réservations, relances, litiges — vous ne touchez plus jamais un Excel.",
  },
];

export function TeacherPath() {
  return (
    <section
      aria-labelledby="teacher-path-title"
      className="relative isolate px-3 pt-8 sm:px-4 sm:pt-12 md:pt-16"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <article className="relative overflow-hidden rounded-[2rem] bg-[#FEF7E5] px-5 py-8 shadow-[0_30px_60px_-40px_rgba(240,160,20,0.22),0_8px_20px_-12px_rgba(10,11,14,0.06)] sm:rounded-[2.5rem] sm:px-8 sm:py-12 md:rounded-[3.5rem] md:px-14 md:py-16 lg:px-20 lg:py-20">
            {/* Warm corner glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#F0A014]/[0.14] blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 bottom-0 -z-10 h-56 w-56 rounded-full bg-[#F0A014]/[0.08] blur-3xl"
            />

            <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-14 lg:gap-20">
              {/* Illustration column — sits AFTER text on mobile, BEFORE on md+ */}
              <div className="relative order-2 md:order-1 md:col-span-6">
                <Reveal delay={120} direction="scale">
                  <IllustrationSlot
                    label="Tableau de bord enseignant, réservations et virement bancaire."
                    caption="Bureau + mobile · 3 scènes enchaînées"
                    aspect="aspect-[5/6] sm:aspect-square"
                    accent="amber"
                    wireframe="mixed"
                  />
                </Reveal>

                {/* Small orbiting badge — "Payé sous 48h" */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-3 rotate-[-6deg] sm:-right-4 sm:-top-4 md:right-4 md:top-4"
                >
                  <div className="rounded-full border border-ink/10 bg-white px-3 py-1.5 shadow-[0_10px_28px_-14px_rgba(10,11,14,0.25)]">
                    <span
                      style={{
                        fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                      }}
                      className="text-[11px] font-bold tracking-tight text-ink sm:text-[12px]"
                    >
                      Payé sous <span className="tabular">48 h</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Text column */}
              <div className="order-1 md:order-2 md:col-span-6">
                <Eyebrow>Pour les enseignants</Eyebrow>

                <h2
                  id="teacher-path-title"
                  style={{
                    fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                  }}
                  className="mt-4 text-[34px] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance sm:text-[42px] md:text-[52px] lg:text-[64px]"
                >
                  Enseignez.
                  <br />
                  Encaissez.
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10">Recommencez.</span>
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-1 -z-0 h-[10px] origin-left bg-[#F0A014]/40 md:h-[14px]"
                    />
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-2 sm:text-[17px]">
                  Votre expertise a une vraie valeur. Darso vous donne la scène,
                  les outils et l'audience — sans jamais s'interposer entre vous
                  et vos élèves.
                </p>

                {/* Pillar grid — 1 col mobile, 2 cols md+ */}
                <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
                  {PILLARS.map((p, i) => (
                    <Reveal key={p.title} delay={80 + i * 90} direction="up">
                      <li className="group relative flex h-full flex-col gap-2 rounded-2xl border border-ink/8 bg-white/85 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F0A014]/40 hover:shadow-[0_16px_32px_-20px_rgba(240,160,20,0.5)] sm:p-5">
                        <span
                          aria-hidden
                          className="grid h-9 w-9 place-items-center rounded-xl bg-[#FEF7E5] text-[#7A4E00] transition-colors duration-300 group-hover:bg-[#F0A014] group-hover:text-white"
                        >
                          <p.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                        </span>
                        <h3
                          style={{
                            fontFamily:
                              "var(--font-cabinet), system-ui, sans-serif",
                          }}
                          className="text-[15px] font-bold tracking-tight text-ink sm:text-[16px]"
                        >
                          {p.title}
                        </h3>
                        <p className="text-[12.5px] leading-relaxed text-ink-2 sm:text-[13.5px]">
                          {p.body}
                        </p>
                      </li>
                    </Reveal>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
                  <Link
                    href={routes.teachLanding()}
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13.5px] font-semibold tracking-tight text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink/90 focus-visible:outline-none focus-visible:shadow-focus sm:px-7 sm:py-3.5 sm:text-[14px]"
                  >
                    Devenir enseignant
                    <span
                      aria-hidden
                      className="grid h-6 w-6 place-items-center rounded-full bg-[#F0A014] text-ink transition-transform duration-300 group-hover:rotate-45"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </span>
                  </Link>
                  <Link
                    href={routes.teachPricing()}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-5 py-3 text-[13.5px] font-semibold tracking-tight text-ink transition-all duration-300 hover:border-ink/30 hover:bg-white focus-visible:outline-none focus-visible:shadow-focus sm:px-6 sm:py-3.5 sm:text-[14px]"
                  >
                    Voir la commission
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#F0A014]/25 bg-white/70 py-1.5 pl-2 pr-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#7A4E00] backdrop-blur-sm">
      <span className="h-2 w-2 rounded-full bg-[#F0A014]" aria-hidden />
      {children}
    </span>
  );
}
