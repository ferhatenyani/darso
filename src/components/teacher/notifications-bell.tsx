"use client";

/**
 * Notifications bell rendered in the teacher dashboard chrome (mobile
 * top-bar + desktop header). Subscribes to the in-session notifications
 * store via useSyncExternalStore so the unread badge stays in lockstep
 * with mutations on the student `/notifications` page.
 *
 * Surface design (impeccable pass):
 * - Restrained icon button with a clear focus-visible ring (no fill-tinted
 *   variant — the badge is the colour anchor).
 * - The badge is a 9px dot capped at "9+", positioned crisply at top-end
 *   with a 2px background ring so it reads on any header tint.
 * - Popover header is quiet: small tracking-wide eyebrow + thin rule.
 *   Unread rows use semibold weight + a small accent dot; read rows shift
 *   to ink-2 so the rhythm reads as "fresh vs. dealt-with" without
 *   stripping any row in a tint band.
 * - Empty state mirrors the page's wording but at popover density.
 */

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Bell,
  CalendarClock,
  MessageSquare,
  Star,
  Wallet,
  Scale,
  CheckCheck,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import {
  EMPTY_NOTIFICATIONS,
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
  subscribeNotifications,
} from "@/lib/mock/notifications-state";
import type { AppNotification, NotificationType } from "@/lib/mock/notifications";
import { cn } from "@/lib/utils";

const iconFor: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  booking: CalendarClock,
  message: MessageSquare,
  review: Star,
  system: Bell,
  billing: Wallet,
  dispute: Scale,
};

const tileFor: Record<NotificationType, string> = {
  booking: "bg-accent-soft/60 text-accent",
  message: "bg-info/10 text-info",
  review: "bg-warning/15 text-[#7a5610]",
  system: "bg-surface text-ink-2",
  billing: "bg-success/10 text-success",
  dispute: "bg-danger/10 text-danger",
};

// SSR fallback for useSyncExternalStore — module state isn't seeded on the
// server until first read, so render an empty list and let the client
// hydrate the real one.
const getServerSnapshot = (): readonly AppNotification[] => EMPTY_NOTIFICATIONS;

export function NotificationsBell({ className }: { className?: string }) {
  const t = useTranslations("teacher.shell.notifications");
  const tn = useTranslations("app.notifications");
  const ttoasts = useTranslations("app.notifications.toasts");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "fr";
  const router = useRouter();
  const { user } = useCurrentUser();
  const { show } = useToast();
  const [open, setOpen] = React.useState(false);

  const accountId = user?.id ?? null;

  // Snapshot getter is keyed on accountId so the cache lookup stays stable
  // across renders for a given identity.
  const getSnapshot = React.useCallback(
    () => getNotifications(accountId),
    [accountId],
  );
  const items = React.useSyncExternalStore<readonly AppNotification[]>(
    subscribeNotifications,
    getSnapshot,
    getServerSnapshot,
  );

  const unreadCount = React.useMemo(
    () => items.reduce((n, x) => n + (x.unread ? 1 : 0), 0),
    [items],
  );

  // Top-N for the dropdown — the "View all" link goes to the full page.
  const visible = items.slice(0, 8);

  const handleRowClick = (n: AppNotification) => {
    if (n.unread) markRead(n.id);
    setOpen(false);
    // The href shape on AppNotification is an in-app path (`/calendar`,
    // `/messages/...`, etc.) — the typed router will normalise the locale.
    router.push(n.href as never);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    markAllRead(accountId);
    show({
      title: t("markAllReadToast.title"),
      description: t("markAllReadToast.desc"),
      variant: "success",
    });
  };

  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={
            unreadCount > 0
              ? `${t("bellLabel")} · ${unreadCount}`
              : t("bellLabel")
          }
          className={cn(
            "relative grid h-10 w-10 place-items-center rounded-[var(--radius-md)] text-ink-2 transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:bg-surface data-[state=open]:text-foreground",
            className,
          )}
        >
          <Bell className="h-5 w-5" aria-hidden />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="absolute top-1.5 end-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-danger px-1 py-px text-[10px] font-semibold leading-none text-danger-foreground ring-2 ring-background tabular"
            >
              {badgeLabel}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[calc(100vw-1.5rem)] max-w-[360px] p-0 sm:w-[380px] sm:max-w-none"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
              {String(unreadCount).padStart(2, "0")}
            </span>
            <span className="text-sm font-medium text-foreground">
              {tn("title")}
            </span>
          </div>
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-1 text-[11px] font-medium text-ink-2 transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink-2"
          >
            <CheckCheck className="h-3.5 w-3.5" aria-hidden />
            {t("markAllRead")}
          </button>
        </header>

        {/* List */}
        {visible.length === 0 ? (
          <EmptyState label={t("empty")} />
        ) : (
          <ScrollArea className="max-h-[420px]">
            <ul className="divide-y divide-border/70">
              {visible.map((n) => {
                const Icon = iconFor[n.type];
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleRowClick(n)}
                      className={cn(
                        "group flex w-full items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none",
                        n.unread && "bg-surface/40",
                      )}
                    >
                      {n.teacher ? (
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback
                            className={cn(
                              "bg-gradient-to-br text-white",
                              n.teacher.accent,
                            )}
                          >
                            {n.teacher.initials}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-md)]",
                            tileFor[n.type],
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "block min-w-0 flex-1 truncate text-[13px] leading-snug",
                              n.unread
                                ? "font-semibold text-foreground"
                                : "text-ink-2",
                            )}
                          >
                            {n.title[lang]}
                          </span>
                          {n.unread && (
                            <span
                              aria-hidden
                              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            />
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-ink-3">
                          {n.body[lang]}
                        </span>
                        <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-ink-3 tabular">
                          {relativeTime(n.at, lang, tn)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}

        {/* Footer */}
        <footer className="border-t border-border px-4 py-2.5">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-surface"
          >
            {t("viewAll")}
          </Link>
        </footer>
      </PopoverContent>
    </Popover>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="grid place-items-center px-6 py-10 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink-2">
        <Bell className="h-4 w-4" aria-hidden />
      </span>
      <p className="mt-3 text-pretty text-[13px] text-ink-2">{label}</p>
    </div>
  );
}

function relativeTime(
  iso: string,
  lang: "fr" | "ar",
  t: ReturnType<typeof useTranslations<"app.notifications">>,
) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  void lang;
  if (mins < 1) return t("ago.now");
  if (mins < 60) return t("ago.minutes", { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("ago.hours", { n: hours });
  return t("ago.days", { n: Math.floor(hours / 24) });
}
