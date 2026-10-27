"use client";

import { getThemeComponent } from "@/lib/theme-registry";

/**
 * ⚠️ PAGE TEMPORAIRE — uniquement pour visualiser les thèmes pendant leur
 * construction. À SUPPRIMER une fois le vrai parcours de création branché
 * (elle n'a pas vocation à exister en production).
 *
 * Contenu de message factice, pour voir le rendu avec du vrai texte.
 */

const MOCK_CONTENT = {
  recipientFirstName: "Sarah",
  body: "Joyeux anniversaire ! J'espère que cette nouvelle année t'apportera autant de bonheur que celui que tu offres à tous ceux qui t'entourent. Je pense fort à toi aujourd'hui.",
  signature: "Ton frère, Bel",
};

export default function TestThemePage() {
  // const ThemeComponent = getThemeComponent("anniversaire", "elegant");
  // const ThemeComponent = getThemeComponent("anniversaire", "luxe");
  // const ThemeComponent = getThemeComponent("anniversaire", "festif");
  // const ThemeComponent = getThemeComponent("anniversaire", "doux");
  // const ThemeComponent = getThemeComponent("anniversaire", "colore");
  // const ThemeComponent = getThemeComponent("anniversaire", "ciel");
  // const ThemeComponent = getThemeComponent("anniversaire", "amoureux");
  // const ThemeComponent = getThemeComponent("anniversaire", "mon-homme");
  // const ThemeComponent = getThemeComponent("declaration-amour", "timide");
  // const ThemeComponent = getThemeComponent("declaration-amour", "passion");
  // const ThemeComponent = getThemeComponent("declaration-amour", "lettre")
  // const ThemeComponent = getThemeComponent("declaration-amour", "nuit-etoilee")
  // const ThemeComponent = getThemeComponent("declaration-amour", "neon")
  // const ThemeComponent = getThemeComponent("declaration-amour", "pop-art");
  // const ThemeComponent = getThemeComponent("saint-valentin", "carte-a-gratter");
  // const ThemeComponent = getThemeComponent("saint-valentin", "rideau-velours");
  // const ThemeComponent = getThemeComponent("saint-valentin", "boite-chocolats")
  // const ThemeComponent = getThemeComponent("saint-valentin", "diner-chandelles")
  // const ThemeComponent = getThemeComponent("saint-valentin", "cupidon")
  // const ThemeComponent = getThemeComponent("saint-valentin", "retro-70s")
  const ThemeComponent = getThemeComponent("demande-mariage", "ecrin")

  if (!ThemeComponent) { 
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Thème introuvable dans le registre.</p>
      </div>
    );
  }

  return <ThemeComponent content={MOCK_CONTENT} />;
}