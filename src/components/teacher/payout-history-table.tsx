"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/auth";
import {
  getPayouts,
  subscribePayouts,
  type Payout,
  type PayoutStatus,
} from "@/lib/mock/payouts-state";
import { useToast } from "@/lib/toast";
import { formatPrice } from "@/lib/utils";

function getServerSnapshot(): readonly Payout[] {
  return EMPTY;
}
const EMPTY: readonly Payout[] = Object.freeze([]);

const STATUS_VARIANT: Record<PayoutStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

/**
 * Payout history table. Desktop: real <table>-like grid with thead.
 * Mobile (< md): stacked cards per row, matching the responsive convention
 * established in Batch 1 / Batch 3 (account-shell payments, subscription
 * invoices).
 */
export function PayoutHistoryTable() {
  const t = useTranslations("payouts.history");
  const tStatus = useTranslations("payouts.status");
  const tt = useTranslations("payouts.toasts");
  const locale = useLocale();
  const { user } = useCurrentUser();
  const { show } = useToast();

  const accountId = user?.id ?? null;
  const getSnapshot = React.useCallback(() => getPayouts(accountId), [accountId]);
  const payouts = React.useSyncExternalStore<readonly Payout[]>(
    subscribePayouts,
    getSnapshot,
    getServerSnapshot,
  );

  const fmtDate = React.useCallback(
    (iso: string) =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(iso)),
    [locale],
  );

  const handleDownload = (ref: string) => {
    show({
      title: tt("statementDownloaded.title"),
      description: tt("statementDownloaded.desc", { ref }),
      variant: "success",
    });
  };

  if (payouts.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-border bg-card p-8 text-center">
        <p className="text-[13px] text-ink-2">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
      {/* Desktop / tablet header — hidden below md */}
      <div className="hidden grid-cols-[1fr_1fr_1fr_1.4fr_0.8fr_44px] gap-3 border-b border-border bg-surface/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3 md:grid">
        <span>{t("thead.date")}</span>
        <span>{t("thead.reference")}</span>
        <span className="text-end">{t("thead.amount")}</span>
        <span>{t("thead.method")}</span>
        <span>{t("thead.status")}</span>
        <span className="sr-only">{t("thead.action")}</span>
      </div>

      <ul className="divide-y divide-border">
        {payouts.map((p) => (
          <li
            key={p.id}
            className="flex flex-col gap-2 px-5 py-4 text-[13px] md:grid md:grid-cols-[1fr_1fr_1fr_1.4fr_0.8fr_44px] md:items-center md:gap-3"
          >
            {/* Mobile: stacked dt/dd-style; Desktop: grid cells. */}
            <div className="flex items-center justify-between gap-3 md:contents">
              <span className="font-medium text-foreground md:font-normal md:text-ink-2 tabular-nums">
                {fmtDate(p.date)}
              </span>
              <span className="font-mono text-[12px] font-semibold tabular-nums text-foreground">
                {p.reference}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 md:contents">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 md:hidden">
                {t("thead.amount")}
              </span>
              <span className="font-semibold tabular-nums text-foreground md:text-end">
                {formatPrice(p.amountDzd, locale)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 md:contents">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 md:hidden">
                {t("thead.method")}
              </span>
              <span className="truncate font-mono text-[12px] tabular-nums text-ink-2">
                {p.methodLabel}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 md:contents">
              <Badge variant={STATUS_VARIANT[p.status]}>{tStatus(p.status)}</Badge>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDownload(p.reference)}
                aria-label={t("download")}
                title={t("download")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
