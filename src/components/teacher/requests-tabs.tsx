"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, Inbox, MapPin, X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { studentRequests, type StudentRequest } from "@/lib/mock/dashboard";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type Status = "pending" | "accepted" | "rejected";

// Pick the first known student-side teacher slug as a safe fallback for the
// "View profile" link on accepted/rejected rows. (Audit line 237: previously
// hard-coded to /teachers/student, which 404'd.)
const FALLBACK_PROFILE_SLUG = "khalil-bensaid";

export function RequestsTabs({ locale }: { locale: "fr" | "ar" }) {
  const t = useTranslations("teacher.requests");
  const tt = useTranslations("teacher.requests.toasts");
  const { show } = useToast();
  const [requests, setRequests] = React.useState<StudentRequest[]>(studentRequests);
  const [confirm, setConfirm] = React.useState<{ open: boolean; type: "accept" | "reject"; req?: StudentRequest }>({
    open: false,
    type: "accept",
  });

  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const handleConfirm = () => {
    const req = confirm.req;
    if (!req) {
      setConfirm((c) => ({ ...c, open: false }));
      return;
    }
    if (confirm.type === "accept") {
      setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: "accepted" } : r)));
      show({
        title: tt("accepted.title"),
        description: tt("accepted.desc", { name: req.student.name[locale] }),
        variant: "success",
      });
    } else {
      setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: "rejected" } : r)));
      show({
        title: tt("rejected.title"),
        description: tt("rejected.desc", { name: req.student.name[locale] }),
        variant: "warning",
      });
    }
    setConfirm((c) => ({ ...c, open: false }));
  };

  return (
    <>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            {t("tabs.pending")}
            <span className="ms-2 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold tabular text-accent">
              {counts.pending}
            </span>
          </TabsTrigger>
          <TabsTrigger value="accepted">
            {t("tabs.accepted")}
            <span className="ms-2 text-[10px] tabular text-ink-3">{counts.accepted}</span>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            {t("tabs.rejected")}
            <span className="ms-2 text-[10px] tabular text-ink-3">{counts.rejected}</span>
          </TabsTrigger>
        </TabsList>

        {(["pending", "accepted", "rejected"] as Status[]).map((status) => (
          <TabsContent key={status} value={status}>
            <List
              locale={locale}
              status={status}
              requests={requests}
              onAccept={(req) => setConfirm({ open: true, type: "accept", req })}
              onReject={(req) => setConfirm({ open: true, type: "reject", req })}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={confirm.open} onOpenChange={(o) => setConfirm((c) => ({ ...c, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm.type === "accept" ? t("confirm.acceptTitle") : t("confirm.rejectTitle")}
            </DialogTitle>
            <DialogDescription>
              {confirm.type === "accept" ? t("confirm.acceptBody") : t("confirm.rejectBody")}
            </DialogDescription>
          </DialogHeader>
          {confirm.type === "reject" && (
            <div className="grid gap-1.5">
              <Label htmlFor="rej-note">{t("confirm.note")}</Label>
              <Textarea id="rej-note" rows={3} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm((c) => ({ ...c, open: false }))}>
              {t("confirm.cancel")}
            </Button>
            <Button
              variant={confirm.type === "accept" ? "primary" : "danger"}
              onClick={handleConfirm}
            >
              {confirm.type === "accept" ? t("confirm.acceptCta") : t("confirm.rejectCta")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function List({
  locale,
  status,
  requests,
  onAccept,
  onReject,
}: {
  locale: "fr" | "ar";
  status: Status;
  requests: StudentRequest[];
  onAccept: (r: StudentRequest) => void;
  onReject: (r: StudentRequest) => void;
}) {
  const t = useTranslations("teacher.requests");
  const items = requests.filter((r) => r.status === status);

  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-[var(--radius-xl)] border border-dashed border-border bg-card px-6 py-16 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-ink-3">
          <Inbox className="h-5 w-5" aria-hidden />
        </span>
        <p className="mt-3 max-w-sm text-pretty text-sm text-ink-3">{t(`empty.${status}`)}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((r, i) => (
        <li
          key={r.id}
          className={cn(
            "grid grid-cols-1 gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5",
            r.status === "accepted" && "border-success/30",
            r.status === "rejected" && "opacity-70",
          )}
        >
          <div className="flex items-start gap-3">
            <span className="mt-1 font-mono text-[10px] font-semibold tabular text-ink-3">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Avatar className="h-11 w-11">
              <AvatarFallback className={cn("text-[13px] text-primary-foreground", `bg-gradient-to-br ${r.student.accent}`)}>
                {r.student.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[14px] font-semibold text-foreground">{r.student.name[locale]}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] tabular text-ink-3">
                <MapPin className="h-3 w-3" aria-hidden />
                {r.student.location[locale]} · {r.sentAt[locale]}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <Badge variant="primary" className="mb-1">{r.course[locale]}</Badge>
            <p className="text-[13px] leading-relaxed text-ink-2">{r.message[locale]}</p>
          </div>

          {status === "pending" ? (
            <div className="flex flex-col gap-2 sm:items-end">
              <Button size="sm" variant="primary" onClick={() => onAccept(r)}>
                <Check className="h-3.5 w-3.5" aria-hidden />
                {t("accept")}
              </Button>
              <Button size="sm" variant="outline" onClick={() => onReject(r)}>
                <X className="h-3.5 w-3.5" aria-hidden />
                {t("reject")}
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" variant="ghost">
              <Link href={`/teachers/${FALLBACK_PROFILE_SLUG}`}>{t("viewProfile")}</Link>
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
