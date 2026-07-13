"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, Inbox, MapPin, X, Sparkles, Send, Clock, Wallet } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { studentRequests, type StudentRequest } from "@/lib/mock/dashboard";
import { learningRequests, type LearningRequest } from "@/lib/mock/requests";
import { useToast } from "@/lib/toast";
import { formatPrice, cn } from "@/lib/utils";

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

  // Open student learning requests — proposal opportunities. Filter to
  // status="open" and cap at 8 so the list stays scannable.
  const openOpportunities = React.useMemo(
    () => learningRequests.filter((r) => r.status === "open").slice(0, 8),
    [],
  );
  const [proposedIds, setProposedIds] = React.useState<Set<string>>(new Set());
  const [composeTarget, setComposeTarget] = React.useState<LearningRequest | null>(null);

  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    opportunities: openOpportunities.length - proposedIds.size,
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
          <TabsTrigger value="opportunities">
            Opportunités
            <span className="ms-2 rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold tabular text-success">
              {counts.opportunities}
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

        <TabsContent value="opportunities">
          <OpportunityList
            locale={locale}
            opportunities={openOpportunities.filter((o) => !proposedIds.has(o.id))}
            onCompose={(req) => setComposeTarget(req)}
          />
        </TabsContent>
      </Tabs>

      {/* Proposal compose dialog */}
      <ProposalComposeDialog
        target={composeTarget}
        locale={locale}
        onClose={() => setComposeTarget(null)}
        onSubmit={(req) => {
          setProposedIds((prev) => {
            const next = new Set(prev);
            next.add(req.id);
            return next;
          });
          show({
            title: "Proposition envoyée",
            description: `Votre proposition pour "${req.title[locale]}" a été envoyée à l'élève.`,
            variant: "success",
          });
          setComposeTarget(null);
        }}
      />

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

// Marketplace opportunities: open student learning requests the teacher
// can respond to with a proposal. Mirrors the Upwork proposal flow —
// pitch + quoted price + optional timeline.
function OpportunityList({
  locale,
  opportunities,
  onCompose,
}: {
  locale: "fr" | "ar";
  opportunities: LearningRequest[];
  onCompose: (r: LearningRequest) => void;
}) {
  if (opportunities.length === 0) {
    return (
      <div className="grid place-items-center rounded-[var(--radius-xl)] border border-dashed border-border bg-card px-6 py-16 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-ink-3">
          <Sparkles className="h-5 w-5" aria-hidden />
        </span>
        <p className="mt-3 max-w-sm text-pretty text-sm text-ink-3">
          Aucune demande ouverte ne correspond à vos sujets pour l'instant. Vérifiez plus tard, ou proposez plus de fiches pour élargir votre visibilité.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {opportunities.map((r) => (
        <li
          key={r.id}
          className="grid gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-start sm:p-5"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" className="gap-1">
                <Sparkles className="h-3 w-3" aria-hidden />
                Opportunité
              </Badge>
              <Badge variant="default">{r.subject[locale]}</Badge>
              <span className="inline-flex items-center gap-1 text-[11px] tabular text-ink-3">
                <Clock className="h-3 w-3" aria-hidden />
                Fenêtre 7 jours
              </span>
            </div>
            <h3 className="mt-2 text-[15px] font-semibold text-foreground">
              {r.title[locale]}
            </h3>
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
              {r.body[locale]}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold tabular text-foreground">
              <Wallet className="h-3.5 w-3.5 text-ink-3" aria-hidden />
              {formatPrice(r.budgetDzd.min, locale)} – {formatPrice(r.budgetDzd.max, locale)}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Button size="sm" variant="primary" onClick={() => onCompose(r)}>
              <Send className="h-3.5 w-3.5" aria-hidden />
              Envoyer une proposition
            </Button>
            <span className="text-[11px] text-ink-3">Compétition avec d'autres profs</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ProposalComposeDialog({
  target,
  locale,
  onClose,
  onSubmit,
}: {
  target: LearningRequest | null;
  locale: "fr" | "ar";
  onClose: () => void;
  onSubmit: (r: LearningRequest) => void;
}) {
  const [price, setPrice] = React.useState<string>("");
  const [pitch, setPitch] = React.useState<string>("");
  const [timeline, setTimeline] = React.useState<string>("");

  React.useEffect(() => {
    if (target) {
      // Pre-fill price with the midpoint of the student's budget range.
      const mid = Math.round((target.budgetDzd.min + target.budgetDzd.max) / 2);
      setPrice(String(mid));
      setPitch("");
      setTimeline("2 séances par semaine");
    }
  }, [target]);

  const priceNum = Number(price);
  const canSubmit = target !== null && priceNum > 0 && pitch.trim().length >= 20;

  return (
    <Dialog open={target !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Envoyer une proposition</DialogTitle>
          <DialogDescription>
            {target
              ? `Pour "${target.title[locale]}" · budget indiqué ${formatPrice(target.budgetDzd.min, locale)} – ${formatPrice(target.budgetDzd.max, locale)}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {target && (
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="proposal-price">Votre prix (DZD)</Label>
              <Input
                id="proposal-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min={0}
                className="max-w-40"
              />
              <p className="text-[11px] text-ink-3">
                Budget de l'élève : {formatPrice(target.budgetDzd.min, locale)} – {formatPrice(target.budgetDzd.max, locale)}
              </p>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="proposal-timeline">Rythme proposé</Label>
              <Input
                id="proposal-timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="Ex : 2 séances par semaine"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="proposal-pitch">Votre pitch</Label>
              <Textarea
                id="proposal-pitch"
                rows={5}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Décrivez votre approche, ce que l'élève va accomplir, votre expérience sur ce sujet…"
              />
              <p className="text-[11px] text-ink-3">
                Minimum 20 caractères. Les propositions détaillées sont acceptées 3× plus souvent.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            disabled={!canSubmit}
            onClick={() => target && onSubmit(target)}
          >
            <Send className="h-3.5 w-3.5" aria-hidden />
            Envoyer la proposition
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
