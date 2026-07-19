"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/nav/mobile-nav";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Homepage-only floating pill navbar.
 * Rests as a glass pill over the hero; adds a subtle shadow after scroll.
 * SiteHeader remains the shell for every other route.
 */
export function HomeHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 pt-3 md:pt-5">
      <div className="container-wide">
        <div
          className={cn(
            "mx-auto flex h-14 items-center gap-2 rounded-full border border-white/60 bg-white/70 pl-4 pr-2 backdrop-blur-xl transition-all duration-300 md:h-[60px] md:pl-6 md:pr-3 lg:w-[92%]",
            scrolled
              ? "border-border shadow-[0_10px_32px_-16px_rgba(10,11,14,0.20),0_2px_6px_-2px_rgba(10,11,14,0.08)]"
              : "shadow-[0_6px_24px_-14px_rgba(10,11,14,0.14)]",
          )}
        >
          {/* Logo */}
          <Link
            href={routes.home()}
            className="group shrink-0 outline-none transition-transform duration-200 hover:-translate-y-[0.5px] focus-visible:rounded-full focus-visible:shadow-focus"
          >
            <Logo />
          </Link>

          {/* Center nav — only from xl (below xl the pill cramps and text wraps) */}
          <nav className="mx-auto hidden items-center gap-0.5 xl:flex" aria-label="Main">
            <PillLink href={routes.browse()} active={pathname.startsWith("/browse")}>
              {t("browse")}
            </PillLink>
            <PillLink href={routes.teachers()} active={pathname.startsWith("/teachers")}>
              {t("teachers")}
            </PillLink>
            <PillLink
              href={routes.live()}
              active={pathname.startsWith("/live")}
              className="gap-2"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-danger live-dot" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-danger" />
              </span>
              {t("liveNow")}
            </PillLink>
            <PillLink href={routes.teachLanding()} active={pathname.startsWith("/teach")}>
              {t("becomeTeacher")}
            </PillLink>
          </nav>

          {/* Right rail */}
          <div className="ms-auto flex items-center gap-1.5 xl:ms-0">
            <Link
              href={routes.signIn()}
              className="hidden md:inline-flex h-10 items-center rounded-full px-4 text-[13.5px] font-medium text-ink-2 transition-colors hover:bg-white/70 hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus"
            >
              {t("signIn")}
            </Link>
            <Link
              href={routes.signUp()}
              className="hidden md:inline-flex h-10 items-center rounded-full bg-primary px-4 text-[13.5px] font-semibold text-primary-foreground shadow-e1 transition-all duration-200 hover:-translate-y-[0.5px] hover:bg-primary-dark hover:shadow-e2 focus-visible:outline-none focus-visible:shadow-focus"
            >
              {t("signUp")}
            </Link>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

function PillLink({
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
        "inline-flex h-10 items-center rounded-full px-4 text-[13.5px] font-medium transition-colors focus-visible:outline-none focus-visible:shadow-focus",
        active
          ? "bg-primary/[0.06] text-foreground"
          : "text-ink-2 hover:bg-white/70 hover:text-foreground",
        className,
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
