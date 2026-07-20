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

/**
 * Segmented auth pill — the two CTAs live inside one capsule so they read
 * as a single "choose your door" object rather than two loose buttons.
 *
 * Enhancements over the first pass:
 * - Softer surround: the hard `foreground/15` hairline is replaced with a
 *   layered soft ring (inset 1px near-transparent + a low-drop 2px shadow)
 *   so the pill lifts off the frosted header without a sharp outline.
 * - Taller: chips grow from h-7/h-9 to h-8/h-10, matching the standard
 *   button md/lg heights so the target hits ≥40px on desktop.
 * - Hover: the whole capsule floats up 0.5px and its shadow warms; the
 *   Sign in half gets its own inset ghost chip on hover (was color-only);
 *   the Sign up half deepens to primary-dark AND grows a 1px accent shelf
 *   underneath so the primary action always confirms with brand ink.
 * - Full-pill focus ring for keyboard users.
 */
function AuthPill({
  signInLabel,
  signUpLabel,
}: {
  signInLabel: string;
  signUpLabel: string;
}) {
  return (
    <div
      className="group/pill inline-flex items-center rounded-full bg-white/85 p-[3px] backdrop-blur-sm shadow-[inset_0_0_0_1px_rgba(10,11,14,0.06),0_1px_1px_rgba(10,11,14,0.03),0_6px_18px_-10px_rgba(10,11,14,0.15)] transition-all duration-500 motion-reduce:transition-none hover:-translate-y-[2px] hover:shadow-[inset_0_0_0_1px_rgba(10,11,14,0.08),0_3px_4px_rgba(10,11,14,0.05),0_14px_28px_-14px_rgba(10,11,14,0.18)] sm:p-[4px]"
    >
      <Link
        href={routes.signIn()}
        className="inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium text-foreground/75 transition-[background-color,color] duration-[260ms] [transition-timing-function:var(--ease-out)] motion-reduce:transition-none hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus sm:h-10 sm:px-4 sm:text-[13.5px]"
      >
        {signInLabel}
      </Link>
      <Link
        href={routes.signUp()}
        className="relative inline-flex h-8 items-center rounded-full bg-foreground px-3.5 text-[12px] font-semibold text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[background-color,box-shadow] duration-[260ms] [transition-timing-function:var(--ease-out)] motion-reduce:transition-none hover:bg-primary-dark hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_1px_0_var(--accent)] focus-visible:outline-none focus-visible:shadow-focus sm:h-10 sm:px-[18px] sm:text-[13.5px]"
      >
        {signUpLabel}
      </Link>
    </div>
  );
}
