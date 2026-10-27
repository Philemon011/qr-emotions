"use client";

import "@fontsource/dancing-script/700.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Heart } from "iconsax-react";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Amoureux" — Anniversaire.
 * Pensé pour souhaiter un anniversaire à son/sa partenaire : ambiance
 * intime façon "dîner aux chandelles" (bordeaux profond + lueur dorée
 * chaude), cœur qui bat au centre, pétales de rose qui tombent, signature
 * en écriture manuscrite. Distinct des autres thèmes par sa chaleur/intimité.
 */

const FONT_SCRIPT = "'Dancing Script', cursive";

/** Cœur qui pulse comme un battement — deux temps rapides puis pause, façon vrai battement de cœur. */
function BeatingHeart() {
  return (
    <m.span
      animate={{ scale: [1, 1.15, 1, 1.15, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 1] }}
      className="flex h-14 w-14 items-center justify-center rounded-full"
      style={{ backgroundColor: "rgba(232,160,168,0.15)" }}
    >
      <Heart size={24} variant="Bold" color="var(--color-amoureux-accent)" />
    </m.span>
  );
}

/** Pétales de rose (teinte chaude, plus rouge que le thème Doux), chute lente. */
function RosePetals() {
  const [petals, setPetals] = useState<
    { id: number; left: number; delay: number; duration: number; repeatDelay: number; size: number; drift: number }[]
  >([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 5,
        repeatDelay: Math.random() * 3,
        size: 8 + Math.random() * 6,
        drift: Math.random() * 40 - 20,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <m.span
          key={p.id}
          initial={{ opacity: 0, y: -20, x: 0, rotate: 0 }}
          animate={{ opacity: [0, 0.85, 0.85, 0], y: 650, x: p.drift, rotate: 100 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.repeatDelay,
            ease: "easeInOut",
          }}
          className="absolute rounded-[60%_40%_60%_40%]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.7,
            backgroundColor: "var(--color-amoureux-accent)",
          }}
        />
      ))}
    </div>
  );
}

/** Lueur chaude, façon flamme de bougie qui vacille doucement au centre du fond. */
function CandleGlow() {
  return (
    <m.div
      aria-hidden
      animate={{ opacity: [0.5, 0.7, 0.5], scale: [1, 1.08, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{ backgroundColor: "var(--color-amoureux-glow)", opacity: 0.15 }}
    />
  );
}

export default function AnniversaireAmoureux({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-amoureux-bg)" }}
    >
      <CandleGlow />
      <RosePetals />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 rounded-[2rem] border px-8 py-14 text-center sm:px-12 sm:py-16"
            style={{
              borderColor: "rgba(232,160,168,0.25)",
              backgroundColor: "var(--color-amoureux-card)",
              boxShadow: "0 30px 80px -20px rgba(255,178,122,0.15), 0 30px 70px -20px rgba(0,0,0,0.5)",
            }}
          >
            <BeatingHeart />

            <span
              className="text-xs font-semibold uppercase tracking-normal"
              style={{ color: "var(--color-amoureux-accent)" }}
            >
              Anniversaire de mon amour
            </span>

            <h1 className="max-w-[240px] text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl">
              Un message vous attend
            </h1>

            {content.recipientFirstName && (
              <p className="text-base" style={{ fontFamily: FONT_SCRIPT, color: "var(--color-amoureux-accent)", fontSize: "1.5rem" }}>
                pour {content.recipientFirstName}
              </p>
            )}

            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-2 rounded-full border px-9 py-3.5 text-xs font-semibold uppercase tracking-normal text-white transition-colors duration-300"
              style={{ borderColor: "var(--color-amoureux-accent)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-amoureux-accent)";
                e.currentTarget.style.color = "var(--color-amoureux-card)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              Découvrir
            </button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-[2rem] border px-8 py-14 text-center sm:px-14 sm:py-16"
            style={{
              borderColor: "rgba(232,160,168,0.25)",
              backgroundColor: "var(--color-amoureux-card)",
              boxShadow: "0 30px 80px -20px rgba(255,178,122,0.15), 0 30px 70px -20px rgba(0,0,0,0.5)",
            }}
          >
            <BeatingHeart />

            {content.recipientFirstName && (
              <h1
                style={{ fontFamily: FONT_SCRIPT, color: "var(--color-amoureux-accent)" }}
                className="text-4xl sm:text-5xl"
              >
                pour {content.recipientFirstName}
              </h1>
            )}

            <p className="text-lg font-normal leading-loose tracking-tight text-white/85 sm:text-xl">
              {content.body}
            </p>

            {content.signature && (
              <p
                className="mt-1 text-3xl"
                style={{ fontFamily: FONT_SCRIPT, color: "var(--color-amoureux-accent)" }}
              >
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