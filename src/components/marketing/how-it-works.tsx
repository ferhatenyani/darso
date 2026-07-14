import { useTranslations } from "next-intl";
import { Search, CalendarCheck, MessageSquareHeart } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("home.how");

  const steps = [
    { key: "browse", icon: Search },
    { key: "book", icon: CalendarCheck },
    { key: "learn", icon: MessageSquareHeart },
  ] as const;

  return (
    <section className="border-b border-border">
      <div className="container-narrow py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-[36px] font-bold leading-[0.98] tracking-tight text-foreground md:text-[42px]">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
              {t("subtitle")}
            </p>
          </div>

          <ol className="lg:col-span-8 grid gap-0 divide-y divide-border border-y border-border">
            {steps.map((step, i) => (
              <li key={step.key} className="grid grid-cols-[auto_auto_1fr] items-start gap-5 py-7 md:py-9">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular pt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-md)] bg-surface text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {t(`steps.${step.key}.title` as never)}
                  </h3>
                  <p className="mt-2 max-w-xl text-[15px] text-ink-2 leading-relaxed">
                    {t(`steps.${step.key}.body` as never)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
