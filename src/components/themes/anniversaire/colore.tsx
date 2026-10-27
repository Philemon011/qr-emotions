"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Coloré" — Anniversaire.
 * Direction "poster graphique" : toutes les couleurs de la palette
 * apparaissent à parts égales (pas de couleur dominante comme Festif),
 * formes géométriques abstraites qui pivotent lentement en continu,
 * bordure en blocs colorés nets (pas un dégradé), titre avec mots
 * colorés individuellement (écho du RotatingWord du Hero).
 */

const PALETTE = [
  "var(--color-joie)",
  "var(--color-amour)",
  "var(--color-gratitude)",
  "var(--color-tendresse)",
  "var(--color-bonheur)",
];

type Shape = { id: number; type: "circle" | "square" | "triangle"; color: string; size: number; top: string; left: string; duration: number };

/** Formes géométriques dispersées, chacune pivotant lentement et indéfiniment. */
function GeometricShapes() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const types: Shape["type"][] = ["circle", "square", "triangle"];
    setShapes(
      Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        type: types[i % types.length],
        color: PALETTE[i % PALETTE.length],
        size: 24 + Math.random() * 40,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        duration: 14 + Math.random() * 10,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s) => (
        <m.div
          key={s.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, rotate: 360 }}
          transition={{
            opacity: { duration: 1 },
            rotate: { duration: s.duration, repeat: Infinity, ease: "linear" },
          }}
          className="absolute"
          style={{ top: s.top, left: s.left }}
        >
          {s.type === "circle" && (
            <div className="rounded-full" style={{ width: s.size, height: s.size, backgroundColor: s.color }} />
          )}
          {s.type === "square" && (
            <div className="rounded-md" style={{ width: s.size, height: s.size, backgroundColor: s.color }} />
          )}
          {s.type === "triangle" && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${s.size / 2}px solid transparent`,
                borderRight: `${s.size / 2}px solid transparent`,
                borderBottom: `${s.size * 0.87}px solid ${s.color}`,
              }}
            />
          )}
        </m.div>
      ))}
    </div>
  );
}

/** Cadre en blocs colorés nets — 4 segments, une couleur différente par côté. */
function RainbowFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
      <div className="absolute inset-x-0 top-0 h-2 rounded-t-[2rem]" style={{ backgroundColor: PALETTE[0] }} />
      <div className="absolute inset-y-0 right-0 w-2" style={{ backgroundColor: PALETTE[1] }} />
      <div className="absolute inset-x-0 bottom-0 h-2 rounded-b-[2rem]" style={{ backgroundColor: PALETTE[2] }} />
      <div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: PALETTE[3] }} />
    </div>
  );
}

/** Titre avec chaque mot coloré individuellement, en boucle sur la palette. */
function ColorfulTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h1 className="font-display max-w-[280px] text-3xl font-bold leading-tight tracking-tight sm:max-w-sm sm:text-4xl">
      {words.map((word, i) => (
        <span key={i} style={{ color: PALETTE[i % PALETTE.length] }}>
          {word}{" "}
        </span>
      ))}
    </h1>
  );
}

export default function AnniversaireColore({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-paper-50 px-6 py-16">
      <GeometricShapes />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 rounded-[2rem] bg-white px-8 py-14 text-center sm:px-12 sm:py-16"
            style={{ boxShadow: "0 30px 70px -20px rgba(10,10,12,0.18)" }}
          >
            <RainbowFrame />

            <div className="relative flex gap-1.5">
              {PALETTE.map((color, i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>

            <span className="relative text-xs font-semibold uppercase tracking-wide text-ink-300">
              Anniversaire
            </span>

            <div className="relative">
              <ColorfulTitle text="Un message vous attend" />
            </div>

            {content.recipientFirstName && (
              <p className="relative text-base font-semibold text-ink-500">
                Pour {content.recipientFirstName}
              </p>
            )}

            <m.button
              type="button"
              onClick={() => setRevealed(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="relative mt-2 rounded-full px-10 py-4 text-base font-bold text-white"
              style={{ backgroundColor: "var(--color-brand-500)" }}
            >
              Découvrir
            </m.button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] bg-white px-8 py-14 text-center sm:px-14 sm:py-16"
            style={{ boxShadow: "0 30px 70px -20px rgba(10,10,12,0.18)" }}
          >
            <RainbowFrame />

            <div className="relative flex gap-1.5">
              {PALETTE.map((color, i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>

            {content.recipientFirstName && (
              <div className="relative">
                <ColorfulTitle text={`Pour ${content.recipientFirstName}`} />
              </div>
            )}

            <p className="relative text-lg font-medium leading-relaxed tracking-tight text-ink-700 sm:text-xl">
              {content.body}
            </p>

            {content.signature && (
              <p className="relative text-sm font-semibold text-ink-500">
                — {content.signature}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-8 text-[11px] font-semibold uppercase tracking-normal text-ink-300">
        Créé avec QR Emotions
      </span>
    </main>
  );
}