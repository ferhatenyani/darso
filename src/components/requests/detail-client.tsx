"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Link2,
  Lock,
  MessageSquare,
  Send,
  Star,
  X as XIcon,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useCurrentUser } from "@/lib/auth";
import {
  getRequestById,
  subscribeRequests,
  updateRequest,
} from "@/lib/mock/learning-requests-state";
import { useToast } from "@/lib/toast";
import type {
  LearningRequest,
  RequestApplication,
  RequestStatus,
} from "@/lib/mock/requests";
import { cn, formatPrice } from "@/lib/utils";
import { formatPostedAt, statusVariant, urgencyStripClass } from "./helpers";

export function RequestDetailClient({
  request: initialRequest,
}: {
  request: LearningRequest;
}) {
  const t = useTranslations("requests");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Arrow = locale === "ar" ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const { show } = useToast();
  const { user } = useCurrentUser();

  // Re-derive the request from the live store on every store tick so
  // in-session edits (status flips, content changes) reflect here without
  // a navigation. The server-rendered prop is used as the initial value;
  // the store seed contains the same record.
  const getLiveRequest = useCallback(
    () => getRequestById(initialRequest.slug) ?? initialRequest,
    [initialRequest],
  );
  const request = useSyncExternalStore(
    subscribeRequests,
    getLiveRequest,
    getLiveRequest,
  );

  const isOwner = !!request.ownedByCurrentUser;
  const [linkCopied, setLinkCopied] = useState(false);
  const [awardedId, setAwardedId] = useState<string | null>(
    request.applications.find((a) => a.isAwarded)?.id ?? null,
  );
  const [acceptCandidate, setAcceptCandidate] = useState<RequestApplication | null>(
    null,
  );

  // status flows through the store now; derive from the subscribed record.
  const status: RequestStatus = request.status;

  const indexNumber = parseInt(request.id.replace(/^[^0-9]+/, "")) || 1;

  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => {
        setLinkCopied(true);
        window.setTimeout(() => setLinkCopied(false), 2200);
      })
      .catch(() => undefined);
  }

  function acceptApplication(app: RequestApplication) {
    setAwardedId(app.id);
    updateRequest(request.id, { status: "awarded" });
    setAcceptCandidate(null);
    show({
      title: t("toasts.applicationAccepted.title"),
      description: t("toasts.applicationAccepted.desc", {
        teacher: app.teacher.name[lang],
      }),
      variant: "success",
    });
  }

  function handleMessage(app: RequestApplication) {
    show({
      title: t("toasts.messageOpening.title"),
      description: t("toasts.messageOpening.desc"),
    });
    // Try to find an existing 1:1 thread with this teacher.
    // The mock chat module uses `th-<firstName>` as ids — best-effort match
    // on the teacher slug's first segment; otherwise just open the inbox.
    const firstName = app.teacher.slug.split("-")[0];
    const threadId = `th-${firstName}`;
    router.push(`/messages/${threadId}` as never);
  }

  function handleClose() {
    updateRequest(request.id, { status: "closed" });
    show({
      title: t("toasts.closed.title"),
      description: t("toasts.closed.desc"),
      variant: "warning",
    });
  }

  function handleReopen() {
    updateRequest(request.id, { status: "open" });
    show({
      title: t("toasts.reopened.title"),
      description: t("toasts.reopened.desc"),
      variant: "success",
    });
  }

  function handleEdit() {
    router.push(`/requests/${request.slug}/edit` as never);
  }

  const student = request.anonymous
    ? {
        name: t("shared.anonymous.name"),
        initials: t("shared.anonymous.initials"),
        accent: "from-ink-3 to-ink-2",
        city: request.city[lang],
      }
    : {
        name: request.student.name[lang],
        initials: request.student.initials,
        accent: request.student.accent,
        city: request.student.city[lang],
      };

  return (
    <>
      {/* Top breadcrumb / index strip */}
      <section className="border-b border-border bg-surface/40">
        <div className="container-narrow flex flex-wrap items-center justify-between gap-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-foreground"
          >
            <Arrow className="h-3.5 w-3.5" />
            {t("detail.backToList")}
          </Link>
          <span className="tabular">
            {t("detail.indexLabel", {
              n: String(indexNumber).padStart(3, "0"),
            })}
          </span>
        </div>
      </section>

      {/* HEADER */}
      <section className="border-b border-border bg-background">
        <div className="container-narrow grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            {/* Status + urgency strip */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    urgencyStripClass(request.urgency),
                  )}
                />
                {t(`shared.urgency.${request.urgency}`)}
              </span>
              <Badge variant={statusVariant(status)}>
                {t(`shared.status.${status}`)}
              </Badge>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
                {t("detail.postedLabel")} ·{" "}
                {formatPostedAt(request.postedAtHours, t)}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 text-balance text-[34px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[44px]">
              {request.title[lang]}
            </h1>

            {/* Student mini-card */}
            <div className="mt-6 flex items-center gap-3 border-s-2 border-accent ps-4">
              <Avatar className="h-12 w-12 shadow-e1">
                <AvatarFallback
                  className={cn("bg-gradient-to-br text-sm text-white", student.accent)}
                >
                  {student.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold text-foreground">
                  {student.name}
                  {request.anonymous && (
                    <Lock className="ms-2 inline h-3.5 w-3.5 -translate-y-0.5 text-ink-3" />
                  )}
                </p>
                <p className="text-[12px] text-ink-3 font-mono">
                  {student.city}
                </p>
              </div>
            </div>

            {/* META rail */}
            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-5 sm:grid-cols-3 font-mono">
              <MetaItem
                label={t("detail.header.budgetLabel")}
                value={
                  <span className="tabular">
                    {formatPrice(request.budgetDzd.min, locale)}
                    <span className="px-1 text-ink-3">–</span>
                    {formatPrice(request.budgetDzd.max, locale)}
                  </span>
                }
              />
              <MetaItem
                label={t("detail.header.deadlineLabel")}
                value={request.deadline[lang]}
              />
              <MetaItem
                label={t("detail.header.modeLabel")}
                value={t(
                  request.mode === "online"
                    ? "shared.modes.online"
                    : request.mode === "in-person"
                      ? "shared.modes.inPerson"
                      : "shared.modes.both",
                )}
              />
              <MetaItem
                label={t("detail.header.cityLabel")}
                value={request.city[lang]}
              />
              <MetaItem
                label={t("detail.header.audienceLabel")}
                value={t(`shared.audience.${request.audience}`)}
              />
              <MetaItem
                label={t("detail.header.levelLabel")}
                value={request.level[lang]}
              />
            </dl>

            {/* Tabs */}
            <Tabs defaultValue="applications" className="mt-8">
              <TabsList className="bg-surface">
                <TabsTrigger value="applications">
                  {t("detail.applicationsTab", {
                    count: request.applicationCount,
                  })}
                </TabsTrigger>
                <TabsTrigger value="discussion">
                  {t("detail.discussionTab")}
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  {t("detail.timelineTab")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="applications">
                {/* BODY summary */}
                <section className="mt-6">
                  <h2 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                    {t("detail.body.title")}
                  </h2>
                  <p className="mt-3 max-w-3xl whitespace-pre-line text-pretty text-[15px] leading-relaxed text-ink-2">
                    {request.body[lang]}
                  </p>
                </section>

                <Separator className="my-8" />

                {/* APPLICATIONS */}
                <section>
                  <header className="mb-5 flex items-baseline justify-between gap-4 border-b border-border pb-3">
                    <div>
                      <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
                        {t("detail.applications.title")}
                      </h2>
                      <p className="mt-1 text-[12.5px] text-ink-3">
                        {t("detail.applications.subtitle")}
                      </p>
                    </div>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
                      {t("detail.applicationsTab", {
                        count: request.applications.length,
                      })}
                    </span>
                  </header>

                  {request.applications.length === 0 ? (
                    <ApplicationsEmpty />
                  ) : (
                    <ul className="space-y-4">
                      {request.applications.map((app, i) => (
                        <li key={app.id}>
                          <ApplicationCard
                            app={app}
                            index={i + 1}
                            awarded={app.id === awardedId}
                            onAccept={() => setAcceptCandidate(app)}
                            onMessage={() => handleMessage(app)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </TabsContent>

              <TabsContent value="discussion">
                <DiscussionPanel
                  currentUser={
                    user
                      ? {
                          name:
                            user.studentName ?? user.email.split("@")[0] ?? "—",
                          initials:
                            user.studentInitials ??
                            (user.studentName ?? user.email)
                              .slice(0, 2)
                              .toUpperCase(),
                          accent: "from-[#1C3A5E] to-[#2F6BFF]",
                        }
                      : null
                  }
                />
              </TabsContent>

              <TabsContent value="timeline">
                <TimelinePanel
                  request={request}
                  awardedId={awardedId}
                  status={status}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* OWNER RAIL */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <OwnerRail
                request={request}
                status={status}
                isOwner={isOwner}
                onCopy={copyLink}
                linkCopied={linkCopied}
                onEdit={handleEdit}
                onClose={handleClose}
                onReopen={handleReopen}
              />
            </div>
          </aside>
        </div>
      </section>

      {/* ACCEPT DIALOG */}
      <Dialog
        open={!!acceptCandidate}
        onOpenChange={(o) => !o && setAcceptCandidate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("detail.acceptDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("detail.acceptDialog.body", {
                teacher: acceptCandidate?.teacher.name[lang] ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptCandidate(null)}>
              {t("detail.acceptDialog.cancel")}
            </Button>
            <Button
              variant="success"
              onClick={() => acceptCandidate && acceptApplication(acceptCandidate)}
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("detail.acceptDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function ApplicationCard({
  app,
  index,
  awarded,
  onAccept,
  onMessage,
}: {
  app: RequestApplication;
  index: number;
  awarded: boolean;
  onAccept: () => void;
  onMessage: () => void;
}) {
  const t = useTranslations("requests");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  return (
    <article
      className={cn(
        "relative isolate overflow-hidden rounded-[var(--radius-lg)] border bg-card text-card-foreground transition-all",
        awarded
          ? "border-success/40 shadow-e2 bg-success/[0.03]"
          : "border-border hover:border-accent/40",
      )}
    >
      {/* Strip + index */}
      <header
        className={cn(
          "flex items-center justify-between border-b border-border bg-surface/60 ps-5 pe-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3",
          awarded && "bg-success/10 border-success/30",
        )}
      >
        <span className="tabular">
          {t("detail.applications.applyCardLabel", {
            n: String(index).padStart(2, "0"),
          })}
        </span>
        <div className="flex items-center gap-2 normal-case tracking-normal">
          {awarded && (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              {t("detail.applications.awardedBadge")}
            </Badge>
          )}
          <span className="text-[10px] tracking-wider">
            {formatPostedAt(app.createdAtHours, t)}
          </span>
        </div>
      </header>

      <div className="grid gap-5 p-5 md:grid-cols-[auto_1fr_auto]">
        {/* Teacher card */}
        <div className="flex items-start gap-3 md:max-w-[14rem]">
          <Avatar className="h-12 w-12 shadow-e1">
            <AvatarFallback
              className={cn("bg-gradient-to-br text-sm text-white", app.teacher.accent)}
            >
              {app.teacher.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Link
              href={`/teachers/${app.teacher.slug}` as never}
              className="text-[14.5px] font-semibold text-foreground hover:text-accent"
            >
              {app.teacher.name[lang]}
            </Link>
            <p className="mt-0.5 line-clamp-2 text-[12px] text-ink-3 leading-snug">
              {app.teacher.headline[lang]}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-[12px] text-ink-2">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-semibold text-foreground tabular">
                {app.teacher.rating.toFixed(2)}
              </span>
              <span className="text-ink-3"> · {app.teacher.reviews}</span>
            </p>
          </div>
        </div>

        {/* Proposal */}
        <div className="border-s border-dashed border-border ps-5">
          <p className="whitespace-pre-line text-pretty text-[13.5px] leading-relaxed text-ink-2">
            {app.proposalMessage[lang]}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5 text-ink-3" />
              <span className="text-ink-3 uppercase tracking-wider text-[10px]">
                {t("detail.applications.availability")}
              </span>
              <span className="font-medium text-foreground normal-case tracking-normal">
                {app.availabilityNote[lang]}
              </span>
            </span>
          </div>
        </div>

        {/* Rate + actions */}
        <div className="flex flex-col items-stretch gap-2 md:items-end md:text-end">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-3">
              {t("detail.applications.rateLabel")}
            </p>
            <p className="mt-1 text-[22px] font-bold tabular text-foreground">
              {formatPrice(app.proposedRateDzd, locale)}
              <span className="text-[12px] font-medium text-ink-3 ms-1">
                {t("detail.applications.perHour")}
              </span>
            </p>
          </div>
          <div className="mt-1 flex flex-row gap-2 md:flex-col">
            <Button variant="outline" size="sm" className="flex-1" onClick={onMessage}>
              <MessageSquare className="h-4 w-4" />
              {t("detail.applications.messageBtn")}
            </Button>
            <Button
              variant={awarded ? "secondary" : "primary"}
              size="sm"
              className="flex-1"
              disabled={awarded}
              onClick={onAccept}
            >
              <CheckCircle2 className="h-4 w-4" />
              {awarded
                ? t("detail.applications.awardedBadge")
                : t("detail.applications.acceptBtn")}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ApplicationsEmpty() {
  const t = useTranslations("requests");
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/40 p-8 text-center">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-3">
        00 / 00
      </p>
      <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-foreground">
        {t("detail.applications.empty.title")}
      </h3>
      <p className="mt-2 mx-auto max-w-md text-[13.5px] leading-relaxed text-ink-2">
        {t("detail.applications.empty.body")}
      </p>
    </div>
  );
}

type DiscussionMessage = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorAccent: string;
  text: string;
  at: number;
};

function DiscussionPanel({
  currentUser,
}: {
  currentUser: { name: string; initials: string; accent: string } | null;
}) {
  const t = useTranslations("requests");
  const { show } = useToast();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);

  const youLabel = t("detail.discussion.composer.you");
  const displayName = currentUser?.name ?? youLabel;
  const displayInitials = currentUser?.initials ?? "??";
  const displayAccent = currentUser?.accent ?? "from-ink-3 to-ink-2";

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `dm-${Date.now().toString(36)}`,
        authorName: displayName,
        authorInitials: displayInitials,
        authorAccent: displayAccent,
        text,
        at: Date.now(),
      },
    ]);
    setDraft("");
    show({
      title: t("toasts.messagePosted.title"),
      description: t("toasts.messagePosted.desc"),
      variant: "success",
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card p-5">
      {messages.length === 0 ? (
        <div className="grid place-items-center border border-dashed border-border bg-surface/40 p-10 rounded-[var(--radius-md)]">
          <div className="max-w-md text-center">
            <Lock className="mx-auto h-6 w-6 text-ink-3" />
            <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-foreground">
              {t("detail.discussion.empty.title")}
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
              {t("detail.discussion.empty.body")}
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface/30 p-3"
            >
              <Avatar className="h-9 w-9 shrink-0 shadow-e1">
                <AvatarFallback
                  className={cn(
                    "bg-gradient-to-br text-[11px] text-white",
                    m.authorAccent,
                  )}
                >
                  {m.authorInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold text-foreground">
                    {m.authorName}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
                    {new Date(m.at).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink-2">
                  {m.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Composer */}
      <form
        className="mt-4 flex items-center gap-2 border-t border-dashed border-border pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("detail.discussion.composer.placeholder")}
          className="flex-1"
          aria-label={t("detail.discussion.composer.placeholder")}
        />
        <Button type="submit" variant="primary" size="md" disabled={!draft.trim()}>
          <Send className="h-4 w-4" />
          {t("detail.discussion.composer.send")}
        </Button>
      </form>
    </div>
  );
}

function TimelinePanel({
  request,
  awardedId,
  status,
}: {
  request: LearningRequest;
  awardedId: string | null;
  status: RequestStatus;
}) {
  const t = useTranslations("requests");

  const steps = [
    { key: "posted", done: true, label: t("detail.timeline.posted") },
    {
      key: "firstApp",
      done: request.applicationCount > 0,
      label: t("detail.timeline.firstApp"),
    },
    {
      key: "negotiating",
      done:
        status === "negotiating" ||
        status === "awarded" ||
        status === "closed",
      label: t("detail.timeline.negotiating"),
    },
    {
      key: "awarded",
      done: !!awardedId || status === "awarded",
      label: t("detail.timeline.awarded"),
    },
    {
      key: "closed",
      done: status === "closed",
      label: t("detail.timeline.closed"),
    },
  ];

  return (
    <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card p-6">
      <h2 className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
        {t("detail.timeline.title")}
      </h2>
      <ol className="mt-5 space-y-4">
        {steps.map((s, i) => (
          <li key={s.key} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full border text-[11px] font-mono font-semibold tabular",
                  s.done
                    ? "border-success bg-success text-success-foreground"
                    : "border-border bg-surface text-ink-3",
                )}
              >
                {s.done ? "✓" : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "mt-1 h-8 w-px",
                    s.done ? "bg-success/40" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className="-mt-0.5 pb-2">
              <p
                className={cn(
                  "text-[13.5px] font-semibold",
                  s.done ? "text-foreground" : "text-ink-3",
                )}
              >
                {s.label}
              </p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-ink-3">
                {s.done ? t("detail.postedLabel") : t("detail.timeline.pending")}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function OwnerRail({
  request,
  status,
  isOwner,
  onCopy,
  linkCopied,
  onEdit,
  onClose,
  onReopen,
}: {
  request: LearningRequest;
  status: RequestStatus;
  isOwner: boolean;
  onCopy: () => void;
  linkCopied: boolean;
  onEdit: () => void;
  onClose: () => void;
  onReopen: () => void;
}) {
  const t = useTranslations("requests");
  return (
    <div className="space-y-4">
      {/* Status block */}
      <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
            {t("detail.rail.statusLabel")}
          </p>
          <Badge variant={statusVariant(status)}>
            {t(`shared.status.${status}`)}
          </Badge>
        </div>
        <dl className="mt-4 space-y-3 text-[12.5px]">
          <DlRow
            label={t("detail.rail.applicationCount", {
              count: request.applicationCount,
            })}
          />
          <DlRow label={t("detail.rail.postedOn")} value={formatPostedAt(request.postedAtHours, t)} />
          <DlRow
            label={t("detail.rail.lastActivity")}
            value={formatPostedAt(
              Math.min(
                ...request.applications.map((a) => a.createdAtHours),
                request.postedAtHours,
              ),
              t,
            )}
          />
          <DlRow
            label={t("detail.rail.audienceSummary")}
            value={t(`shared.audience.${request.audience}`)}
          />
        </dl>
      </div>

      {/* Owner actions */}
      {isOwner && (
        <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-accent">
            {t("detail.rail.ownerTitle")}
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
            {t("detail.rail.ownerNote")}
          </p>
          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-start"
              onClick={onEdit}
            >
              <Edit3 className="h-4 w-4" />
              {t("detail.rail.edit")}
            </Button>
            {status !== "closed" ? (
              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start text-danger hover:bg-danger/10 hover:text-danger"
                onClick={onClose}
              >
                <XIcon className="h-4 w-4" />
                {t("detail.rail.close")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start"
                onClick={onReopen}
              >
                <ChevronRight className="h-4 w-4" />
                {t("detail.rail.reopen")}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Share block */}
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-3">
          {t("detail.rail.shareTitle")}
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
          {t("detail.rail.shareNote")}
        </p>
        <Button
          variant="outline"
          size="md"
          className="mt-3 w-full justify-center"
          onClick={onCopy}
        >
          <Link2 className="h-4 w-4" />
          {linkCopied ? t("detail.rail.linkCopied") : t("detail.rail.copyLink")}
        </Button>
      </div>
    </div>
  );
}

function DlRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-border pb-2 last:border-0 last:pb-0">
      <dt className="text-ink-3">{label}</dt>
      {value && <dd className="font-mono text-[11.5px] text-foreground tabular">{value}</dd>}
    </div>
  );
}
