"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Check, X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { recentRequests, type JoinRequest } from "@/lib/mock/dashboard";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function PendingRequestsInbox({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.home.inbox");
  const tt = useTranslations("teacher.home.toasts");
  const { show } = useToast();
  const [requests, setRequests] = React.useState<JoinRequest[]>(recentRequests);

  const handleAccept = (req: JoinRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    show({
      title: tt("requestAccepted.title"),
      description: tt("requestAccepted.desc", { name: req.student.name[locale] }),
      variant: "success",
    });
  };

  const handleReject = (req: JoinRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    show({
      title: tt("requestRejected.title"),
      description: tt("requestRejected.desc", { name: req.student.name[locale] }),
      variant: "warning",
    });
  };

  return (
    <div className="mt-6 space-y-3">
      {requests.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-border bg-card px-4 py-8 text-center text-[13px] text-ink-3">
          {t("empty")}
        </p>
      ) : (
        requests.map((r) => (
          <article
            key={r.id}
            className="rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-colors hover:bg-surface/40"
          >
            <header className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={cn("text-[12px] text-primary-foreground", `bg-gradient-to-br ${r.student.accent}`)}>
                  {r.student.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-foreground">{r.student.name[locale]}</p>
                <p className="truncate text-[11px] text-ink-3 tabular">
                  {r.student.location[locale]} · {r.sentAt[locale]}
                </p>
              </div>
            </header>
            <p className="mt-2 line-clamp-2 text-[12px] text-ink-2">{r.excerpt[locale]}</p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="primary"
                className="h-8 flex-1 text-[12px]"
                onClick={() => handleAccept(r)}
              >
                <Check className="h-3 w-3" aria-hidden />
                {t("accept")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 flex-1 text-[12px]"
                onClick={() => handleReject(r)}
              >
                <X className="h-3 w-3" aria-hidden />
                {t("reject")}
              </Button>
            </div>
          </article>
        ))
      )}
      <Link
        href="/teach/requests"
        className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] bg-surface px-4 py-2.5 text-[13px] font-medium text-ink-2 hover:bg-surface-2 hover:text-foreground"
      >
        {t("viewAll")}
        <ArrowUpRight className="h-4 w-4 rtl-flip" aria-hidden />
      </Link>
    </div>
  );
}
