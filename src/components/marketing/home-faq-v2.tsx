"use client";

import { useRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Combien coûte Darso pour un·e enseignant·e ?",
    a: "Zéro dinar jusqu'à 10 000 DZD de revenus mensuels. Au-delà, la commission monte progressivement pour se stabiliser à 15 % maximum à partir de 200 000 DZD par mois. Rien à cocher, rien à activer — la remise est automatique.",
  },
  {
    q: "Comment sont payés les enseignant·e·s ?",
    a: "L'élève paie à la réservation. Nous conservons la somme le temps du cours. Sous 48 h après la séance, votre part est virée sur votre compte bancaire (ou CIB à venir). Aucun retard, jamais.",
  },
  {
    q: "Un élève peut-il annuler après avoir réservé ?",
    a: "Oui, gratuitement jusqu'à 24 h avant le cours. Ensuite, la moitié du tarif est retenue pour vous. Ces règles sont visibles avant chaque réservation — pas de mauvaise surprise pour personne.",
  },
  {
    q: "Comment vérifiez-vous les enseignant·e·s ?",
    a: "Vérification d'identité, contact validé, publication d'au moins un cours ou une disponibilité. Les diplômes, quand ils existent, sont affichés comme tels — mais aucun diplôme n'est requis pour enseigner sur Darso.",
  },
  {
    q: "Y a-t-il des cours en présentiel ?",
    a: "Oui. Chaque enseignant précise son mode : en ligne, présentiel, ou hybride. Vous filtrez ensuite par wilaya sur la page recherche.",
  },
  {
    q: "Qu'est-ce que le mode collectif (agence) ?",
    a: "Un espace pour les écoles, prépas et collectifs qui veulent héberger plusieurs enseignants sous une même marque. Sous-domaine personnalisé, tableau de bord partagé, facturation groupée. Migration accompagnée par notre équipe.",
  },
  {
    q: "Puis-je essayer avant de m'inscrire ?",
    a: "Absolument. Parcourir les cours, consulter les profils et voir les tarifs ne demande aucune inscription. Le compte se crée uniquement au moment d'une réservation, d'un message ou d'un cours mis en ligne.",
  },
];

const CABINET = "var(--font-cabinet), system-ui, sans-serif";

export function HomeFaqV2() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="faq-v2-title"
      className="relative isolate px-3 pt-16 sm:px-4 sm:pt-20 md:pt-28"
    >
      <div className="container-wide">
        {/* 40/60 split on desktop (2/5 + 3/5) */}
        <div className="grid gap-10 md:grid-cols-5 md:gap-14 lg:gap-20">
          {/* Left — sticky headline + CTAs (col-span-2 = 40%) */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 md:sticky md:top-28 md:self-start"
          >
            <h2
              id="faq-v2-title"
              style={{ fontFamily: CABINET, lineHeight: 1.1 }}
              className="text-[36px] font-extrabold tracking-[-0.035em] text-ink text-balance sm:text-[42px] md:text-[48px]"
            >
              Sept questions.
              <br />
              Sept réponses.
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-3 sm:text-[15.5px]">
              Une autre en tête ? Écrivez-nous, on la rajoute — nom compris, si
              vous voulez.
            </p>
            {/* Stacked CTAs — ghost first, dark ink second */}
            <div className="mt-8 flex flex-col items-start gap-3">
              <Link
                href={routes.help()}
                className="inline-flex items-center rounded-full border border-ink/15 bg-white px-5 py-2.5 text-[13px] font-semibold tracking-tight text-ink transition-all duration-300 hover:border-ink hover:shadow-[0_10px_24px_-14px_rgba(10,11,14,0.25)] focus-visible:outline-none focus-visible:shadow-focus"
              >
                Centre d'aide
              </Link>
              <Link
                href={routes.contact()}
                className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold tracking-tight text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink/90 focus-visible:outline-none focus-visible:shadow-focus"
              >
                Nous écrire
              </Link>
            </div>
          </motion.div>

          {/* Right — accordion card (col-span-3 = 60%) */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="md:col-span-3"
          >
            <AccordionPrimitive.Root
              type="single"
              collapsible
              className="overflow-hidden rounded-[2rem] border border-ink/8 bg-white"
            >
              {FAQS.map((f, i) => (
                <AccordionPrimitive.Item
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-ink/6 last:border-b-0"
                >
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger
                      className={cn(
                        "group flex w-full items-center gap-4 px-5 py-6 text-start transition-colors sm:px-7",
                        "focus-visible:outline-none focus-visible:shadow-focus",
                      )}
                    >
                      {/* Fixed 32px monospace number column, right-aligned */}
                      <span
                        aria-hidden
                        className="inline-flex w-8 shrink-0 justify-end pt-1 font-mono text-[12px] font-bold tabular text-ink-3 transition-colors group-data-[state=open]:text-accent"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Question text — turns blue when open */}
                      <span
                        style={{ fontFamily: CABINET }}
                        className="flex-1 text-[16px] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent group-data-[state=open]:text-accent sm:text-[17px]"
                      >
                        {f.q}
                      </span>

                      {/* Chevron chip — 28px, fills blue + rotates on open */}
                      <span
                        aria-hidden
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/10 bg-white text-ink-2 transition-all duration-300 group-hover:border-accent group-hover:text-accent group-data-[state=open]:rotate-180 group-data-[state=open]:border-accent group-data-[state=open]:bg-accent group-data-[state=open]:text-white"
                      >
                        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.4} />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content
                    className="overflow-hidden text-[15px] leading-relaxed text-ink-3 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1"
                  >
                    <div className="px-5 pb-7 pl-[68px] pt-0 sm:px-7 sm:pl-[76px]">
                      {f.a}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
