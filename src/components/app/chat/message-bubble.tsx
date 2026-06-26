"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check, CheckCheck, FileText, Image as ImageIcon, Music, Paperclip } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/mock/chats";

type Props = {
  message: ChatMessage;
  /** True if the bubble is from the current user (rendered at END side) */
  mine: boolean;
  /** Whether to show the sender's name + avatar above (groups only, first of run) */
  showAuthor: boolean;
};

const fileIconFor = (kind: "image" | "pdf" | "audio" | "doc") => {
  if (kind === "image") return ImageIcon;
  if (kind === "audio") return Music;
  if (kind === "pdf") return FileText;
  return Paperclip;
};

export function MessageBubble({ message, mine, showAuthor }: Props) {
  const t = useTranslations("app.messages");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  if (message.system) {
    return (
      <div className="my-4 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-border" aria-hidden />
        <p className="max-w-md text-pretty text-center font-serif text-[12px] italic text-ink-3" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
          {message.system[lang]}
        </p>
        <span className="h-px w-12 bg-border" aria-hidden />
      </div>
    );
  }

  const time = new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(message.at));

  return (
    <div
      className={cn(
        "group flex w-full gap-2.5",
        mine ? "justify-end" : "justify-start",
      )}
    >
      {!mine && showAuthor && (
        <Avatar className="mt-5 h-7 w-7 shrink-0">
          <AvatarFallback className={cn("bg-gradient-to-br text-[10px] text-white", message.authorAccent ?? "from-primary to-accent")}>
            {message.authorInitials ?? "?"}
          </AvatarFallback>
        </Avatar>
      )}
      {!mine && !showAuthor && <span className="w-7 shrink-0" aria-hidden />}

      <div className={cn("flex max-w-[78%] flex-col gap-1", mine ? "items-end" : "items-start")}>
        {!mine && showAuthor && message.authorName && (
          <span className="ps-1 text-[11px] font-semibold text-ink-2">
            {message.authorName[lang]}
          </span>
        )}
        <div
          className={cn(
            "relative rounded-[var(--radius-lg)] border bg-card px-3.5 py-2.5 text-[14px] leading-relaxed text-foreground shadow-e1",
            mine
              ? "border-accent/40 bg-accent-soft/45 [&_.bar]:bg-accent"
              : "border-border [&_.bar]:bg-primary",
          )}
        >
          {/* Marker rule on the sender side */}
          <span
            aria-hidden
            className={cn(
              "bar absolute inset-y-2 w-[3px] rounded-full",
              mine ? "end-0 -me-[3px]" : "start-0 -ms-[3px]",
            )}
          />
          {message.text && <p className="whitespace-pre-wrap text-pretty">{message.text[lang]}</p>}
          {message.attachments && message.attachments.length > 0 && (
            <ul className="mt-2 grid gap-1.5">
              {message.attachments.map((a) => {
                const Icon = fileIconFor(a.kind);
                return (
                  <li
                    key={a.id}
                    className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-background px-2.5 py-1.5"
                  >
                    <Icon className="h-4 w-4 text-ink-3" aria-hidden />
                    <span className="flex-1 truncate text-[12px] text-foreground">{a.name}</span>
                    <span className="shrink-0 text-[10px] text-ink-3 tabular">
                      {Math.ceil(a.sizeKb)} Ko
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={cn("flex items-center gap-2 px-1 text-[10px] text-ink-3", mine ? "flex-row-reverse" : "")}>
          <span className="tabular">{time}</span>
          {mine && (
            <span aria-label={t(`status.${message.status ?? "sent"}`)} className="inline-flex items-center">
              {message.status === "read" ? (
                <CheckCheck className="h-3 w-3 text-accent" />
              ) : message.status === "delivered" ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
          {message.reactions && message.reactions.length > 0 && (
            <ul className="flex items-center gap-1">
              {message.reactions.map((r, i) => (
                <li
                  key={i}
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full border border-border bg-background px-1.5 py-0.5 text-[10px] tabular",
                    r.mine && "border-accent/50 bg-accent-soft/60",
                  )}
                >
                  <span aria-hidden>{r.emoji}</span>
                  <span>{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
