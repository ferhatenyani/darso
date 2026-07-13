import { useTranslations } from "next-intl";
import { Search, PenLine } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/nav/mobile-nav";
import { DiscoverMenu } from "@/components/nav/discover-menu";
import { UserMenu } from "@/components/nav/user-menu";
import { UserRail } from "@/components/nav/user-rail";
import { routes } from "@/lib/routes";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container-wide flex h-14 items-center gap-3 md:h-[68px] lg:h-[72px]">
        {/* Logo */}
        <Link href={routes.home()} className="shrink-0 outline-none focus-visible:rounded-[var(--radius-xs)]">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="ms-4 hidden lg:flex items-center gap-0.5" aria-label="Main">
          <DiscoverMenu />
          <NavLink href={routes.teachers()}>{t("teachers")}</NavLink>
          <NavLink href={routes.live()} className="gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-danger live-dot" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-danger" />
            </span>
            {t("liveNow")}
          </NavLink>
          <NavLink href={routes.requestNew()} className="gap-1.5">
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
            className="hidden md:inline-flex h-10 items-center rounded-[var(--radius-xs)] px-3 text-[13.5px] font-medium text-ink-2 transition-colors hover:text-foreground"
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
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href as never}
      className={
        "inline-flex h-10 items-center rounded-[var(--radius-xs)] px-3 text-[14px] font-medium text-ink-2 transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus " +
        (className ?? "")
      }
    >
      {children}
    </Link>
  );
}
