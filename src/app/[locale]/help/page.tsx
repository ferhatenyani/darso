import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Sparkles, LifeBuoy, ShieldCheck } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { HelpSearch } from "./help-search";

type Props = { params: Promise<{ locale: string }> };

type Shortcut = { title: string; blurb: string; href: string };
type FaqItem = { q: string; a: string };
type FaqCategory = { id: string; label: string; items: FaqItem[] };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "help.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("help");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const popular: string[] = t.raw("hero.popular");
  const shortcuts: Shortcut[] = t.raw("shortcuts.items");
  const categories: FaqCategory[] = t.raw("faq.categories");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* HERO + SEARCH */}
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(60%_55%_at_50%_0%,black,transparent_85%)]"
          />
          <div className="container-narrow py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="accent"
                className="mb-5 gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              >
                <LifeBuoy className="h-3 w-3" aria-hidden />
                {t("hero.eyebrow")}
              </Badge>
              <h1 className="text-balance text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[48px] md:text-[60px]">
                {t("hero.title")}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
                {t("hero.subtitle")}
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl">
              <HelpSearch
                placeholder={t("hero.searchPlaceholder")}
                ctaLabel={t("hero.searchAction")}
                popularLabel={t("hero.popularLabel")}
                popular={popular}
                toastTitle={t("toast.searchTitle")}
                toastDescriptionTemplate={t.raw("toast.searchDescription")}
              />
            </div>
          </div>
        </section>

        {/* SHORTCUTS */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-14 md:py-20">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                {t("shortcuts.title")}
              </p>
              <h2 className="text-balance text-[24px] font-semibold tracking-tight text-foreground md:text-[30px]">
                {t("shortcuts.subtitle")}
              </h2>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {shortcuts.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href as never}
                    className="group flex h-full flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-e2"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">{s.title}</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{s.blurb}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-2 transition-colors group-hover:text-accent">
                      {t("shortcuts.title")}
                      <Arrow className="h-3.5 w-3.5 rtl-flip" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
              {/* Sidebar nav */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                  {t("faq.eyebrow")}
                </p>
                <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-foreground md:text-[28px]">
                  {t("faq.title")}
                </h2>
                <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-ink-3">
                  {t("faq.subtitle")}
                </p>
                <nav aria-label="FAQ categories" className="mt-6 hidden lg:block">
                  <ul className="space-y-1 border-s border-border ps-4">
                    {categories.map((c, i) => (
                      <li key={c.id}>
                        <a
                          href={`#cat-${c.id}`}
                          className="block py-1.5 text-[13.5px] text-ink-2 transition-colors hover:text-accent"
                        >
                          <span className="me-2 tabular text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              {/* Categories */}
              <div className="space-y-10">
                {categories.map((c, idx) => (
                  <section
                    key={c.id}
                    id={`cat-${c.id}`}
                    aria-labelledby={`cat-${c.id}-title`}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
                      <h3
                        id={`cat-${c.id}-title`}
                        className="text-[18px] font-semibold tracking-tight text-foreground"
                      >
                        <span className="me-2 text-[12px] font-semibold tabular text-ink-3">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {c.label}
                      </h3>
                      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3 tabular">
                        {c.items.length}
                      </span>
                    </div>
                    <Accordion type="single" collapsible className="mt-2">
                      {c.items.map((item, i) => (
                        <AccordionItem key={i} value={`${c.id}-${i}`}>
                          <AccordionTrigger className="text-[14.5px]">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="max-w-[72ch] text-[14px] leading-relaxed text-ink-2">
                              {item.a}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STILL NEED HELP */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-20">
            <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-8 shadow-e1 md:p-12">
              <div className="grid gap-6 md:grid-cols-[1.6fr_auto] md:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    {t("stillNeed.title")}
                  </span>
                  <h2 className="mt-3 max-w-xl text-balance text-[24px] font-semibold tracking-tight text-foreground md:text-[32px]">
                    {t("stillNeed.title")}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
                    {t("stillNeed.subtitle")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 md:flex-nowrap">
                  <Button asChild variant="primary" size="lg">
                    <Link href="/contact">
                      {t("stillNeed.ctaContact")}
                      <Arrow className="h-4 w-4 rtl-flip" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/trust">
                      <ShieldCheck className="h-4 w-4" aria-hidden />
                      {t("stillNeed.ctaTrust")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
