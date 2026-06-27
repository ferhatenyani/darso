import "server-only";

import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "./constants";

/**
 * Server-only: read the auth cookie. Returns the account id string or null.
 * `cookies()` is async in Next.js 16.
 */
export async function readAuthCookie(): Promise<string | null> {
  const store = await cookies();
  const cookie = store.get(AUTH_COOKIE_NAME);
  return cookie?.value ?? null;
}

/**
 * Server-action-only: write the auth cookie. Must be called from a server
 * action or route handler — Server Components cannot mutate cookies.
 *
 * `httpOnly: false` is deliberate so the client provider can also read the
 * cookie if needed; this is a mock-only flow with no real credentials, so
 * standard XSS concerns don't apply.
 */
export async function setAuthCookie(accountId: string): Promise<void> {
  const store = await cookies();
  store.set({
    name: AUTH_COOKIE_NAME,
    value: accountId,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    // 30 days
    maxAge: 60 * 60 * 24 * 30,
  });
}

/**
 * Server-action-only: clear the auth cookie.
 */
export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE_NAME);
}
