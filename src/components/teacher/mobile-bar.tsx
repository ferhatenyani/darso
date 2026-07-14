"use client";

import * as React from "react";
import { LayoutDashboard, Library, Inbox, Star, MoreHorizontal, UserCog, CalendarDays, PlayCircle, Send, MessagesSquare, Wallet, Landmark, BarChart3, Users, LogOut, Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetBody } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useCurrentUser } from "@/lib/auth";
import { findTeacherById } from "@/lib/mock/teachers";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/teach/dashboard", icon: LayoutDashboard, key: "home" },
  { href: "/teach/courses", icon: Library, key: "courses" },
  { href: "/teach/requests", icon: Inbox, key: "requests", badge: 3 },
  { href: "/teach/reviews", icon: Star, key: "reviews" },
];

const baseMoreItems = [
  { href: "/teach/profile", icon: UserCog, key: "profile" },
  { href: "/teach/events", icon: CalendarDays, key: "events" },
  { href: "/teach/ondemand", icon: PlayCircle, key: "onDemand" },
  { href: "/teach/applications", icon: Send, key: "applications" },
  { href: "/messages", icon: MessagesSquare, key: "messages" },
  { href: "/teach/analytics", icon: BarChart3, key: "analytics" },
  { href: "/teach/subscription", icon: Wallet, key: "subscription" },
  { href: "/teach/payouts", icon: Landmark, key: "payouts" },
];

const AGENCY_ITEMS = [
  { href: "/teach/agency", icon: Users, key: "agency" },
  { href: "/teach/agency/analytics", icon: BarChart3, key: "agencyAnalytics" },
] as const;

export function TeacherMobileBar() {
  const t = useTranslations("teacher.shell");
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { user, signOut } = useCurrentUser();

  // Only surface the Agency entry when the signed-in teacher actually
  // belongs to a studio. Solo teachers (and the anonymous preview) never
  // see it in the more-sheet.
  const showAgency = Boolean(findTeacherById(user?.teacherId)?.parentAgencyId);
  const moreItems = React.useMemo(
    () => (showAgency ? [...baseMoreItems, ...AGENCY_ITEMS] : baseMoreItems),
    [showAgency],
  );

  const isActive = (href: string) => {
    if (href === "/teach/dashboard") {
      return pathname === "/teach/dashboard" || pathname === "/teach";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:hidden"
      aria-label={t("nav.home")}
    >
      <div className="grid grid-cols-5 px-1 pb-[max(env(safe-area-inset-bottom),4px)] pt-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-ink-3",
              )}
            >
              {active && (
                <span aria-hidden className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-accent" />
              )}
              <span className="relative">
                <Icon className="h-[18px] w-[18px]" aria-hidden />
                {tab.badge && (
                  <span className="absolute -end-1.5 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-accent px-1 text-[9px] font-semibold tabular text-accent-foreground">
                    {tab.badge}
                  </span>
                )}
              </span>
              <span>{t(`nav.${tab.key}`)}</span>
            </Link>
          );
        })}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] text-[10px] font-medium text-ink-3"
            >
              <MoreHorizontal className="h-[18px] w-[18px]" aria-hidden />
              <span>{t("more")}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80dvh]">
            <SheetHeader>
              <SheetTitle>{t("more")}</SheetTitle>
            </SheetHeader>
            <SheetBody>
              <ul className="grid grid-cols-2 gap-2">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-surface text-ink-2">
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="flex-1 truncate">{t(`nav.${item.key}`)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                <LanguageSwitcher />
                <Link
                  href="/"
                  className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm font-medium text-ink-2 hover:bg-surface"
                >
                  <Eye className="h-4 w-4" aria-hidden />
                  {t("viewAsStudent")}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-surface"
              >
                <LogOut className="h-4 w-4 rtl-flip" aria-hidden />
                {t("logout")}
              </button>
            </SheetBody>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
