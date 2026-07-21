"use client";

import { ArrowUpRight, Layers, LineChart, Palette } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { Reveal } from "@/components/ui/reveal";

const PERKS = [
  {
    icon: Layers,
    title: "Un tableau, tous vos profs.",
    body: "Regroupez enseignants, cours et réservations sous une même racine. Chaque prof garde son espace, vous gardez la vue d'ensemble.",
  },
  {
    icon: LineChart,
    title: "Reporting qui parle métier.",
    body: "Taux de remplissage par prof, satisfaction moyenne, tendance des revenus. Assez de chiffres pour décider, jamais assez pour se noyer.",
  },
  {
    icon: Palette,
    title: "Vos couleurs, notre moteur.",
    body: "Logo, palette, sous-domaine. Vos élèves ne voient plus Darso, ils voient votre école, propulsée sans une seule ligne de code à écrire.",
  },
];

export function AgencyCollective() {
  return (
    <section
      aria-labelledby="agency-title"
      className="relative isolate px-3 pt-8 sm:px-4 sm:pt-12 md:pt-16"
    >
      <div className="container-wide">
        {/* Header block — asymmetric, no eyebrow, no underline. Ghost numeral on the left, headline right. */}
        <Reveal direction="up">
          <div className="grid gap-4 sm:gap-8 md:grid-cols-12 md:items-end md:gap-14">
            <div className="md:col-span-4">
              <p
                aria-hidden
                style={{
                  fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                }}
                className="text-[96px] font-extrabold leading-none tracking-[-0.06em] tabular text-ink/[0.10] sm:text-[140px] md:text-[180px] lg:text-[220px]"
              >
                3+
              </p>
            </div>
            <div className="md:col-span-8">
              <h2
                id="agency-title"
                style={{
                  fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                }}
                className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[40px] md:text-[48px] lg:text-[56px]"
              >
                Trois profs, une seule adresse. Sans site web à maintenir.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-2 sm:text-[16.5px]">
                Le mode collectif de Darso est pensé pour les agences, prépas
                et écoles qui veulent grandir ensemble. Vous gardez votre marque
                et votre équipe. Le moteur tourne pour vous.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Perk grid */}
        <ul className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-3">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={80 + i * 100} direction="up">
              <li className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white p-6 shadow-[0_1px_2px_rgba(10,11,14,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_48px_-24px_rgba(10,11,14,0.18)] sm:rounded-[2rem] sm:p-8">
                {/* Icon */}
                <span
                  aria-hidden
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white transition-transform duration-300 group-hover:-rotate-6 sm:h-14 sm:w-14"
                >
                  <p.icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.7} />
                </span>

                <h3
                  style={{
                    fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                  }}
                  className="mt-6 text-[19px] font-bold leading-tight tracking-tight text-ink sm:text-[22px]"
                >
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-2 sm:text-[14.5px]">
                  {p.body}
                </p>

                {/* Bottom hairline that stretches on hover */}
                <span
                  aria-hidden
                  className="mt-6 block h-[1.5px] w-8 origin-left bg-ink/25 transition-transform duration-500 group-hover:scale-x-[3.6] group-hover:bg-ink"
                />
              </li>
            </Reveal>
          ))}
        </ul>

        {/* Bottom CTA line */}
        <Reveal delay={220} direction="up">
          <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:justify-center">
            <Link
              href={routes.teachAgency()}
              className="group inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-6 py-3 text-[13.5px] font-semibold tracking-tight text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_12px_28px_-14px_rgba(10,11,14,0.25)] focus-visible:outline-none focus-visible:shadow-focus sm:px-7 sm:py-3.5 sm:text-[14px]"
            >
              Découvrir le mode collectif
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2.2}
                aria-hidden
              />
            </Link>
            <span className="text-[12.5px] text-ink-3">
              Sans engagement · Migration incluse
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

