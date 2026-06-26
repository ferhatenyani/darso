"use client";

import { useLocale, useTranslations } from "next-intl";
import { FileText, Image as ImageIcon, Music, Paperclip } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { stateOrder, type DisputeTimelineEntry, type DisputeState } from "@/lib/mock/disputes";
import { StateBadge } from "./state-badge";

const fileIconFor = (kind: "image" | "pdf" | "audio" | "doc") => {
  if (kind === "image") return ImageIcon;
  if (kind === "audio") return Music;
  if (kind === "pdf") return FileText;
  return Paperclip;
};

export function Timeline({
  entries,
  currentState,
}: {
  entries: DisputeTimelineEntry[];
  currentState: DisputeState;
}) {
  const t = useTranslations("app.disputes");
  const tc = useTranslations("app.common");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";

  const fmtDate = new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentIdx = stateOrder.indexOf(currentState);

  return (
    <ol className="relative space-y-6 ps-8">
      {/* The vertical rule */}
      <span
        aria-hidden
        className="absolute inset-y-0 start-3 w-px bg-border"
      />
      {entries.map((entry, i) => {
        const stateIdx = stateOrder.indexOf(entry.state);
        const isFuture = stateIdx > currentIdx;
        const isCurrent = entry.state === currentState && i === entries.length - 1;

        return (
          <li key={entry.id} className="relative">
            {/* node */}
            <span
              aria-hidden
              className={cn(
                "absolute -start-[1.6rem] top-1 grid h-6 w-6 place-items-center rounded-full border-2",
                isFuture
                  ? "border-border bg-background"
                  : isCurrent
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-accent bg-background",
              )}
            >
              <span
                className={cn(
                  "block h-2 w-2 rounded-full",
                  isFuture ? "bg-transparent" : isCurrent ? "bg-accent-foreground" : "bg-accent",
                )}
              />
            </span>

            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold text-foreground">{entry.action[lang]}</h3>
                {isCurrent && <StateBadge state={entry.state} size="sm" />}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[12px] text-ink-3">
                <span className="tabular">{fmtDate.format(new Date(entry.at))}</span>
                <span aria-hidden>·</span>
                {entry.actor === "system" ? (
                  <span>{t(`actor.system`)}</span>
                ) : entry.actorName ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback
                        className={cn(
                          "bg-gradient-to-br text-[9px] text-white",
                          entry.actorAccent ?? "from-primary to-accent",
                        )}
                      >
                        {entry.actorInitials ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{entry.actorName[lang]}</span>
                    <span className="text-ink-3">· {t(`actor.${entry.actor}`)}</span>
                  </span>
                ) : (
                  <span>{t(`actor.${entry.actor}`)}</span>
                )}
              </div>

              {entry.description && (
                <p className="text-pretty text-[13px] text-ink-2">{entry.description[lang]}</p>
              )}

              {entry.attachments && entry.attachments.length > 0 && (
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {entry.attachments.map((a) => {
                    const Icon = fileIconFor(a.kind);
                    return (
                      <li
                        key={a.id}
                        className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-card px-2.5 py-2"
                      >
                        <Icon className="h-4 w-4 text-ink-3" aria-hidden />
                        <span className="flex-1 truncate text-[12px] text-foreground">{a.name}</span>
                        <span className="shrink-0 text-[10px] text-ink-3 tabular">
                          {tc("fileSize", { kb: a.sizeKb })}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
