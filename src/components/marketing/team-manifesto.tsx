"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VALUES = [
  {
    numeral: "Zéro",
    heading: "commission cachée",
    body: "Ce que l'élève paie, c'est ce que le prof reçoit — moins une commission qu'on assume, qui commence à zéro.",
  },
  {
    numeral: "0 €",
    heading: "à l'inscription",
    body: "Créer un compte, publier un profil, ouvrir un agenda : gratuit. Pas de carte requise tant que rien ne se passe.",
  },
  {
    numeral: "100 %",
    heading: "pédagogique",
    body: "Personne ne paie pour remonter dans les résultats. Les meilleurs, pas les mieux placés.",
  },
];

const CABINET = "var(--font-cabinet), system-ui, sans-serif";

export function TeamManifesto() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -12% 0px",
  });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="manifesto-title"
      className="relative isolate mt-16 overflow-hidden bg-[#111110] px-4 py-24 text-white sm:mt-20 sm:py-28 md:mt-28 md:py-32"
    >
      {/* Subtle grid dot pattern at ~6% opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.06,
        }}
      />

      {/* Warm amber corner glow — bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-40 -z-10 h-[400px] w-[400px] rounded-full opacity-[0.12]"
        style={{
          background:
            "radial-gradient(closest-side, #F0A014 0%, transparent 70%)",
        }}
      />
      {/* Cool blue corner glow — top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[300px] w-[300px] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(closest-side, #2F6FEB 0%, transparent 70%)",
        }}
      />

      {/* Single centered column, max-w 720 */}
      <div className="mx-auto max-w-[720px]">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#F0A014]" />
            Un mot de l'équipe
          </span>
        </motion.div>

        {/* Huge decorative quote mark + centered quote */}
        <div className="relative mt-10 text-center">
          <span
            aria-hidden
            style={{ fontFamily: CABINET }}
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-[52%] select-none text-[120px] font-extrabold leading-none text-[#F0A014] opacity-20 sm:-top-12 sm:text-[140px]"
          >
            &ldquo;
          </span>

          <motion.h2
            id="manifesto-title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ fontFamily: CABINET }}
            className="relative text-[28px] font-extrabold leading-[1.25] tracking-[-0.02em] text-white text-balance sm:text-[36px] md:text-[40px]"
          >
            On a connu des profs qui ont tout changé.
            <br className="hidden sm:block" /> Et un système qui les a faits
            partir.{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F0A014]">
                Darso, c'est notre réponse.
              </span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: "0% 50%" }}
                className="absolute inset-x-0 bottom-1 -z-0 h-[10px] bg-[#F0A014]/25 sm:h-[12px]"
              />
            </span>
          </motion.h2>
        </div>

        {/* Signature row: 3 gradient-initial avatars + team label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <div className="flex -space-x-2">
            {[
              { i: "Y", grad: "linear-gradient(135deg,#F0A014,#7A4E00)" },
              { i: "S", grad: "linear-gradient(135deg,#2F6FEB,#1E58C7)" },
              { i: "A", grad: "linear-gradient(135deg,#2E8B6B,#1A5C46)" },
            ].map(({ i, grad }) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#111110] text-[13px] font-bold text-white backdrop-blur-sm"
                style={{ background: grad, fontFamily: CABINET }}
              >
                {i}
              </motion.span>
            ))}
          </div>
          <p
            style={{ fontFamily: CABINET }}
            className="mt-1 text-[15px] font-bold text-white"
          >
            L'équipe darso
          </p>
          <p className="text-[13px] text-white/60">Alger, pour toute l'Algérie</p>
        </motion.div>

        {/* 3-column "zéro" values strip, separated by hairlines that draw in */}
        <ul className="mt-16 grid gap-8 sm:mt-20 sm:grid-cols-3 sm:gap-0">
          {VALUES.map((v, i) => (
            <li
              key={v.numeral + v.heading}
              className="relative flex flex-col items-center gap-2 text-center sm:px-6"
            >
              {/* Vertical hairline between columns — first one hidden */}
              {i > 0 && (
                <motion.span
                  aria-hidden
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: "50% 0%" }}
                  className="absolute -left-px top-0 hidden h-full w-px bg-white/12 sm:block"
                />
              )}

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ fontFamily: CABINET }}
                className="text-[32px] font-extrabold leading-none tracking-[-0.03em] text-[#F0A014] tabular sm:text-[36px]"
              >
                {v.numeral}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.7 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-[13.5px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                {v.heading}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.8 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-1 max-w-[240px] text-[13px] leading-relaxed text-white/70"
              >
                {v.body}
              </motion.p>

              {/* Horizontal hairline draw-in below each on mobile */}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: "50% 50%" }}
                className="mt-4 h-px w-16 bg-white/20 sm:hidden"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
