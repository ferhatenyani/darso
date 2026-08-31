"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";

const CABINET = "var(--font-cabinet), system-ui, sans-serif";

/**
 * Split words on space so each word animates in as a unit — cleaner than
 * per-char stagger for CJK-safe accents and doesn't shatter kerning.
 */
function AnimatedWords({
  children,
  inView,
  baseDelay = 0,
  wordDelay = 0.06,
  className,
}: {
  children: string;
  inView: boolean;
  baseDelay?: number;
  wordDelay?: number;
  className?: string;
}) {
  const words = children.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: baseDelay + i * wordDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block will-change-transform"
          >
            {word}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function ClosingCta() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="closing-title"
      className="relative isolate mt-16 min-h-[480px] overflow-hidden bg-[#111110] px-4 py-24 sm:mt-20 sm:py-28 md:mt-28 md:py-32"
    >
      {/* Subtle grid texture at 5% */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          opacity: 0.05,
        }}
      />

      {/* Amber bottom-left corner glow (stronger — 18%) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-40 -z-10 h-[440px] w-[440px] rounded-full opacity-[0.18]"
        style={{
          background:
            "radial-gradient(closest-side, #F0A014 0%, transparent 70%)",
        }}
      />
      {/* Blue top-right corner glow (18%) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[420px] w-[420px] rounded-full opacity-[0.18]"
        style={{
          background:
            "radial-gradient(closest-side, #2F6FEB 0%, transparent 70%)",
        }}
      />

      {/* Super-ellipse silhouette — slow 12s scale pulse. Behind the copy. */}
      <motion.svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] sm:h-[560px] sm:w-[560px] md:h-[720px] md:w-[720px]"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      >
        <path
          d="M120 40 Q 100 40 100 60 L 100 120 Q 100 140 80 140 L 40 140 Q 20 140 20 160 L 20 340 Q 20 360 40 360 L 180 360 Q 200 360 200 380 L 200 388 Q 200 400 212 400 L 360 400 Q 380 400 380 380 L 380 60 Q 380 40 360 40 Z"
          fill="currentColor"
          className="text-white"
        />
      </motion.svg>

      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="closing-title"
          style={{ fontFamily: CABINET }}
          className="text-[40px] font-extrabold leading-[1.02] tracking-[-0.035em] text-white text-balance sm:text-[56px] md:text-[64px] lg:text-[72px]"
        >
          <span className="block">
            <AnimatedWords inView={inView} baseDelay={0.05}>
              Une seule question.
            </AnimatedWords>
          </span>
          <span className="mt-2 block">
            <AnimatedWords inView={inView} baseDelay={0.3}>
              Vous
            </AnimatedWords>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={inView ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block text-[#F0A014]"
              >
                enseignez
              </motion.span>
            </span>
            <AnimatedWords inView={inView} baseDelay={0.5}>
              , ou vous
            </AnimatedWords>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={inView ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block text-accent"
              >
                apprenez
              </motion.span>
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="inline-block"
            >
              &nbsp;?
            </motion.span>
          </span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-[16.5px]"
        >
          Deux portes, un seul geste. Passer la vôtre prend moins d'une minute
          et ne coûte rien tant que rien ne se passe.
        </motion.p>

        {/* Single split-pill container divided by a 1px vertical rule */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex justify-center sm:mt-12"
        >
          <SplitPill />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-6 text-[13px] uppercase tracking-[0.14em] text-white/50"
        >
          Sans carte bancaire · Sans engagement
        </motion.p>
      </div>
    </section>
  );
}

function SplitPill() {
  return (
    <div
      role="group"
      aria-label="Choisir une porte"
      className="inline-flex items-stretch overflow-hidden rounded-full border border-white/15 bg-white/[0.03] shadow-[0_20px_60px_-24px_rgba(240,160,20,0.35),0_20px_60px_-24px_rgba(47,111,235,0.35)] backdrop-blur-sm"
    >
      <SplitHalf
        href={routes.teachLanding()}
        label="Enseigner"
        variant="teach"
      />
      <span aria-hidden className="w-px self-stretch bg-white/15" />
      <SplitHalf
        href={routes.browse()}
        label="Apprendre"
        variant="learn"
      />
    </div>
  );
}

function SplitHalf({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "teach" | "learn";
}) {
  const isTeach = variant === "teach";
  const accent = isTeach ? "#F0A014" : "#2F6FEB";

  return (
    <Link
      href={href as never}
      className="group relative isolate flex min-w-[160px] items-center justify-center overflow-hidden px-6 py-4 text-[14.5px] font-bold tracking-tight transition-colors duration-300 focus-visible:outline-none focus-visible:shadow-focus sm:min-w-[200px] sm:px-10 sm:py-5 sm:text-[15.5px]"
      style={{ color: accent }}
    >
      {/* Morphing square background — 0×0 → full pill fill on hover */}
      <span
        aria-hidden
        className="absolute left-4 top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rounded-[3px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:-translate-y-0 group-hover:rounded-none"
        style={{ backgroundColor: `${accent}40` }}
      />

      <span className="relative z-10 inline-flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-[1px]">
        {label}
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
          strokeWidth={2.4}
          aria-hidden
        />
      </span>
    </Link>
  );
}
