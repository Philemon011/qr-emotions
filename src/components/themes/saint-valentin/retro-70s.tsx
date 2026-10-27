"use client";

import "@fontsource/boogaloo/400.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Rétro 70s" : Saint-Valentin.
 * Soleil levant en arcs concentriques (symétrie géométrique parfaite,
 * pas de tracé à main levée) qui tourne très lentement, blobs façon
 * lampe à lave qui se déforment en douceur (morphing de path), bandes
 * ondulées superposées façon papier peint vintage, mot "LOVE" en
 * Boogaloo, cadre polaroid légèrement jauni pour le message.
 */

const FONT_GROOVY = "'Boogaloo', cursive";
const CREAM = "var(--color-retro-cream)";
const MUSTARD = "var(--color-retro-mustard)";
const TERRACOTTA = "var(--color-retro-terracotta)";
const BROWN = "var(--color-retro-brown)";
const RUST = "var(--color-retro-rust)";

/** Soleil levant : arcs concentriques alternés, rotation lente et continue. */
function RisingSun() {
  const rings = [
    { r: 230, color: MUSTARD },
    { r: 190, color: TERRACOTTA },
    { r: 150, color: RUST },
    { r: 110, color: MUSTARD },
    { r: 70, color: CREAM },
  ];

  // Précalculé une seule fois, et arrondi à 2 décimales : évite tout écart
  // de précision flottante entre le rendu serveur et le rendu client.
  const rays = Array.from({ length: 11 }).map((_, i) => {
    const angle = -90 + (i - 5) * 11;
    const rad = (angle * Math.PI) / 180;
    return {
      x1: (Math.cos(rad) * 235).toFixed(2),
      y1: (Math.sin(rad) * 235).toFixed(2),
      x2: (Math.cos(rad) * 280).toFixed(2),
      y2: (Math.sin(rad) * 280).toFixed(2),
    };
  });

  return (
    <m.svg
      aria-hidden
      viewBox="-260 -260 520 300"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] w-full"
      animate={{ rotate: [0, 2, 0, -2, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "0px 0px" }}
    >
      {rings.map((ring) => (
        <path
          key={ring.r}
          d={`M${-ring.r} 0 A${ring.r} ${ring.r} 0 0 1 ${ring.r} 0 Z`}
          fill={ring.color}
        />
      ))}
      {rays.map((ray, i) => (
        <line key={i} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} stroke={CREAM} strokeWidth="7" strokeLinecap="round" />
      ))}
    </m.svg>
  );
}

/** Un blob "lampe à lave" : la forme morphe doucement entre 3 variantes organiques symétriques. */
function LavaBlob({ className, size, color, duration, delay }: { className: string; size: number; color: string; duration: number; delay: number }) {
  const shapes = [
    "M50 5C75 5 95 25 95 50C95 75 75 95 50 95C25 95 5 75 5 50C5 25 25 5 50 5Z",
    "M50 10C70 0 95 20 92 45C98 68 78 95 50 90C25 98 2 72 10 48C2 25 28 2 50 10Z",
    "M50 8C72 12 90 30 88 52C92 74 70 94 50 90C28 96 8 76 12 52C6 28 30 4 50 8Z",
  ];
  return (
    <m.svg
      aria-hidden
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`pointer-events-none absolute opacity-70 ${className}`}
    >
      <m.path
        fill={color}
        animate={{ d: shapes }}
        transition={{ duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay }}
      />
    </m.svg>
  );
}

/** Bandes ondulées horizontales, superposées, façon papier peint 70s. */
function WavyStripes() {
  return (
    <svg aria-hidden viewBox="0 0 400 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-28 w-full opacity-40">
      <path d="M0 40Q50 10 100 40T200 40T300 40T400 40V0H0Z" fill={TERRACOTTA} />
      <path d="M0 80Q50 50 100 80T200 80T300 80T400 80V40Q350 10 300 40T200 40T100 40T0 40Z" fill={MUSTARD} opacity="0.6" />
    </svg>
  );
}

/** Cœur simple, en aplat, pour le polaroid et la déco. */
function Heart({ size = 20, color = TERRACOTTA }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 20.5C12 20.5 2 13.5 2 7.3C2 4.1 4.6 1.5 7.8 1.5C9.8 1.5 11.2 2.6 12 4.3C12.8 2.6 14.2 1.5 16.2 1.5C19.4 1.5 22 4.1 22 7.3C22 13.5 12 20.5 12 20.5Z" />
    </svg>
  );
}

export default function SaintValentinRetro70s({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-14"
      style={{ backgroundColor: CREAM }}
    >
      <WavyStripes />
      <RisingSun />
      <LavaBlob className="left-[4%] top-[12%]" size={90} color={TERRACOTTA} duration={9} delay={0} />
      <LavaBlob className="right-[6%] top-[20%]" size={60} color={MUSTARD} duration={11} delay={1.2} />
      <LavaBlob className="left-[10%] bottom-[8%]" size={70} color={RUST} duration={10} delay={0.6} />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center gap-5 text-center"
          >
            <span
              className="rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: RUST }}
            >
              Saint-Valentin
            </span>

            <h1
              className="text-8xl leading-none tracking-wide sm:text-9xl"
              style={{ fontFamily: FONT_GROOVY, color: TERRACOTTA, WebkitTextStroke: `3px ${BROWN}` }}
            >
              LOVE
            </h1>

            {content.recipientFirstName && (
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: BROWN }}>
                pour {content.recipientFirstName}
              </p>
            )}

            <m.button
              type="button"
              onClick={() => setRevealed(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 rounded-full px-9 py-3.5 text-sm font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: TERRACOTTA, boxShadow: `4px 4px 0 ${BROWN}` }}
            >
              Découvrir
            </m.button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 18, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative z-10 w-full max-w-sm bg-white p-3 pb-7 text-center"
            style={{ boxShadow: "0 25px 60px -16px rgba(90,51,33,0.5)" }}
          >
            {/* Bandeau "photo" jauni, avec cœurs en coin façon sticker vintage */}
            <div
              className="relative flex min-h-[200px] flex-col items-center justify-center gap-4 px-6 py-8"
              style={{ backgroundColor: MUSTARD }}
            >
              <div className="absolute left-3 top-3"><Heart size={18} color={CREAM} /></div>
              <div className="absolute right-3 top-3" style={{ transform: "rotate(15deg)" }}><Heart size={18} color={CREAM} /></div>

              {content.recipientFirstName && (
                <h1 className="text-4xl" style={{ fontFamily: FONT_GROOVY, color: BROWN }}>
                  Pour {content.recipientFirstName}
                </h1>
              )}
              <p className="text-base font-semibold leading-relaxed" style={{ color: BROWN }}>
                {content.body}
              </p>
            </div>

            {content.signature && (
              <p className="mt-5 text-2xl" style={{ fontFamily: FONT_GROOVY, color: TERRACOTTA }}>
                {content.signature}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-8 text-[11px] font-bold uppercase tracking-normal" style={{ color: BROWN, opacity: 0.5 }}>
        Créé avec QR Emotions
      </span>
    </main>
  );
}