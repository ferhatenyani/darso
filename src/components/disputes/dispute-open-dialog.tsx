"use client";

/**
 * Shared "Open a dispute" dialog — single client surface for the two entry
 * points Batch 5 wires:
 *   1. "+ Start a dispute" primary CTA at the top of /disputes
 *   2. Per-row "Report a problem" action on /account → Recent bookings
 *
 * Composes around an existing trigger button (cloned via React.cloneElement
 * so the call-site keeps its own variant/copy). The trigger is optional —
 * callers that own their own open state pass `open` / `onOpenChange`
 * directly (matches the CheckoutDialog pattern).
 *
 * On submit: creates a Dispute in the in-memory store
 * (src/lib/mock/disputes-state.ts), toasts success, navigates to the new
 * dispute's detail page.
 *
 * Anonymous gate mirrors CheckoutDialog: if !user we surface a toast +
 * push to /sign-in?next=... instead of opening the dialog.
 */

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Paperclip, ShieldCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import {
  addDispute,
  type DisputeReason,
} from "@/lib/mock/disputes-state";
import {
  getBookingsForAccount,
  subscribeBookings,
  type Booking,
} from "@/lib/mock/bookings-state";

/** Minimum dispute description length — guards against accidental noise. */
const MIN_DESCRIPTION_LENGTH = 20;

/** Sentinel value used when the user picks "Other" instead of a booking. */
const OTHER_SUBJECT = "other";

const REASONS: DisputeReason[] = [
  "teacher-no-show",
  "quality-issue",
  "payment-issue",
  "other",
];

// Stable empty snapshot for useSyncExternalStore SSR fallback.
const EMPTY_BOOKINGS: readonly Booking[] = Object.freeze([]);
const getServerSnapshot = (): readonly Booking[] => EMPTY_BOOKINGS;

export type DisputeOpenDialogProps = {
  /**
   * The button (or any element) that opens the dialog. Cloned with a click
   * handler so anonymous visitors get redirected to sign-in instead.
   *
   * Omit in favor of `open` / `onOpenChange` when the caller owns the
   * open state (e.g. the per-row "Report a problem" button on the account
   * shell renders a single shared dialog at the section level).
   */
  trigger?: React.ReactElement;
  /** Controlled open state — when present, `trigger` is ignored. */
  open?: boolean;
  /** Open-state setter for the controlled variant. */
  onOpenChange?: (next: boolean) => void;
  /**
   * Optional booking to pre-fill the subject dropdown. When provided, the
   * subject Select snaps to that booking and the description placeholder
   * hints at the booking title.
   */
  prefillBooking?: Booking;
  /**
   * Optional chat thread id to pre-fill the subject. Currently unused for
   * routing (we lean on bookings), but kept on the prop surface for the
   * "Open a dispute from a chat" entry point Batch 6 polish could add.
   */
  prefillThreadId?: string;
};

