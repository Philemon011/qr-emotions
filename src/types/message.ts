/**
 * Types partagés du parcours de création de message.
 * Point de référence unique — toute la mécanique (occasions, thèmes,
 * formulaire, prévisualisation) s'appuie sur ces types.
 */

/** Une occasion disponible (ex: Anniversaire), avec la liste de ses thèmes. */
export interface Occasion {
  slug: string; // identifiant URL, ex: "anniversaire"
  label: string; // nom affiché, ex: "Anniversaire"
  emoji: string; // repère visuel rapide dans les listes/cartes
  color: string; // couleur dominante de l'occasion (variable CSS du design system)
  themes: Theme[];
}

/** Un thème visuel appartenant à une occasion (ex: "Élégant" pour Anniversaire). */
export interface Theme {
  slug: string; // identifiant URL, ex: "elegant"
  label: string; // nom affiché, ex: "Élégant"
}

/**
 * Les données saisies par l'utilisateur pour composer son message.
 * Correspond exactement aux champs prévus dans le cahier des charges
 * (section 5) : destinataire et signature sont tous deux optionnels.
 */
export interface MessageContent {
  recipientFirstName?: string;
  body: string;
  signature?: string;
}

/**
 * Props reçues par CHAQUE composant de thème (ex: anniversaire/elegant.tsx).
 * Garantit que tous les thèmes, quelle que soit l'occasion, ont exactement
 * la même interface — on peut donc les échanger/ajouter librement sans
 * jamais casser le reste du parcours.
 */
export interface ThemeProps {
  content: MessageContent;
}