"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ThreadList } from "@/components/app/chat/thread-list";
import {
  getChatThreads,
  subscribeChats,
  type ChatThread,
} from "@/lib/mock/chats";
import { InboxIllustration } from "./inbox-illustration";

/** Top-level inbox: list visible on mobile, two-pane on desktop with an editorial empty state. */
export function InboxShell({ activeId }: { activeId?: string }) {
  const t = useTranslations("app.messages");

  // Subscribe to the chat thread store so threads created by `ensureThread`
  // (student CTAs that route into messaging) appear in the inbox without
  // a refresh. Snapshot is frozen and referentially stable between ticks.
  const threads = React.useSyncExternalStore<readonly ChatThread[]>(
    subscribeChats,
    getChatThreads,
    getChatThreads,
  );

  return (
    <section className="container-narrow py-8 md:py-10">
      {/* Editorial title strip — small, distinct */}
      <header className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-3">
            <span className="ink-rule" aria-hidden />
            <span>{t("title")}</span>
          </div>
          <h1 className="mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[32px] md:text-[36px]">
            <span className="text-balance">{t("subtitle")}</span>
          </h1>
        </div>
      </header>

      {/* Two-pane shell on desktop; on mobile show only the thread list (a
          picked thread swaps the entire view to /messages/[threadId]). */}
      <div className="grid h-[min(76vh,820px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-e1 md:grid-cols-[340px_1fr]">
        <div className="md:border-e md:border-border">
          <ThreadList threads={threads} activeId={activeId} />
        </div>
        <div className="hidden md:block">
          <EmptyPane />
        </div>
      </div>
    </section>
  );
}

function EmptyPane() {
  const t = useTranslations("app.messages.empty");
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 px-10 text-center">
      {/* Subtle background dots */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-50" />

      <InboxIllustration />

      <div className="relative space-y-3">
        <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="max-w-md text-pretty text-sm text-ink-2">{t("body")}</p>
        <Button asChild variant="outline" size="md">
          <Link href="/teachers">{t("cta")}</Link>
        </Button>
      </div>
    </div>
  );
}
