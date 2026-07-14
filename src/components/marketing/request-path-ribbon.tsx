import { ArrowRight, PenLine } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";

// Homepage discovery hierarchy is marketplace-primary. Search, categories,
// and featured teachers dominate above. This ribbon lives after that
// primary surface as the visible-but-secondary path: "if the marketplace
// didn't have what you were looking for, describe it and let teachers
// come to you." Deliberately quieter than a hero, louder than a footer link.

export function RequestPathRibbon() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container-narrow py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="ink-rule" aria-hidden />
              Autre voie
            </p>
            <h2 className="mt-4 max-w-2xl text-balance text-[26px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[36px]">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[16px]">
              Publiez une demande d'apprentissage : décrivez votre objectif, votre budget, votre disponibilité. Les professeurs qui vous correspondent vous font des propositions sous 72 heures.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <Link
              href={routes.requestNew()}
              className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <PenLine className="h-[18px] w-[18px]" aria-hidden />
              Poster une demande
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="text-[12.5px] text-ink-3">Gratuit · Vous choisissez la proposition</p>
          </div>
        </div>
      </div>
    </section>
  );
}
