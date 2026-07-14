"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Search, PenLine } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/nav/mobile-nav";
import { DiscoverMenu } from "@/components/nav/discover-menu";
import { UserMenu } from "@/components/nav/user-menu";
import { UserRail } from "@/components/nav/user-rail";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/85 backdrop-blur transition-[background-color,border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-background/70",
        scrolled
          ? "border-border shadow-[0_1px_0_0_rgba(10,11,14,0.04)]"
          : "border-transparent",
      )}
    >
      <div className="container-wide flex h-14 items-center gap-3 md:h-[68px] lg:h-[72px]">
        {/* Logo */}
        <Link
          href={routes.home()}
          className="group shrink-0 outline-none transition-transform duration-200 hover:-translate-y-[0.5px] focus-visible:rounded-[var(--radius-xs)] focus-visible:shadow-focus"
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="ms-4 hidden lg:flex items-center gap-0.5" aria-label="Main">
          <DiscoverMenu />
          <NavLink href={routes.teachers()} active={pathname.startsWith("/teachers")}>
            {t("teachers")}
          </NavLink>
          <NavLink
            href={routes.live()}
            active={pathname.startsWith("/live")}
            className="gap-2"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-danger live-dot" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-danger" />
            </span>
            {t("liveNow")}
          </NavLink>
          <NavLink
            href={routes.requestNew()}
            active={pathname.startsWith("/requests")}
            className="gap-1.5"
          >
            <PenLine className="h-[15px] w-[15px]" aria-hidden />
            {t("postRequest")}
          </NavLink>
        </nav>

        {/* Right rail */}
        <div className="ms-auto flex items-center gap-1.5">
          {/* Icon search (desktop only) */}
          <Link
            href={routes.search()}
            aria-label={t("search")}
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-xs)] text-ink-2 transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>

          {/* Become teacher (desktop) */}
          <Link
            href={routes.teachLanding()}
            className="hidden md:inline-flex h-10 items-center rounded-[var(--radius-xs)] px-3 text-[13.5px] font-medium text-ink-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus"
          >
            {t("becomeTeacher")}
          </Link>

          <span className="hidden md:block h-6 w-px bg-border me-1" aria-hidden />

          {/* Auth-aware slots */}
          <UserRail />
          <UserMenu />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  className,
  active,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href as never}
      className={cn(
        "group relative inline-flex h-10 items-center rounded-[var(--radius-xs)] px-3 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:shadow-focus",
        active
          ? "text-foreground"
          : "text-ink-2 hover:bg-surface hover:text-foreground",
        className,
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
      {/* Active underline */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-accent origin-left transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
