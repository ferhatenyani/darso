"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Users, ArrowRight, ArrowLeft } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckoutDialog } from "@/components/booking/checkout-dialog";
import { upcomingSessions, type Session } from "@/lib/mock/sessions";
import { useToast } from "@/lib/toast";
import { cn, formatPrice } from "@/lib/utils";

export function LivePage() {
  const t = useTranslations("student.live");
  const tBooking = useTranslations("booking");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const { show } = useToast();
  const [tab, setTab] = useState<"now" | "soon" | "today" | "tomorrow">("now");

  const handleJoinLive = (sessionTitle: string) => {
    show({
      title: tBooking("toasts.joiningLive.title"),
      description: tBooking("toasts.joiningLive.desc", { title: sessionTitle }),
      variant: "default",
    });
  };

  const filterByTab = (s: Session) => {
    if (tab === "now") return s.state === "live";
    if (tab === "soon") return s.state === "soon";
    if (tab === "today") return s.state === "live" || s.state === "soon" || s.state === "later";
    return s.state === "tomorrow";
  };

  const sessions = upcomingSessions.filter(filterByTab);

  return (
    <>
      <section className="relative isolate border-b border-border bg-background">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-danger" />
        <div className="container-narrow py-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-danger px-2.5 text-[11px] font-bold uppercase tracking-wider text-danger-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-danger-foreground/70 live-dot" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-danger-foreground" />
              </span>
              {t("stateLive")}
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">{t("title")}</p>
          </div>
          <h1 className="mt-3 text-[36px] font-bold tracking-tight text-foreground md:text-[46px]">
            <span className="block">{t("title")}</span>
          </h1>
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-2">{t("subtitle")}</p>
        </div>
      </section>

      <section className="bg-surface/30">
        <div className="container-narrow py-10">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              <TabsTrigger value="now">{t("tabsNow")}</TabsTrigger>
              <TabsTrigger value="soon">{t("tabsSoon")}</TabsTrigger>
              <TabsTrigger value="today">{t("tabsToday")}</TabsTrigger>
              <TabsTrigger value="tomorrow">{t("tabsTomorrow")}</TabsTrigger>
            </TabsList>
            <TabsContent value={tab}>
              {sessions.length === 0 ? (
                <p className="mt-6 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-10 text-center text-[14px] text-ink-3">
                  {t("empty")}
                </p>
              ) : (
                <ul className="mt-6 grid gap-3">
                  {sessions.map((s, i) => {
                    const isLive = s.state === "live";
                    const left = s.capacity.total - s.capacity.taken;
                    return (
                      <li
                        key={s.id}
                        className={cn(
                          "grid grid-cols-[64px_1fr] items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-colors sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-4",
                          isLive && "border-danger/30 bg-gradient-to-r from-danger/[0.04] to-transparent",
                        )}
                      >
                        <div className="grid h-14 w-14 grid-rows-2 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface text-center sm:h-16 sm:w-16">
                          <div
                            className={cn(
                              "flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider",
                              isLive ? "bg-danger text-danger-foreground" : "bg-accent/10 text-accent",
                            )}
                          >
                            {isLive ? t("stateLive") : t("stateSoon")}
                          </div>
                          <div className="flex items-center justify-center text-[13px] font-semibold text-foreground tabular">
                            {s.startsAt[lang].split("·").pop()?.trim().replace("h", ":") ?? ""}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-[11px] text-ink-3">
                            <span className="tabular text-foreground">{String(i + 1).padStart(2, "0")}</span>
                            <span className="ink-rule" aria-hidden />
                            <span>{s.startsAt[lang]}</span>
                            {s.startsInMin && s.startsInMin > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 text-[10px] font-semibold text-accent">
                                <Clock className="h-2.5 w-2.5" />
                                {s.startsInMin}m
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-[15px] font-semibold text-foreground">{s.title[lang]}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className={cn("bg-gradient-to-br text-[9px] text-white", s.teacher.accent)}>
                                {s.teacher.initials}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-[12px] text-ink-2">
                              {t("with")} {s.teacher.name[lang]}
                            </p>
                            <span className="ms-2 inline-flex items-center gap-1 text-[11px] text-ink-3 tabular">
                              <Users className="h-3 w-3" />
                              {t("places", { taken: s.capacity.taken, total: s.capacity.total })}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2 mt-2 flex items-center justify-between gap-2 border-t border-border pt-3 sm:col-span-1 sm:mt-0 sm:flex-col sm:items-end sm:gap-1 sm:border-t-0 sm:pt-0">
                          <span className="text-[13px] font-semibold tabular text-foreground">
                            {formatPrice(s.priceDzd, locale)}
                          </span>
                          {isLive ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="danger"
                              onClick={() => handleJoinLive(s.title[lang])}
                            >
                              {t("joinNow")}
                              <Arrow className="h-3.5 w-3.5" />
                            </Button>
                          ) : (
                            <CheckoutDialog
                              kind="live"
                              subjectTitle={s.title}
                              teacherSlug={s.teacher.slug}
                              teacherName={s.teacher.name}
                              priceDzd={s.priceDzd}
                              scheduleLabel={s.startsAt}
                              trigger={
                                <Button type="button" size="sm" variant="primary">
                                  {t("reserve")}
                                  <Arrow className="h-3.5 w-3.5" />
                                </Button>
                              }
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
