"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { Account } from "./accounts";

type CurrentUserCtx = {
  user: Account | null;
  /** Local optimistic setter (used by the demo picker before redirect). */
  setCurrentUser: (next: Account | null) => void;
  /** Call the sign-out server action and clear local state. */
  signOut: () => Promise<void> | void;
};

const Ctx = createContext<CurrentUserCtx | null>(null);

export function CurrentUserProvider({
  initialUser,
  signOut,
  children,
}: {
  initialUser: Account | null;
  /**
   * The server action wrapper that clears the cookie and redirects.
   * Passed in by the server-side layout so this client component doesn't
   * import "use server" code directly.
   */
  signOut: () => Promise<void> | void;
  children: ReactNode;
}) {
  const [user, setUser] = useState<Account | null>(initialUser);

  const handleSignOut = useCallback(async () => {
    setUser(null);
    await signOut();
  }, [signOut]);

  const value = useMemo<CurrentUserCtx>(
    () => ({
      user,
      setCurrentUser: setUser,
      signOut: handleSignOut,
    }),
    [user, handleSignOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Hook for client components. Returns the current user (or null) plus a
 * sign-out handle and an optimistic setter.
 *
 * Safe to call from anywhere inside `CurrentUserProvider`; outside the
 * provider it returns a no-op shape with `user: null`.
 */
export function useCurrentUser(): CurrentUserCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      user: null,
      setCurrentUser: () => {},
      signOut: () => {},
    };
  }
  return ctx;
}
