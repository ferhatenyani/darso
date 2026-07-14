"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CheckCheck, BellRing } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotificationRow } from "@/components/app/notifications/notification-row";
import type { AppNotification } from "@/lib/mock/notifications";
import {
  EMPTY_NOTIFICATIONS,
  getNotifications,
  markAllRead,
  markRead,
  subscribeNotifications,
} from "@/lib/mock/notifications-state";

type Filter = "all" | "bookings" | "messages" | "reviews" | "billing";

const filterMap: Record<Filter, AppNotification["type"][] | "all"> = {
  all: "all",
  bookings: ["booking"],
  messages: ["message"],
  reviews: ["review"],
  billing: ["billing"],
};

// SSR fallback for useSyncExternalStore — module state isn't seeded on the
// server until first read, so render an empty list and let the client
// hydrate the real one.
const getServerSnapshot = (): readonly AppNotification[] => EMPTY_NOTIFICATIONS;

export function NotificationsShell() {
  const t = useTranslations("app.notifications");
  const [filter, setFilter] = React.useState<Filter>("all");

  // Surface the full seeded catalogue on this page regardless of the
  // signed-in user (matches the disputes-shell pattern); the bell already
  // filters per-account for the chrome surface.
  const getSnapshot = React.useCallback(() => getNotifications(), []);
  const items = React.useSyncExternalStore<readonly AppNotification[]>(
    subscribeNotifications,
    getSnapshot,
    getServerSnapshot,
  );

  const filtered = React.useMemo(() => {
    const allow = filterMap[filter];
    return items.filter((n) => allow === "all" || allow.includes(n.type));
  }, [items, filter]);

  const byBucket = React.useMemo(() => {
    return {
      today: filtered.filter((n) => n.bucket === "today"),
      week: filtered.filter((n) => n.bucket === "week"),
      earlier: filtered.filter((n) => n.bucket === "earlier"),
    };
  }, [filtered]);

  const handleMarkRead = React.useCallback((id: string) => markRead(id), []);
  const handleMarkAllRead = React.useCallback(() => markAllRead(), []);

  const unreadCount = filtered.filter((n) => n.unread).length;

  return (
    <section className="container-narrow grid gap-8 py-8 md:py-10 lg:grid-cols-[1fr_280px]">
      <div>
        {/* Editorial header */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-3">
              <span className="ink-rule" aria-hidden />
              <span>{t("title")}</span>
            </div>
            <h1 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[32px] md:text-[36px]">
              <span className="text-balance">{t("subtitle")}</span>
            </h1>
          </div>
          <Button onClick={handleMarkAllRead} variant="outline" size="sm" disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4" />
            {t("markAllRead")}
          </Button>
        </header>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
            <TabsTrigger value="bookings">{t("tabs.bookings")}</TabsTrigger>
            <TabsTrigger value="messages">{t("tabs.messages")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("tabs.reviews")}</TabsTrigger>
            <TabsTrigger value="billing">{t("tabs.billing")}</TabsTrigger>
          </TabsList>
          <TabsContent value={filter} className="mt-6">
            {filtered.length === 0 ? (
              <NotificationsEmpty filter={filter} />
            ) : (
              <div className="space-y-10">
                <Section title={t("sections.today")} index={1} items={byBucket.today} onMarkRead={handleMarkRead} />
                <Section title={t("sections.week")} index={2} items={byBucket.week} onMarkRead={handleMarkRead} />
                <Section title={t("sections.earlier")} index={3} items={byBucket.earlier} onMarkRead={handleMarkRead} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right column: a small editorial card */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 space-y-4">
          <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-e1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
              {String(unreadCount).padStart(2, "0")}
            </span>
            <h2 className="mt-2 text-[16px] font-semibold leading-snug text-foreground">
              {unreadCount === 1
                ? t("type.message") /* single-noun fallback */
                : t("title")}
            </h2>
            <p className="mt-2 text-pretty text-xs text-ink-3">{t("subtitle")}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}

function Section({
  title,
  index,
  items,
  onMarkRead,
}: {
  title: string;
  index: number;
  items: AppNotification[];
  onMarkRead: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 flex items-baseline gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3 tabular">
          {String(index).padStart(2, "0")}
        </span>
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </h2>
      <ul className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-e1">
        {items.map((n, i) => (
          <NotificationRow key={n.id} n={n} index={i} onMarkRead={onMarkRead} />
        ))}
      </ul>
    </section>
  );
}

function NotificationsEmpty({ filter }: { filter: Filter }) {
  const t = useTranslations("app.notifications.empty");
  const tt = useTranslations("app.notifications.tabs");
  const filterLabel = filter === "all" ? null : tt(filter);
  return (
    <EmptyState
      icon={BellRing}
      tone="success"
      title={t("title")}
      description={filterLabel ? t("bodyFiltered", { filter: filterLabel }) : t("body")}
      secondary={{ label: t("openPreferences"), href: "/account?tab=preferences" }}
    />
  );
}
