"use client";

import { ArrowUpRight, Compass, Radio, Users } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { Reveal } from "@/components/ui/reveal";
import { IllustrationSlot } from "./illustration-slot";

const POINTS = [
  {
    icon: Compass,
    title: "Le bon prof en 60 secondes.",
    body: "Filtrez par matière, wilaya, budget, mode. On garde ce qui compte, on jette le reste.",
  },
  {
    icon: Radio,
    title: "En direct ou à votre rythme.",
    body: "Cours live avec chat, ou séances individuelles réservées quand ça vous arrange.",
  },
  {
    icon: Users,
    title: "Vous n'apprenez pas seul·e.",
    body: "Groupes d'entraide par matière et par niveau — la classe qu'on aurait voulue.",
  },
];

export function StudentPath() {
  return (
    <section
      aria-labelledby="student-path-title"
      className="relative isolate px-3 pt-8 sm:px-4 sm:pt-12 md:pt-16"
    >
      <div className="container-wide">
        <Reveal direction="up">
          <article className="relative overflow-hidden rounded-[2rem] bg-[#F7F7F5] px-5 py-8 shadow-[0_30px_60px_-40px_rgba(10,11,14,0.18),0_8px_20px_-12px_rgba(10,11,14,0.08)] sm:rounded-[2.5rem] sm:px-8 sm:py-12 md:rounded-[3.5rem] md:px-14 md:py-16 lg:px-20 lg:py-20">
            {/* Corner glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/[0.06] blur-3xl"
            />

            {/* 2-col grid on md+; text stacks above slot on mobile */}
            <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-14 lg:gap-20">
              {/* Text column */}
              <div className="md:col-span-6 md:pr-2">
                <Eyebrow tone="blue">Pour les élèves</Eyebrow>

                <h2
                  id="student-path-title"
                  style={{
                    fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                  }}
                  className="mt-4 text-[34px] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance sm:text-[42px] md:text-[52px] lg:text-[64px]"
                >
                  Votre rythme.
                  <br />
                  Votre prof.
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10">Vos matières.</span>
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-1 -z-0 h-[10px] origin-left bg-accent/25 md:h-[14px]"
                    />
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-2 sm:text-[17px]">
                  L'école ne vous a pas laissé le choix. Darso, si. Choisissez qui
                  vous enseigne, quand, comment — et payez seulement ce que vous suivez.
                </p>

                <ul className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
                  {POINTS.map((p, i) => (
                    <Reveal key={p.title} delay={80 + i * 90} direction="left">
                      <li className="group flex items-start gap-4">
                        <span
                          aria-hidden
                          className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-accent/25 bg-white text-accent shadow-[0_6px_18px_-10px_rgba(47,111,235,0.35)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent group-hover:shadow-[0_10px_24px_-12px_rgba(47,111,235,0.55)]"
                        >
                          <p.icon className="h-5 w-5" strokeWidth={1.75} />
                        </span>
                        <div>
                          <h3
                            style={{
                              fontFamily:
                                "var(--font-cabinet), system-ui, sans-serif",
                            }}
                            className="text-[16.5px] font-bold tracking-tight text-ink sm:text-[18px]"
                          >
                            {p.title}
                          </h3>
                          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2 sm:text-[14.5px]">
                            {p.body}
                          </p>
                        </div>
                      </li>
                    </Reveal>
                  ))}
                </ul>

                <div className="mt-9 sm:mt-11">
                  <Link
                    href={routes.browse()}
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13.5px] font-semibold tracking-tight text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink/90 focus-visible:outline-none focus-visible:shadow-focus sm:px-7 sm:py-3.5 sm:text-[14px]"
                  >
                    Explorer les cours
                    <span
                      aria-hidden
                      className="grid h-6 w-6 place-items-center rounded-full bg-white/12 transition-transform duration-300 group-hover:rotate-45"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </span>
                  </Link>
                </div>
              </div>

              {/* Illustration column */}
              <div className="relative md:col-span-6">
                <Reveal delay={120} direction="scale">
                  <IllustrationSlot
                    label="Un élève parcourt les profils enseignants, discute et réserve."
                    caption="Bureau + mobile · 4 scènes enchaînées"
                    aspect="aspect-[5/6] sm:aspect-square"
                    accent="blue"
                    wireframe="cards"
                  />
                </Reveal>

                {/* Handwritten annotation */}
                <div
                  aria-hidden
                  className="absolute -bottom-6 -right-2 hidden rotate-[6deg] md:block"
                >
                  <svg
                    viewBox="0 0 120 60"
                    className="h-14 w-24 text-ink"
                    fill="none"
                  >
                    <path
                      d="M6 32 C 30 6, 70 6, 106 26"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M96 20 L 106 26 L 96 34"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p
                    style={{
                      fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                    }}
                    className="mt-1 max-w-[160px] text-[13px] font-semibold leading-tight text-ink"
                  >
                    Ça commence ici, en 3 clics.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function Eyebrow({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "blue" | "amber";
}) {
  const dot = tone === "blue" ? "bg-accent" : "bg-[#F0A014]";
  const text = tone === "blue" ? "text-accent" : "text-[#7A4E00]";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 py-1.5 pl-2 pr-3 text-[10.5px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm ${text}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
      {children}
    </span>
  );
}
