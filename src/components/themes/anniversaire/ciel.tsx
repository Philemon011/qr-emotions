"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Send2 } from "iconsax-react";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Ciel" — Anniversaire.
 * Fond bleu ciel avec nuages moelleux à la dérive, carte "nuit" bleu
 * foncé qui semble flotter au milieu (effet jour/nuit), avion en papier
 * qui traverse l'écran, étoiles scintillantes en profondeur. Direction
 * plus masculine/aventurière, distincte des 5 thèmes précédents.
 */

/** Un nuage moelleux (plusieurs cercles superposés), qui dérive lentement. */
function Cloud({ className, size, duration, delay }: { className: string; size: number; duration: number; delay: number }) {
  return (
    <m.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 0.9, x: [0, 30, 0] }}
      transition={{
        opacity: { duration: 1, delay },
        x: { duration, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size * 0.55 }}
    >
      <svg viewBox="0 0 100 55" fill="var(--color-ciel-cloud)">
        <ellipse cx="28" cy="35" rx="26" ry="18" />
        <ellipse cx="55" cy="24" rx="30" ry="22" />
        <ellipse cx="80" cy="36" rx="22" ry="16" />
        <rect x="18" y="32" width="70" height="20" rx="10" />
      </svg>
    </m.div>
  );
}

/** Petites étoiles scintillantes en fond, apparition/disparition douce et répétée. */
function TwinklingStars() {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 60}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        size: 2 + Math.random() * 2.5,
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
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            backgroundColor: "var(--color-ciel-star)",
          }}
        />
      ))}
    </div>
  );
}

/** Avion en papier qui traverse l'écron en diagonale, en boucle. */
function PaperPlane() {
  return (
    <m.div
      initial={{ x: "-10vw", y: "70vh", rotate: -8 }}
      animate={{ x: "110vw", y: "10vh", rotate: -8 }}
      transition={{ duration: 14, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
      className="pointer-events-none absolute z-0"
    >
      <Send2 size={30} variant="Bold" color="#ffffff" style={{ opacity: 0.85 }} />
    </m.div>
  );
}

export default function AnniversaireCiel({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-ciel-bg)" }}
    >
      <TwinklingStars />
      <PaperPlane />

      <Cloud className="left-[4%] top-[14%]" size={150} duration={9} delay={0} />
      <Cloud className="right-[6%] top-[10%]" size={110} duration={7} delay={0.5} />
      <Cloud className="left-[10%] bottom-[16%]" size={130} duration={10} delay={1} />
      <Cloud className="right-[8%] bottom-[20%]" size={90} duration={8} delay={1.5} />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 rounded-[2.5rem] px-8 py-14 text-center sm:px-12 sm:py-16"
            style={{
              backgroundColor: "var(--color-ciel-card)",
              boxShadow: "0 30px 70px -20px rgba(16,35,61,0.5)",
            }}
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                  fill="var(--color-ciel-star)"
                />
              </svg>
            </span>

            <span className="text-xs font-semibold uppercase tracking-wide text-white/50">
              Anniversaire
            </span>

            <h1 className="font-display max-w-[240px] text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Un message vous attend
            </h1>

            {content.recipientFirstName && (
              <p className="text-base font-medium text-white/70">
                Pour {content.recipientFirstName}
              </p>
            )}

            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-2 rounded-full px-9 py-3.5 text-sm font-bold text-white transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: "var(--color-ciel-bg)" }}
            >
              Découvrir
            </button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 rounded-[2.5rem] px-8 py-14 text-center sm:px-14 sm:py-16"
            style={{
              backgroundColor: "var(--color-ciel-card)",
              boxShadow: "0 30px 70px -20px rgba(16,35,61,0.5)",
            }}
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                  fill="var(--color-ciel-star)"
                />
              </svg>
            </span>

            {content.recipientFirstName && (
              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Pour {content.recipientFirstName}
              </h1>
            )}

            <p className="text-lg font-medium leading-relaxed tracking-tight text-white/85 sm:text-xl">
              {content.body}
            </p>

            {content.signature && (
              <p className="text-sm font-semibold text-white/60">
                — {content.signature}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-8 text-[11px] font-semibold uppercase tracking-normal text-white/60">
        Créé avec QR Emotions
      </span>
    </main>
  );
}