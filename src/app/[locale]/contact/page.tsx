import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ContactForm } from "./contact-form";

type Props = { params: Promise<{ locale: string }> };

type ElsewhereItem = {
  title: string;
  blurb: string;
  cta: string;
  href: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const elsewhereEntries: { key: "help" | "trust" | "press"; data: ElsewhereItem }[] = [
    { key: "help", data: t.raw("elsewhere.help") },
    { key: "trust", data: t.raw("elsewhere.trust") },
    { key: "press", data: t.raw("elsewhere.press") },
  ];

  const subjects = {
    placeholder: t("form.subjectPlaceholder"),
    options: [
      { value: "support", label: t("form.subjects.support") },
      { value: "billing", label: t("form.subjects.billing") },
      { value: "partnership", label: t("form.subjects.partnership") },
      { value: "press", label: t("form.subjects.press") },
      { value: "report", label: t("form.subjects.report") },
      { value: "other", label: t("form.subjects.other") },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(60%_55%_at_50%_0%,black,transparent_85%)]"
          />
          <div className="container-narrow py-14 md:py-20">
            <div className="max-w-3xl">
              <Badge
                variant="accent"
                className="mb-5 gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              >
                <MessageSquare className="h-3 w-3" aria-hidden />
                {t("hero.eyebrow")}
              </Badge>
              <h1 className="text-balance text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[44px] md:text-[56px]">
                {t("hero.title")}
              </h1>
              <p className="mt-5 max-w-[60ch] text-pretty text-[15px] leading-relaxed text-ink-2 md:text-[17px]">
                {t("hero.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* FORM + SIDEBAR */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
              {/* Form */}
              <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-6 shadow-e1 md:p-9">
                <div className="mb-6">
                  <h2 className="text-[20px] font-semibold tracking-tight text-foreground md:text-[24px]">
                    {t("form.title")}
                  </h2>
                  <p className="mt-1.5 text-[13.5px] text-ink-3">
                    {t("form.subtitle")}
                  </p>
                </div>
                <ContactForm
                  labels={{
                    name: t("form.name"),
                    namePlaceholder: t("form.namePlaceholder"),
                    email: t("form.email"),
                    emailPlaceholder: t("form.emailPlaceholder"),
                    subject: t("form.subject"),
                    subjectPlaceholder: subjects.placeholder,
                    subjectOptions: subjects.options,
                    message: t("form.message"),
                    messagePlaceholder: t("form.messagePlaceholder"),
                    submit: t("form.submit"),
                    submitting: t("form.submitting"),
                    privacyNote: t("form.privacyNote"),
                    errors: {
                      name: t("form.errors.name"),
                      email: t("form.errors.email"),
                      subject: t("form.errors.subject"),
                      message: t("form.errors.message"),
                    },
                    toastTitle: t("toast.successTitle"),
                    toastDescriptionTemplate: t.raw("toast.successDescription"),
                  }}
                />
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-6 shadow-e1 md:p-7">
                  <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
                    {t("sidebar.title")}
                  </h2>
                  <p className="mt-1 text-[13px] text-ink-3">{t("sidebar.subtitle")}</p>

                  <ul className="mt-5 space-y-4 text-[14px]">
                    <li className="grid grid-cols-[28px_1fr] items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 text-accent" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                          {t("sidebar.emailLabel")}
                        </p>
                        <a
                          href={`mailto:${t("sidebar.emailValue")}`}
                          className="mt-0.5 block text-foreground hover:text-accent"
                        >
                          {t("sidebar.emailValue")}
                        </a>
                      </div>
                    </li>
                    <li className="grid grid-cols-[28px_1fr] items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 text-accent" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                          {t("sidebar.phoneLabel")}
                        </p>
                        <a
                          href={`tel:${t("sidebar.phoneValue").replace(/\s/g, "")}`}
                          className="mt-0.5 block text-foreground tabular hover:text-accent"
                        >
                          {t("sidebar.phoneValue")}
                        </a>
                      </div>
                    </li>
                    <li className="grid grid-cols-[28px_1fr] items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                          {t("sidebar.addressLabel")}
                        </p>
                        <p className="mt-0.5 text-foreground">{t("sidebar.addressLine1")}</p>
                        <p className="text-ink-2">{t("sidebar.addressLine2")}</p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[28px_1fr] items-start gap-3">
                      <Clock className="mt-0.5 h-4 w-4 text-accent" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                          {t("sidebar.hoursLabel")}
                        </p>
                        <p className="mt-0.5 text-foreground">{t("sidebar.hoursValue")}</p>
                        <p className="text-[12.5px] text-ink-3">{t("sidebar.closedValue")}</p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[28px_1fr] items-start gap-3">
                      <Send className="mt-0.5 h-4 w-4 text-accent" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                          {t("sidebar.supportLabel")}
                        </p>
                        <p className="mt-0.5 text-foreground">{t("sidebar.supportValue")}</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Mock office map */}
                <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card shadow-e1">
                  <div
                    aria-hidden
                    className="relative aspect-[5/3] w-full bg-surface"
                  >
                    <div className="absolute inset-0 bg-grid-sm opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="flex items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-e1">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        Alger 16000
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ELSEWHERE */}
        <section className="bg-background">
          <div className="container-narrow py-14 md:py-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
              {t("elsewhere.title")}
            </p>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {elsewhereEntries.map(({ key, data }) => (
                <li key={key}>
                  <Link
                    href={data.href as never}
                    className="group flex h-full flex-col justify-between gap-6 rounded-[var(--radius-lg)] border border-border bg-card p-6 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-e2"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">{data.title}</p>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
                        {data.blurb}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-accent">
                      {data.cta}
                      <Arrow className="h-3.5 w-3.5 rtl-flip" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
