"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Copy, X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/lib/toast";

export function EventRowActions({ eventId, locale }: { eventId: string; locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.events.actions");
  const tt = useTranslations("teacher.events.toasts");
  const { show } = useToast();

  return (
    <>
      <Button asChild variant="outline" size="sm">
        <Link href={`/teach/events/${eventId}`}>{locale === "ar" ? "تحرير" : "Modifier"}</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={t("more")}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() =>
              show({
                title: tt("duplicated.title"),
                description: tt("duplicated.desc"),
                variant: "success",
              })
            }
          >
            <Copy className="h-4 w-4" />
            {t("duplicate")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-danger focus:text-danger"
            onSelect={() =>
              show({
                title: tt("cancelled.title"),
                description: tt("cancelled.desc"),
                variant: "warning",
              })
            }
          >
            <X className="h-4 w-4" />
            {t("cancel")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
