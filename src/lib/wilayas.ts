/**
 * Canonical list of Algeria's 48 wilayas (administrative provinces).
 * Each key resolves through the `search.wilayas` namespace in
 * `messages/{fr,ar}/common.json` to its localized display label.
 *
 * The leading "any" sentinel means "no wilaya filter" and is used in
 * search/browse UIs; profile-style pickers should slice it off.
 */
export const wilayaKeys = [
  "any",
  "adrar",
  "chlef",
  "laghouat",
  "oumElBouaghi",
  "batna",
  "bejaia",
  "biskra",
  "bechar",
  "blida",
  "bouira",
  "tamanrasset",
  "tebessa",
  "tlemcen",
  "tiaret",
  "tiziOuzou",
  "alger",
  "djelfa",
  "jijel",
  "setif",
  "saida",
  "skikda",
  "sidiBelAbbes",
  "annaba",
  "guelma",
  "constantine",
  "medea",
  "mostaganem",
  "msila",
  "mascara",
  "ouargla",
  "oran",
  "elBayadh",
  "illizi",
  "bordjBouArreridj",
  "boumerdes",
  "elTarf",
  "tindouf",
  "tissemsilt",
  "elOued",
  "khenchela",
  "soukAhras",
  "tipaza",
  "mila",
  "ainDefla",
  "naama",
  "ainTemouchent",
  "ghardaia",
  "relizane",
] as const;

export type WilayaKey = (typeof wilayaKeys)[number];
