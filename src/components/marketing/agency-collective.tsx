"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Layers, LineChart, Palette } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";

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

const CABINET = "var(--font-cabinet), system-ui, sans-serif";

export function AgencyCollective() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -12% 0px",
  });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="agency-title"
      className="relative isolate bg-white px-3 pt-16 sm:px-4 sm:pt-20 md:pt-28"
    >
      <div className="container-wide">
        {/* Asymmetric header: 40% ghost numeral / 60% right-aligned H2 */}
        <div className="grid items-end gap-4 sm:gap-8 md:grid-cols-5 md:gap-10 lg:gap-14">
          {/* Ghost numeral column — 40% (2/5 on md+) */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2"
          >
            <p
              aria-hidden
              style={{ fontFamily: CABINET, fontSize: "clamp(96px, 20vw, 280px)" }}
              className="select-none font-extrabold leading-[0.85] tracking-[-0.06em] text-ink"
            >
              <span className="opacity-[0.08]">3+</span>
            </p>
          </motion.div>

          {/* Headline column — 60% (3/5 on md+), right-aligned */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="md:col-span-3 md:text-right"
          >
            <h2
              id="agency-title"
              style={{ fontFamily: CABINET }}
              className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[40px] md:text-[48px] lg:text-[56px]"
            >
              Trois profs, une seule adresse.
              <br className="hidden md:block" /> Sans site web à maintenir.
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-3 sm:text-[16.5px] md:ml-auto">
              Le mode collectif de Darso est pensé pour les agences, prépas
              et écoles qui veulent grandir ensemble. Vous gardez votre marque
              et votre équipe. Le moteur tourne pour vous.
            </p>
          </motion.div>
        </div>

        {/* 3-col perk grid — clean white cards, 1px border, generous gutters */}
        <ul className="mt-14 grid gap-5 sm:mt-20 sm:gap-6 md:grid-cols-3 md:gap-8">
          {PERKS.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.25 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#E8E8E6] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(10,11,14,0.18)] sm:p-8"
            >
              {/* Ink icon tile — 40×40, rotates 8° on hover */}
              <motion.span
                aria-hidden
                whileHover={{ rotate: 8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid h-10 w-10 place-items-center rounded-[10px] bg-ink text-white"
              >
                <p.icon className="h-5 w-5" strokeWidth={1.85} />
              </motion.span>

              <h3
                style={{ fontFamily: CABINET }}
                className="mt-6 text-[20px] font-bold leading-tight tracking-tight text-ink"
              >
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-3">
                {p.body}
              </p>

              {/* Bottom hairline: stretches 0 → 100% on hover */}
              <span
                aria-hidden
                className="mt-7 block h-[1.5px] w-full origin-left scale-x-0 bg-ink/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </motion.li>
          ))}
        </ul>

        {/* Centered ghost CTA + microcopy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 flex flex-col items-center gap-3 sm:mt-16"
        >
          <Link
            href={routes.teachAgency()}
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-[13.5px] font-semibold tracking-tight text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink/[0.04] hover:shadow-[0_12px_28px_-14px_rgba(10,11,14,0.25)] focus-visible:outline-none focus-visible:shadow-focus sm:px-7 sm:py-3.5 sm:text-[14px]"
          >
            Découvrir le mode collectif
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2.2}
              aria-hidden
            />
          </Link>
          <p className="text-[13px] text-ink-3">
            Sans engagement · Migration incluse
          </p>
        </motion.div>
      </div>
    </section>
  );
}
