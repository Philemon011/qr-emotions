"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

/**
 * Affiche un mot qui change automatiquement en boucle, avec une couleur
 * propre à chaque mot. La largeur du mot le plus long est réservée via
 * un span invisible en position normale (pas en grid), et le mot animé
 * est positionné en absolute par-dessus — évite tout décalage ou ligne
 * fantôme dans le flux du texte parent.
 */

interface RotatingWordProps {
  words: string[];
  colors: string[];
  intervalMs?: number;
  className?: string;
}

export function RotatingWord({
  words,
  colors,
  intervalMs = 2200,
  className,
}: RotatingWordProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [words.length, intervalMs]);

  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b));

  return (
    <span className="relative inline-block align-baseline">
      {/* Réserve la largeur, invisible, garde le flux normal (pas de ligne fantôme) */}
      <span aria-hidden className={`invisible ${className ?? ""}`}>
        {longestWord}
      </span>

      <AnimatePresence mode="wait">
        <m.span
          key={words[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute inset-0 ${className ?? ""}`}
          style={{ color: colors[index] }}
        >
          {words[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}