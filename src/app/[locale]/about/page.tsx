import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GraduationCap, Landmark, ShieldCheck, HeartHandshake, Sparkles, MapPin } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "darso, la marketplace algérienne de l'apprentissage — trouvez un enseignant, réservez un cours, ou enseignez ce que vous savez.",
};

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Sécurité d'abord",
    body: "Chaque paiement est retenu jusqu'à la fin du cours. Chaque enseignant passe une vérification d'identité.",
  },
  {
    icon: HeartHandshake,
    title: "Rémunérer justement",
    body: "Commission progressive. Zéro frais tant que l'enseignant n'a pas encore gagné.",
  },
  {
    icon: Sparkles,
    title: "Aucune surprise",
    body: "Prix affichés, conditions claires. Pas de forfaits piégés, pas d'engagement caché.",
  },
];

export default async function AboutPage({
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">À propos</p>
            <h1 className="mt-3 max-w-3xl text-balance text-[38px] font-bold leading-[1.02] tracking-[-0.02em] text-foreground md:text-[54px] lg:text-[64px]">
              Un endroit sûr pour apprendre, et pour enseigner.
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-ink-2 md:text-[18px]">
              darso relie des élèves et des enseignants partout en Algérie — en ligne ou en présentiel.
              La plateforme est faite pour que les deux parties se sentent en confiance dès le premier échange.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="border-b border-border bg-surface py-14 md:py-20 lg:py-24">
          <div className="container-standard grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Notre mission
              </p>
              <h2 className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]">
                Rendre l'apprentissage direct et humain.
              </h2>
            </div>
            <div className="space-y-5 lg:col-span-7">
              <p className="text-[15px] leading-relaxed text-ink-2">
                On croit qu'apprendre passe d'abord par une bonne rencontre. Un vrai enseignant, présent,
                qui prend le temps de comprendre là où vous en êtes.
              </p>
              <p className="text-[15px] leading-relaxed text-ink-2">
                On ne veut pas remplacer cette rencontre par des vidéos pré-fabriquées ou par un algorithme.
                On construit l'inverse : moins d'intermédiaires, plus de transparence, du paiement sécurisé
                et un support qui répond réellement.
              </p>
              <p className="text-[15px] leading-relaxed text-ink-2">
                darso démarre — nous n'avons pas encore de gros chiffres à afficher, et c'est très bien.
                On préfère bâtir doucement quelque chose de solide.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-14 md:py-20 lg:py-24">
          <div className="container-standard">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Nos principes
              </p>
              <h2 className="mt-2 text-[26px] font-bold tracking-tight text-foreground md:text-[32px] lg:text-[38px]">
                Trois engagements non négociables
              </h2>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
              {PRINCIPLES.map((p) => (
                <li key={p.title} className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1">
                  <span aria-hidden className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-accent-soft text-accent">
                    <p.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-[16px] font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Origin */}
        <section className="border-y border-border bg-primary py-14 text-primary-foreground md:py-20 lg:py-24">
          <div className="container-standard grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                D'où on vient
              </p>
              <h2 className="mt-2 text-[26px] font-bold tracking-tight md:text-[32px] lg:text-[38px]">
                Conçu à Alger, pour toute l'Algérie.
              </h2>
            </div>
            <div className="space-y-4 text-[15px] leading-relaxed text-primary-foreground/85 lg:col-span-7">
              <p>
                darso est né d'une observation simple : trouver un bon professeur particulier en Algérie
                dépend souvent du bouche-à-oreille. On voulait une manière plus juste — pour les élèves
                comme pour les enseignants.
              </p>
              <p>
                On travaille avec des enseignants de plusieurs wilayas, en cours 1:1, en cohorte en ligne
                ou en atelier présentiel. On donne à chacun un tableau de bord pour publier, gérer les
                réservations et être payé — sans jongler avec dix outils.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-[13px] text-primary-foreground/70">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden />
                  Basé à Alger
                </span>
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" aria-hidden />
                  Équipe distribuée en Algérie
                </span>
                <span className="inline-flex items-center gap-2">
                  <Landmark className="h-4 w-4" aria-hidden />
                  Paiements domestiques + internationaux
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 md:py-20 lg:py-24">
          <div className="container-standard rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-e1 md:p-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="text-[24px] font-bold tracking-tight text-foreground md:text-[28px]">
                  Envie de rejoindre l'aventure ?
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                  Que vous vouliez apprendre ou enseigner, la plateforme est ouverte. Vos retours nous
                  aideront à la rendre meilleure.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                <Button asChild size="lg" variant="accent">
                  <Link href={routes.browse()}>Explorer les cours</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={routes.teachLanding()}>Devenir enseignant</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
