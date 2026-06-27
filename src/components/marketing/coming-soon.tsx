import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type RelatedLink = { label: string; href: string };

export type ComingSoonProps = {
  title: string;
  description: string;
  breadcrumb?: string[];
  eta?: string;
  relatedLinks?: RelatedLink[];
};

export function ComingSoon({
  title,
  description,
  breadcrumb,
  eta,
  relatedLinks,
}: ComingSoonProps) {
  const locale = useLocale();
  const t = useTranslations("comingSoon");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Background composition mirrors the marketing hero */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(70%_70%_at_50%_20%,black,transparent_85%)] opacity-60"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-accent/60" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 mx-auto h-[3px] w-28 translate-y-[-1px] bg-accent"
      />
      <p
        aria-hidden
        className="pointer-events-none absolute -top-8 end-6 -z-10 select-none text-[120px] font-black leading-none tracking-tighter text-foreground/[0.035] md:text-[200px]"
      >
        SOON
      </p>

      <div className="container-narrow flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center md:py-28">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3"
          >
            {breadcrumb.map((crumb, i) => (
              <span key={`${crumb}-${i}`} className="flex items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden className="text-ink-3/60">
                    /
                  </span>
                ) : null}
                <span>{crumb}</span>
              </span>
            ))}
          </nav>
        ) : null}

        {/* Coming soon badge */}
        <Badge variant="accent" className="mb-6 gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <Sparkles className="h-3 w-3" aria-hidden />
          {t("badge")}
        </Badge>

        {/* Editorial headline */}
        <h1 className="max-w-3xl text-balance text-[40px] font-bold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[56px] md:text-[64px]">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[16px]">
          {description}
        </p>

        {/* ETA */}
        {eta ? (
          <p className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-ink-3">
            <span aria-hidden className="ink-rule" />
            <span>{t("etaLabel")}</span>
            <span className="tabular text-ink-2">{eta}</span>
          </p>
        ) : null}

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/">
              {t("backHome")}
              <Arrow className="h-4 w-4 rtl-flip" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/browse">{t("browse")}</Link>
          </Button>
        </div>

        {/* Related links */}
        {relatedLinks && relatedLinks.length > 0 ? (
          <div className="mt-16 w-full max-w-2xl border-t border-border pt-8">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("relatedTitle")}
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href as never}
                    className="group flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-border bg-card px-4 py-3 text-[14px] font-medium text-ink-2 transition-colors hover:border-accent hover:bg-accent-soft/40 hover:text-accent"
                  >
                    <span>{link.label}</span>
                    <Arrow
                      className="h-4 w-4 rtl-flip opacity-60 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
