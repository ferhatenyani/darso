"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Comment fonctionne le paiement ?",
    a: "Les fonds sont retenus jusqu'à ce que le cours se déroule correctement. Si tout est en ordre, l'enseignant reçoit le paiement dans les 48 h suivant la fin de la séance. En cas de problème, vous pouvez ouvrir un litige et être remboursé·e.",
  },
  {
    q: "Puis-je annuler ou changer d'enseignant ?",
    a: "Oui. Avant qu'un cours ne commence, l'annulation est gratuite. Si vous n'êtes pas satisfait·e après une première séance, contactez notre équipe et nous vous aidons à trouver un autre enseignant sans perdre votre solde.",
  },
  {
    q: "Comment sont vérifiés les enseignants ?",
    a: "Chaque enseignant passe une vérification d'identité (pièce officielle), une vérification de contact (numéro & email), et fournit ses diplômes ou expérience. Les badges affichés sur les profils reflètent uniquement ce qui est vérifié.",
  },
  {
    q: "Y a-t-il des cours en présentiel ?",
    a: "Oui. Chaque enseignant précise s'il·elle enseigne en ligne, en présentiel, ou les deux. Vous pouvez filtrer par mode et par wilaya sur la page recherche.",
  },
  {
    q: "Quels tarifs pratiquent les enseignants ?",
    a: "Chaque enseignant fixe son propre tarif horaire. Les prix varient selon la matière, l'expérience et la ville — du cours à 900 DA/h pour les débutants à 2 500 DA/h et plus pour des profils experts.",
  },
  {
    q: "Comment devenir enseignant sur darso ?",
    a: "Créez un profil, passez la vérification d'identité, publiez au moins un cours ou une disponibilité. Aucune commission n'est prise avant votre premier dinar gagné. Ensuite, la commission s'ajuste à vos revenus mensuels.",
  },
];

export function HomeFaq() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-border bg-surface py-14 md:py-20 lg:py-24">
      <div className="container-narrow">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Questions fréquentes
          </p>
          <h2 id="faq-title" className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]">
            Ce qu'on nous demande le plus
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
            Vous avez une autre question ?{" "}
            <Link href={routes.help()} className="font-medium text-accent hover:underline">
              Consultez le centre d'aide
            </Link>{" "}
            ou{" "}
            <Link href={routes.contact()} className="font-medium text-accent hover:underline">
              écrivez-nous
            </Link>
            .
          </p>
        </div>

        <AccordionPrimitive.Root
          type="single"
          collapsible
          className="mt-10 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-card"
        >
          {FAQS.map((f, i) => (
            <AccordionPrimitive.Item key={i} value={`item-${i}`} className="px-5 sm:px-6">
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className={cn(
                    "group flex w-full items-center justify-between gap-4 py-5 text-start",
                    "text-[15px] font-semibold text-foreground focus-visible:outline-none",
                  )}
                >
                  {f.q}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden text-[14px] leading-relaxed text-ink-2 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                <div className="pb-5 pt-1">{f.a}</div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}
