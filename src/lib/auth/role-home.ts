import type { AccountRole } from "./accounts";

/**
 * Compute the post-sign-in landing page for a given role.
 * - student → /account
 * - teacher → /teach/dashboard
 *
 * Sync helper — lives outside `actions.ts` because that file is a
 * `"use server"` module and every export there must be an async function.
 */
export function roleHome(role: AccountRole): string {
  return role === "teacher" ? "/teach/dashboard" : "/account";
}
