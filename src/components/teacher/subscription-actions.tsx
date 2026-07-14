"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/lib/toast";

// `PlanSelectButton` was dropped with the Starter/Pro/Agency plan cards
// (Batch 6 — agency RIP + locked-in default 4: progressive revenue tier is
// the only pricing model). InvoiceDownloadButton + ChangePaymentButton are
// still wired into the subscription page header / invoices section.

export function InvoiceDownloadButton({
  invoiceId,
  label,
}: {
  invoiceId: string;
  label: string;
}) {
  const tt = useTranslations("teacher.subscription.toasts");
  const { show } = useToast();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={() =>
        show({
          title: tt("invoiceDownloaded.title"),
          description: tt("invoiceDownloaded.desc", { id: invoiceId }),
          variant: "success",
        })
      }
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}

export function ChangePaymentButton({ label }: { label: string }) {
  const tPayment = useTranslations("teacher.subscription.payment");
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tPayment("changeTitle")}</DialogTitle>
          <DialogDescription>{tPayment("changeBody")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="primary" onClick={() => setOpen(false)}>
            {tPayment("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
