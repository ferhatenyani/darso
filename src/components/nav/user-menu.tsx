"use client";

import { useTranslations } from "next-intl";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";

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
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Auth-aware cluster for the right end of the SiteHeader.
 *
 * - Anonymous: classic "Sign in / Sign up" pair.
 * - Signed in (student): renders nothing here — [UserRail] takes over
 *   with an icon rail + labeled bookings CTA so frequent destinations
 *   stay one click away instead of buried in a dropdown.
 * - Signed in (teacher): a slim menu with a dashboard link + sign out —
 *   the teacher app has its own dedicated dashboard nav.
 */
export function UserMenu() {
  const t = useTranslations("nav");
  const tMenu = useTranslations("nav.userMenu");
  const { user, signOut } = useCurrentUser();

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-1 ms-1">
        <Button asChild variant="ghost" size="md">
          <Link href={routes.signIn()}>{t("signIn")}</Link>
        </Button>
        <Button asChild variant="primary" size="md">
          <Link href={routes.signUp()}>{t("signUp")}</Link>
        </Button>
      </div>
    );
  }

  // Students use UserRail — this component is a no-op for them.
  if (user.role === "student") return null;

  const initials = user.teacherSlug
    ? user.teacherSlug
        .split("-")
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("")
    : "T";

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
              <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
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
                {tMenu("teacherTagline")}
              </span>
              <span className="mt-0.5 block text-[11px] font-normal text-ink-3 tabular">
                {user.email}
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={routes.teachDashboard()} className="flex w-full items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>{tMenu("dashboard")}</span>
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
