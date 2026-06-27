"use client";

import * as React from "react";
import { Menu, Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TeacherSidebar } from "./sidebar";

export function TeacherTopBar() {
  const t = useTranslations("teacher.shell");
  const tnav = useTranslations("teacher.shell.nav");
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const title = React.useMemo(() => {
    if (pathname === "/teach/dashboard" || pathname.endsWith("/teach/dashboard")) return tnav("home");
    if (pathname.includes("/teach/profile")) return tnav("profile");
    if (pathname.includes("/teach/courses/new")) return tnav("courses");
    if (pathname.includes("/teach/courses")) return tnav("courses");
    if (pathname.includes("/teach/events")) return tnav("events");
    if (pathname.includes("/teach/applications")) return tnav("applications");
    if (pathname.includes("/teach/ondemand")) return tnav("onDemand");
    if (pathname.includes("/teach/requests")) return tnav("requests");
    if (pathname.includes("/teach/reviews")) return tnav("reviews");
    if (pathname.includes("/teach/subscription")) return tnav("subscription");
    if (pathname.includes("/teach/agency")) return tnav("agency");
    if (pathname.includes("/messages")) return tnav("messages");
    return tnav("home");
  }, [pathname, tnav]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label={t("openSidebar")}
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] text-ink-2 hover:bg-surface"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent side="start" className="w-[290px] p-0">
          <TeacherSidebar inSheet />
        </SheetContent>
      </Sheet>
      <Link href="/teach/dashboard" className="lg:hidden">
        <Logo mark />
      </Link>
      <h1 className="ms-1 truncate text-sm font-semibold text-foreground">{title}</h1>
      <Link
        href="/"
        className="ms-auto inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-md)] border border-border bg-background px-2.5 text-[12px] font-medium text-ink-2 hover:bg-surface"
      >
        <Eye className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">{t("viewAsStudent")}</span>
      </Link>
    </header>
  );
}

/** Desktop "View as student" link in the top corner */
export function TeacherDesktopHeader() {
  const t = useTranslations("teacher.shell");
  return (
    <div className="hidden lg:flex sticky top-0 z-20 h-14 items-center justify-end gap-2 border-b border-border bg-background/85 px-6 backdrop-blur">
      <Link
        href="/"
        className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-background px-3 text-[13px] font-medium text-ink-2 hover:bg-surface hover:text-foreground"
      >
        <Eye className="h-4 w-4" aria-hidden />
        {t("viewAsStudent")}
      </Link>
    </div>
  );
}
