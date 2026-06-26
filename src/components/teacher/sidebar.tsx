"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Library,
  CalendarDays,
  PlayCircle,
  Inbox,
  Send,
  MessagesSquare,
  Star,
  Wallet,
  Users,
  LogOut,
  UserCog,
  ChevronRight,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { currentTeacher } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

type NavItem = { href: string; icon: typeof LayoutDashboard; key: string; badge?: number };

const groups: { key: string; items: NavItem[] }[] = [
  {
    key: "groupOverview",
    items: [
      { href: "/teach", icon: LayoutDashboard, key: "home" },
      { href: "/teach/profile", icon: UserCog, key: "profile" },
    ],
  },
  {
    key: "groupLibrary",
    items: [
      { href: "/teach/courses", icon: Library, key: "courses" },
      { href: "/teach/events", icon: CalendarDays, key: "events" },
      { href: "/teach/ondemand", icon: PlayCircle, key: "onDemand" },
    ],
  },
  {
    key: "groupInbox",
    items: [
      { href: "/teach/requests", icon: Inbox, key: "requests", badge: 3 },
      { href: "/teach/applications", icon: Send, key: "applications" },
      { href: "/messages", icon: MessagesSquare, key: "messages" },
    ],
  },
  {
    key: "groupPerformance",
    items: [
      { href: "/teach/reviews", icon: Star, key: "reviews" },
      { href: "/teach/subscription", icon: Wallet, key: "subscription" },
    ],
  },
  {
    key: "groupAgency",
    items: [{ href: "/teach/agency", icon: Users, key: "agency" }],
  },
];

export function TeacherSidebar({ inSheet = false }: { inSheet?: boolean }) {
  const t = useTranslations("teacher.shell");
  const locale = useLocale() as "fr" | "ar";
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/teach") return pathname === "/teach";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col bg-background",
        !inSheet && "border-e border-border",
      )}
    >
      <div className="flex h-16 items-center px-5">
        <Link href="/teach" className="outline-none focus-visible:rounded-md">
          <Logo />
        </Link>
      </div>

      {/* Teacher card */}
      <div className="px-3">
        <Link
          href="/teach/profile"
          className="group relative flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3 transition-colors hover:bg-surface"
        >
          <Avatar className="h-11 w-11 ring-2 ring-background">
            <AvatarFallback
              className={cn("text-[13px] text-primary-foreground", `bg-gradient-to-br ${currentTeacher.accent}`)}
            >
              {currentTeacher.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-foreground">{currentTeacher.name[locale]}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              {currentTeacher.topRated && (
                <Badge variant="warning" className="h-[18px] px-1.5 text-[10px] leading-3">
                  {t("topRated")}
                </Badge>
              )}
              <span className="truncate text-[11px] text-ink-3 tabular">
                {t("responseLabel")}{" "}
                {t("responseHours", { hours: currentTeacher.responseHours })}
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-ink-3 rtl-flip" aria-hidden />
        </Link>
      </div>

      {/* Nav */}
      <ScrollArea className="mt-4 flex-1 px-2">
        <nav className="flex flex-col gap-5 pb-4" aria-label={t("nav.home")}>
          {groups.map((g, gi) => (
            <div key={g.key}>
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="font-mono text-[10px] font-semibold tabular text-ink-3">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
                  {t(`nav.${g.key}`)}
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden />
              </div>
              <ul className="mt-1 flex flex-col gap-0.5">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex h-10 items-center gap-3 rounded-[var(--radius-md)] px-3 text-[14px] font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-ink-2 hover:bg-surface hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="flex-1 truncate">{t(`nav.${item.key}`)}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "min-w-5 rounded-full px-1.5 py-px text-center text-[10px] font-semibold tabular",
                              active ? "bg-background/15 text-primary-foreground" : "bg-accent text-accent-foreground",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                        {active && (
                          <span
                            aria-hidden
                            className="absolute inset-y-2 -start-2 w-[3px] rounded-full bg-accent"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-surface hover:text-foreground"
          >
            <LogOut className="h-4 w-4 rtl-flip" aria-hidden />
            {t("logout")}
          </button>
        </div>
      </div>
    </aside>
  );
}
