import { Link } from "@/i18n/navigation";
import { ArrowUpRight, ShieldCheck, Landmark, Handshake } from "lucide-react";
import { routes } from "@/lib/routes";

const PILLARS = [
  {
    icon: Landmark,
    title: "Paiement sécurisé",
    body: "Les fonds sont retenus jusqu'à la fin du cours. En cas de problème, remboursement complet.",
  },
  {
    icon: ShieldCheck,
    title: "Profils vérifiés",
    body: "Identité, diplômes et coordonnées vérifiées. Chaque enseignant validé porte un badge officiel.",
  },
  {
    icon: Handshake,
    title: "Litiges arbitrés",
    body: "Un désaccord ? Notre équipe médiation intervient sous 48 h. Réponses réelles, pas de bots.",
  },
];

export function TrustSafety() {
  return (
    <section aria-labelledby="trust-title" className="py-14 md:py-20 lg:py-24">
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Confiance & sécurité
            </p>
            <h2 id="trust-title" className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[36px]">
              Vous n'êtes jamais seul·e face à un litige.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">
              La marketplace n'est utile que si elle est sûre. On ne prend pas cette partie à la légère.
            </p>
            <Link
              href={routes.trust()}
              className="mt-6 inline-flex items-center gap-1 text-[13.5px] font-semibold text-accent hover:underline"
            >
              Comment on protège votre argent
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-6">
            {PILLARS.map((p) => (
              <li
                key={p.title}
                className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1"
              >
                <span
                  aria-hidden
                  className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-accent-soft text-accent"
                >
                  <p.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-[16px] font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
