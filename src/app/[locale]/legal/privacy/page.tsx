import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Lock } from "lucide-react";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Badge } from "@/components/ui/badge";

import { LegalShell, type LegalSection, type TocItem } from "../legal-shell";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  const toc: TocItem[] = t.raw("privacy.toc");
  const sections: LegalSection[] = t.raw("privacy.sections");

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
              <span className="text-ink-2">{t("privacy.hero.eyebrow")}</span>
            </nav>
            <Badge
              variant="default"
              className="gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
            >
              <Lock className="h-3 w-3" aria-hidden />
              {t("privacy.hero.eyebrow")}
            </Badge>
            <h1 className="mt-4 max-w-3xl text-balance text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[44px] md:text-[52px]">
              {t("privacy.hero.title")}
            </h1>
            <p className="mt-4 max-w-[68ch] text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              {t("privacy.hero.subtitle")}
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
