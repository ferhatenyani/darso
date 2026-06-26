import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { MobileNav } from "@/components/nav/mobile-nav";
import { DiscoverMenu } from "@/components/nav/discover-menu";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container-narrow flex h-20 items-center">
        <Link href="/" className="shrink-0 outline-none focus-visible:rounded-md">
          <Logo />
        </Link>

        <nav className="ms-8 hidden lg:flex items-center gap-1" aria-label="Main">
          <DiscoverMenu />
          <Link
            href="/teachers"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] px-3 text-[15px] font-medium text-ink-2 transition-colors hover:text-foreground"
          >
            {t("teachers")}
          </Link>
          <Link
            href="/live"
            className="group inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] px-3 text-[15px] font-medium text-ink-2 transition-colors hover:text-foreground"
            aria-label={t("liveNowSub")}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-danger live-dot" />
              <span className="relative h-2 w-2 rounded-full bg-danger" />
            </span>
            {t("liveNow")}
          </Link>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <Link
            href="/search"
            aria-label={t("search")}
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-ink-2 transition-colors hover:bg-surface hover:text-foreground"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>

          <Link
            href="/teach"
            className="hidden md:inline-flex h-10 items-center rounded-[var(--radius-md)] px-3 text-[15px] font-medium text-ink-2 transition-colors hover:text-foreground"
          >
            {t("becomeTeacher")}
          </Link>

          <span className="hidden md:block h-6 w-px bg-border me-1" aria-hidden />

          <LanguageSwitcher />

          <div className="hidden md:flex items-center gap-1 ms-1">
            <Button asChild variant="ghost" size="md">
              <Link href="/sign-in">{t("signIn")}</Link>
            </Button>
            <Button asChild variant="primary" size="md">
              <Link href="/sign-up">{t("signUp")}</Link>
            </Button>
          </div>
          <MobileNav />
        </div>
      </div>

      {/* Subtle bottom rule: thin border with a small accent strip on the start side */}
      <div className="relative h-px bg-border" aria-hidden>
        <span className="absolute start-0 top-0 h-px w-24 bg-accent" />
      </div>
    </header>
  );
}
