"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck, Landmark, Loader2, Pencil, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  getPayoutMethod,
  setPayoutMethod,
  subscribePayouts,
  type PayoutMethod,
} from "@/lib/mock/payouts-state";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const BANK_KEYS = [
  "bna",
  "bea",
  "cpa",
  "badr",
  "bdl",
  "agb",
  "sga",
  "trust",
  "ccp",
] as const;

type BankKey = (typeof BANK_KEYS)[number];

function getServerSnapshot(): PayoutMethod | null {
  return null;
}

/**
 * Bank / RIB management island. Renders either:
 *  - an empty state + form when no method exists,
 *  - a summary card (masked RIB + verified badge) with an "Edit" toggle
 *    that re-opens the form when one is already stored.
 */
export function PayoutMethodForm() {
  const t = useTranslations("payouts.method");
  const tt = useTranslations("payouts.toasts");
  const locale = useLocale() as "fr" | "ar";
  const { user } = useCurrentUser();
  const { show } = useToast();

  const accountId = user?.id ?? null;
  const getSnapshot = React.useCallback(() => getPayoutMethod(accountId), [accountId]);
  const method = React.useSyncExternalStore<PayoutMethod | null>(
    subscribePayouts,
    getSnapshot,
    getServerSnapshot,
  );

  // Editing mode is auto-true when there's no method yet; toggleable when
  // one exists so the summary card can switch back into the form.
  const [editing, setEditing] = React.useState(false);
  React.useEffect(() => {
    if (!method) setEditing(true);
  }, [method]);

  const defaultHolder = React.useMemo(() => {
    if (method?.accountHolder) return method.accountHolder;
    // Pull a sensible default from the teacher seed when the current user
    // is the demo teacher. Brand-new sign-ups land on an empty string.
    if (user?.role === "teacher") {
      return locale === "ar" ? "خليل بن سعيد" : "Khalil Bensaïd";
    }
    return "";
  }, [method, user, locale]);

  const [bank, setBank] = React.useState<BankKey>((method?.bankName as BankKey) ?? "bna");
  const [holder, setHolder] = React.useState(defaultHolder);
  const [rib, setRib] = React.useState(method?.rib ?? "");
  const [bic, setBic] = React.useState(method?.bic ?? "");
  const [ribError, setRibError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  // Re-sync local state when the store value changes (e.g. after save).
  React.useEffect(() => {
    if (method) {
      setBank((method.bankName as BankKey) ?? "bna");
      setHolder(method.accountHolder);
      setRib(method.rib);
      setBic(method.bic ?? "");
    }
  }, [method]);

  function validateRib(raw: string): string | null {
    const trimmed = raw.replace(/\s+/g, "");
    if (!/^\d*$/.test(trimmed)) return t("ribErrorDigits");
    if (trimmed.length !== 20) return t("ribErrorLength");
    return null;
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId) return;
    const error = validateRib(rib);
    if (error) {
      setRibError(error);
      show({
        title: tt("ribInvalid.title"),
        description: tt("ribInvalid.desc"),
        variant: "danger",
      });
      return;
    }
    setRibError(null);
    startTransition(() => {
      setPayoutMethod(accountId, {
        bankName: bank,
        accountHolder: holder.trim() || defaultHolder,
        rib: rib.replace(/\s+/g, ""),
        bic: bic.trim() || undefined,
      });
      setEditing(false);
      show({
        title: tt("methodSaved.title"),
        description: tt("methodSaved.desc"),
        variant: "success",
      });
    });
  }

  function handleVerify() {
    show({
      title: tt("verifyStarted.title"),
      description: tt("verifyStarted.desc"),
      variant: "default",
    });
  }

  const bankLabel = (key: BankKey) => t(`banks.${key}`);
  const maskedTail = method ? method.rib.slice(-4) : "";

  // ─────────────────────────────────────────────────────────────
  // Summary view — only shown when a method exists AND we're not editing.
  // ─────────────────────────────────────────────────────────────
  if (method && !editing) {
    return (
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.5fr_1fr]">
          <div className="border-b border-border p-6 lg:border-b-0 lg:border-e">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("summaryLabel")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-surface text-ink-2">
                <Landmark className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-foreground">
                  {bankLabel(method.bankName as BankKey)}
                </p>
                <p className="mt-0.5 font-mono text-[13px] tabular-nums text-ink-2">
                  •••• •••• •••• {maskedTail}
                </p>
              </div>
              <Badge variant={method.verified ? "success" : "warning"}>
                {method.verified ? t("verifiedBadge") : t("unverifiedBadge")}
              </Badge>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                  {t("accountHolderLabel")}
                </dt>
                <dd className="mt-1 text-foreground">{method.accountHolder}</dd>
              </div>
              {method.bic && (
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                    {t("bicLabel")}
                  </dt>
                  <dd className="mt-1 font-mono tabular-nums text-foreground">{method.bic}</dd>
                </div>
              )}
              <div className="col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                  {t("addedOn", {
                    date: new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(method.addedAt)),
                  })}
                </dt>
              </div>
            </dl>
            <div className="mt-5">
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" aria-hidden />
                {t("edit")}
              </Button>
            </div>
          </div>

          <div className="bg-surface/60 p-6">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
              {method.verified ? (
                <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5 text-warning" aria-hidden />
              )}
              {t("verifyTitle")}
            </p>
            <p className="mt-2 text-[13px] text-ink-2">{t("verifyBody")}</p>
            <Button
              variant={method.verified ? "ghost" : "primary"}
              size="sm"
              className="mt-4"
              onClick={handleVerify}
              disabled={method.verified}
              title={method.verified ? t("verifiedBadge") : undefined}
            >
              {t("verifyAction")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Form view — empty state + first-time setup, OR edit toggle.
  // ─────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSave}
      className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card"
    >
      {!method && (
        <div className="border-b border-border bg-surface/60 p-6">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
            <Landmark className="h-4 w-4 text-ink-2" aria-hidden />
            {t("emptyTitle")}
          </p>
          <p className="mt-1.5 text-[13px] text-ink-2">{t("emptyBody")}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="bank">{t("bankLabel")}</Label>
          <Select value={bank} onValueChange={(v) => setBank(v as BankKey)}>
            <SelectTrigger id="bank">
              <SelectValue placeholder={t("bankPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {BANK_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {bankLabel(k)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="holder">{t("accountHolderLabel")}</Label>
          <Input
            id="holder"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            autoComplete="off"
            required
          />
          <p className="text-[11px] text-ink-3">{t("accountHolderHint")}</p>
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="rib">{t("ribLabel")}</Label>
          <Input
            id="rib"
            value={rib}
            onChange={(e) => {
              setRib(e.target.value);
              if (ribError) setRibError(null);
            }}
            autoComplete="off"
            inputMode="numeric"
            maxLength={24}
            dir="ltr"
            className={cn(
              "font-mono tabular-nums",
              ribError && "border-danger focus-visible:border-danger",
            )}
            placeholder="00000000000000000000"
            aria-invalid={Boolean(ribError)}
            aria-describedby={ribError ? "rib-error" : "rib-hint"}
          />
          {ribError ? (
            <p id="rib-error" className="text-[11px] font-medium text-danger">
              {ribError}
            </p>
          ) : (
            <p id="rib-hint" className="text-[11px] text-ink-3">
              {t("ribHint")}
            </p>
          )}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="bic">{t("bicLabel")}</Label>
          <Input
            id="bic"
            value={bic}
            onChange={(e) => setBic(e.target.value)}
            autoComplete="off"
            dir="ltr"
            className="font-mono tabular-nums"
            placeholder="BNAMDZALXXX"
          />
          <p className="text-[11px] text-ink-3">{t("bicHint")}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-surface/40 px-6 py-4">
        {method && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
          >
            {t("cancel")}
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          <span className={pending ? "opacity-0" : ""}>{t("save")}</span>
        </Button>
      </div>
    </form>
  );
}
