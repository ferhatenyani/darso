import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";

// Marketing scaffolding pages (about, how-it-works, press, careers, blog,
// trust, help, contact) are stubbed for v1. They exist so nothing in nav
// or footer breaks, but the fully-designed versions were removed to focus
// build effort on the core booking loop. Restore per-page implementations
// when marketing is a priority again.

type Props = {
  title: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PlaceholderPage({
  title,
  body = "Cette page arrive bientôt. En attendant, explorez la marketplace ou publiez une demande d'apprentissage.",
  primaryHref = "/browse",
  primaryLabel = "Parcourir les cours",
}: Props) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-background">
          <div className="container-narrow flex flex-col items-start gap-8 py-24 md:py-32">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Bientôt disponible
            </p>
            <h1 className="max-w-3xl text-balance text-[34px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground md:text-[52px]">
              {title}
            </h1>
            <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              {body}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/requests/new">Publier une demande</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
