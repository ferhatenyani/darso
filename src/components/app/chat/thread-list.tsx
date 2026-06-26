"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, Users } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ChatThread } from "@/lib/mock/chats";

export function ThreadList({
  threads,
  activeId,
}: {
  threads: ChatThread[];
  activeId?: string;
}) {
  const t = useTranslations("app.messages");
  const tc = useTranslations("app.common");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState<"all" | "1to1" | "cohorts">("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return threads.filter((th) => {
      if (tab === "1to1" && th.kind !== "1to1") return false;
      if (tab === "cohorts" && th.kind === "1to1") return false;
      if (!q) return true;
      const title = th.title[lang].toLowerCase();
      const lastMsg = th.messages.at(-1);
      const last = lastMsg?.text?.[lang] ?? lastMsg?.system?.[lang] ?? "";
      return title.includes(q) || last.toLowerCase().includes(q);
    });
  }, [threads, query, tab, lang]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background px-4 pt-4 pb-3">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl text-foreground" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
            <span className="italic">{t("title")}</span>
          </h2>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-3 tabular">
            {String(threads.filter((t) => t.unread > 0).length).padStart(2, "0")}
          </span>
        </div>
        <label htmlFor="thread-search" className="sr-only">
          {t("search")}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden />
          <Input
            id="thread-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="ps-9"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-3">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              {t("tabs.all")}
            </TabsTrigger>
            <TabsTrigger value="1to1" className="flex-1">
              {t("tabs.oneToOne")}
            </TabsTrigger>
            <TabsTrigger value="cohorts" className="flex-1">
              {t("tabs.cohorts")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-0" />
        </Tabs>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
          <span className="font-serif text-base italic text-foreground" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
            {t("emptyFiltered.title")}
          </span>
          <p className="text-sm text-ink-3">{t("emptyFiltered.body")}</p>
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto scroll-thin">
          {filtered.map((th) => (
            <ThreadRow key={th.id} thread={th} active={th.id === activeId} lang={lang} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ThreadRow({
  thread,
  active,
  lang,
}: {
  thread: ChatThread;
  active: boolean;
  lang: "fr" | "ar";
}) {
  const t = useTranslations("app.messages");
  const locale = useLocale();

  const lastMsg = thread.messages.at(-1);
  const lastText = lastMsg?.text?.[lang] ?? lastMsg?.system?.[lang] ?? "";
  const time = lastMsg
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(lastMsg.at))
    : "";

  return (
    <li className="relative">
      <Link
        href={`/messages/${thread.id}` as never}
        className={cn(
          "group relative grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border/70 px-4 py-3.5 transition-colors",
          active ? "bg-accent-soft/30" : "hover:bg-surface/60",
        )}
      >
        {/* Vertical rule that thickens on hover */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 start-0 w-[2px] bg-transparent transition-colors",
            active ? "bg-accent" : "group-hover:bg-accent/70",
          )}
        />

        {/* Avatar */}
        {thread.kind === "1to1" && thread.teacher ? (
          <div className="relative">
            <Avatar className="h-11 w-11">
              <AvatarFallback className={cn("bg-gradient-to-br text-white", thread.teacher.accent)}>
                {thread.teacher.initials}
              </AvatarFallback>
            </Avatar>
            {thread.online && (
              <span
                aria-hidden
                className="absolute -bottom-0.5 -end-0.5 inline-block h-3 w-3 rounded-full border-2 border-background bg-success"
              />
            )}
          </div>
        ) : (
          <GroupAvatarStack thread={thread} />
        )}

        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{thread.title[lang]}</p>
            <span className="shrink-0 text-[11px] text-ink-3 tabular">{time}</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p
              className={cn(
                "truncate text-[13px]",
                thread.unread > 0 ? "font-medium text-foreground" : "text-ink-3",
              )}
            >
              {lastText}
            </p>
            {thread.unread > 0 ? (
              <span className="inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold tabular text-accent-foreground">
                {thread.unread}
              </span>
            ) : (
              <span className="shrink-0 font-mono text-[10px] tracking-tight text-ink-3" aria-hidden>
                ──
              </span>
            )}
          </div>
        </div>
        <span aria-hidden />
      </Link>
    </li>
  );
}

function GroupAvatarStack({ thread }: { thread: ChatThread }) {
  const parts = thread.participants?.slice(0, 2) ?? [];
  return (
    <div className="relative h-11 w-11">
      {parts[0] && (
        <Avatar className="absolute inset-0 h-9 w-9">
          <AvatarFallback className={cn("bg-gradient-to-br text-[10px] text-white", parts[0].accent)}>
            {parts[0].initials}
          </AvatarFallback>
        </Avatar>
      )}
      {parts[1] && (
        <Avatar className="absolute -bottom-0.5 -end-0.5 h-7 w-7 ring-2 ring-background">
          <AvatarFallback className={cn("bg-gradient-to-br text-[10px] text-white", parts[1].accent)}>
            {parts[1].initials}
          </AvatarFallback>
        </Avatar>
      )}
      {!parts[0] && (
        <Avatar className="h-11 w-11">
          <AvatarFallback className="bg-surface text-ink-2">
            <Users className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
