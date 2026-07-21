"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { Reveal, Stagger } from "@/components/ui/reveal";
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

export function HomeFaqV2() {
  return (
    <section
      aria-labelledby="faq-v2-title"
      className="relative isolate px-3 pt-8 sm:px-4 sm:pt-12 md:pt-16"
    >
      <div className="container-wide">
        <div className="grid gap-8 md:grid-cols-12 md:gap-14">
          {/* Left — sticky title block on desktop. Number-in-headline as emphasis, no eyebrow, no underline. */}
          <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
            <Reveal direction="up">
              <h2
                id="faq-v2-title"
                style={{
                  fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                }}
                className="text-[30px] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink text-balance sm:text-[38px] md:text-[42px] lg:text-[48px]"
              >
                Sept questions.{" "}
                <br className="hidden md:block" />
                Sept réponses.
              </h2>
              <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-ink-2 sm:text-[15.5px]">
                Une autre en tête ? Écrivez-nous, on la rajoute — nom compris,
                si vous voulez.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={routes.help()}
                  className="inline-flex items-center rounded-full border border-ink/15 bg-white px-4 py-2 text-[12.5px] font-semibold tracking-tight text-ink transition-all duration-300 hover:border-ink hover:shadow-[0_10px_24px_-14px_rgba(10,11,14,0.25)] focus-visible:outline-none focus-visible:shadow-focus"
                >
                  Centre d'aide
                </Link>
                <Link
                  href={routes.contact()}
                  className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold tracking-tight text-white transition-all duration-300 hover:bg-ink/90 focus-visible:outline-none focus-visible:shadow-focus"
                >
                  Nous écrire
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right — questions */}
          <div className="md:col-span-8">
            <AccordionPrimitive.Root
              type="single"
              collapsible
              className="overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white shadow-[0_1px_2px_rgba(10,11,14,0.04)] sm:rounded-[2rem]"
            >
              <Stagger step={45} initialDelay={80}>
                {FAQS.map((f, i) => (
                  <AccordionPrimitive.Item
                    key={i}
                    value={`item-${i}`}
                    className={cn(
                      "border-b border-ink/6 last:border-b-0",
                    )}
                  >
                    <AccordionPrimitive.Header>
                      <AccordionPrimitive.Trigger
                        className={cn(
                          "group flex w-full items-center justify-between gap-4 px-5 py-5 text-start transition-colors sm:px-7 sm:py-6",
                          "focus-visible:outline-none focus-visible:shadow-focus",
                        )}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="tabular text-[10.5px] font-bold text-ink-3 group-data-[state=open]:text-accent sm:text-[11.5px]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            style={{
                              fontFamily:
                                "var(--font-cabinet), system-ui, sans-serif",
                            }}
                            className="text-[15.5px] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent group-data-[state=open]:text-accent sm:text-[17px]"
                          >
                            {f.q}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 bg-white text-ink-2 transition-all duration-300 group-hover:border-accent group-hover:text-accent group-data-[state=open]:rotate-180 group-data-[state=open]:border-accent group-data-[state=open]:bg-accent group-data-[state=open]:text-white"
                        >
                          <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
                        </span>
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionPrimitive.Content
                      className="overflow-hidden text-[14px] leading-relaxed text-ink-2 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 sm:text-[15px]"
                    >
                      <div className="px-5 pb-6 pl-11 pt-0 sm:px-7 sm:pl-14">
                        {f.a}
                      </div>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                ))}
              </Stagger>
            </AccordionPrimitive.Root>
          </div>
        </div>
      </div>
    </section>
  );
}
