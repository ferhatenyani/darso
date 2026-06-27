import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { DashboardShell } from "@/components/nav/dashboard-shell";
import { ChatThreadView } from "@/components/app/chat/chat-thread";
import { ThreadList } from "@/components/app/chat/thread-list";
import { chatThreads, findThread } from "@/lib/mock/chats";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ locale: string; threadId: string }>;
}) {
  const { locale, threadId } = await params;
  setRequestLocale(locale);

  const thread = findThread(threadId);
  if (!thread) {
    notFound();
  }

  return (
    <DashboardShell>
      <section className="container-narrow py-8">
        <div className="grid h-[min(80vh,860px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-e1 md:grid-cols-[340px_1fr]">
          <div className="hidden border-e border-border md:block">
            <ThreadList threads={chatThreads} activeId={thread.id} />
          </div>
          <ChatThreadView thread={thread} />
        </div>
      </section>
    </DashboardShell>
  );
}
