import type { ComponentType } from "react";
import type { ThemeProps } from "@/types/message";

// --- Anniversaire ---
import AnniversaireElegant from "@/components/themes/anniversaire/elegant";
import AnniversaireLuxe from "@/components/themes/anniversaire/luxe";
import AnniversaireFestif from "@/components/themes/anniversaire/festif";
import AnniversaireDoux from "@/components/themes/anniversaire/doux";
import AnniversaireColore from "@/components/themes/anniversaire/colore";
import AnniversaireCiel from "@/components/themes/anniversaire/ciel";
import AnniversaireAmoureux from "@/components/themes/anniversaire/amoureux";
import AnniversaireMonHomme from "@/components/themes/anniversaire/mon-homme";

// --- Déclaration d'amour ---
import DeclarationTimide from "@/components/themes/declaration-amour/timide";
import DeclarationPassion from "@/components/themes/declaration-amour/passion";
import DeclarationLettre from "@/components/themes/declaration-amour/lettre";
import DeclarationNuitEtoilee from "@/components/themes/declaration-amour/nuit-etoilee";
import DeclarationNeon from "@/components/themes/declaration-amour/neon";
import DeclarationPopArt from "@/components/themes/declaration-amour/pop-art";

// --- Saint-Valentin ---
import SaintValentinCarteAGratter from "@/components/themes/saint-valentin/carte-a-gratter";
import SaintValentinRideauVelours from "@/components/themes/saint-valentin/rideau-velours";
import SaintValentinBoiteChocolats from "@/components/themes/saint-valentin/boite-chocolats";
import SaintValentinDinerChandelles from "@/components/themes/saint-valentin/diner-chandelles";
import SaintValentinCupidon from "@/components/themes/saint-valentin/cupidon";
import SaintValentinRetro70s from "@/components/themes/saint-valentin/retro-70s";
import DemandeMariageEcrin from "@/components/themes/demande-mariage/ecrin";

type ThemeComponent = ComponentType<ThemeProps>;

/**
 * Registre central : "occasion + thème" → composant visuel.
 * Les clés doivent correspondre EXACTEMENT aux slugs déclarés dans
 * src/lib/occasions.ts, sinon le thème est introuvable.
 */
export const THEME_REGISTRY: Record<string, Record<string, ThemeComponent>> = {
  anniversaire: {
    elegant: AnniversaireElegant,
    luxe: AnniversaireLuxe,
    festif: AnniversaireFestif,
    doux: AnniversaireDoux,
    colore: AnniversaireColore,
    ciel: AnniversaireCiel,
    amoureux: AnniversaireAmoureux,
    "mon-homme": AnniversaireMonHomme,
  },
  "declaration-amour": {
    timide: DeclarationTimide,
    passion: DeclarationPassion,
    lettre: DeclarationLettre,
    "nuit-etoilee": DeclarationNuitEtoilee,
    neon: DeclarationNeon,
    "pop-art": DeclarationPopArt,
  },

  "saint-valentin": {
    "carte-a-gratter": SaintValentinCarteAGratter,
    "rideau-velours": SaintValentinRideauVelours,
    "boite-chocolats": SaintValentinBoiteChocolats,
    "diner-chandelles": SaintValentinDinerChandelles,
    "cupidon": SaintValentinCupidon,
    "retro-70s": SaintValentinRetro70s,
  },

  "demande-mariage": {
    "ecrin": DemandeMariageEcrin,
  },
};

export function getThemeComponent(
  occasionSlug: string,
  themeSlug: string
): ThemeComponent | null {
  return THEME_REGISTRY[occasionSlug]?.[themeSlug] ?? null;
}