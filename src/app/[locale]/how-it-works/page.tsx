import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Search, MessageSquare, Wallet, GraduationCap, PenLine, ClipboardCheck, BookOpen } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description: "Comment fonctionne darso — recherche, réservation, paiement sécurisé, et évaluation.",
};

const LEARN_STEPS = [
  {
    icon: Search,
    title: "Explorez ou publiez",
    body: "Parcourez le catalogue par matière, ville et format — ou publiez votre demande et laissez les enseignants vous contacter.",
  },
  {
    icon: MessageSquare,
    title: "Discutez, choisissez",
    body: "Consultez les profils, comparez les tarifs, échangez avec plusieurs enseignants gratuitement avant de vous engager.",
  },
  {
    icon: Wallet,
    title: "Réservez en sécurité",
    body: "Le paiement est retenu jusqu'à la fin du cours. Si un problème survient, vous êtes remboursé·e.",
  },
  {
    icon: GraduationCap,
    title: "Apprenez et évaluez",
    body: "Suivez le cours en ligne ou en présentiel. Après la séance, donnez votre avis honnête.",
  },
];

const TEACH_STEPS = [
  {
    icon: PenLine,
    title: "Créez votre profil",
    body: "Décrivez votre expertise, ajoutez vos diplômes, définissez vos tarifs — 10 minutes suffisent.",
  },
  {
    icon: ClipboardCheck,
    title: "Publiez cours ou disponibilités",
    body: "1:1, cohortes, ateliers — vous décidez du format. Vous fixez le calendrier.",
  },
  {
    icon: MessageSquare,
    title: "Recevez et confirmez",
    body: "Les élèves vous contactent. Vous acceptez les demandes qui vous conviennent.",
  },
  {
    icon: Wallet,
    title: "Enseignez, soyez payé·e",
    body: "Paiement sur votre compte 48 h après la fin du cours. Commission progressive selon vos revenus.",
  },
];

export default async function HowItWorksPage({
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
        <section className="relative overflow-hidden border-b border-border">
          <div aria-hidden className="absolute inset-0 -z-10 bg-dots opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_80%)]" />
          <div aria-hidden className="absolute start-8 top-0 -z-10 h-[3px] w-24 bg-accent md:start-12" />
          <div className="container-standard pt-16 pb-14 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Comment ça marche
            </p>
            <h1 className="mt-3 max-w-3xl text-balance text-[36px] font-bold leading-[1.02] tracking-[-0.02em] text-foreground md:text-[52px] lg:text-[60px]">
              Une plateforme claire pour deux parcours.
            </h1>
            <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-ink-2 md:text-[17px]">
              Que vous cherchiez à apprendre ou à enseigner, le fonctionnement est identique : simple,
              transparent, protégé.
            </p>
          </div>
        </section>

        {/* Learners */}
        <section className="border-b border-border bg-surface py-14 md:py-20 lg:py-24">
          <div className="container-standard">
            <div className="flex items-baseline gap-3">
              <span className="inline-flex h-8 items-center rounded-[var(--radius-xs)] bg-accent-soft px-3 text-[12px] font-semibold uppercase tracking-wider text-accent">
                Apprendre
              </span>
              <span className="text-[12px] font-medium text-ink-3">4 étapes</span>
            </div>
            <h2 className="mt-4 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]">
              Trouver un enseignant, en 4 étapes
            </h2>

            <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {LEARN_STEPS.map((s, i) => (
                <li key={s.title} className="relative rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-primary text-primary-foreground">
                      <span className="text-[15px] font-bold tabular">0{i + 1}</span>
                    </span>
                    <s.icon className="h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-[16px] font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href={routes.browse()}>
                  <Search className="h-4 w-4" aria-hidden />
                  Explorer les cours
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={routes.requestNew()}>
                  <PenLine className="h-4 w-4" aria-hidden />
                  Publier ma demande
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Teachers */}
        <section className="border-b border-border bg-primary py-14 text-primary-foreground md:py-20 lg:py-24">
          <div className="container-standard">
            <div className="flex items-baseline gap-3">
              <span className="inline-flex h-8 items-center rounded-[var(--radius-xs)] bg-accent px-3 text-[12px] font-semibold uppercase tracking-wider text-accent-foreground">
                Enseigner
              </span>
              <span className="text-[12px] font-medium text-primary-foreground/60">4 étapes</span>
            </div>
            <h2 className="mt-4 text-[26px] font-bold tracking-tight md:text-[32px] lg:text-[38px]">
              Lancer votre activité, en 4 étapes
            </h2>

            <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {TEACH_STEPS.map((s, i) => (
                <li key={s.title} className="rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
                      <span className="text-[15px] font-bold tabular">0{i + 1}</span>
                    </span>
                    <s.icon className="h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-[16px] font-semibold text-primary-foreground">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-primary-foreground/75">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href={routes.teachLanding()}>
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Devenir enseignant
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-14 md:py-20 lg:py-24">
          <div className="container-standard grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Ce que darso garantit
              </p>
              <h2 className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[36px]">
                Vous êtes couvert·e, à chaque étape.
              </h2>
              <div className="mt-6">
                <Button asChild size="lg" variant="outline">
                  <Link href={routes.trust()}>Voir la charte complète</Link>
                </Button>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:gap-6">
              {[
                { title: "Paiement retenu", body: "Le montant reste en séquestre jusqu'à la fin du cours." },
                { title: "Remboursement possible", body: "Si le cours ne se déroule pas, vous êtes remboursé·e sous 48 h." },
                { title: "Profils vérifiés", body: "Identité et coordonnées vérifiées avant publication." },
                { title: "Litige arbitré", body: "Un humain traite chaque désaccord signalé." },
              ].map((g) => (
                <li key={g.title} className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1">
                  <h3 className="text-[15.5px] font-semibold text-foreground">{g.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{g.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
