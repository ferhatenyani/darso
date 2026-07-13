"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Column = { title: string; items: { label: string; href: string }[] };

export function SiteFooter() {
  const t = useTranslations("home.footer");
  const year = new Date().getFullYear();

  const columns: Column[] = [
    {
      title: "Découvrir",
      items: [
        { label: "Trouver un enseignant", href: routes.teachers() },
        { label: "Parcourir les cours", href: routes.browse() },
        { label: "En direct maintenant", href: routes.live() },
        { label: "Publier une demande", href: routes.requestNew() },
      ],
    },
    {
      title: "Enseigner",
      items: [
        { label: "Devenir enseignant", href: routes.teachLanding() },
        { label: "Tarifs & commission", href: routes.teachPricing() },
        { label: "Ressources pédagogiques", href: routes.teachResources() },
      ],
    },
    {
      title: "L'entreprise",
      items: [
        { label: "À propos", href: routes.about() },
        { label: "Comment ça marche", href: routes.howItWorks() },
        { label: "Presse", href: routes.press() },
        { label: "Carrières", href: routes.careers() },
        { label: "Blog", href: routes.blog() },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Centre d'aide", href: routes.help() },
        { label: "Confiance & sécurité", href: routes.trust() },
        { label: "Nous contacter", href: routes.contact() },
        { label: "Résolution de litiges", href: routes.disputes() },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-wide py-14 md:py-16 lg:py-20">
        {/* Top: brand + columns */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand block */}
          <div className="space-y-5 md:col-span-4 lg:col-span-4">
            <div className="[&_span]:!text-primary-foreground">
              <Logo />
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-primary-foreground/80">
              {t("tagline")}
            </p>
            <p className="text-[12px] text-primary-foreground/60">
              Conçu à Alger, pour toute l'Algérie.
            </p>
          </div>

          {/* Column links — mobile as accordion, tablet+ as grid */}
          <div className="md:col-span-8 md:pt-2 lg:col-span-8">
            {/* Mobile accordion */}
            <div className="md:hidden">
              <AccordionPrimitive.Root type="multiple" className="divide-y divide-white/10">
                {columns.map((col) => (
                  <AccordionPrimitive.Item key={col.title} value={col.title}>
                    <AccordionPrimitive.Header>
                      <AccordionPrimitive.Trigger
                        className={cn(
                          "group flex w-full items-center justify-between gap-4 py-4 text-start",
                          "text-[13.5px] font-semibold uppercase tracking-[0.14em] text-primary-foreground focus-visible:outline-none",
                        )}
                      >
                        {col.title}
                        <ChevronDown
                          className="h-4 w-4 shrink-0 text-primary-foreground/60 transition-transform duration-200 group-data-[state=open]:rotate-180"
                          aria-hidden
                        />
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                      <ul className="space-y-2 pb-4">
                        {col.items.map((it) => (
                          <li key={it.href}>
                            <Link
                              href={it.href as never}
                              className="text-[14px] text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                            >
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                ))}
              </AccordionPrimitive.Root>
            </div>

            {/* Tablet+ grid */}
            <div className="hidden md:grid md:grid-cols-4 md:gap-6 lg:gap-10">
              {columns.map((col) => (
                <div key={col.title} className="space-y-3">
                  <h4 className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/60">
                    {col.title}
                  </h4>
                  <ul className="space-y-2">
                    {col.items.map((it) => (
                      <li key={it.href}>
                        <Link
                          href={it.href as never}
                          className="text-[13.5px] text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                        >
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom rule + legal + status */}
        <div className="mt-12 border-t border-white/10 pt-6 md:mt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-[12px] text-primary-foreground/60">
              © {year} darso. Tous droits réservés.
            </p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-primary-foreground/70">
              <li>
                <Link href={routes.legalTerms()} className="hover:text-primary-foreground">
                  Conditions
                </Link>
              </li>
              <li>
                <Link href={routes.legalPrivacy()} className="hover:text-primary-foreground">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href={routes.legalCookies()} className="hover:text-primary-foreground">
                  Cookies
                </Link>
              </li>
              <li className="inline-flex items-center gap-1.5 text-primary-foreground/60">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                Tous systèmes opérationnels
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
