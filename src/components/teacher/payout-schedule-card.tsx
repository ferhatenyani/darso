"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarClock, Coins, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/lib/auth";
import {
  getPayoutFrequency,
  getPendingAmount,
  nextPayoutDate,
  setPayoutFrequency,
  subscribePayouts,
  type PayoutFrequency,
} from "@/lib/mock/payouts-state";
import { useToast } from "@/lib/toast";
import { formatPrice } from "@/lib/utils";

type Snapshot = { freq: PayoutFrequency; pending: number };

// Cache snapshots per accountId so useSyncExternalStore's getSnapshot stays
// referentially stable between renders.
const _snapCache = new Map<string, Snapshot>();
function readSnapshot(accountId: string | null): Snapshot {
  if (!accountId) return { freq: "monthly", pending: 0 };
  const next: Snapshot = {
    freq: getPayoutFrequency(accountId),
    pending: getPendingAmount(accountId),
  };
  const prev = _snapCache.get(accountId);
  if (prev && prev.freq === next.freq && prev.pending === next.pending) return prev;
  _snapCache.set(accountId, next);
  return next;
}

const EMPTY_SNAP: Snapshot = { freq: "monthly", pending: 0 };
function getServerSnapshot(): Snapshot {
  return EMPTY_SNAP;
}

/**
 * Payout schedule card. Displays cadence + next payout date + pending
 * amount + a frequency selector (Monthly / Weekly / On-demand).
 *
 * The "next payout" is computed client-side from `today` via
 * `nextPayoutDate`. We render the initial value during SSR but flag the
 * date span as suppressHydrationWarning so that locale-formatted date
 * strings don't trip the React hydration mismatch warning when the
 * server-rendered "today" drifts past the client-rendered "now".
 */
export function PayoutScheduleCard() {
  const t = useTranslations("payouts.schedule");
  const tt = useTranslations("payouts.toasts");
  const locale = useLocale();
  const { user } = useCurrentUser();
  const { show } = useToast();

  const accountId = user?.id ?? null;
  const getSnap = React.useCallback(() => readSnapshot(accountId), [accountId]);
  const { freq, pending: pendingAmount } = React.useSyncExternalStore<Snapshot>(
    subscribePayouts,
    getSnap,
    getServerSnapshot,
  );

  const [draftFreq, setDraftFreq] = React.useState<PayoutFrequency>(freq);
  const [isPending, startTransition] = React.useTransition();

  // Re-sync the draft when the store value flips (e.g. another tab edit).
  React.useEffect(() => {
    setDraftFreq(freq);
  }, [freq]);

  // Compute next payout once on mount so SSR + first-render match.
  const nextDate = React.useMemo(() => nextPayoutDate(), []);
  const nextDateLabel = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(nextDate),
    [locale, nextDate],
  );

  function handleSaveFrequency() {
    if (!accountId || draftFreq === freq) return;
    startTransition(() => {
      setPayoutFrequency(accountId, draftFreq);
      show({
        title: tt("frequencyUpdated.title"),
        description: tt("frequencyUpdated.desc", { freq: t(`freq.${draftFreq}`) }),
        variant: "success",
      });
    });
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
        {/* Cadence */}
        <div className="border-b border-border p-6 md:border-b-0 md:border-e">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            <Repeat className="h-3.5 w-3.5" aria-hidden />
            {t("cadenceLabel")}
          </p>
          <p className="mt-3 text-[20px] font-semibold leading-snug tracking-tight text-foreground">
            {t("cadenceValue")}
          </p>
        </div>

        {/* Next payout */}
        <div className="border-b border-border p-6 md:border-b-0 md:border-e">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            {t("nextPayoutLabel")}
          </p>
          <p
            className="mt-3 text-[20px] font-semibold leading-snug tracking-tight text-foreground"
            suppressHydrationWarning
          >
            {nextDateLabel}
          </p>
        </div>

        {/* Pending amount */}
        <div className="bg-surface/60 p-6">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            <Coins className="h-3.5 w-3.5" aria-hidden />
            {t("pendingLabel")}
          </p>
          <p className="mt-3 text-[28px] font-semibold leading-none tabular-nums tracking-tight text-foreground">
            {formatPrice(pendingAmount, locale)}
          </p>
          <p className="mt-2 text-[11px] text-ink-3">{t("pendingHint")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-background p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="payout-frequency">{t("frequencyLabel")}</Label>
          <Select value={draftFreq} onValueChange={(v) => setDraftFreq(v as PayoutFrequency)}>
            <SelectTrigger id="payout-frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">{t("freq.monthly")}</SelectItem>
              <SelectItem value="weekly">{t("freq.weekly")}</SelectItem>
              <SelectItem value="ondemand">{t("freq.ondemand")}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-ink-3">{t("frequencyHint")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveFrequency}
          disabled={isPending || draftFreq === freq}
        >
          {t("saveFrequency")}
        </Button>
      </div>
    </div>
  );
}
