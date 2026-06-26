"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Scale } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StateBadge } from "@/components/app/disputes/state-badge";
import { disputes, type Dispute } from "@/lib/mock/disputes";
import { cn, formatPrice } from "@/lib/utils";

type Filter = "open" | "resolved" | "all";

function partition(d: Dispute, f: Filter) {
  if (f === "all") return true;
  if (f === "open") return ["open", "awaiting-response", "in-mediation"].includes(d.state);
  return ["resolved", "refunded", "rejected"].includes(d.state);
}

export function DisputesShell() {
  const t = useTranslations("app.disputes");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const [tab, setTab] = React.useState<Filter>("open");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const fmtShort = new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    day: "numeric",
    month: "short",
  });
  const fmtRel = new Intl.RelativeTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", { numeric: "auto" });

  const filtered = disputes.filter((d) => partition(d, tab));

  return (
    <section className="container-narrow py-10">
      <header className="mb-8">
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-3">
          <span className="ink-rule" aria-hidden />
          <span>{t("title")}</span>
        </div>
        <h1
          className="mt-3 max-w-3xl font-serif text-4xl text-foreground sm:text-5xl"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          <span className="text-balance">{t("subtitle")}</span>
        </h1>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Filter)}>
        <TabsList>
          <TabsTrigger value="open">{t("tabs.open")}</TabsTrigger>
          <TabsTrigger value="resolved">{t("tabs.resolved")}</TabsTrigger>
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-6">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-e1">
              {filtered.map((d, idx) => {
                const opened = new Date(d.openedAt);
                const last = new Date(d.lastActivityAt);
                const lastH = Math.max(1, Math.round((Date.now() - last.getTime()) / 3600000));
                const lastLabel = lastH < 24
                  ? fmtRel.format(-lastH, "hour")
                  : fmtRel.format(-Math.round(lastH / 24), "day");
                return (
                  <li key={d.id} className="border-b border-border/70 last:border-b-0">
                    <Link
                      href={`/disputes/${d.id}` as never}
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface/40"
                    >
                      {/* Left: index + dispute id mono */}
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[12px] font-semibold text-foreground">
                          {d.id}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="truncate font-semibold text-foreground">{d.title[lang]}</p>
                          <span className="hidden text-xs text-ink-3 sm:inline">·</span>
                          <p className="hidden truncate text-xs text-ink-3 sm:inline">
                            {d.subject.course[lang]}
                          </p>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-3">
                          <span className="inline-flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback
                                className={cn("bg-gradient-to-br text-[9px] text-white", d.counterparty.accent)}
                              >
                                {d.counterparty.initials}
                              </AvatarFallback>
                            </Avatar>
                            {t("list.against", { name: d.counterparty.name[lang] })}
                          </span>
                          <span aria-hidden>·</span>
                          <span className="tabular">
                            {t("list.openedAt", { date: fmtShort.format(opened) })}
                          </span>
                          <span aria-hidden>·</span>
                          <span className="tabular">
                            {t("list.lastActivity", { time: lastLabel })}
                          </span>
                          <span aria-hidden>·</span>
                          <span className="font-mono tabular text-foreground">
                            {formatPrice(d.amountDzd, locale)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <StateBadge state={d.state} />
                        <Arrow className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl-flip" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

function EmptyState() {
  const t = useTranslations("app.disputes.list.empty");
  return (
    <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-card py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
        <Scale className="h-5 w-5" />
      </div>
      <h3
        className="mt-4 font-serif text-xl italic text-foreground"
        style={{ fontFamily: "ui-serif, Georgia, serif" }}
      >
        {t("title")}
      </h3>
      <p className="mt-2 max-w-sm text-pretty text-sm text-ink-2">{t("body")}</p>
    </div>
  );
}
