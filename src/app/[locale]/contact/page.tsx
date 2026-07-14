import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe darso — support, presse, partenariats.",
};

const contactLabels = {
  name: "Votre nom",
  namePlaceholder: "Ex : Amina Cherif",
  email: "Votre email",
  emailPlaceholder: "vous@exemple.com",
  subject: "Sujet",
  subjectPlaceholder: "Choisissez un sujet",
  subjectOptions: [
    { value: "support", label: "Support · question générale" },
    { value: "booking", label: "Support · réservation en cours" },
    { value: "teacher", label: "Devenir enseignant" },
    { value: "press", label: "Presse & médias" },
    { value: "partner", label: "Partenariat" },
    { value: "other", label: "Autre" },
  ],
  message: "Votre message",
  messagePlaceholder: "Décrivez votre demande en quelques phrases (20 caractères minimum)…",
  submit: "Envoyer le message",
  submitting: "Envoi…",
  privacyNote:
    "En envoyant ce formulaire, vous acceptez que darso utilise vos coordonnées pour vous répondre.",
  errors: {
    name: "Merci de renseigner votre nom.",
    email: "Merci d'entrer un email valide.",
    subject: "Choisissez un sujet.",
    message: "Un message d'au moins 20 caractères, s'il vous plaît.",
  },
  toastTitle: "Message envoyé",
  toastDescriptionTemplate: "Nous vous répondrons à {email} sous 24 h ouvrées.",
};

export default async function ContactPage({
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
          <div className="container-standard pt-14 pb-10 md:pt-20 md:pb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Nous écrire
            </p>
            <h1 className="mt-3 max-w-3xl text-balance text-[32px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground md:text-[44px] lg:text-[52px]">
              Une question ? Un projet ? Un signalement ?
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              L'équipe darso répond dans les 24 heures ouvrées, en français ou en arabe.
            </p>
          </div>
        </section>

        {/* Content: form + info */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container-standard grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-8">
              <div className="rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-e1 md:p-8">
                <h2 className="text-[19px] font-semibold text-foreground">Formulaire de contact</h2>
                <p className="mt-1 text-[13.5px] text-ink-3">
                  Choisissez un sujet et nous acheminons votre message à la bonne équipe.
                </p>
                <div className="mt-6">
                  <ContactForm labels={contactLabels} />
                </div>
              </div>
            </div>

            {/* Info column */}
            <aside className="space-y-4 lg:col-span-4">
              <InfoCard icon={Mail} title="Email direct" body="hello@darso.com" href="mailto:hello@darso.com" />
              <InfoCard icon={MessageCircle} title="Support pendant un cours" body="Ouvrez un ticket depuis votre tableau de bord — traitement prioritaire." href="/help" hrefLabel="Ouvrir un ticket" />
              <InfoCard icon={Phone} title="Presse & médias" body="press@darso.com" href="mailto:press@darso.com" />
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-[13.5px] leading-relaxed text-ink-2">
                <div className="flex items-center gap-2 text-ink-3">
                  <MapPin className="h-4 w-4" aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Basé à</span>
                </div>
                <p className="mt-2">Alger, Algérie — équipe distribuée sur plusieurs wilayas.</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
  href,
  hrefLabel,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
      <span aria-hidden className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-accent-soft text-accent">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <h3 className="mt-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-3">{title}</h3>
      <p className="mt-1 text-[14px] text-foreground">{body}</p>
      {href && (
        <Link href={href as never} className="mt-2 inline-block text-[13px] font-semibold text-accent hover:underline">
          {hrefLabel ?? "Ouvrir →"}
        </Link>
      )}
    </div>
  );
}
