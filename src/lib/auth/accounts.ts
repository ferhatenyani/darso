/**
 * Mock account catalog — in-memory only.
 *
 * Auth in this app is mock-only: a cookie holds the account id, and this
 * module is the single source of truth for who that id resolves to. Mutations
 * (adding a new account at sign-up) survive in-session and reset on full
 * page reload, because the module state lives in the server process.
 */

export type AccountRole = "student" | "teacher";

export type Account = {
  id: string;
  role: AccountRole;
  email: string;
  /* Student-specific */
  studentName?: string;
  studentInitials?: string;
  studentCity?: string;
  studentPhone?: string;
  /* Teacher-specific */
  teacherSlug?: string;
  teacherId?: string;
};

/**
 * Live mock account map. We use `let` + a wrapper array so dynamic sign-ups
 * can extend it within a session.
 */
const _accounts: Account[] = [
  {
    id: "acc-lina",
    role: "student",
    email: "lina@darso.dz",
    studentName: "Lina M.",
    studentInitials: "LM",
    studentCity: "constantine",
    studentPhone: "+213 555 11 22 33",
  },
  {
    id: "acc-khalil",
    role: "teacher",
    email: "khalil@darso.dz",
    teacherSlug: "khalil-bensaid",
    teacherId: "t-khalil",
  },
];

export const mockAccounts: ReadonlyArray<Account> = _accounts;

export function findAccountById(id: string | null | undefined): Account | null {
  if (!id) return null;
  return _accounts.find((a) => a.id === id) ?? null;
}

export function findAccountByEmail(email: string | null | undefined): Account | null {
  if (!email) return null;
  const lower = email.trim().toLowerCase();
  return _accounts.find((a) => a.email.toLowerCase() === lower) ?? null;
}

export function listAccounts(): ReadonlyArray<Account> {
  return _accounts;
}

/**
 * Register a brand-new account (sign-up flow). Returns the created record.
 * Throws if an account with that email already exists.
 */
export function registerAccount(input: {
  role: AccountRole;
  email: string;
  name?: string;
}): Account {
  const existing = findAccountByEmail(input.email);
  if (existing) return existing;

  const id = `acc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const initials = input.name
    ? input.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("")
    : "U";

  const account: Account =
    input.role === "teacher"
      ? {
          id,
          role: "teacher",
          email: input.email,
          // New teachers don't have a public slug or seeded mock teacher yet
          teacherSlug: undefined,
          teacherId: undefined,
        }
      : {
          id,
          role: "student",
          email: input.email,
          studentName: input.name ?? "Nouveau membre",
          studentInitials: initials || "NM",
        };

  _accounts.push(account);
  return account;
}
