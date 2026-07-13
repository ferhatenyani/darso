"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Menu,
  X,
  BookMarked,
  Calendar,
  MessageSquare,
  Bell,
  Heart,
  Receipt,
  Settings,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard,
  PenLine,
} from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useCurrentUser();

  const publicLinks = [
    { href: routes.browse(), label: t("browse") },
    { href: routes.teachers(), label: t("teachers") },
    { href: routes.requestNew(), label: t("postRequest"), icon: PenLine },
    { href: routes.howItWorks(), label: t("howItWorks") },
  ];

  const studentPersonalLinks = [
    { href: routes.account(), label: "Mon compte", Icon: User },
    { href: routes.bookings(), label: "Mes réservations", Icon: BookMarked },
    { href: routes.calendar(), label: "Calendrier", Icon: Calendar },
    { href: routes.messages(), label: "Messages", Icon: MessageSquare },
    { href: routes.notifications(), label: "Notifications", Icon: Bell },
    { href: routes.favorites(), label: "Favoris", Icon: Heart },
    { href: routes.account("payments"), label: "Reçus & factures", Icon: Receipt },
    { href: routes.account("settings"), label: "Paramètres", Icon: Settings },
  ];

  return (
    <>
      <button
        type="button"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-border text-ink-2 hover:bg-surface"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label={t("closeMenu")}
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col gap-4 overflow-y-auto bg-background p-5 shadow-e3 transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-border text-ink-2 hover:bg-surface"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <Separator />

          {/* Discovery links — visible to everyone */}
          <nav className="flex flex-col gap-1" aria-label="Main">
            {publicLinks.map((l) => {
              const active = pathname === l.href;
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href as never}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-base font-medium",
                    active ? "bg-surface text-foreground" : "text-ink-2 hover:bg-surface hover:text-foreground",
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" aria-hidden />}
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {user && user.role === "student" && (
            <>
              <Separator />
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
                Mon espace
              </p>
              <nav className="flex flex-col gap-0.5" aria-label="Personal space">
                {studentPersonalLinks.map((l) => {
                  const active = pathname === l.href;
                  const Icon = l.Icon;
                  return (
                    <Link
                      key={l.href}
                      href={l.href as never}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-[14.5px] font-medium",
                        active ? "bg-surface text-foreground" : "text-ink-2 hover:bg-surface hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {l.label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href={routes.teachLanding()}
                onClick={() => setOpen(false)}
                className="mx-3 flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-card px-3 py-2.5 text-[14px] font-medium text-foreground hover:bg-surface"
              >
                <Sparkles className="h-4 w-4 text-warning" aria-hidden />
                Devenir professeur
              </Link>
            </>
          )}

          {user && user.role === "teacher" && (
            <>
              <Separator />
              <Link
                href={routes.teachDashboard()}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-ink-2 hover:bg-surface hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord
              </Link>
            </>
          )}

          <div className="mt-auto">
            <Separator />
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="mt-3 flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-danger hover:bg-danger/8"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <Button asChild variant="primary" size="lg">
                  <Link href={routes.signUp()} onClick={() => setOpen(false)}>
                    {t("signUp")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={routes.signIn()} onClick={() => setOpen(false)}>
                    {t("signIn")}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
