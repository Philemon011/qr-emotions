"use client";

import "@fontsource/dancing-script/700.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Nuit étoilée" — Déclaration d'amour.
 * Ciel nocturne romantique : étoiles scintillantes, croissant de lune,
 * constellation en forme de cœur (reliant des points), et une photo
 * réelle du bouquet dans un cadre polaroid légèrement incliné.
 *
 * ⚠️ PLACEHOLDER À REMPLACER (signalé 📷) : la photo du bouquet, dans
 * le composant PolaroidPhoto ci-dessous.
 */

const FONT_SCRIPT = "'Dancing Script', cursive";

/** Étoile à 4 branches (vraie forme d'étincelle), qui grossit/rétrécit en scintillant. */
function Sparkle({ style, delay, size }: { style: React.CSSProperties; delay: number; size: number }) {
  return (
    <m.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="var(--color-nuit-star)"
      className="pointer-events-none absolute"
      style={style}
      animate={{ opacity: [0, 1, 0], scale: [0.3, 1.1, 0.3], rotate: [0, 25] }}
      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 + Math.random() * 2, delay, ease: "easeInOut" }}
    >
      <path d="M12 0C12 6 14 10 20 12C14 14 12 18 12 24C12 18 10 14 4 12C10 10 12 6 12 0Z" />
    </m.svg>
  );
}

/** Mélange de petits points scintillants (fond) et d'étincelles plus marquées (premier plan). */
function TwinklingStars() {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: number; size: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ id: number; top: string; left: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        size: 1.5 + Math.random() * 2,
      }))
    );
    setSparkles(
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        delay: Math.random() * 2,
        size: 10 + Math.random() * 10,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <m.span
          key={s.id}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, delay: s.delay, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, backgroundColor: "var(--color-nuit-star)" }}
        />
      ))}
      {sparkles.map((s) => (
        <Sparkle key={s.id} style={{ top: s.top, left: s.left }} delay={s.delay} size={s.size} />
      ))}
    </div>
  );
}

/** Croissant de lune, dessiné en SVG (deux cercles superposés). */
function CrescentMoon() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="absolute right-[8%] top-[8%] opacity-90">
      <mask id="moonMask">
        <rect width="46" height="46" fill="white" />
        <circle cx="30" cy="18" r="15" fill="black" />
      </mask>
      <circle cx="23" cy="20" r="16" fill="var(--color-nuit-star)" mask="url(#moonMask)" />
    </svg>
  );
}

/** Constellation en forme de cœur : points reliés par des traits fins, se dessine progressivement. */
function HeartConstellation() {
  // Points positionnés pour dessiner un cœur stylisé
  const points = [
    [50, 20], [38, 8], [24, 12], [16, 26], [22, 42], [50, 64], [78, 42], [84, 26], [76, 12], [62, 8], [50, 20],
  ];
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");

  return (
    <svg width="100" height="70" viewBox="0 0 100 70" fill="none" className="opacity-70">
      <m.path
        d={path}
        stroke="var(--color-nuit-star)"
        strokeWidth="1"
        strokeDasharray="2 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
      />
      {points.slice(0, -1).map((p, i) => (
        <m.circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="2"
          fill="var(--color-nuit-star)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.3 }}
        />
      ))}
    </svg>
  );
}

/** Photo du bouquet dans un cadre polaroid, légèrement incliné, ombre douce. */
function PolaroidPhoto() {
  return (
    <m.div
      initial={{ opacity: 0, y: 12, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: -4 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      className="w-44 bg-white p-2.5 pb-6 sm:w-52"
      style={{ boxShadow: "0 20px 40px -14px rgba(0,0,0,0.45)" }}
    >
      <img
        src="/images/themes/bouquet.jpg"
        alt="Bouquet de fleurs"
        className="aspect-square w-full object-cover"
      />
    </m.div>
  );
}

export default function DeclarationNuitEtoilee({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-nuit-bg)" }}
    >
      <TwinklingStars />
      <CrescentMoon />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl px-8 py-12 text-center sm:px-12 sm:py-14"
            style={{
              backgroundColor: "var(--color-nuit-card)",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.55)",
            }}
          >
            <PolaroidPhoto />

            <HeartConstellation />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
              Déclaration d&apos;amour
            </span>

            <h1
              className="max-w-[240px] text-3xl text-white sm:text-4xl"
              style={{ fontFamily: FONT_SCRIPT }}
            >
              Un message vous attend
            </h1>

            {content.recipientFirstName && (
              <p className="text-sm font-medium text-white/60">Pour {content.recipientFirstName}</p>
            )}

            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-1 rounded-full px-9 py-3.5 text-sm font-semibold text-[var(--color-nuit-bg)] transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: "var(--color-nuit-star)" }}
            >
              Découvrir
            </button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl px-8 py-12 text-center sm:px-14 sm:py-14"
            style={{
              backgroundColor: "var(--color-nuit-card)",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.55)",
            }}
          >
            <PolaroidPhoto />

            {content.recipientFirstName && (
              <h1 className="text-3xl text-white sm:text-4xl" style={{ fontFamily: FONT_SCRIPT }}>
                Pour {content.recipientFirstName}
              </h1>
            )}

            <p className="text-lg font-normal leading-relaxed tracking-tight text-white/85 sm:text-xl">
              {content.body}
            </p>

            {content.signature && (
              <p className="text-2xl" style={{ fontFamily: FONT_SCRIPT, color: "var(--color-nuit-star)" }}>
                {content.signature}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-8 text-[11px] font-semibold uppercase tracking-normal text-white/30">
        Créé avec QR Emotions
      </span>
    </main>
  );
}