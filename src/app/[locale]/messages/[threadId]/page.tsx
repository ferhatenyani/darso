import { setRequestLocale } from "next-intl/server";

import { DashboardShell } from "@/components/nav/dashboard-shell";
import { ThreadPaneClient } from "./thread-pane-client";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ locale: string; threadId: string }>;
}) {
  const { locale, threadId } = await params;
  setRequestLocale(locale);

  // The thread list and detail are both client-side now so threads
  // created via `ensureThread` (student "Send a message" CTAs) — which
  // only exist in the client mock store — resolve immediately without a
  // server round-trip. See `src/lib/mock/chats.ts` for the store API.
  return (
    <DashboardShell>
      <ThreadPaneClient threadId={threadId} />
    </DashboardShell>
  );
}
