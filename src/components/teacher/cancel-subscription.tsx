"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/toast";

export function CancelSubscriptionDialog() {
  const t = useTranslations("teacher.subscription.cancel");
  const tt = useTranslations("teacher.subscription.toasts");
  const locale = useLocale();
  const { show } = useToast();
  const [open, setOpen] = React.useState(false);
  // Destructive-confirm pattern mirroring the account delete dialog: the
  // teacher must type the locale-specific confirm word before the Confirm
  // button enables.
  const confirmWord = t("confirmWord");
  const [typed, setTyped] = React.useState("");
  const canConfirm = typed.trim().toUpperCase() === confirmWord.toUpperCase();

  // Reset the typed state whenever the dialog re-opens so a previous
  // attempt doesn't carry over.
  React.useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  // End-of-period date for the cancellation toast (1st of next month).
  const endDate = React.useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  }, [locale]);

  const handleKeep = () => {
    setOpen(false);
    show({
      title: tt("kept.title"),
      description: tt("kept.desc"),
      variant: "default",
    });
  };

  const handleConfirm = () => {
    setOpen(false);
    show({
      title: tt("cancelRequested.title"),
      description: tt("cancelRequested.desc", { date: endDate }),
      variant: "warning",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-xl)] border border-dashed border-danger/30 bg-card p-5 text-start text-[13px] font-medium text-danger transition-colors hover:bg-danger/5"
        >
          <span className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4" aria-hidden />
            {t("trigger")}
          </span>
          <span aria-hidden>→</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("body")}</DialogDescription>
        </DialogHeader>
        <div className="rounded-[var(--radius-md)] border border-accent/20 bg-accent-soft/40 p-3 text-[12px] text-ink-2">
          {t("retention")}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cancel-confirm" className="text-[12px] text-ink-2">
            {t("typeToConfirm", { word: confirmWord })}
          </Label>
          <Input
            id="cancel-confirm"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            placeholder={confirmWord}
            // Force LTR — the confirm word is always in Latin caps so the
            // visual feedback matches the rendered placeholder.
            dir="ltr"
          />
        </div>
        <DialogFooter>
          <Button variant="primary" onClick={handleKeep}>{t("keep")}</Button>
          <Button
            variant="outline"
            onClick={handleConfirm}
            disabled={!canConfirm}
            aria-disabled={!canConfirm}
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
