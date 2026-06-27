"use client";

/**
 * Mock checkout dialog — the single entry point for every Reserve / Book /
 * Apply / Join CTA across the marketplace. Confirming creates a Booking in
 * the in-memory store, which surfaces on /account payments and /calendar
 * via subscribeBookings + useSyncExternalStore.
 *
 * Composes around an existing trigger button (cloned via React.cloneElement
 * so the call-site keeps its own variant/copy). Intercepts the click to
 * route anonymous visitors through sign-in — the proxy already redirects
 * gated routes, but Reserve buttons live on public pages too, and a hard
 * 302 from a dropdown trigger feels worse than a toast + push.
 */

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { CreditCard, ShieldCheck, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { addBooking, type BookingKind } from "@/lib/mock/bookings-state";
import {
  defaultMockPaymentMethods,
  type PaymentMethod,
} from "@/lib/mock/payments-state";
import { cn, formatPrice } from "@/lib/utils";

export type CheckoutDialogProps = {
  /** Booking-kind tag — drives summary copy and where it lands on /calendar. */
  kind: BookingKind;
  /** Localized human title (course, event, 1to1 slot subject…). */
  subjectTitle: { fr: string; ar: string };
  /** Slug of the teacher being booked — surfaced on /account & calendar. */
  teacherSlug: string;
  /** Teacher display name in both locales. */
  teacherName: { fr: string; ar: string };
  /** DZD price the visitor sees on the source page. */
  priceDzd: number;
  /** ISO start time if known (live session, scheduled cohort, 1to1 slot…). */
  start?: string;
  /** ISO end time if known. */
  end?: string;
  /** Optional secondary line shown in the summary (e.g. "Lundi · 14:00"). */
  scheduleLabel?: { fr: string; ar: string };
  /**
   * The button (or any element) that opens the dialog. Cloned with a click
   * handler so anonymous visitors get redirected to sign-in instead.
   *
   * Omit this in favor of the controlled `open` / `onOpenChange` props if
   * the dialog needs to be opened from an external state (e.g. the
   * availability grid pre-fills a slot then opens a single shared dialog).
   */
  trigger?: React.ReactElement;
  /** Controlled open state — when present, `trigger` is ignored. */
  open?: boolean;
  /** Open-state setter for the controlled variant. */
  onOpenChange?: (next: boolean) => void;
};

export function CheckoutDialog({
  kind,
  subjectTitle,
  teacherSlug,
  teacherName,
  priceDzd,
  start,
  end,
  scheduleLabel,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: CheckoutDialogProps) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const { show } = useToast();

  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (isControlled) onOpenChange?.(next);
      else setUncontrolledOpen(next);
    },
    [isControlled, onOpenChange],
  );

  const [paymentId, setPaymentId] = React.useState<string>("pm-default-1");
  const [submitting, setSubmitting] = React.useState(false);

  const methodLabels = {
    edahabia: t("methods.edahabia"),
    cib: t("methods.cib"),
    postalMandate: t("methods.postalMandate"),
    baridiMob: t("methods.baridiMob"),
  };
  const methods: PaymentMethod[] = React.useMemo(
    () => defaultMockPaymentMethods(methodLabels),
    // methodLabels are static per-render strings from t() so a single memo is fine
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  // Anonymous-visitor short-circuit. Toast + redirect instead of opening.
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      show({
        title: t("toasts.signInRequired.title"),
        description: t("toasts.signInRequired.desc"),
        variant: "warning",
      });
      // `pathname` from next-intl is locale-stripped; the sign-in action
      // expects an absolute path starting with "/" — locale-prefixing keeps
      // the post-sign-in redirect on the correct locale shell.
      const next = encodeURIComponent(`/${locale}${pathname}`);
      router.push(`/sign-in?next=${next}` as never);
      return;
    }
    setOpen(true);
  };

  // Clone trigger to inject our gated onClick (preserving its original handler).
  // Skipped entirely in controlled mode — the parent owns the open state.
  const wrappedTrigger = trigger
    ? React.cloneElement(
        trigger as React.ReactElement<{
          onClick?: (e: React.MouseEvent) => void;
        }>,
        {
          onClick: (e: React.MouseEvent) => {
            const original = (trigger.props as { onClick?: (e: React.MouseEvent) => void })
              ?.onClick;
            original?.(e);
            if (e.defaultPrevented) return;
            handleTriggerClick(e);
          },
        },
      )
    : null;

  const handleConfirm = async () => {
    if (!user) return; // belt + suspenders — gate already prevented open
    setSubmitting(true);
    try {
      const method = methods.find((m) => m.id === paymentId);
      addBooking({
        accountId: user.id,
        kind,
        subjectTitle,
        teacherSlug,
        teacherName,
        priceDzd,
        start,
        end,
        status: "confirmed",
        paymentLabel: method ? method.label : undefined,
      });
      setOpen(false);
      show({
        title: t("toasts.bookingConfirmed.title"),
        description: t("toasts.bookingConfirmed.desc", {
          subject: subjectTitle[lang],
        }),
        variant: "success",
      });
    } catch {
      show({
        title: t("toasts.bookingFailed.title"),
        description: t("toasts.bookingFailed.desc"),
        variant: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {wrappedTrigger}
      <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("checkout.title")}</DialogTitle>
            <DialogDescription>{t("checkout.subtitle")}</DialogDescription>
          </DialogHeader>

          {/* Summary card */}
          <section className="grid gap-3 rounded-[var(--radius-lg)] border border-border bg-surface/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                  {t(`kind.${kind}` as never)}
                </p>
                <p className="mt-1 text-[14.5px] font-semibold text-foreground">
                  {subjectTitle[lang]}
                </p>
                <p className="mt-0.5 text-[12px] text-ink-3">
                  {t("checkout.withTeacher", { name: teacherName[lang] })}
                </p>
              </div>
              <Badge variant="primary" className="shrink-0">
                {formatPrice(priceDzd, locale)}
              </Badge>
            </div>
            {scheduleLabel && (
              <p className="flex items-center gap-1.5 text-[12px] text-ink-2">
                <Sparkles className="h-3 w-3 text-accent" />
                {scheduleLabel[lang]}
              </p>
            )}
          </section>

          {/* Payment-method picker */}
          <section className="grid gap-2">
            <Label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
              {t("checkout.methodLabel")}
            </Label>
            <RadioGroup
              value={paymentId}
              onValueChange={setPaymentId}
              className="grid gap-2"
            >
              {methods.map((m) => (
                <Label
                  key={m.id}
                  htmlFor={`bk-${m.id}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border bg-card p-3",
                    paymentId === m.id
                      ? "border-accent shadow-e1"
                      : "border-border hover:border-border-strong",
                  )}
                >
                  <RadioGroupItem id={`bk-${m.id}`} value={m.id} />
                  <CreditCard className="h-4 w-4 text-ink-3" />
                  <span className="flex-1 text-[13.5px] font-semibold text-foreground">
                    {m.label}
                  </span>
                  {m.last4 && (
                    <span className="text-[11px] tabular text-ink-3">
                      •••• {m.last4}
                    </span>
                  )}
                  {m.isDefault && (
                    <Badge variant="success" className="ms-1">
                      ●
                    </Badge>
                  )}
                </Label>
              ))}
            </RadioGroup>
            <p className="flex items-start gap-1.5 text-[11px] text-ink-3">
              <ShieldCheck className="mt-0.5 h-3 w-3 text-success" />
              {t("checkout.secureNote")}
            </p>
          </section>

          <Separator />

          <div className="flex items-center justify-between text-[14px]">
            <span className="text-ink-2">{t("checkout.totalLabel")}</span>
            <span className="text-[18px] font-bold tabular text-foreground">
              {formatPrice(priceDzd, locale)}
            </span>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              {t("checkout.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting ? t("checkout.confirming") : t("checkout.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
