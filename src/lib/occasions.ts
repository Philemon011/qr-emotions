import type { Occasion } from "@/types/message";

export const OCCASIONS: Occasion[] = [
  {
    slug: "anniversaire",
    label: "Anniversaire",
    emoji: "🎂",
    color: "var(--color-joie)",
    themes: [
      { slug: "elegant", label: "Élégant" },
      { slug: "luxe", label: "Luxe" },
      { slug: "festif", label: "Festif" },
      { slug: "doux", label: "Doux" },
      { slug: "colore", label: "Coloré" },
      { slug: "ciel", label: "Ciel" },
      { slug: "amoureux", label: "Amoureux" },
      { slug: "mon-homme", label: "Mon Homme" },
    ],
  },
  {
    slug: "declaration-amour",
    label: "Déclaration d'amour",
    emoji: "💌",
    color: "var(--color-amour)",
    themes: [
      { slug: "timide", label: "Timide" },
      { slug: "passion", label: "Passion" },
      { slug: "lettre", label: "Lettre manuscrite" },
      { slug: "nuit-etoilee", label: "Nuit étoilée" },
      { slug: "neon", label: "Néon" },
      { slug: "pop-art", label: "Pop Art" },
    ],
  },
  {
    slug: "saint-valentin",
    label: "Saint-Valentin",
    emoji: "❤️",
    color: "var(--color-amour)",
    themes: [
      { slug: "carte-a-gratter", label: "Carte à gratter" },
      { slug: "rideau-velours", label: "Rideau de velours" },
      { slug: "boite-chocolats", label: "Boîte de chocolats" },
      { slug: "diner-chandelles", label: "Dîner aux chandelles" },
      { slug: "cupidon", label: "Cupidon" },
      { slug: "retro-70s", label: "Rétro 70s" },
    ],
  },
  {
    slug: "demande-mariage",
    label: "Demande en mariage",
    emoji: "💍",
    color: "var(--color-gratitude)",
        themes: [{ slug: "ecrin", label: "Écrin" }],
  },
];

export function getOccasion(slug: string) {
  return OCCASIONS.find((o) => o.slug === slug);
}

export function getTheme(occasionSlug: string, themeSlug: string) {
  const occasion = getOccasion(occasionSlug);
  return occasion?.themes.find((t) => t.slug === themeSlug);
}