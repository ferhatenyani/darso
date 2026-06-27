"use client";

import { useTranslations } from "next-intl";
import { LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * Auth-aware cluster for the right end of the SiteHeader.
 *
 * - Anonymous: classic "Sign in / Sign up" pair.
 * - Signed in: avatar + dropdown menu with Account / Sign out.
 *
 * Lives as a client component because it reads the user context. The
 * surrounding header is a server component.
 */
export function UserMenu() {
  const t = useTranslations("nav");
  const tMenu = useTranslations("nav.userMenu");
  const { user, signOut } = useCurrentUser();

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-1 ms-1">
        <Button asChild variant="ghost" size="md">
          <Link href="/sign-in">{t("signIn")}</Link>
        </Button>
        <Button asChild variant="primary" size="md">
          <Link href="/sign-up">{t("signUp")}</Link>
        </Button>
      </div>
    );
  }

  const initials =
    user.role === "teacher"
      ? user.teacherSlug
        ? user.teacherSlug
            .split("-")
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase() ?? "")
            .join("")
        : "T"
      : user.studentInitials ?? user.email.slice(0, 2).toUpperCase();

  const accountHref = user.role === "teacher" ? "/teach/dashboard" : "/account";
  const accountLabel = user.role === "teacher" ? tMenu("dashboard") : tMenu("account");
  const accountIcon =
    user.role === "teacher" ? (
      <LayoutDashboard className="h-4 w-4" />
    ) : (
      <User className="h-4 w-4" />
    );

  return (
    <div className="hidden md:flex items-center ms-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-sm font-medium text-ink-2 transition-colors",
              "hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            )}
            aria-label={tMenu("openLabel")}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-[#2F6BFF] to-[#3E8FD0] text-[11px] font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-3.5 w-3.5 text-ink-3" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="min-w-56">
          <DropdownMenuLabel>
            <span className="block normal-case tracking-normal">
              <span className="block text-[12.5px] font-semibold text-foreground">
                {user.role === "teacher"
                  ? tMenu("teacherTagline")
                  : user.studentName ?? user.email}
              </span>
              <span className="mt-0.5 block text-[11px] font-normal text-ink-3 tabular">
                {user.email}
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={accountHref} className="flex w-full items-center gap-2">
              {accountIcon}
              <span>{accountLabel}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              void signOut();
            }}
            className="text-danger focus:text-danger"
          >
            <LogOut className="h-4 w-4" />
            <span>{tMenu("signOut")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
