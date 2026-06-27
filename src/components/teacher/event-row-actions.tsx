"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Copy, X, Pencil } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/lib/auth/context";
import {
  addEvent,
  deleteEvent,
  getEventById,
} from "@/lib/mock/teacher-events-state";
import { useToast } from "@/lib/toast";

/**
 * Row-scoped actions for /teach/events. Edit links to the [id] page;
 * Duplicate seeds a new event from the row through the teacher-events
 * store (real mutation, no "Coming soon" toast); Cancel removes the
 * event via the store with a confirm dialog.
 */
export function EventRowActions({ eventId, locale }: { eventId: string; locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.events.actions");
  const tt = useTranslations("events.toasts");
  const { show } = useToast();
  const { user } = useCurrentUser();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  function duplicate() {
    const src = getEventById(eventId);
    if (!src) {
      show({ title: tt("duplicateFailed.title"), description: tt("duplicateFailed.desc"), variant: "danger" });
      return;
    }
    const suffix = locale === "ar" ? " (نسخة)" : " (copie)";
    addEvent({
      title: { fr: src.title.fr + suffix, ar: src.title.ar + suffix },
      format: src.format,
      description: src.description,
      start: src.start,
      end: src.end,
      timezone: src.timezone,
      capacity: src.capacity,
      targetAudience: src.targetAudience,
      language: src.language,
      priceDzd: src.priceDzd,
      isFree: src.isFree,
      refundPolicy: src.refundPolicy,
      status: "draft",
      accountId: user?.id ?? src.accountId,
    });
    show({
      title: tt("duplicated.title"),
      description: tt("duplicated.desc"),
      variant: "success",
    });
  }

  function cancelEvent() {
    const removed = deleteEvent(eventId);
    setConfirmOpen(false);
    if (!removed) {
      show({
        title: tt("cancelFailed.title"),
        description: tt("cancelFailed.desc"),
        variant: "danger",
      });
      return;
    }
    show({
      title: tt("cancelled.title"),
      description: tt("cancelled.desc"),
      variant: "warning",
    });
  }

  return (
    <>
      <Button asChild variant="outline" size="sm">
        <Link href={`/teach/events/${eventId}`}>
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          {locale === "ar" ? "تحرير" : "Modifier"}
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={t("more")}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={duplicate}>
            <Copy className="h-4 w-4" />
            {t("duplicate")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-danger focus:text-danger"
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <X className="h-4 w-4" />
            {t("cancel")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{tt("cancelConfirm.title")}</DialogTitle>
            <DialogDescription>{tt("cancelConfirm.body")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {tt("cancelConfirm.cancel")}
            </Button>
            <Button variant="danger" onClick={cancelEvent}>
              {tt("cancelConfirm.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
