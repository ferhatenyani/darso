import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Wallet, ShieldCheck, MessageCircle, Calendar, Settings, Landmark, ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { HelpSearch } from "./help-search";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Centre d'aide",
  description: "Guide et FAQ pour élèves et enseignants sur darso.",
};

const TOPICS = [
  {
    icon: Wallet,
    title: "Paiement & remboursement",
    body: "Comment marchent le séquestre, les remboursements, les factures.",
    href: routes.trust(),
  },
  {
    icon: ShieldCheck,
    title: "Sécurité & vérification",
    body: "Ce que vérifions sur les enseignants, ce que vous pouvez signaler.",
    href: routes.trust(),
  },
  {
    icon: Calendar,
    title: "Réservations & annulations",
    body: "Comment réserver, changer, annuler un cours.",
    href: routes.browse(),
  },
  {
    icon: MessageCircle,
    title: "Messages & communication",
    body: "Comment contacter un enseignant avant, pendant, après un cours.",
    href: routes.messages(),
  },
  {
    icon: Landmark,
    title: "Enseigner sur darso",
    body: "Créer un profil, publier un cours, être payé.",
    href: routes.teachLanding(),
  },
  {
    icon: Settings,
    title: "Compte & paramètres",
    body: "Changer votre email, mot de passe, préférences.",
    href: routes.account("settings"),
  },
];

const FAQ = [
  {
    q: "Comment ouvrir un litige ?",
    a: "Depuis la page de votre réservation, cliquez sur « Signaler un problème ». Notre équipe traite la demande sous 48 h ouvrées.",
  },
  {
    q: "Puis-je changer d'enseignant après le premier cours ?",
    a: "Oui. Si vous n'êtes pas satisfait·e, contactez le support — nous vous aidons à trouver un autre enseignant sans perdre votre solde.",
  },
  {
    q: "Comment ajouter un moyen de paiement ?",
    a: "Dans votre tableau de bord, allez dans « Paiements » puis « Ajouter un moyen ». Nous acceptons carte, virement, et paiements domestiques.",
  },
  {
    q: "Que se passe-t-il si l'enseignant ne se présente pas ?",
    a: "Vous êtes remboursé·e automatiquement à 100 % dans les 48 h qui suivent la séance manquée.",
  },
];

export default async function HelpPage({
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
        {/* Hero + search */}
        <section className="relative overflow-hidden border-b border-border">
          <div aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_80%)]" />
          <div aria-hidden className="absolute start-8 top-0 -z-10 h-[3px] w-24 bg-accent md:start-12" />
          <div className="container-standard pt-16 pb-14 md:pt-20 md:pb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Centre d'aide
            </p>
            <h1 className="mt-3 max-w-3xl text-balance text-[32px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground md:text-[44px] lg:text-[52px]">
              Comment on peut vous aider ?
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              Cherchez une réponse — ou écrivez-nous directement. On répond en 24 h ouvrées.
            </p>
            <div className="mt-8 max-w-2xl">
              <HelpSearch
                placeholder="Décrivez votre problème…"
                ctaLabel="Chercher"
                popularLabel="Populaire"
                popular={["Remboursement", "Annuler un cours", "Devenir enseignant", "Ajouter carte"]}
                toastTitle="Recherche lancée"
                toastDescriptionTemplate="Recherche interne pour « {query} ». Bientôt disponible."
              />
            </div>
          </div>
        </section>

        {/* Topic grid */}
        <section className="border-b border-border bg-surface py-14 md:py-20 lg:py-24">
          <div className="container-standard">
            <h2 className="text-[22px] font-bold tracking-tight text-foreground md:text-[26px]">
              Parcourir par thème
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {TOPICS.map((t) => (
                <li key={t.title}>
                  <Link
                    href={t.href as never}
                    className="group card-interactive block rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1 focus-visible:outline-none"
                  >
                    <span aria-hidden className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-accent-soft text-accent">
                      <t.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-4 text-[16px] font-semibold text-foreground">{t.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{t.body}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-accent group-hover:underline">
                      Ouvrir la rubrique
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20 lg:py-24">
          <div className="container-narrow">
            <h2 className="text-[22px] font-bold tracking-tight text-foreground md:text-[26px]">
              Questions rapides
            </h2>
            <ul className="mt-8 space-y-3">
              {FAQ.map((f) => (
                <li key={f.q} className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
                  <h3 className="text-[15px] font-semibold text-foreground">{f.q}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{f.a}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-[var(--radius-lg)] border border-dashed border-border bg-card p-6 text-center shadow-e1">
              <p className="text-[13.5px] text-ink-2">Vous ne trouvez pas votre réponse ?</p>
              <Link
                href={routes.contact()}
                className="mt-3 inline-flex h-10 items-center rounded-[var(--radius-xs)] bg-accent px-5 text-[13.5px] font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Contacter le support
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
