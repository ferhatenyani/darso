/**
 * Backend integration notes
 *
 * Endpoints:
 *   GET    /api/payments/methods        → seeds the user's saved cards (currently
 *                                          lives inside account-shell PaymentsSection)
 *   POST   /api/payments/methods        → add a new card / method
 *   PATCH  /api/payments/methods/:id    → update label / set as default
 *   DELETE /api/payments/methods/:id    → remove method
 *   (no subscribe — request/response, optionally refetched on focus)
 *
 * Shape: the backend should return PaymentMethod[] matching the type below.
 *   `defaultMockPaymentMethods` is a localized fallback for visitors who
 *   haven't saved any method yet — drop it once the GET endpoint returns
 *   an empty-state shape.
 * Cache invalidation: mutations should invalidate the per-account cache
 *   so both account-shell and CheckoutDialog re-read in sync.
 *
 * Identity: accountId is the cookie-derived user id (from @/lib/auth/server).
 *   In the real backend, the user is read from the auth context; mock stores
 *   accept it as a parameter for snapshot scoping.
 */

/**
 * Shared payment-method shape used by both `account-shell` (the user-managed
 * list) and `CheckoutDialog` (the picker at booking time).
 *
 * Lifted from account-shell so the booking dialog can reuse the same type
 * without duplicating field definitions. The actual mutable list still lives
 * inside `account-shell` PaymentsSection — this file only exports the type
 * and a small fallback used when the picker is opened from outside the
 * account shell (default cards a brand-new visitor would see).
 */
export type PaymentMethod = {
  id: string;
  label: string;
  last4?: string;
  expiry?: string;
  isDefault?: boolean;
};

/**
 * Localized default cards used by the checkout dialog when it can't read
 * the live list from the account shell (the account shell owns mutation
 * state; the dialog reads from a static fallback so it works on any page).
 *
 * Picks brand names that match the methods seeded in account-shell so the
 * UX feels consistent even when the data isn't actually shared.
 */
export function defaultMockPaymentMethods(
  labels: { edahabia: string; cib: string; postalMandate: string; baridiMob: string },
): PaymentMethod[] {
  return [
    { id: "pm-default-1", label: labels.edahabia, last4: "4218", expiry: "12/27", isDefault: true },
    { id: "pm-default-2", label: labels.cib, last4: "9043", expiry: "06/26" },
    { id: "pm-default-3", label: labels.postalMandate },
    { id: "pm-default-4", label: labels.baridiMob },
  ];
}
