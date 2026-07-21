"use client";

import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { Reveal } from "@/components/ui/reveal";

export function ClosingCta() {
  return (
    <section
      aria-labelledby="closing-title"
      className="relative isolate px-3 pt-8 pb-6 sm:px-4 sm:pt-12 sm:pb-10 md:pt-16 md:pb-14"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <article className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-5 py-12 text-white sm:rounded-[2.5rem] sm:px-8 sm:py-16 md:rounded-[3.5rem] md:px-14 md:py-24 lg:px-20 lg:py-28">
            {/* Textured backdrop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.055]"
            />
            {/* Warm + cool corner lights */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -bottom-32 -z-10 h-80 w-80 rounded-full bg-[#F0A014]/22 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/22 blur-3xl"
            />
            {/* Faint notched-super-ellipse silhouette — echoes the hero container shape */}
            <svg
              aria-hidden
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -right-16 -top-16 -z-10 h-72 w-72 opacity-[0.06] sm:-right-8 sm:-top-8 sm:h-96 sm:w-96 md:h-[520px] md:w-[520px]"
            >
              <path
                d="M120 40 Q 100 40 100 60 L 100 120 Q 100 140 80 140 L 40 140 Q 20 140 20 160 L 20 340 Q 20 360 40 360 L 180 360 Q 200 360 200 380 L 200 388 Q 200 400 212 400 L 360 400 Q 380 400 380 380 L 380 60 Q 380 40 360 40 Z"
                fill="currentColor"
                className="text-white"
              />
            </svg>

            {/* Copy */}
            <div className="mx-auto max-w-3xl text-center">
              <h2
                id="closing-title"
                style={{
                  fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                }}
                className="text-[36px] font-extrabold leading-[1.02] tracking-[-0.035em] text-white text-balance sm:text-[52px] md:text-[64px] lg:text-[76px]"
              >
                Une seule question.
                <br />
                Vous <span className="text-[#F0A014]">enseignez</span>,
                <br className="sm:hidden" /> ou vous{" "}
                <span className="text-accent">apprenez</span> ?
              </h2>

              <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-[16.5px]">
                Deux portes, un seul geste. Passer la vôtre prend moins d'une
                minute et ne coûte rien tant que rien ne se passe.
              </p>

              {/* Split-pill CTA — inspired by the hero's BC notch */}
              <div className="mt-9 flex flex-col items-stretch justify-center gap-2 sm:mt-11 sm:flex-row sm:items-center sm:gap-3">
                <TeachButton />
                <LearnButton />
              </div>

              <p className="mt-6 text-[12px] uppercase tracking-[0.14em] text-white/50 sm:text-[13px]">
                Sans carte bancaire · Sans engagement
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

/* --- CTA buttons ---------------------------------------------------- */

function TeachButton() {
  return (
    <Link
      href={routes.teachLanding()}
      className="group relative flex items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white px-6 py-4 text-[14.5px] font-bold tracking-tight text-ink transition-all duration-300 hover:border-[#F0A014] focus-visible:outline-none focus-visible:shadow-focus sm:min-w-[220px] sm:px-8 sm:py-5 sm:text-[15.5px]"
    >
      <span className="relative z-20 inline-flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
        Enseigner
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
          strokeWidth={2.4}
          aria-hidden
        />
      </span>
      <span
        aria-hidden
        className="absolute left-4 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-[3px] bg-[#F0A014] transition-all duration-500 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:-translate-y-0 group-hover:rounded-full group-hover:bg-[#F0A014]/25"
      />
    </Link>
  );
}

function LearnButton() {
  return (
    <Link
      href={routes.browse()}
      className="group relative flex items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-transparent px-6 py-4 text-[14.5px] font-bold tracking-tight text-white transition-all duration-300 hover:border-accent focus-visible:outline-none focus-visible:shadow-focus sm:min-w-[220px] sm:px-8 sm:py-5 sm:text-[15.5px]"
    >
      <span className="relative z-20 inline-flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
        Apprendre
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
          strokeWidth={2.4}
          aria-hidden
        />
      </span>
      <span
        aria-hidden
        className="absolute left-4 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-[3px] bg-accent transition-all duration-500 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:-translate-y-0 group-hover:rounded-full group-hover:bg-accent/25"
      />
    </Link>
  );
}
