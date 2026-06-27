"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, Plus, Scale } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StateBadge } from "@/components/app/disputes/state-badge";
import { DisputeOpenDialog } from "@/components/disputes/dispute-open-dialog";
import {
  getDisputes,
  subscribeDisputes,
  EMPTY_DISPUTES,
} from "@/lib/mock/disputes-state";
import type { Dispute } from "@/lib/mock/disputes";
import { useCurrentUser } from "@/lib/auth";
import { cn, formatPrice } from "@/lib/utils";

type Filter = "open" | "resolved" | "all";

function partition(d: Dispute, f: Filter) {
  if (f === "all") return true;
  if (f === "open") return ["open", "awaiting-response", "in-mediation"].includes(d.state);
  return ["resolved", "refunded", "rejected"].includes(d.state);
}

// SSR fallback for useSyncExternalStore — module state isn't seeded on the
// server until first read, so render an empty list and let the client
// hydrate the real one.
const getServerSnapshot = (): readonly Dispute[] => EMPTY_DISPUTES;

export function DisputesShell() {
  const t = useTranslations("app.disputes");
  const tOpen = useTranslations("app.disputes.open");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const [tab, setTab] = React.useState<Filter>("open");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const { user } = useCurrentUser();

  const fmtShort = new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    day: "numeric",
    month: "short",
  });
  const fmtRel = new Intl.RelativeTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", { numeric: "auto" });

  // Live-subscribe to the dispute store. We surface ALL disputes here (no
  // account filter) so the seeded mock catalogue still renders for any
  // signed-in viewer — newly opened disputes are tagged with the current
  // user id, so they always appear too.
  const getSnapshot = React.useCallback(() => getDisputes(), []);
  const disputes = React.useSyncExternalStore<readonly Dispute[]>(
    subscribeDisputes,
    getSnapshot,
    getServerSnapshot,
  );

  const filtered = disputes.filter((d) => partition(d, tab));

  // Controlled open state so the primary CTA opens the same dialog instance
  // (we don't need React.cloneElement here — the button is right next to it).
  const [openDialog, setOpenDialog] = React.useState(false);
  // Avoid an unused-locals warning when we later branch on the hook return
  // for anonymous gating — the dialog itself short-circuits anonymous
  // visitors when its trigger fires, but the standalone primary CTA owns
  // its own open state and needs the same guard.
  void user;

  return (
    <section className="container-narrow py-10">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
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
        </div>

        {/* "+ Start a dispute" primary CTA. Uses the shared dialog in
            controlled mode so the button copy lives entirely in the shell. */}
        <DisputeOpenDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          trigger={
            <Button
              type="button"
              variant="primary"
              size="md"
              className="self-start sm:self-end"
            >
              <Plus className="h-4 w-4" />
              <span className="ms-1">{tOpen("cta")}</span>
            </Button>
          }
        />
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Filter)}>
        <TabsList>
          <TabsTrigger value="open">{t("tabs.open")}</TabsTrigger>
          <TabsTrigger value="resolved">{t("tabs.resolved")}</TabsTrigger>
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-6">
          {filtered.length === 0 ? (
            <DisputesEmpty />
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

function DisputesEmpty() {
  const t = useTranslations("app.disputes.list.empty");
  return (
    <EmptyState
      icon={Scale}
      tone="success"
      title={t("title")}
      description={t("body")}
      secondary={{ label: t("learnMore"), href: "/trust" }}
    />
  );
}
