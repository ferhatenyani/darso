"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/browse" as const, label: t("browse") },
    { href: "/teachers" as const, label: t("teachers") },
    { href: "/requests" as const, label: t("requests") },
    { href: "/how-it-works" as const, label: t("howItWorks") },
    { href: "/teach" as const, label: t("becomeTeacher") },
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
            "absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col gap-4 bg-background p-5 shadow-e3 transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
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
          <nav className="flex flex-col gap-1" aria-label="Main">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-[var(--radius-md)] px-3 py-3 text-base font-medium",
                    active ? "bg-surface text-foreground" : "text-ink-2 hover:bg-surface hover:text-foreground",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <Separator />
          <div className="flex flex-col gap-2">
            <Button asChild variant="primary" size="lg">
              <Link href="/sign-up" onClick={() => setOpen(false)}>
                {t("signUp")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                {t("signIn")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
