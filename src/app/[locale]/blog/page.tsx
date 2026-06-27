import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.blog" });
  return { title: t("metaTitle") };
}

type Post = {
  category: string;
  title: string;
  excerpt: string;
  author?: string;
  date?: string;
  readTime?: number;
  featured?: boolean;
};

const coverAccents = [
  "from-[#6E5BFF] via-[#9C7BFF] to-[#C5B3FF]",
  "from-[#FF7A59] via-[#FFA38C] to-[#FFCFC0]",
  "from-[#16A085] via-[#2EC4A2] to-[#7AE6C8]",
  "from-[#2563EB] via-[#60A5FA] to-[#BFDBFE]",
  "from-[#D946EF] via-[#F0ABFC] to-[#FBCFE8]",
  "from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]",
];

function initialsOf(name?: string) {
  if (!name) return "DA";
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const t = await getTranslations("marketing.blog");
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const posts: Post[] = t.raw("posts");
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* HERO + Featured combined into an editorial top section */}
        <section className="relative isolate overflow-hidden border-b border-border bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_15%,black,transparent_80%)]"
          />
          <div className="container-narrow py-16 md:py-20">
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

          {/* Featured */}
          {featured ? (
            <div className="container-narrow pb-16 md:pb-24">
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                {t("featuredTitle")}
              </p>
              <Link
                href="/blog"
                className="group grid overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card transition-shadow hover:shadow-e2 md:grid-cols-[1.1fr_1fr]"
              >
                {/* Cover */}
                <div
                  className={cn(
                    "relative h-[220px] bg-gradient-to-br md:h-auto md:min-h-[360px]",
                    coverAccents[0],
                  )}
                >
                  <div className="absolute inset-0 bg-dots opacity-20" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <Badge variant="solid" className="bg-foreground text-background">
                      {featured.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-6 p-8 md:p-10">
                  <h2 className="text-balance text-[24px] font-semibold leading-[1.15] tracking-tight text-foreground md:text-[32px]">
                    {featured.title}
                  </h2>
                  <p className="text-pretty text-[14.5px] leading-relaxed text-ink-2 md:text-[15.5px]">
                    {featured.excerpt}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-border pt-5">
                    {featured.author ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gradient-to-br from-foreground to-ink-2 text-[11px] font-semibold text-background">
                            {initialsOf(featured.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[13px] font-semibold tracking-tight text-foreground">
                            {featured.author}
                          </p>
                          <p className="text-[11.5px] tabular text-ink-3">{featured.date}</p>
                        </div>
                      </div>
                    ) : null}
                    {featured.readTime ? (
                      <p className="ms-auto inline-flex items-center gap-1.5 text-[12px] tabular text-ink-3">
                        <Clock className="h-3.5 w-3.5" />
                        {featured.readTime} {t("readTimeLabel")}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            </div>
          ) : null}
        </section>

        {/* Post grid */}
        <section className="border-b border-border bg-background">
          <div className="container-narrow py-16 md:py-20">
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <li key={p.title} className="group">
                  <Link href="/blog" className="block">
                    <div
                      className={cn(
                        "relative h-[180px] overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br",
                        coverAccents[(i + 1) % coverAccents.length],
                      )}
                    >
                      <div className="absolute inset-0 bg-dots opacity-20" aria-hidden />
                      <div className="absolute start-5 top-5">
                        <Badge variant="default" className="bg-background/90 text-foreground">
                          {p.category}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="mt-5 text-balance text-[18px] font-semibold leading-[1.25] tracking-tight text-foreground transition-colors group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-ink-2">
                      {p.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-[12px] text-ink-3">
                      {p.author ? (
                        <>
                          <span className="font-medium text-ink-2">
                            {t("by")} {p.author}
                          </span>
                          <span aria-hidden>·</span>
                        </>
                      ) : null}
                      {p.date ? <span className="tabular">{p.date}</span> : null}
                      {p.readTime ? (
                        <>
                          <span aria-hidden>·</span>
                          <span className="tabular">
                            {p.readTime} {t("readTimeLabel")}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-background">
          <div className="container-narrow py-16 md:py-24">
            <div className="rounded-[var(--radius-2xl)] border border-border bg-card p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
                <div>
                  <h2 className="max-w-xl text-balance text-[26px] font-semibold tracking-tight text-foreground md:text-[34px]">
                    {t("ctaTitle")}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14.5px] text-ink-2">{t("ctaBody")}</p>
                </div>
                <NewsletterForm
                  placeholder={t("ctaEmailPlaceholder")}
                  cta={t("ctaButton")}
                  successTitle={ar ? "تمّ الاشتراك" : "Inscription enregistrée"}
                  successBody={
                    ar
                      ? "ستتلقّى أوّل نشرة في الجمعة القادمة."
                      : "Tu recevras la prochaine newsletter vendredi."
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* trailing arrow link to home */}
        <section className="bg-background pb-16">
          <div className="container-narrow">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-2 transition-colors hover:text-accent"
            >
              <Arrow className="h-4 w-4 rotate-180 rtl-flip" />
              {ar ? "العودة إلى الصّفحة الرّئيسيّة" : "Retour à l'accueil"}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
