import { useLocale, useTranslations } from "next-intl";
import { Radio } from "lucide-react";
import { upcomingSessions } from "@/lib/mock/sessions";
import { cn } from "@/lib/utils";

export function LiveTicker() {
  const t = useTranslations("home.hero.ticker");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  const items = upcomingSessions.slice(0, 6);
  // Duplicated for seamless marquee loop
  const loop = [...items, ...items];

  return (
    <div
      className="relative border-y border-border bg-primary text-primary-foreground"
      aria-label={t("joinPrefix")}
    >
      <div className="container-narrow flex items-stretch overflow-hidden">
        <span className="z-10 -ms-5 me-3 hidden shrink-0 items-center gap-2 self-stretch border-e border-primary-foreground/15 ps-5 pe-4 text-[10px] font-bold uppercase tracking-[0.22em] sm:inline-flex">
          <Radio className="h-3 w-3 text-accent" />
          {t("joinPrefix")}
        </span>
        <div className="flex w-full overflow-hidden">
          <ul className="flex shrink-0 animate-marquee gap-10 whitespace-nowrap py-3 text-[12.5px] font-medium">
            {loop.map((s, i) => (
              <li key={`${s.id}-${i}`} className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-1.5 w-1.5 rounded-full",
                    s.state === "live" ? "bg-danger" : "bg-accent",
                  )}
                />
                <span className="font-semibold">{s.teacher.name[lang]}</span>
                <span className="text-primary-foreground/60">{t("dot")}</span>
                <span className="text-primary-foreground/85">{s.title[lang]}</span>
                <span className="text-primary-foreground/60">{t("dot")}</span>
                <span className="text-primary-foreground/70">{s.startsAt[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
