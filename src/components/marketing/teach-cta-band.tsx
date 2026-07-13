import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { routes } from "@/lib/routes";

const POINTS = [
  "Créez votre profil et vos cours en 10 minutes",
  "Recevez des demandes d'élèves prêts à réserver",
  "Commission progressive — 0 % jusqu'au premier revenu",
  "Tableau de bord, paiements et messagerie intégrés",
];

export function TeachCtaBand() {
  return (
    <section aria-labelledby="teach-title" className="relative overflow-hidden bg-primary py-14 text-primary-foreground md:py-20 lg:py-24">
      {/* Background composition */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.06]" />
      <div
        aria-hidden
        className="absolute -end-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/25 blur-[100px]"
      />

      <div className="container-wide grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Vous enseignez ?
          </p>
          <h2 id="teach-title" className="mt-2 text-[28px] font-bold tracking-tight md:text-[36px] lg:text-[44px] text-balance">
            Publiez vos cours, recevez des élèves.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-primary-foreground/75">
            Gratuit jusqu'à votre premier dinar gagné. Ensuite, une commission transparente qui s'ajuste à
            vos revenus — jamais plus.
          </p>

          <ul className="mt-8 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"
                >
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span className="text-[14.5px] leading-relaxed text-primary-foreground/90">{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={routes.teachLanding()}
              className="inline-flex h-12 items-center rounded-[var(--radius-xs)] bg-accent px-6 text-[14.5px] font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Devenir enseignant
            </Link>
            <Link
              href={routes.teachPricing()}
              className="inline-flex h-12 items-center rounded-[var(--radius-xs)] border border-white/20 bg-transparent px-6 text-[14.5px] font-semibold text-primary-foreground transition-colors hover:bg-white/[0.06]"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>

        {/* Preview card */}
        <div className="lg:col-span-5">
          <div className="rounded-[var(--radius-xl)] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/60">
              Modèle de commission
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[52px] font-bold leading-none tracking-tight tabular">0 %</span>
              <span className="text-[14px] text-primary-foreground/70">jusqu'à votre 1er dinar gagné</span>
            </div>
            <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
              <TierRow band="0 – 25 000 DA" rate="12 %" label="Palier de démarrage" />
              <TierRow band="25 000 – 50 000 DA" rate="8 %" label="Palier standard" active />
              <TierRow band="≥ 50 000 DA" rate="6 %" label="Palier confirmé" />
            </div>
            <p className="mt-5 text-[12px] text-primary-foreground/60">
              La commission baisse à mesure que vos revenus mensuels augmentent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TierRow({
  band,
  rate,
  label,
  active,
}: {
  band: string;
  rate: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[13px] font-medium text-primary-foreground">{band}</p>
        <p className="text-[11px] text-primary-foreground/60">{label}</p>
      </div>
      <span
        className={
          "rounded-[var(--radius-xs)] px-2 py-1 text-[13px] font-semibold tabular " +
          (active
            ? "bg-accent text-accent-foreground"
            : "border border-white/15 text-primary-foreground/80")
        }
      >
        {rate}
      </span>
    </div>
  );
}
