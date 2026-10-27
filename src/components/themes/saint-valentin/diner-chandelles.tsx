"use client";

import "@fontsource/dancing-script/700.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Dîner aux chandelles" : Saint-Valentin.
 * Bougie avec flamme qui vacille réellement (rotation + scale légers et
 * irréguliers, pas une simple pulsation), cire qui coule en goutte figée,
 * deux verres à vin qui s'entrechoquent au clic ("trinquer") pour révéler
 * le message, pétales de rose en courbes qui tombent doucement.
 */

const FONT_SCRIPT = "'Dancing Script', cursive";
const GOLD = "var(--color-diner-gold)";
const FLAME = "var(--color-diner-flame)";
const WINE = "var(--color-diner-wine)";

/** Flamme de bougie : vacille avec un mouvement irrégulier (deux fréquences superposées). */
function CandleFlame() {
  return (
    <m.div
      className="absolute -top-7 left-1/2 -translate-x-1/2"
      style={{ transformOrigin: "50% 90%" }}
      animate={{ rotate: [-3, 4, -2, 3, -3], scaleY: [1, 1.08, 0.95, 1.05, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="20" height="30" viewBox="0 0 20 30">
        <path
          d="M10 30C4 22 4 15 10 0C16 15 16 22 10 30Z"
          fill={FLAME}
        />
        <path
          d="M10 24C7 19 7 15 10 6C13 15 13 19 10 24Z"
          fill="#fff4d0"
        />
      </svg>
      {/* Halo lumineux, pas un dégradé linéaire */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{ backgroundColor: FLAME, opacity: 0.25 }}
      />
    </m.div>
  );
}

/** Bougie : corps cylindrique, goutte de cire figée sur le côté, mèche. */
function Candle() {
  return (
    <div className="relative flex flex-col items-center">
      <CandleFlame />
      <svg width="34" height="70" viewBox="0 0 34 70" className="mt-3">
        <rect x="14" y="0" width="6" height="8" fill="#3a2414" />
        <rect x="4" y="8" width="26" height="62" rx="3" fill="#fff8ec" />
        {/* Goutte de cire coulée, une seule forme courbe figée */}
        <path d="M26 14C30 20 29 28 25 30C22 28 23 20 26 14Z" fill="#ffefd2" />
        <rect x="4" y="8" width="26" height="62" rx="3" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/** Un verre à vin, penché au repos, redressé au clic (trinquer). */
function WineGlass({ side, clinked }: { side: "left" | "right"; clinked: boolean }) {
  const tiltRest = side === "left" ? 10 : -10;
  return (
    <m.svg
      width="46"
      height="86"
      viewBox="0 0 46 86"
      animate={
        clinked
          ? { rotate: [tiltRest, 0, -4, 0], x: side === "left" ? [0, 10, 6, 8] : [0, -10, -6, -8] }
          : { rotate: tiltRest }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ transformOrigin: "50% 100%" }}
    >
      <path d="M23 4C11 4 8 16 12 26C15 33 21 36 21 42V68H14V74H32V68H25V42C25 36 31 33 34 26C38 16 35 4 23 4Z" fill="none" stroke="#f2e9da" strokeWidth="1.6" />
      <path d="M14 12C13 20 16 27 22 30C28 27 33 18 33 12C29 18 17 18 14 12Z" fill={WINE} opacity="0.85" />
    </m.svg>
  );
}

/** Pétale de rose, forme ovale asymétrique en courbe, tombe doucement. */
function FallingPetal({ left, delay, duration }: { left: number; delay: number; duration: number }) {
  return (
    <m.span
      className="pointer-events-none absolute rounded-[70%_30%_70%_30%]"
      style={{ left: `${left}%`, top: -20, width: 11, height: 8, backgroundColor: WINE, opacity: 0.55 }}
      initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
      animate={{ y: 640, x: [0, 16, -10, 0], rotate: 200, opacity: [0, 0.55, 0.55, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function SaintValentinDinerChandelles({ content }: ThemeProps) {
  const [clinked, setClinked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 4,
      }))
    );
  }, []);

  const handleClink = () => {
    if (clinked) return;
    setClinked(true);
    setTimeout(() => setRevealed(true), 700);
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-14"
      style={{ backgroundColor: "var(--color-diner-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--color-diner-bg2)", opacity: 0.7 }}
      />
      {petals.map((p) => (
        <FallingPetal key={p.id} left={p.left} delay={p.delay} duration={p.duration} />
      ))}

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="table"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center gap-7 text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-normal" style={{ color: GOLD }}>
              Saint-Valentin
            </span>

            <Candle />

            <div className="flex items-end gap-8">
              <button type="button" onClick={handleClink} aria-label="Trinquer">
                <WineGlass side="left" clinked={clinked} />
              </button>
              <button type="button" onClick={handleClink} aria-label="Trinquer">
                <WineGlass side="right" clinked={clinked} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <h1 style={{ fontFamily: FONT_SCRIPT, fontSize: "2.4rem", color: "#fdf2e5" }}>
                Un dîner rien que pour nous
              </h1>
              {content.recipientFirstName && (
                <p className="text-sm font-medium" style={{ color: GOLD }}>
                  pour {content.recipientFirstName}
                </p>
              )}
            </div>

            <m.span
              animate={{ opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#fdf2e5" }}
            >
              Trinquez pour découvrir
            </m.span>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-[2rem] px-8 py-12 text-center sm:px-12"
            style={{ backgroundColor: "rgba(255,248,236,0.06)", border: `1px solid ${GOLD}44`, boxShadow: "0 30px 70px -20px rgba(0,0,0,0.6)" }}
          >
            {content.recipientFirstName && (
              <h1 className="text-2xl font-semibold" style={{ color: "#fdf2e5" }}>
                Pour {content.recipientFirstName}
              </h1>
            )}
            <p className="text-lg font-medium leading-relaxed" style={{ color: "#fdf2e5", opacity: 0.9 }}>
              {content.body}
            </p>
            {content.signature && (
              <p style={{ fontFamily: FONT_SCRIPT, fontSize: "2rem", color: GOLD }}>
                {content.signature}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span
        className="relative z-10 mt-9 text-[11px] font-semibold uppercase tracking-normal"
        style={{ color: GOLD, opacity: 0.6 }}
      >
        Créé avec QR Emotions
      </span>
    </main>
  );
}