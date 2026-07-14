import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Landmark, ShieldCheck, HeartHandshake, AlertTriangle, MailPlus } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger } from "@/components/ui/reveal";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Confiance & sécurité",
  description:
    "Comment darso protège élèves et enseignants : paiement retenu, profils vérifiés, résolution de litiges.",
};

const PROMISES = [
  {
    icon: Landmark,
    eyebrow: "Paiement",
    title: "Vos fonds sont retenus",
    body:
      "Quand vous réservez un cours, le montant est placé en séquestre. L'enseignant est payé 48 h après la fin de la séance — s'il n'y a eu ni annulation, ni litige.",
    bullets: [
      "Paiement retenu jusqu'à la fin du cours",
      "Remboursement complet en cas d'annulation avant début",
      "Aucune commission cachée",
    ],
    note: "01",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Identité",
    title: "Enseignants vérifiés",
    body:
      "Chaque enseignant fournit une pièce d'identité officielle, un contact vérifiable, et une preuve d'expérience ou de diplôme. Les badges affichés reflètent uniquement ce qui a été validé.",
    bullets: [
      "Vérification identité (pièce officielle)",
      "Vérification contact (email + téléphone)",
      "Badges basés sur des faits, pas sur le marketing",
    ],
    note: "02",
  },
  {
    icon: HeartHandshake,
    eyebrow: "Support",
    title: "Litiges arbitrés par un humain",
    body:
      "En cas de désaccord, notre équipe médiation intervient sous 48 h ouvrées. Nous demandons les faits aux deux parties avant de trancher — jamais un algorithme opaque.",
    bullets: [
      "Ouverture de litige possible jusqu'à 7 jours après le cours",
      "Réponse sous 48 h ouvrées",
      "Décision motivée par écrit",
    ],
    note: "03",
  },
  {
    icon: AlertTriangle,
    eyebrow: "Signalement",
    title: "Vous voyez un problème ?",
    body:
      "Contenu inapproprié, comportement suspect, tentative de contact hors plateforme, faux profil — dites-le-nous. Nous vérifions et agissons rapidement.",
    bullets: [
      "Bouton « Signaler » sur chaque profil et cours",
      "Enquête interne systématique",
      "Sanctions immédiates en cas d'abus",
    ],
    note: "04",
  },
];

export default async function TrustPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border">
          <div aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_80%)]" />
          <div aria-hidden className="absolute start-8 top-0 -z-10 h-[3px] w-24 bg-accent md:start-12" />
          <div className="container-standard pt-16 pb-14 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
            <p className="anim-fade-up text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Confiance & sécurité
            </p>
            <h1
              className="anim-fade-up mt-3 max-w-3xl text-balance text-[36px] font-bold leading-[1.02] tracking-[-0.02em] text-foreground md:text-[52px] lg:text-[60px]"
              style={{ animationDelay: "90ms" }}
            >
              Une marketplace n'est utile{" "}
              <span className="relative inline-block">
                <span className="relative z-10">que si elle est sûre.</span>
                <span
                  aria-hidden
                  className="anim-underline absolute inset-x-0 bottom-1 -z-0 h-[10px] bg-accent-soft"
                />
              </span>
            </h1>
            <p
              className="anim-fade-up mt-6 max-w-2xl text-[15.5px] leading-relaxed text-ink-2 md:text-[17px]"
              style={{ animationDelay: "180ms" }}
            >
              Voici, concrètement, comment darso protège votre argent, vérifie les enseignants,
              et traite les litiges. Aucune promesse en l'air.
            </p>
          </div>
        </section>

        {/* Promises */}
        <section className="border-b border-border bg-surface py-14 md:py-20 lg:py-24">
          <div className="container-standard">
            <Stagger as="ul" step={110} initialDelay={80} className="grid gap-6 md:grid-cols-2">
              {PROMISES.map((p) => (
                <li
                  key={p.title}
                  className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1 transition-all duration-500 hover:-translate-y-1 hover:border-border-strong hover:shadow-e2 md:p-8"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-6 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-accent transition-transform duration-500 group-hover:scale-x-100 md:inset-x-8"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-accent-soft text-accent transition-transform duration-500 group-hover:rotate-[-4deg]"
                      >
                        <p.icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                        {p.eyebrow}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="tabular text-[10px] font-semibold text-ink-3"
                    >
                      {p.note}
                    </span>
                  </div>
                  <h2 className="mt-4 text-[19px] font-bold tracking-tight text-foreground">{p.title}</h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{p.body}</p>
                  <ul className="mt-5 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13.5px] text-ink-2">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Contact for questions */}
        <section className="py-14 md:py-20 lg:py-24">
          <div className="container-standard">
            <Reveal>
              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-e1 md:p-12">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-8">
                    <h2 className="text-[24px] font-bold tracking-tight text-foreground md:text-[28px]">
                      Une question précise sur votre situation ?
                    </h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                      Écrivez à notre équipe support. Nous répondons dans la journée, en français ou en arabe.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                    <Button asChild size="lg" variant="accent">
                      <Link href={routes.contact()}>
                        <MailPlus className="h-4 w-4" aria-hidden />
                        Contacter le support
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href={routes.help()}>Voir le centre d'aide</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
