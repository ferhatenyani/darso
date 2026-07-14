"use client";

import { Link } from "@/i18n/navigation";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { routes } from "@/lib/routes";

/**
 * Pre-traction stand-in for the "testimonials" slot.
 * Honest, factual, signed — no fabricated reviews.
 */
export function FoundersNote() {
  return (
    <section aria-labelledby="founder-title" className="py-14 md:py-20 lg:py-24">
      <div className="container-standard">
        <Reveal>
          <div className="relative grid gap-10 rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-e1 md:p-12 lg:grid-cols-12 lg:gap-16 lg:p-14">
            {/* Editorial quote mark */}
            <Quote
              aria-hidden
              className="absolute end-6 top-6 h-14 w-14 -rotate-6 text-surface-2"
              strokeWidth={1.25}
            />

            <div className="lg:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Un mot des fondateurs
              </p>
              <h2
                id="founder-title"
                className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[30px] lg:text-[34px]"
              >
                On ne fabrique pas de témoignages.
              </h2>
              <div
                aria-hidden
                className="mt-6 h-[3px] w-16 bg-accent origin-left anim-underline"
              />
            </div>

            <div className="space-y-5 lg:col-span-8">
              <p className="text-[15.5px] leading-relaxed text-ink-2">
                darso démarre. Nous ne mettrons pas de fausses évaluations 5 étoiles ni de chiffres gonflés
                pour paraître plus établis que nous ne le sommes.
              </p>
              <p className="text-[15.5px] leading-relaxed text-ink-2">
                Ce que nous garantissons : chaque profil visible est vérifié, chaque dinar payé est retenu
                jusqu'à la fin du cours, chaque litige est traité par une personne — pas par un chatbot.
                Vous en trouverez la preuve à mesure que la plateforme grandit avec vous.
              </p>
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-10 w-10 place-items-center rounded-full bg-primary text-[13px] font-semibold text-primary-foreground"
                  >
                    d.
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-foreground">L'équipe darso</p>
                    <p className="mt-0.5 text-[12.5px] text-ink-3">Conçu à Alger, pour toute l'Algérie.</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={routes.about()}
                    className="inline-flex h-10 items-center rounded-[var(--radius-xs)] border border-border bg-background px-4 text-[13.5px] font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:shadow-focus"
                  >
                    Notre mission
                  </Link>
                  <Link
                    href={routes.contact()}
                    className="inline-flex h-10 items-center rounded-[var(--radius-xs)] bg-accent px-4 text-[13.5px] font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:shadow-focus"
                  >
                    Nous écrire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
