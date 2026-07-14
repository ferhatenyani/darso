import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const items: { quote: string; name: string; role: string }[] = t.raw("items");

  return (
    <section className="border-t border-border bg-background">
      <div className="container-narrow py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t("eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <figure
              key={i}
              className="relative flex h-full flex-col gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1"
            >
              <Quote className="h-7 w-7 text-accent/30" aria-hidden />
              <blockquote className="text-base leading-relaxed text-foreground">
                &laquo; {it.quote} &raquo;
              </blockquote>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <figcaption>
                  <p className="text-sm font-semibold text-foreground">{it.name}</p>
                  <p className="text-xs text-ink-3">{it.role}</p>
                </figcaption>
                <div className="flex items-center gap-0.5" aria-label="5 / 5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-3.5 w-3.5 fill-warning text-warning" />
                  ))}
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
