"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Send, Shield, Check } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StateBadge } from "@/components/app/disputes/state-badge";
import { Timeline } from "@/components/app/disputes/timeline";
import { MessageBubble } from "@/components/app/chat/message-bubble";
import type { ChatMessage } from "@/lib/mock/chats";
import type { Dispute, DisputeMessage } from "@/lib/mock/disputes";
import { useCurrentUser } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { cn, formatPrice } from "@/lib/utils";

export function DisputeDetail({ dispute }: { dispute: Dispute }) {
  const t = useTranslations("app.disputes");
  const tc = useTranslations("app.common");
  const tt = useTranslations("app.disputes.toasts");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;
  const [refundPct, setRefundPct] = React.useState<number[]>([dispute.refundProposedPct ?? 50]);
  const [proposedPct, setProposedPct] = React.useState<number | undefined>(dispute.refundProposedPct);
  const [response, setResponse] = React.useState("");
  const [messages, setMessages] = React.useState<DisputeMessage[]>(dispute.messages);
  const [mediationOpen, setMediationOpen] = React.useState(false);
  const [mediationText, setMediationText] = React.useState("");
  const { user } = useCurrentUser();
  const { show } = useToast();

  // Identity for outbound dispute messages. The DisputeMessage `authorId`
  // is a constrained enum that means "the viewer", so we always stamp
  // "u-self" — but the name/initials hydrate from the current account so the
  // bubble shows the right person.
  const selfName: { fr: string; ar: string } = user?.studentName
    ? { fr: user.studentName, ar: user.studentName }
    : { fr: "Lina M.", ar: "لينا م." };
  const selfInitials = user?.studentInitials ?? "LM";
  const selfAccent = "from-[#2F6BFF] to-[#3E8FD0]";

  const fmtDay = new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const buildSelfMessage = (text: string): DisputeMessage => ({
    id: `local-${Date.now()}`,
    authorId: "u-self" as const,
    authorName: selfName,
    authorInitials: selfInitials,
    authorAccent: selfAccent,
    at: new Date().toISOString(),
    text: { fr: text, ar: text },
  });

  const submitResponse = () => {
    const v = response.trim();
    if (!v) return;
    setMessages((arr) => [...arr, buildSelfMessage(v)]);
    setResponse("");
  };

  const submitMediation = () => {
    const v = mediationText.trim();
    if (!v) {
      show({ title: tt("mediationEmpty.title"), description: tt("mediationEmpty.desc"), variant: "danger" });
      return;
    }
    setMessages((arr) => [...arr, buildSelfMessage(v)]);
    setMediationText("");
    setMediationOpen(false);
    show({ title: tt("mediationSent.title"), description: tt("mediationSent.desc"), variant: "success" });
  };

  const submitRefundProposal = () => {
    const pct = refundPct[0];
    setProposedPct(pct);
    show({
      title: tt("refundProposalSent.title"),
      description: tt("refundProposalSent.desc", {
        pct,
        amount: formatPrice(Math.round((dispute.amountDzd * pct) / 100), locale),
      }),
      variant: "success",
    });
  };

  return (
    <section className="container-narrow py-8">
      {/* Back rail */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/disputes">
            <Back className="h-4 w-4" />
            {tc("back")}
          </Link>
        </Button>
      </div>

      {/* Editorial header */}
      <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex items-baseline gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-3">
            <span className="ink-rule" aria-hidden />
            <span>{t("detail.id")}</span>
            <span aria-hidden>·</span>
            <span className="font-mono tracking-tight text-foreground">{dispute.id}</span>
          </div>
          <h1 className="mt-3 max-w-3xl text-[28px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[36px] lg:text-[40px]">
            <span className="text-balance">{dispute.title[lang]}</span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-2">
            <span>{dispute.subject.course[lang]}</span>
            <span aria-hidden>·</span>
            <span className="tabular">{dispute.subject.sessionLabel[lang]}</span>
            <span aria-hidden>·</span>
            <span className="font-mono tabular font-semibold text-foreground">
              {formatPrice(dispute.amountDzd, locale)}
            </span>
          </div>
        </div>
        <StateBadge state={dispute.state} size="lg" />
      </header>

      {/* Claim summary card */}
      <div className="mb-8 grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1 md:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-[#2F6BFF] to-[#3E8FD0] text-white text-xs">
              {selfInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("detail.openedBy")}
            </p>
            <p className="text-sm font-medium text-foreground">{t("detail.you")}</p>
            <p className="text-xs text-ink-3 tabular">{fmtDay.format(new Date(dispute.openedAt))}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
            {t("detail.claimTitle")}
          </p>
          <p className="mt-1.5 text-pretty text-sm text-foreground">{dispute.claim[lang]}</p>
        </div>
      </div>

      {/* Two columns: timeline + action panel */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {/* Timeline section */}
          <section className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1">
            <header className="mb-6 flex items-baseline gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                01
              </span>
              <h2 className="text-sm font-medium text-foreground">{t("detail.timeline")}</h2>
              <span aria-hidden className="h-px flex-1 bg-border" />
            </header>
            <Timeline entries={dispute.timeline} currentState={dispute.state} />
          </section>

          {/* Messages section */}
          <section className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-e1">
            <header className="mb-4 flex items-baseline gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                02
              </span>
              <h2 className="text-sm font-medium text-foreground">{t("detail.messages")}</h2>
              <span aria-hidden className="h-px flex-1 bg-border" />
            </header>
            {messages.length === 0 ? (
              <p className="px-1 py-6 text-sm text-ink-3">{tc("noContent")}</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => {
                  const chatMsg: ChatMessage = {
                    id: m.id,
                    authorId: m.authorId,
                    authorName: m.authorName,
                    authorInitials: m.authorInitials,
                    authorAccent: m.authorAccent,
                    at: m.at,
                    text: m.text,
                  };
                  const isMine = m.authorId === "u-self";
                  return (
                    <MessageBubble
                      key={m.id}
                      message={chatMsg}
                      mine={isMine}
                      showAuthor={!isMine}
                    />
                  );
                })}
              </ul>
            )}
            {/* Composer */}
            <div className="mt-4 grid gap-2 border-t border-border pt-4">
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={t("composer.placeholder")}
                rows={3}
              />
              <Button onClick={submitResponse} disabled={!response.trim()} variant="primary" size="md" className="ms-auto">
                <Send className="h-4 w-4 rtl-flip" />
                {t("composer.send")}
              </Button>
            </div>
          </section>
        </div>

        {/* Sticky action panel */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-5">
            {/* Parties card */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                {t("detail.parties")}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-[#2F6BFF] to-[#3E8FD0] text-white text-xs">
                      {selfInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{t("detail.you")}</p>
                    <p className="text-xs text-ink-3">{t("actor.student")}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={cn("bg-gradient-to-br text-white text-xs", dispute.counterparty.accent)}>
                      {dispute.counterparty.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {dispute.counterparty.name[lang]}
                    </p>
                    <p className="text-xs text-ink-3">{t("actor.teacher")}</p>
                  </div>
                </li>
                {dispute.state === "in-mediation" && (
                  <li className="flex items-center gap-3 rounded-[var(--radius-sm)] bg-accent-soft/40 p-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-[#1C3A5E] to-[#102338] text-white text-xs">
                        DM
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{t("detail.mediator")}</p>
                      <p className="text-xs text-ink-3">{t("actor.mediator")}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                {t("detail.actions")}
              </h3>

              {(dispute.state === "open" || dispute.state === "awaiting-response") && (
                <Dialog open={mediationOpen} onOpenChange={setMediationOpen}>
                  <DialogTrigger asChild>
                    <Button variant="primary" size="md" className="w-full">
                      <Shield className="h-4 w-4" />
                      {t("actions.mediation.title")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("actions.mediation.dialogTitle")}</DialogTitle>
                      <DialogDescription>{t("actions.mediation.dialogBody")}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-2">
                      <Textarea
                        value={mediationText}
                        onChange={(e) => setMediationText(e.target.value)}
                        placeholder={t("composer.placeholder")}
                        rows={4}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                          setMediationText("");
                          setMediationOpen(false);
                        }}
                      >
                        {tc("cancel")}
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={submitMediation}
                        disabled={!mediationText.trim()}
                      >
                        {t("actions.mediation.submit")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {dispute.state === "in-mediation" && (
                <div className="grid gap-3">
                  <div>
                    <p className="text-[11px] font-medium text-foreground">
                      {t("actions.resolve.refundLabel")}
                    </p>
                    <div className="mt-1.5 grid items-center gap-2">
                      <Slider
                        value={refundPct}
                        onValueChange={setRefundPct}
                        min={0}
                        max={100}
                        step={5}
                        ariaLabel={t("actions.resolve.refundLabel")}
                        format={(n) =>
                          `${n}% · ${formatPrice(Math.round((dispute.amountDzd * n) / 100), locale)}`
                        }
                      />
                    </div>
                    {proposedPct !== undefined && (
                      <p className="mt-2 text-[11px] text-ink-3 tabular">
                        {tt("proposalLabel", {
                          pct: proposedPct,
                          amount: formatPrice(Math.round((dispute.amountDzd * proposedPct) / 100), locale),
                        })}
                      </p>
                    )}
                  </div>
                  <Button variant="success" size="md" onClick={submitRefundProposal}>
                    <Check className="h-4 w-4" />
                    {t("actions.resolve.submit")}
                  </Button>
                </div>
              )}

              {(dispute.state === "resolved" || dispute.state === "refunded") && (
                <Badge variant="success" className="w-full justify-center">
                  <Check className="h-3 w-3" />
                  {t(`state.${dispute.state}`)}
                </Badge>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
