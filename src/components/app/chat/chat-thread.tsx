"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Info, Video, BellOff, Bell, ExternalLink } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ChatThread, ChatMessage } from "@/lib/mock/chats";
import { currentUser } from "@/lib/mock/chats";
import { useCurrentUser } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { MessageBubble } from "./message-bubble";
import { Composer } from "./composer";

type Props = { thread: ChatThread };

/**
 * Group messages by day for date separators.
 * Returns array of { dateLabel, messages[] }.
 */
function bucketByDay(messages: ChatMessage[], locale: string) {
  const fmtToday = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d0 = new Date(d);
    d0.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - d0.getTime()) / 86400000);
    if (diffDays === 0) return { kind: "today" as const };
    if (diffDays === 1) return { kind: "yesterday" as const };
    if (diffDays < 7)
      return {
        kind: "weekday" as const,
        label: new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
          weekday: "long",
        }).format(d),
      };
    return {
      kind: "date" as const,
      label: new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
        day: "numeric",
        month: "long",
      }).format(d),
    };
  };
  const buckets: { key: string; label: { kind: string; label?: string }; messages: ChatMessage[] }[] = [];
  for (const m of messages) {
    const d = new Date(m.at);
    const k = d.toISOString().slice(0, 10);
    let bucket = buckets.find((b) => b.key === k);
    if (!bucket) {
      bucket = { key: k, label: fmtToday(d), messages: [] };
      buckets.push(bucket);
    }
    bucket.messages.push(m);
  }
  return buckets;
}

export function ChatThreadView({ thread }: Props) {
  const t = useTranslations("app.messages");
  const tc = useTranslations("app.common");
  const tt = useTranslations("app.chat.toasts");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;
  const [localMsgs, setLocalMsgs] = React.useState<ChatMessage[]>(thread.messages);
  const [muted, setMuted] = React.useState(!!thread.muted);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const { user } = useCurrentUser();
  const { show } = useToast();
  // Sender id for outbound messages — current account if signed in, else
  // the legacy "u-self" mock so unauthenticated previews still render.
  const senderId = user?.id ?? currentUser.id;

  React.useEffect(() => {
    setLocalMsgs(thread.messages);
  }, [thread.messages]);

  React.useEffect(() => {
    // Scroll to bottom on mount or message change
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [localMsgs.length]);

  const onSend = (text: string) => {
    setLocalMsgs((arr) => [
      ...arr,
      {
        id: `local-${Date.now()}`,
        authorId: senderId,
        at: new Date().toISOString(),
        text: { fr: text, ar: text },
        status: "sent",
      },
    ]);
  };

  const buckets = bucketByDay(localMsgs, locale);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Header */}
      <header className="relative flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <Button asChild variant="ghost" size="icon" className="md:hidden">
          <Link href="/messages" aria-label={tc("back")}>
            <Back className="h-4 w-4" />
          </Link>
        </Button>

        {thread.kind === "1to1" && thread.teacher ? (
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={cn("bg-gradient-to-br text-white", thread.teacher.accent)}>
                {thread.teacher.initials}
              </AvatarFallback>
            </Avatar>
            {thread.online && (
              <span aria-hidden className="absolute -bottom-0.5 -end-0.5 inline-block h-3 w-3 rounded-full border-2 border-background bg-success" />
            )}
          </div>
        ) : (
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
              {(thread.participants?.[0]?.initials ?? "G").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{thread.title[lang]}</p>
            <Badge variant="outline" className="hidden sm:inline-flex">
              {t(`kind.${thread.kind}`)}
            </Badge>
          </div>
          <p className="text-xs text-ink-3">
            {thread.online ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                {tc("online")}
              </span>
            ) : thread.lastActiveLabel ? (
              tc("lastActive", { label: thread.lastActiveLabel[lang] })
            ) : (
              tc("offline")
            )}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label={t("thread.joinCall")}
          title={t("thread.joinCall")}
          onClick={() =>
            show({
              title: tt("videoComingSoon.title"),
              description: tt("videoComingSoon.desc"),
              variant: "default",
            })
          }
        >
          <Video className="h-5 w-5" />
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t("thread.info")} title={t("thread.info")}>
              <Info className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="end" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>{thread.title[lang]}</SheetTitle>
              <SheetDescription>
                {thread.kind === "1to1"
                  ? t(`kind.1to1`)
                  : t("thread.participants", { n: thread.participants?.length ?? 0 })}
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="space-y-6">
              {thread.courseLink && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3">
                    {t("thread.linkedTitle")}
                  </h3>
                  <Link
                    href={thread.courseLink.href as never}
                    className="group flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3 transition-colors hover:border-accent/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {thread.courseLink.label[lang]}
                      </p>
                      <p className="text-xs text-ink-3">{t("thread.viewCourse")}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-ink-3 transition-colors group-hover:text-accent rtl-flip" />
                  </Link>
                </section>
              )}

              {thread.participants && thread.participants.length > 0 && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3">
                    {t("thread.membersTitle")}
                  </h3>
                  <ul className="space-y-1.5">
                    {thread.participants.map((p) => (
                      <li key={p.id} className="flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-1.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={cn("bg-gradient-to-br text-[10px] text-white", p.accent)}>
                            {p.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-foreground">{p.name[lang]}</p>
                          {p.role && <p className="text-xs text-ink-3">{p.role[lang]}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3">
                  {t("thread.settingsTitle")}
                </h3>
                <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      {muted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      {muted ? t("thread.unmute") : t("thread.mute")}
                    </p>
                  </div>
                  <Switch checked={muted} onCheckedChange={setMuted} aria-label={t("thread.mute")} />
                </div>
              </section>
            </SheetBody>
          </SheetContent>
        </Sheet>
      </header>

      {/* Messages scroll area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin">
        <div className="mx-auto max-w-3xl space-y-4 px-3 py-5 sm:px-6">
          {buckets.map((b) => (
            <section key={b.key}>
              <DateSeparator kind={b.label.kind} label={b.label.label} />
              <div className="space-y-2">
                {b.messages.map((m, i) => {
                  // Both the legacy "u-self" stamp and the current account id
                  // count as "mine" so historical bubbles still render correctly.
                  const mine = m.authorId === senderId || m.authorId === currentUser.id;
                  const prev = b.messages[i - 1];
                  const samePrev =
                    prev && !prev.system && prev.authorId === m.authorId && !m.system;
                  return (
                    <MessageBubble
                      key={m.id}
                      message={m}
                      mine={mine}
                      showAuthor={thread.kind !== "1to1" && !mine && !samePrev}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Composer onSend={onSend} />
    </div>
  );
}

function DateSeparator({ kind, label }: { kind: string; label?: string }) {
  const t = useTranslations("app.messages.dateSep");
  let txt = "";
  if (kind === "today") txt = t("today");
  else if (kind === "yesterday") txt = t("yesterday");
  else txt = label ?? "";

  return (
    <div className="my-4 flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-border" aria-hidden />
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">{txt}</span>
      <span className="h-px w-16 bg-border" aria-hidden />
    </div>
  );
}
