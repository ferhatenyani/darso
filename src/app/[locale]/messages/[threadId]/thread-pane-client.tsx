"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChatThreadView } from "@/components/app/chat/chat-thread";
import { ThreadList } from "@/components/app/chat/thread-list";
import {
  getChatThreads,
  subscribeChats,
  type ChatThread,
} from "@/lib/mock/chats";

/**
 * Client island for a single thread pane.
 *
 * Subscribed to the in-memory chat store so threads created in-session
 * via `ensureThread` resolve here without a server round-trip. When the
 * thread genuinely doesn't exist (bad URL, stale link) we render a
 * client-side empty pane instead of calling `notFound()` — the route
 * stays under the dashboard chrome and the inbox list is still
 * navigable next to the empty pane.
 */
export function ThreadPaneClient({ threadId }: { threadId: string }) {
  const threads = React.useSyncExternalStore<readonly ChatThread[]>(
    subscribeChats,
    getChatThreads,
    getChatThreads,
  );

  const thread = React.useMemo(
    () => threads.find((th) => th.id === threadId),
    [threads, threadId],
  );

  return (
    <section className="container-narrow py-8">
      <div className="grid h-[min(80vh,860px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-e1 md:grid-cols-[340px_1fr]">
        <div className="hidden border-e border-border md:block">
          <ThreadList threads={threads} activeId={thread?.id} />
        </div>
        {thread ? (
          <ChatThreadView thread={thread} />
        ) : (
          <MissingThreadPane />
        )}
      </div>
    </section>
  );
}

function MissingThreadPane() {
  const t = useTranslations("app.messages");
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 px-10 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-3">
        {t("title")}
      </p>
      <h2 className="text-[20px] font-semibold tracking-tight text-foreground">
        {t("emptyFiltered.title")}
      </h2>
      <p className="max-w-sm text-pretty text-sm text-ink-2">
        {t("emptyFiltered.body")}
      </p>
      <Button asChild variant="outline" size="md">
        <Link href="/messages">{t("title")}</Link>
      </Button>
    </div>
  );
}