export function DisputeOpenDialog({
  trigger,
  open: controlledOpen,
  onOpenChange,
  prefillBooking,
  prefillThreadId: _prefillThreadId,
}: DisputeOpenDialogProps) {
  const t = useTranslations("app.disputes.open");
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

  // Live bookings for the current user — surfaced in the subject Select.
  const accountId = user?.id ?? null;
  const getSnapshot = React.useCallback(
    () => getBookingsForAccount(accountId),
    [accountId],
  );
  const bookings = React.useSyncExternalStore<readonly Booking[]>(
    subscribeBookings,
    getSnapshot,
    getServerSnapshot,
  );
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  // Form state
  const [subjectId, setSubjectId] = React.useState<string>(
    prefillBooking?.id ?? OTHER_SUBJECT,
  );
  const [reason, setReason] = React.useState<DisputeReason>("quality-issue");
  const [description, setDescription] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // When the prefillBooking prop changes (e.g. a different row opened the
  // dialog), snap the subject Select to match.
  React.useEffect(() => {
    if (prefillBooking) {
      setSubjectId(prefillBooking.id);
    }
  }, [prefillBooking]);

  // Reset form state every time the dialog closes so the next open starts
  // clean (unless prefillBooking is sticking us to a row).
  React.useEffect(() => {
    if (!open) {
      setSubjectId(prefillBooking?.id ?? OTHER_SUBJECT);
      setReason("quality-issue");
      setDescription("");
      setSubmitting(false);
    }
  }, [open, prefillBooking]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // belt + suspenders — anonymous gate handled above
    const trimmed = description.trim();
    if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
      show({
        title: t("toasts.descriptionTooShort.title"),
        description: t("toasts.descriptionTooShort.desc", {
          min: MIN_DESCRIPTION_LENGTH,
        }),
        variant: "danger",
      });
      return;
    }
    setSubmitting(true);
    try {
      // Resolve subject -> booking (or "other") so we can attach context
      // to the new dispute.
      const booking =
        subjectId !== OTHER_SUBJECT
          ? confirmedBookings.find((b) => b.id === subjectId)
          : undefined;

      const created = addDispute({
        accountId: user.id,
        bookingId: subjectId,
        reason,
        description: trimmed,
        subjectTitle: booking?.subjectTitle,
        teacherSlug: booking?.teacherSlug,
        amountDzd: booking?.priceDzd,
        openedAt: new Date().toISOString(),
        status: "open",
      });

      setOpen(false);
      show({
        title: t("toasts.opened.title"),
        description: t("toasts.opened.desc", { id: created.id }),
        variant: "success",
      });
      router.push(`/disputes/${created.id}` as never);
    } catch {
      // Fall through — addDispute is in-memory and currently can't throw,
      // but keep the surface symmetrical to CheckoutDialog.
      setSubmitting(false);
    }
  };

  // When the user has no bookings, the Select still renders the "Other"
  // option so the form remains usable.
  const subjectHasBookings = confirmedBookings.length > 0;

  return (
    <>
      {wrappedTrigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>
              <DialogDescription>{t("subtitle")}</DialogDescription>
            </DialogHeader>

            {/* Subject */}
            <div className="grid gap-2">
              <Label
                htmlFor="dispute-subject"
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3"
              >
                {t("subjectLabel")}
              </Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger id="dispute-subject">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjectHasBookings &&
                    confirmedBookings.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.subjectTitle[lang]}
                      </SelectItem>
                    ))}
                  <SelectItem value={OTHER_SUBJECT}>
                    {t("subjectOther")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reason */}
            <div className="grid gap-2">
              <Label
                htmlFor="dispute-reason"
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3"
              >
                {t("reasonLabel")}
              </Label>
              <Select
                value={reason}
                onValueChange={(v) => setReason(v as DisputeReason)}
              >
                <SelectTrigger id="dispute-reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(`reasons.${reasonKey(r)}` as never)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label
                htmlFor="dispute-description"
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3"
              >
                {t("descriptionLabel")}
              </Label>
              <Textarea
                id="dispute-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                minLength={MIN_DESCRIPTION_LENGTH}
                rows={5}
              />
              <p className="text-[11.5px] text-ink-3 tabular">
                {description.trim().length} / {MIN_DESCRIPTION_LENGTH}+
              </p>
            </div>

            {/* Attachments (non-functional placeholder) */}
            <div className="grid gap-2">
              <Label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                {t("attachmentsLabel")}
              </Label>
              <div
                aria-disabled
                className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-border bg-surface/30 px-4 py-6 text-center"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink-3">
                  <Paperclip className="h-4 w-4" />
                </span>
                <p className="text-[12.5px] font-medium text-ink-2">
                  {t("attachmentsHint")}
                </p>
              </div>
            </div>

            {/* Secure / mediation note */}
            <p className="flex items-start gap-1.5 text-[11.5px] text-ink-3">
              <ShieldCheck className="mt-0.5 h-3 w-3 text-success" />
              <span>{t("subtitle")}</span>
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting}
              >
                {submitting ? t("submitting") : t("submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Map enum kebab values to camelCase i18n keys. */
function reasonKey(r: DisputeReason): string {
  switch (r) {
    case "teacher-no-show":
      return "teacherNoShow";
    case "quality-issue":
      return "qualityIssue";
    case "payment-issue":
      return "paymentIssue";
    case "other":
      return "other";
  }
}
