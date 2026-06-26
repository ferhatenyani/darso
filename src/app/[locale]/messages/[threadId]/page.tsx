import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/nav/site-header";
import { SiteFooter } from "@/components/nav/site-footer";
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
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="container-narrow py-8">
          <div className="grid h-[min(80vh,860px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-e1 md:grid-cols-[340px_1fr]">
            {/* Left list — hidden on mobile when viewing a thread */}
            <div className="hidden border-e border-border md:block">
              <ThreadList threads={chatThreads} activeId={thread.id} />
            </div>
            {/* Right pane: thread */}
            <ChatThreadView thread={thread} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
