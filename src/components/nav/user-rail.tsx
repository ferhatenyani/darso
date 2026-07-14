"use client";

import { useSyncExternalStore } from "react";
import {
  Bell,
  MessageSquare,
  Heart,
  Calendar,
  BookMarked,
  User,
  Receipt,
  Settings,
  Sparkles,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
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
import {
  getUnreadCount,
  subscribeNotifications,
} from "@/lib/mock/notifications-state";
import { getChatThreads, subscribeChats } from "@/lib/mock/chats";
import { savedItems } from "@/lib/mock/students";
import { cn } from "@/lib/utils";

// Signed-in student header cluster.
//
// Design intent: keep every frequently-used destination one click away.
// The icon rail (notifications / messages / favorites / calendar) shows
// live badges from the mock stores; the labeled "Mes réservations" button
// is the primary personal-space action; the avatar dropdown holds only
// settings-ish items (account, receipts, settings, become-teacher, sign
// out). Anything reached weekly-or-more shouldn't be behind a dropdown.

function useUnreadNotifications(accountId: string | undefined): number {
  return useSyncExternalStore(
    subscribeNotifications,
    () => getUnreadCount(accountId ?? null),
    () => 0,
  );
}

function useUnreadMessages(): number {
  return useSyncExternalStore(
    subscribeChats,
    () => getChatThreads().reduce((n, t) => n + (t.unread ?? 0), 0),
    () => 0,
  );
}

// Favorites doesn't have a live store yet — count is derived from the
// seed catalogue. Wrap in the same shape so consumers don't have to know.
function useFavoritesCount(): number {
  return savedItems.length;
}

export function UserRail() {
  const { user, signOut } = useCurrentUser();
  const notifsCount = useUnreadNotifications(user?.id);
  const msgsCount = useUnreadMessages();
  const favsCount = useFavoritesCount();

  if (!user || user.role !== "student") return null;

  const initials =
    user.studentInitials ?? user.email.slice(0, 2).toUpperCase();

  return (
    <div className="hidden md:flex items-center gap-1 ms-1">
      {/* Icon rail — direct 1-click destinations with live badges */}
      <IconLink
        href={routes.notifications()}
        Icon={Bell}
        label="Notifications"
        count={notifsCount}
      />
      <IconLink
        href={routes.messages()}
        Icon={MessageSquare}
        label="Messages"
        count={msgsCount}
      />
      <IconLink
        href={routes.favorites()}
        Icon={Heart}
        label="Favoris"
        count={favsCount}
      />
      <IconLink href={routes.calendar()} Icon={Calendar} label="Calendrier" />

      <span className="mx-1 h-6 w-px bg-border" aria-hidden />

      {/* Labeled bookings CTA — the primary personal-space action */}
      <Link
        href={routes.bookings()}
        className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-card px-3 text-[14px] font-semibold text-foreground transition-colors hover:border-accent hover:bg-accent-soft/40 hover:text-accent"
      >
        <BookMarked className="h-4 w-4" aria-hidden />
        Mes réservations
      </Link>

      {/* Slim avatar dropdown — settings-ish items only */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Ouvrir le menu du compte"
            className="ms-1 inline-flex items-center gap-1.5 rounded-[var(--radius-md)] p-1 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                {user.studentName ?? user.email}
              </span>
              <span className="mt-0.5 block text-[11px] font-normal text-ink-3 tabular">
                {user.email}
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={routes.account()} className="flex w-full items-center gap-2">
              <User className="h-4 w-4" />
              <span>Mon compte</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={routes.account("payments")} className="flex w-full items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>Reçus & factures</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={routes.account("settings")} className="flex w-full items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={routes.teachLanding()} className="flex w-full items-center gap-2">
              <Sparkles className="h-4 w-4 text-warning" />
              <span>Devenir professeur</span>
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
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function IconLink({
  href,
  Icon,
  label,
  count,
}: {
  href: string;
  Icon: typeof Bell;
  label: string;
  count?: number;
}) {
  const showBadge = typeof count === "number" && count > 0;
  return (
    <Link
      href={href as never}
      aria-label={label}
      title={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-ink-2 transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden />
      {showBadge && (
        <span
          aria-hidden
          className={cn(
            "absolute end-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-danger-foreground tabular",
            count > 9 && "min-w-[18px]",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
