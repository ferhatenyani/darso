"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CancelSubscriptionDialog() {
  const t = useTranslations("teacher.subscription.cancel");
  return (
    <Dialog>
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
        <DialogFooter>
          <Button variant="primary">{t("keep")}</Button>
          <Button variant="outline">{t("confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
