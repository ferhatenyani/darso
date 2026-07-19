"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { routes } from "@/lib/routes";

/**
 * Home page header. Sits in normal flow — no sticky/fixed —
 * so it scrolls away with the page. Logo and auth pill hug the
 * viewport corners with only a hair of inline padding.
 */
export function HomeHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-30 bg-white/55 pt-2 pb-2 backdrop-blur-xl backdrop-saturate-150 md:pt-3 md:pb-3">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-5 md:px-6">
        <Link
          href={routes.home()}
          className="shrink-0 outline-none focus-visible:rounded-md focus-visible:shadow-focus"
          aria-label="darso"
        >
          <Logo />
        </Link>

        <AuthPill signInLabel={t("signIn")} signUpLabel={t("signUp")} />
      </div>
    </header>
  );
}

function AuthPill({
  signInLabel,
  signUpLabel,
}: {
  signInLabel: string;
  signUpLabel: string;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-foreground/15 bg-white p-[2px] shadow-[0_1px_2px_rgba(10,11,14,0.05),0_6px_16px_-8px_rgba(10,11,14,0.14)] sm:p-[3px]">
      <Link
        href={routes.signIn()}
        className="inline-flex h-7 items-center rounded-full px-1.5 text-[11px] font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus sm:h-9 sm:px-2.5 sm:text-[13px]"
      >
        {signInLabel}
      </Link>
      <Link
        href={routes.signUp()}
        className="inline-flex h-7 items-center rounded-full bg-foreground px-1.5 text-[11px] font-semibold text-background transition-transform duration-200 hover:-translate-y-[0.5px] focus-visible:outline-none focus-visible:shadow-focus sm:h-9 sm:px-2.5 sm:text-[13px]"
      >
        {signUpLabel}
      </Link>
    </div>
  );
}
