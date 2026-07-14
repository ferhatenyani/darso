import "server-only";

import { findAccountById, type Account } from "./accounts";
import { readAuthCookie } from "./cookies";

/**
 * Server-only: resolve the current user from the auth cookie. Returns the
 * mock `Account` record or `null` when no cookie is present (or the cookie
 * refers to an account that no longer exists in the in-memory map, e.g. after
 * a hot-reload).
 */
export async function getCurrentUser(): Promise<Account | null> {
  const id = await readAuthCookie();
  return findAccountById(id);
}
