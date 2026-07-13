import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";

/**
 * Pre-traction stand-in for the "testimonials" slot.
 * Honest, factual, signed — no fabricated reviews.
 */
export function FoundersNote() {
  return (
    <section aria-labelledby="founder-title" className="py-14 md:py-20 lg:py-24">
      <div className="container-standard">
        <div className="grid gap-10 rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-e1 md:p-12 lg:grid-cols-12 lg:gap-16 lg:p-14">
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
          </div>

          <div className="space-y-4 lg:col-span-8">
            <p className="text-[15px] leading-relaxed text-ink-2">
              darso démarre. Nous ne mettrons pas de fausses évaluations 5 étoiles ni de chiffres gonflés
              pour paraître plus établis que nous ne le sommes.
            </p>
            <p className="text-[15px] leading-relaxed text-ink-2">
              Ce que nous garantissons : chaque profil visible est vérifié, chaque euro payé est retenu
              jusqu'à la fin du cours, chaque litige est traité par une personne — pas par un chatbot.
              Vous en trouverez la preuve à mesure que la plateforme grandit avec vous.
            </p>
            <div className="border-t border-border pt-6">
              <p className="text-[13px] font-semibold text-foreground">L'équipe darso</p>
              <p className="mt-1 text-[12.5px] text-ink-3">Conçu à Alger, pour toute l'Algérie.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={routes.about()}
                  className="inline-flex h-10 items-center rounded-[var(--radius-xs)] border border-border bg-background px-4 text-[13.5px] font-semibold text-foreground hover:border-border-strong hover:bg-surface"
                >
                  Notre mission
                </Link>
                <Link
                  href={routes.contact()}
                  className="inline-flex h-10 items-center rounded-[var(--radius-xs)] bg-accent px-4 text-[13.5px] font-semibold text-accent-foreground hover:bg-accent-hover"
                >
                  Nous écrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
