import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Cookie } from "lucide-react";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Badge } from "@/components/ui/badge";

import { LegalShell, type LegalSection, type TocItem } from "../legal-shell";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.cookies.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  const toc: TocItem[] = t.raw("cookies.toc");
  const sections: LegalSection[] = t.raw("cookies.sections");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <header className="border-b border-border bg-background">
          <div className="container-narrow py-12 md:py-16">
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-3"
            >
              <span>{t("shared.breadcrumbLegal")}</span>
              <span aria-hidden>/</span>
              <span className="text-ink-2">{t("cookies.hero.eyebrow")}</span>
            </nav>
            <Badge
              variant="default"
              className="gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
            >
              <Cookie className="h-3 w-3" aria-hidden />
              {t("cookies.hero.eyebrow")}
            </Badge>
            <h1 className="mt-4 max-w-3xl text-balance text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[44px] md:text-[52px]">
              {t("cookies.hero.title")}
            </h1>
            <p className="mt-4 max-w-[68ch] text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              {t("cookies.hero.subtitle")}
            </p>
          </div>
        </header>

        <LegalShell
          toc={toc}
          sections={sections}
          labels={{
            tocTitle: t("shared.tocTitle"),
            tocMobileOpen: t("shared.tocMobileOpen"),
            tocMobileClose: t("shared.tocMobileClose"),
            backToTop: t("shared.backToTop"),
            lastUpdated: t("shared.lastUpdated"),
            questions: t("shared.questions"),
            questionsBody: t("shared.questionsBody"),
            contactDpo: t("shared.contactDpo"),
            contactEmail: t("shared.contactEmail"),
          }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
