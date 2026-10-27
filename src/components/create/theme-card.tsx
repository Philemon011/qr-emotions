"use client";

import Link from "next/link";
import { m } from "framer-motion";
import type { Theme } from "@/types/message";
import { getThemePreview } from "@/lib/theme-previews";

/**
 * Carte de thème — affiche une mini-maquette fidèle à l'ambiance réelle
 * du thème (ses couleurs exactes, une carte flottante à l'intérieur avec
 * de fausses lignes de texte) plutôt qu'un simple nom sur fond neutre.
 * Objectif : que le choix soit visuel et immédiat, sans avoir à ouvrir
 * chaque thème pour se faire une idée.
 */

interface ThemeCardProps {
  occasionSlug: string;
  theme: Theme;
  index: number;
}

export function ThemeCard({ occasionSlug, theme, index }: ThemeCardProps) {
  const preview = getThemePreview(theme.slug);

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/creer/${occasionSlug}/${theme.slug}`}
        className="group block overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-card"
      >
        {/* Mini-maquette de l'ambiance du thème */}
        <div
          className="relative flex aspect-[4/5] items-center justify-center p-4"
          style={{ backgroundColor: preview.bg }}
        >
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2.5 rounded-xl px-4 py-5 transition-transform duration-300 group-hover:scale-[1.03]"
            style={{ backgroundColor: preview.card, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.25)" }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: preview.accent }}
            />
            {/* Fausses lignes de texte, pour suggérer "voici où le message apparaîtra" */}
            <span className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: preview.accent, opacity: 0.3 }} />
            <span className="h-1.5 w-1/2 rounded-full" style={{ backgroundColor: preview.accent, opacity: 0.3 }} />
          </div>
        </div>

        {/* Nom du thème */}
        <div className="bg-paper-50 px-4 py-3 text-center">
          <span className="text-sm font-semibold text-ink-950">{theme.label}</span>
        </div>
      </Link>
    </m.div>
  );
}