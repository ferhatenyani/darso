import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Button } from "@/components/ui/button";
import { HowItWorksTabs } from "@/components/marketing/how-it-works-tabs";
import { HowItWorksFaq } from "@/components/marketing/how-it-works-faq";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.howItWorks" });
  return { title: t("metaTitle") };
}

type Format = { name: string; body: string; duration: string; price: string };
type Step = { title: string; body: string };
type Faq = { q: string; a: string };

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const t = await getTranslations("marketing.howItWorks");
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const studentSteps: Step[] = t.raw("studentSteps");
  const teacherSteps: Step[] = t.raw("teacherSteps");
  const formats: Format[] = t.raw("formats");
  const faqs: Faq[] = t.raw("faqs");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_15%,black,transparent_80%)]"
          />
          <div className="container-narrow py-16 md:py-24">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="ink-rule" aria-hidden />
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 max-w-3xl text-balance text-[34px] font-bold leading-[1.02] tracking-[-0.025em] text-foreground sm:text-[44px] md:text-[56px] lg:text-[64px]">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
              {t("lede")}
            </p>
          </div>
        </section>

        {/* Steps with tabs */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <HowItWorksTabs
              tabStudents={t("tabStudents")}
              tabTeachers={t("tabTeachers")}
              studentSteps={studentSteps}
              teacherSteps={teacherSteps}
            />
          </div>
        </section>

        {/* Formats */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {t("formatsEyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                {t("formatsTitle")}
              </h2>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border md:grid-cols-3">
              {formats.map((f) => (
                <article key={f.name} className="flex flex-col bg-card p-7 md:p-8">
                  <h3 className="text-[20px] font-semibold tracking-tight text-foreground md:text-[22px]">
                    {f.name}
                  </h3>
                  <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-2">{f.body}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-x-4 border-t border-border pt-5">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                        {ar ? "المدّة" : "Durée"}
                      </dt>
                      <dd className="mt-1 text-[13px] font-semibold tabular text-foreground">
                        {f.duration}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                        {ar ? "السّعر" : "Prix"}
                      </dt>
                      <dd className="mt-1 text-[13px] font-semibold tabular text-foreground">
                        {f.price}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("faqEyebrow")}
                </p>
                <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
                  {t("faqTitle")}
                </h2>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <HowItWorksFaq faqs={faqs} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-20">
            <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-8 md:p-12">
              <div className="grid gap-6 md:grid-cols-[1.6fr_auto] md:items-center">
                <div>
                  <h2 className="max-w-xl text-balance text-[26px] font-semibold tracking-tight text-foreground md:text-[34px]">
                    {t("ctaTitle")}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] text-ink-2">{t("ctaBody")}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="primary" size="lg">
                    <Link href="/browse">
                      {t("ctaPrimary")}
                      <Arrow className="h-4 w-4 rtl-flip" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/teach">{t("ctaSecondary")}</Link>
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
