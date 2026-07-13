/**
 * Unified action queue for the teacher — Decision 16 (time-urgency sort).
 *
 * Aggregates every action-worthy item from four sources so the teacher
 * has ONE place to work through them instead of having to remember to
 * check /teach/requests + /teach/applications + /teach/messages + etc.
 * Sources:
 *  - Pending join/booking approvals on approval-required listings
 *    (from bookings-state, stage `requested`)
 *  - Payment-receipt confirmations on direct-pay bookings
 *    (bookings-state, stage `pending_teacher_confirmation`)
 *  - Direct invites from students to respond to a request
 *  - Open proposal opportunities matching the teacher's subjects
 *
 * Sort: time-urgency ascending — soonest expiring first. Approvals with
 * tight 72h clocks bubble to the top. Ties break by newest first.
 */

import { recentRequests } from "./dashboard";

export type ActionKind =
  | "approval" // pending join request awaiting approve/reject
  | "payment_confirmation" // teacher must confirm direct-pay receipt
  | "direct_invite" // student invited this teacher to a request
  | "proposal_opportunity"; // open request matches teacher subjects

export type ActionItem = {
  id: string;
  kind: ActionKind;
  /** Person that triggered the item — student name / initials / accent. */
  actor: {
    name: string;
    initials: string;
    accent: string;
    city?: string;
  };
  /** Localized short title — e.g. "Rejoindre le cours de maths". */
  title: string;
  /** One-line subtext — details or excerpt. */
  subtitle: string;
  /** Hours remaining before the item auto-expires (used for sort + badge). */
  hoursRemaining: number;
  /** Where the primary CTA routes. */
  primaryHref: string;
  /** Optional secondary href (e.g. Reject / Decline). */
  secondaryHref?: string;
  /** Optional cached price for revenue framing. */
  priceDzd?: number;
};

/**
 * Seeded direct invites + proposal opportunities. Real backend derives
 * these from indexed learning-requests + invites tables. Kept small so
 * the queue has content even on a fresh account.
 */
function seededExtras(): ActionItem[] {
  return [
    {
      id: "inv-nadia",
      kind: "direct_invite",
      actor: {
        name: "Nadia B.",
        initials: "NB",
        accent: "from-[#D946EF] to-[#F0ABFC]",
        city: "Oran",
      },
      title: "Nadia vous invite à répondre à sa demande",
      subtitle: "Préparation IELTS · budget 25–35k DA · en ligne",
      hoursRemaining: 48,
      primaryHref: "/teach/requests",
      priceDzd: 30000,
    },
    {
      id: "req-bac-physique",
      kind: "proposal_opportunity",
      actor: {
        name: "Sofiane K.",
        initials: "SK",
        accent: "from-[#2F6BFF] to-[#1C3A5E]",
        city: "Alger",
      },
      title: "Nouvelle demande — Physique Bac",
      subtitle: "Groupe de 3 élèves · 2 séances/sem · matin",
      hoursRemaining: 66,
      primaryHref: "/teach/requests",
      priceDzd: 12000,
    },
    {
      id: "req-python-jeunes",
      kind: "proposal_opportunity",
      actor: {
        name: "Yasmine H.",
        initials: "YH",
        accent: "from-[#16A085] to-[#2EC4A2]",
        city: "Constantine",
      },
      title: "Nouvelle demande — Programmation Python",
      subtitle: "Pour deux ados (12 & 14 ans) · débutant · en présentiel",
      hoursRemaining: 71,
      primaryHref: "/teach/requests",
      priceDzd: 18000,
    },
  ];
}

/**
 * Turn the existing `recentRequests` mock into approval action items.
 * Uses the request's `sentAt` label as a coarse urgency signal (fresh
 * requests have plenty of clock, stale ones bubble to the top).
 */
function approvalsFromRecent(): ActionItem[] {
  return recentRequests
    .filter((r) => r.status === "pending")
    .map((r): ActionItem => {
      // Parse hours from the sentAt label ("il y a 3h") — coarse approx.
      // Real backend uses stored timestamps.
      const hoursSince = parseHoursFromLabel(r.sentAt.fr);
      const hoursRemaining = Math.max(1, 72 - hoursSince);
      return {
        id: r.id,
        kind: "approval",
        actor: {
          name: r.student.name.fr,
          initials: r.student.initials,
          accent: r.student.accent,
          city: r.student.location.fr,
        },
        title: `${r.student.name.fr} veut rejoindre`,
        subtitle: r.excerpt.fr,
        hoursRemaining,
        primaryHref: "/teach/requests",
        secondaryHref: "/teach/requests",
      };
    });
}

function parseHoursFromLabel(label: string): number {
  const m = label.match(/(\d+)\s*(h|min)/);
  if (!m) return 24;
  const n = parseInt(m[1] ?? "0", 10);
  return m[2] === "min" ? Math.ceil(n / 60) : n;
}

export function getActionQueue(): ActionItem[] {
  const items = [...approvalsFromRecent(), ...seededExtras()];
  // Sort by urgency ascending; ties break by title.
  return items.sort((a, b) => a.hoursRemaining - b.hoursRemaining || a.title.localeCompare(b.title));
}

export function kindLabelFr(kind: ActionKind): string {
  switch (kind) {
    case "approval":
      return "Approbation";
    case "payment_confirmation":
      return "Paiement à confirmer";
    case "direct_invite":
      return "Invitation directe";
    case "proposal_opportunity":
      return "Opportunité";
  }
}
