/**
 * Public surface of the mock auth module — client-safe entry point.
 *
 * Server-only helpers live in `./server` and must be imported from there
 * (e.g. `import { getCurrentUser } from "@/lib/auth/server"`). They cannot
 * be re-exported from this barrel because `server.ts` and `cookies.ts`
 * import `server-only`, which would poison every client component that
 * touches `@/lib/auth`.
 *
 * Server actions are safe to re-export — `"use server"` modules can be
 * called from client components (they marshal across the boundary).
 */

export type { Account, AccountRole } from "./accounts";
export {
  mockAccounts,
  findAccountById,
  findAccountByEmail,
  listAccounts,
  registerAccount,
} from "./accounts";

export { AUTH_COOKIE_NAME } from "./constants";

export {
  signInWithAccountId,
  signInWithEmail,
  signUpWithEmail,
  signOutAction,
} from "./actions";
export { roleHome } from "./role-home";

export { CurrentUserProvider, useCurrentUser } from "./context";
