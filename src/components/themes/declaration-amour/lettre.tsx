"use client";

import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";

import { useState, useMemo } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Lettre manuscrite" v3 — Déclaration d'amour.
 * Direction "notebook doodle" : papier ligné, marge perforée façon
 * cahier, bordure ondulée découpée, cœurs dessinés à la main dispersés,
 * quelques mots du message mis en couleur, titre souligné à la main.
 * Rendu chaleureux et illustré, mais avec des tracés SVG nets (pas de
 * gribouillis approximatif) pour rester premium.
 */

const FONT_HAND = "'Caveat', cursive";
const HIGHLIGHT_COLORS = ["var(--color-amour)", "var(--color-gratitude)", "var(--color-bonheur)"];

/** Cœur dessiné à la main (contour, pas rempli), taille/rotation/couleur variables. */
function DoodleHeart({
  className,
  size,
  rotate,
  color = "var(--color-notebook-margin)",
  opacity = 0.9,
}: {
  className: string;
  size: number;
  rotate: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`pointer-events-none absolute ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, opacity }}
    >
      <path
        d="M12 20.5C12 20.5 2 13.5 2 7.3C2 4.1 4.6 1.5 7.8 1.5C9.8 1.5 11.2 2.6 12 4.3C12.8 2.6 14.2 1.5 16.2 1.5C19.4 1.5 22 4.1 22 7.3C22 13.5 12 20.5 12 20.5Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Trous perforés façon feuille de cahier, alignés verticalement sur la marge gauche. */
function PunchedHoles() {
  return (
    <div className="absolute bottom-6 left-3 top-6 flex flex-col justify-between sm:left-4">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: "var(--color-paper-100)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)" }}
        />
      ))}
    </div>
  );
}

/** Titre souligné à la main, trait qui se dessine progressivement. */
function HandDrawnUnderline({ width = 140 }: { width?: number }) {
  return (
    <svg width={width} height="12" viewBox={`0 0 ${width} 12`} fill="none">
      <m.path
        d={`M2 7C${width * 0.28} 3 ${width * 0.55} 10 ${width - 2} 6`}
        stroke="var(--color-notebook-margin)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

/**
 * Révèle le texte mot par mot ; certains mots (déterministes, pas
 * aléatoires à chaque rendu) sont mis en couleur, comme sur les
 * références "mots en surbrillance" dans une lettre manuscrite.
 */
function DoodleText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p
      className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xl leading-relaxed sm:text-2xl"
      style={{ fontFamily: FONT_HAND, color: "var(--color-ink-950)" }}
    >
      {words.map((word, i) => {
        // Met en couleur environ un mot sur 5 (motif fixe, pas aléatoire),
        // pour un effet "surbrillance" sans dépendre du contenu du texte.
        const isHighlighted = word.length > 3 && i % 5 === 2;
        const color = HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
        return (
          <m.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.04 }}
            style={{ color: isHighlighted ? color : "var(--color-ink-950)", fontWeight: isHighlighted ? 700 : 500 }}
          >
            {word}
          </m.span>
        );
      })}
    </p>
  );
}

/** Enveloppe dessinée au trait (doodle), pas une illustration réaliste. */
function DoodleEnvelope() {
  return (
    <svg width="76" height="56" viewBox="0 0 76 56" fill="none">
      <rect x="2" y="2" width="72" height="52" rx="4" stroke="var(--color-ink-950)" strokeWidth="2" fill="white" />
      <path d="M4 5L38 34L72 5" stroke="var(--color-ink-950)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M32 24C32 24 27 20 27 16.5C27 14.5 28.6 13 30.5 13C31.9 13 33 13.8 33.5 15C34 13.8 35.1 13 36.5 13C38.4 13 40 14.5 40 16.5C40 20 35 24 35 24"
        stroke="var(--color-notebook-margin)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Carte : papier ligné, marge perforée, bordure ondulée, cœurs dispersés. */
function NotebookCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full overflow-hidden px-10 py-12 text-center sm:px-14 sm:py-14"
      style={{
        backgroundColor: "#fffdf9",
        backgroundImage: "repeating-linear-gradient(var(--color-notebook-line) 0 1px, transparent 1px 34px)",
        backgroundPosition: "0 60px",
        boxShadow: "0 30px 70px -22px rgba(58,47,34,0.3)",
        clipPath:
          "polygon(0% 1.5%, 3% 0%, 7% 1.2%, 11% 0%, 15% 1.2%, 19% 0%, 23% 1.2%, 27% 0%, 31% 1.2%, 35% 0%, 39% 1.2%, 43% 0%, 47% 1.2%, 51% 0%, 55% 1.2%, 59% 0%, 63% 1.2%, 67% 0%, 71% 1.2%, 75% 0%, 79% 1.2%, 83% 0%, 87% 1.2%, 91% 0%, 95% 1.2%, 100% 0%, 100% 100%, 95% 98.5%, 91% 100%, 87% 98.5%, 83% 100%, 79% 98.5%, 75% 100%, 71% 98.5%, 67% 100%, 63% 98.5%, 59% 100%, 55% 98.5%, 51% 100%, 47% 98.5%, 43% 100%, 39% 98.5%, 35% 100%, 31% 98.5%, 27% 100%, 23% 98.5%, 19% 100%, 15% 98.5%, 11% 100%, 7% 98.5%, 3% 100%, 0% 98.5%)",
      }}
    >
      {/* Marge rouge façon cahier */}
      <div className="absolute bottom-0 left-8 top-0 w-px sm:left-10" style={{ backgroundColor: "var(--color-notebook-margin)", opacity: 0.4 }} />
      <PunchedHoles />

      <DoodleHeart className="left-[6%] top-[6%]" size={32} rotate={-14} />
      <DoodleHeart className="right-[6%] top-[10%]" size={22} rotate={18} color="var(--color-gratitude)" opacity={0.75} />
      <DoodleHeart className="bottom-[8%] left-[10%]" size={24} rotate={10} color="var(--color-bonheur)" opacity={0.75} />
      <DoodleHeart className="bottom-[6%] right-[8%]" size={36} rotate={-20} />

      <div className="relative ml-4 sm:ml-6">{children}</div>
    </div>
  );
}

export default function DeclarationLettre({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--color-paper-100)] px-6 py-16">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-sm"
          >
            <NotebookCard>
              <div className="flex flex-col items-center gap-6">
                <DoodleEnvelope />

                <div className="flex flex-col items-center gap-1.5">
                  <h1 style={{ fontFamily: FONT_HAND, fontSize: "2.4rem", color: "var(--color-ink-950)" }}>
                    Une lettre pour vous
                  </h1>
                  <HandDrawnUnderline width={160} />
                </div>

                {content.recipientFirstName && (
                  <p style={{ fontFamily: FONT_HAND, fontSize: "1.6rem", color: "var(--color-notebook-margin)" }}>
                    pour {content.recipientFirstName}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="mt-1 rounded-full bg-[var(--color-notebook-margin)] px-9 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.04]"
                >
                  Lire la lettre
                </button>
              </div>
            </NotebookCard>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <NotebookCard>
              <div className="flex flex-col items-center gap-6">
                {content.recipientFirstName && (
                  <div className="flex flex-col items-center gap-1.5">
                    <h1 style={{ fontFamily: FONT_HAND, fontSize: "2.2rem", color: "var(--color-ink-950)" }}>
                      Pour {content.recipientFirstName}
                    </h1>
                    <HandDrawnUnderline width={120} />
                  </div>
                )}

                <DoodleText text={content.body} />

                {content.signature && (
                  <p
                    className="mt-1"
                    style={{ fontFamily: FONT_HAND, fontSize: "1.9rem", color: "var(--color-notebook-margin)" }}
                  >
                    {content.signature}
                  </p>
                )}
              </div>
            </NotebookCard>
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-8 text-[11px] font-semibold uppercase tracking-normal text-ink-300">
        Créé avec QR Emotions
      </span>
    </main>
  );
}