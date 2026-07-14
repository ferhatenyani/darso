/**
 * Direct-pay methods advertised by teachers at checkout.
 *
 * v1 launches Algeria-only with no platform-processed payments — every
 * booking uses the same direct-pay handshake: student marks payment
 * arranged, teacher confirms receipt.
 *
 * v1 mock policy: all teachers advertise the same three methods. When
 * per-teacher configuration lands (teacher dashboard payout settings),
 * this helper takes a teacherSlug and returns their specific list. The
 * signature already accepts it so consumers don't need to change.
 */

export type DirectPayMethodKind = "bank_transfer" | "cash" | "baridimob";

export type DirectPayMethod = {
  id: string;
  kind: DirectPayMethodKind;
  label: string;
  /** Multi-line human instructions shown at checkout. */
  instructions: string;
};

const DEFAULT_METHODS: DirectPayMethod[] = [
  {
    id: "bank",
    kind: "bank_transfer",
    label: "Virement bancaire",
    instructions:
      "BNP · IBAN DZ12 3456 7890 1234 5678 9012 · Titulaire : le professeur\nEnvoyez le reçu par message une fois le virement effectué.",
  },
  {
    id: "baridimob",
    kind: "baridimob",
    label: "BaridiMob",
    instructions:
      "Numéro CCP : 0012345 clé 67 · Titulaire : le professeur\nUtilisez le motif « darso » suivi de la référence de la réservation.",
  },
  {
    id: "cash",
    kind: "cash",
    label: "Espèces à la première séance",
    instructions:
      "Réglez en espèces au début de votre première séance. Le professeur confirmera la réception ici.",
  },
];

export function getDirectPayMethods(_teacherSlug?: string): DirectPayMethod[] {
  return DEFAULT_METHODS;
}
