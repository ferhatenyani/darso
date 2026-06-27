import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Locale-stripped paths that always require a session.
// `/teach` and `/teach/{pricing,resources}` are intentionally public — they
// are the marketing surfaces. Everything else under `/teach/` is dashboard-
// only and gated below.
const GATED_PATHS = [
  "/account",
  "/teach/dashboard",
  "/teach/agency",
  "/teach/applications",
  "/teach/courses",
  "/teach/events",
  "/teach/ondemand",
  "/teach/profile",
  "/teach/requests",
  "/teach/reviews",
  "/teach/subscription",
  "/messages",
  "/calendar",
  "/requests/my",
  "/disputes",
  "/notifications",
];

const GATED_REGEXES: RegExp[] = [/^\/requests\/[^/]+\/edit\/?$/];

const SIGN_IN_PATH = "/sign-in";

function inspectPath(pathname: string): { gated: boolean; locale: string; rest: string } {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const locale =
    maybeLocale && (routing.locales as readonly string[]).includes(maybeLocale)
      ? maybeLocale
      : routing.defaultLocale;
  const rest = "/" + segments.slice(locale === maybeLocale ? 1 : 0).join("/");
  const gated =
    GATED_PATHS.some((p) => rest === p || rest.startsWith(`${p}/`)) ||
    GATED_REGEXES.some((re) => re.test(rest));
  return { gated, locale, rest };
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { gated, locale, rest } = inspectPath(pathname);

  if (gated) {
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!authCookie?.value) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = `/${locale}${SIGN_IN_PATH}`;
      signInUrl.search = `?next=${encodeURIComponent(`/${locale}${rest}${search}`)}`;
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
