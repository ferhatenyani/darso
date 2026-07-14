"use server";

import { redirect } from "next/navigation";

import {
  findAccountByEmail,
  findAccountById,
  registerAccount,
  type AccountRole,
} from "./accounts";
import { clearAuthCookie, setAuthCookie } from "./cookies";
import { roleHome } from "./role-home";

/**
 * Sign in by selecting an existing mock account by id. Validates the id is
 * in the catalog before setting the cookie. If `next` is provided we honor
 * it (used by the proxy redirect with ?next=…), otherwise we go to the
 * role's home.
 *
 * Note: `redirect()` throws, so any code after must not run on success.
 */
export async function signInWithAccountId(
  accountId: string,
  next?: string,
): Promise<{ ok: false; error: "unknown-account" } | void> {
  const account = findAccountById(accountId);
  if (!account) {
    return { ok: false, error: "unknown-account" };
  }
  await setAuthCookie(account.id);
  redirect(next && next.startsWith("/") ? next : roleHome(account.role));
}

/**
 * Sign in by email lookup against the mock account catalog. Returns
 * `{ ok: false, error: "unknown-email" }` if no match; otherwise redirects.
 */
export async function signInWithEmail(
  email: string,
  next?: string,
): Promise<{ ok: false; error: "unknown-email" } | void> {
  const account = findAccountByEmail(email);
  if (!account) {
    return { ok: false, error: "unknown-email" };
  }
  await setAuthCookie(account.id);
  redirect(next && next.startsWith("/") ? next : roleHome(account.role));
}

/**
 * Register a new mock account from the sign-up form and sign them in.
 * Mock-only — no password validation.
 */
export async function signUpWithEmail(input: {
  role: AccountRole;
  email: string;
  name?: string;
  next?: string;
}): Promise<void> {
  const account = registerAccount({
    role: input.role,
    email: input.email,
    name: input.name,
  });
  await setAuthCookie(account.id);
  redirect(
    input.next && input.next.startsWith("/")
      ? input.next
      : input.role === "student"
        ? "/account/onboarding"
        : roleHome(input.role),
  );
}

/**
 * Sign out — clears the cookie and goes to the marketing landing.
 */
export async function signOutAction(): Promise<void> {
  await clearAuthCookie();
  redirect("/");
}
