/**
 * Données de prévisualisation pour la grille de choix de thème.
 * Volontairement séparées des vrais composants de thème (qui contiennent
 * des animations/particules coûteuses) — ici on ne reprend que les
 * couleurs clés de chaque thème, pour un aperçu léger et rapide.
 */
export interface ThemePreview {
  bg: string;
  card: string;
  accent: string;
  textOnCard: string;
}

export const THEME_PREVIEWS: Record<string, ThemePreview> = {
  elegant: { bg: "var(--color-elegant-bg)", card: "#fffdf9", accent: "var(--color-elegant-accent)", textOnCard: "var(--color-ink-950)" },
  luxe: { bg: "var(--color-luxe-bg)", card: "var(--color-luxe-card)", accent: "var(--color-luxe-accent)", textOnCard: "#ffffff" },
  festif: { bg: "var(--color-festif-bg)", card: "#ffffff", accent: "var(--color-bonheur)", textOnCard: "var(--color-ink-950)" },
  doux: { bg: "var(--color-doux-bg)", card: "#ffffff", accent: "var(--color-doux-accent)", textOnCard: "var(--color-ink-950)" },
  colore: { bg: "#ffffff", card: "#ffffff", accent: "var(--color-brand-500)", textOnCard: "var(--color-ink-950)" },
  ciel: { bg: "var(--color-ciel-bg)", card: "var(--color-ciel-card)", accent: "var(--color-ciel-star)", textOnCard: "#ffffff" },
  amoureux: { bg: "var(--color-amoureux-bg)", card: "var(--color-amoureux-card)", accent: "var(--color-amoureux-accent)", textOnCard: "#ffffff" },
  "mon-homme": { bg: "var(--color-monhomme-bg)", card: "var(--color-monhomme-card)", accent: "var(--color-monhomme-accent)", textOnCard: "#ffffff" },

  timide: { bg: "var(--color-timide-bg)", card: "#ffffff", accent: "var(--color-timide-accent)", textOnCard: "var(--color-ink-950)" },
  passion: { bg: "var(--color-passion-bg)", card: "var(--color-passion-card)", accent: "var(--color-passion-accent)", textOnCard: "#ffffff" },
  lettre: { bg: "var(--color-paper-100)", card: "#fffdf9", accent: "var(--color-notebook-margin)", textOnCard: "var(--color-ink-950)" },
  "nuit-etoilee": { bg: "var(--color-nuit-bg)", card: "var(--color-nuit-card)", accent: "var(--color-nuit-star)", textOnCard: "#ffffff" },
  neon: { bg: "var(--color-neon-bg)", card: "rgba(15,6,25,0.9)", accent: "var(--color-neon-pink)", textOnCard: "#ffffff" },
  "pop-art": { bg: "var(--color-pop-yellow)", card: "#ffffff", accent: "var(--color-pop-red)", textOnCard: "var(--color-pop-ink)" },

    "carte-a-gratter": { bg: "var(--color-gratter-bg)", card: "var(--color-gratter-card)", accent: "var(--color-gratter-gold)", textOnCard: "var(--color-gratter-ink)" },
      "rideau-velours": { bg: "var(--color-rideau-stage)", card: "var(--color-rideau-red)", accent: "var(--color-rideau-gold)", textOnCard: "#ffffff" },
        "boite-chocolats": { bg: "var(--color-choco-bg)", card: "#ffffff", accent: "var(--color-choco-ribbon)", textOnCard: "var(--color-choco-box-dark)" },
          "diner-chandelles": { bg: "var(--color-diner-bg)", card: "var(--color-diner-bg2)", accent: "var(--color-diner-gold)", textOnCard: "#fdf2e5" },
            cupidon: { bg: "var(--color-cupidon-bg)", card: "var(--color-cupidon-card)", accent: "var(--color-cupidon-magenta)", textOnCard: "#ffffff" },
              "retro-70s": { bg: "var(--color-retro-cream)", card: "#ffffff", accent: "var(--color-retro-terracotta)", textOnCard: "var(--color-retro-brown)" },

                ecrin: { bg: "var(--color-ecrin-bg)", card: "var(--color-ecrin-velvet)", accent: "var(--color-ecrin-gold)", textOnCard: "#fdf6e8" },
};

export function getThemePreview(slug: string): ThemePreview {
  return THEME_PREVIEWS[slug] ?? THEME_PREVIEWS.elegant;
}