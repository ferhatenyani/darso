import { ArrowRight, MailPlus } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

/**
 * Marketing scaffolding for pages that are announced but not built out yet
 * (careers, press, blog, sub-legal…). Now uses the redesign tokens and shows
 * an honest "coming soon" surface with two useful next-step CTAs.
 */
type Props = {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PlaceholderPage({
  eyebrow = "Bientôt disponible",
  title,
  body = "Cette page arrive prochainement. En attendant, explorez la plateforme ou écrivez-nous — nous répondons à chaque message.",
  primaryHref = routes.browse(),
  primaryLabel = "Parcourir la plateforme",
  secondaryHref = routes.contact(),
  secondaryLabel = "Nous écrire",
}: Props) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_80%)]"
          />
          <div aria-hidden className="absolute start-8 top-0 -z-10 h-[3px] w-24 bg-accent md:start-12" />

          <div className="container-standard flex flex-col items-start gap-6 pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-28 lg:pb-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[12px] font-medium text-ink-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {eyebrow}
            </div>

            <h1 className="max-w-3xl text-balance text-[34px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground md:text-[52px]">
              {title}
            </h1>

            <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              {body}
            </p>

            <div className="mt-2 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href={primaryHref as never}>
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryHref as never}>
                  <MailPlus className="h-4 w-4" aria-hidden />
                  {secondaryLabel}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
