"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarPlus, Radio } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EventCard } from "@/components/marketing/event-card";
import { upcomingSessions, type Session } from "@/lib/mock/sessions";
import { routes } from "@/lib/routes";

type Tab = "now" | "soon" | "today" | "tomorrow";

/**
 * Live sessions & events discovery. Refactored to lean on the marketing
 * EventCard so the grid matches the homepage strip and the profile pages,
 * and to drop the legacy list-row layout which was inconsistent with the
 * card system elsewhere.
 */
export function LivePage() {
  const t = useTranslations("student.live");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const [tab, setTab] = useState<Tab>("now");

  const filterByTab = (s: Session) => {
    if (tab === "now") return s.state === "live";
    if (tab === "soon") return s.state === "soon";
    if (tab === "today")
      return s.state === "live" || s.state === "soon" || s.state === "later";
    return s.state === "tomorrow" || s.state === "this-week";
  };

  const sessions = useMemo(
    () => upcomingSessions.filter(filterByTab),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab],
  );

  const liveNow = upcomingSessions.filter((s) => s.state === "live").length;

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative isolate border-b border-border bg-background">
        {/* Signal ribbon — thin danger stripe up top to key the "live" theme */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-danger" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dots opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_80%)]"
        />
        <div className="container-standard py-10 md:py-14 lg:py-16">
          <div className="flex flex-wrap items-center gap-3">
            {liveNow > 0 ? (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-danger px-2.5 text-[11px] font-bold uppercase tracking-wider text-danger-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-danger-foreground/70 live-dot" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-danger-foreground" />
                </span>
                {t("liveNowLabel", { count: liveNow })}
              </span>
            ) : (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                <Radio className="h-3 w-3" aria-hidden />
                {t("noLiveNow")}
              </span>
            )}
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
              {t("eyebrow")}
            </p>
          </div>
          <h1 className="mt-3 max-w-3xl text-[32px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[40px] md:text-[48px]">
            {t("title")}{" "}
            <span className="font-light italic text-ink-2">{t("titleAccent")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>
        </div>
      </section>

      {/* ========== TABS + GRID ========== */}
      <section className="bg-surface/40">
        <div className="container-standard py-8 md:py-12">
          <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
            {/* Mobile: horizontal scroll to fit 4 tabs. Desktop: inline row. */}
            <div className="scroll-none -mx-4 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
              <TabsList className="inline-flex w-auto md:w-auto">
                <TabsTrigger value="now">{t("tabsNow")}</TabsTrigger>
                <TabsTrigger value="soon">{t("tabsSoon")}</TabsTrigger>
                <TabsTrigger value="today">{t("tabsToday")}</TabsTrigger>
                <TabsTrigger value="tomorrow">{t("tabsTomorrow")}</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={tab} className="mt-6">
              {sessions.length === 0 ? (
                <EmptyState />
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {sessions.map((s) => (
                    <li key={s.id}>
                      <EventCard session={s} />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>

          {/* Footer note — small hint about starting your own live */}
          <div className="mt-10 flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-dashed border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-surface text-ink-2"
              >
                <CalendarPlus className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-foreground">
                  {t("hostCtaTitle")}
                </p>
                <p className="mt-0.5 max-w-md text-[12.5px] leading-relaxed text-ink-2">
                  {t("hostCtaBody")}
                </p>
              </div>
            </div>
            <Button asChild variant="primary" size="md">
              <Link href={routes.teachLanding()}>{t("hostCta")}</Link>
            </Button>
          </div>

          {/* Suppress unused warning for `lang` — kept in case future
              localised copy uses the current language explicitly. */}
          <span className="hidden">{lang}</span>
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  const t = useTranslations("student.live");
  return (
    <div className="grid place-items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-ink-3">
        <Radio className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="text-[16px] font-semibold text-foreground">{t("emptyTitle")}</h3>
      <p className="max-w-md text-[13px] text-ink-2 text-pretty">{t("empty")}</p>
    </div>
  );
}
