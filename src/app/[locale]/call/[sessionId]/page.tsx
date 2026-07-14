import { getTranslations, setRequestLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { upcomingSessions } from "@/lib/mock/sessions";
import { VideoCallRoom } from "@/components/app/call/video-call-room";

type Props = { params: Promise<{ locale: string; sessionId: string }> };

/**
 * Full-bleed video-call mock. Lives at the locale root so it inherits the
 * locale layout (i18n provider, fonts, toast host) but skips SiteHeader /
 * SiteFooter — which the locale layout doesn't render by default. The call
 * room itself uses `fixed inset-0 z-50` so it visually covers anything the
 * route ends up inheriting (defensive against future layout additions).
 *
 * `sessionId` is intentionally forgiving — chat threadIds and seeded
 * live-session ids are valid; anything else renders a generic mock room with
 * the same chrome so the rewires from chat / live never 404 even when the
 * id is something we don't have a record for.
 */
export default async function CallPage({ params }: Props) {
  const { locale, sessionId } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) {
    redirect({
      href: `/sign-in?next=/call/${encodeURIComponent(sessionId)}`,
      locale,
    });
    return null;
  }

  // Try to enrich the eyebrow / title from the seeded live sessions. We
  // don't 404 on miss — the call room renders a generic room instead.
  const session = upcomingSessions.find((s) => s.id === sessionId) ?? null;
  const loc = locale as "fr" | "ar";

  let title: string | undefined;
  if (session) {
    title = session.title[loc] ?? session.title.fr;
  } else {
    // Fall back to a translated generic title so the eyebrow still reads
    // naturally for the chat / message-thread route.
    const t = await getTranslations("app.call");
    title = t("generic.title");
  }

  return (
    <VideoCallRoom
      sessionId={sessionId}
      sessionTitle={title}
      isGeneric={!session}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app.call" });
  return {
    title: t("generic.title"),
    robots: { index: false, follow: false },
  };
}
