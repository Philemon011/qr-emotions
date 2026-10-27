export const MAX_BODY_LENGTH = 400;
export const MAX_NAME_LENGTH = 40;
export const MAX_SIGNATURE_LENGTH = 60;

/**
 * Durées d'expiration proposées à la création (en jours). `null` = pas
 * d'expiration, qui reste le choix par défaut — jamais de suppression
 * automatique surprise (voir discussion sur la durabilité des données).
 */
export const EXPIRATION_OPTIONS = [
  { value: null, label: "Jamais" },
  { value: 7, label: "1 semaine" },
  { value: 30, label: "1 mois" },
  { value: 90, label: "3 mois" },
  { value: 365, label: "1 an" },
] as const;

export type ExpirationDays = (typeof EXPIRATION_OPTIONS)[number]["value"];