"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, m, useAnimationControls } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Cupidon" : Saint-Valentin — "Frappé par l'amour".
 * Un cœur se charge visuellement (anneaux qui pulsent de plus en plus
 * vite, étincelles qui crépitent). Au tap : un éclair en zigzag traverse
 * l'écran, la scène tremble brièvement, puis une explosion de confettis
 * en forme de cœur révèle le message. Fond violet nuit, magenta et or.
 */

const BG = "var(--color-cupidon-bg)";
const CARD = "var(--color-cupidon-card)";
const MAGENTA = "var(--color-cupidon-magenta)";
const GOLD = "var(--color-cupidon-gold)";
const VIOLET = "var(--color-cupidon-violet)";

const HEART_PATH =
  "M12 21.5C12 21.5 2 14.5 2 8.2C2 4.9 4.6 2.5 7.7 2.5C9.6 2.5 11.2 3.5 12 5.1C12.8 3.5 14.4 2.5 16.3 2.5C19.4 2.5 22 4.9 22 8.2C22 14.5 12 21.5 12 21.5Z";

/** Halo violet/magenta puissant qui respire en continu, en fond de page. */
function PulsingGlow() {
  return (
    <m.div
      aria-hidden
      animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.12, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{ backgroundColor: MAGENTA, opacity: 0.22 }}
    />
  );
}

/** Anneaux concentriques qui irradient depuis le cœur, à un rythme de plus en plus rapide. */
function ChargingRings() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {[0, 0.35, 0.7].map((delay) => (
        <m.span
          key={delay}
          initial={{ scale: 0.5, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay }}
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{ borderColor: MAGENTA }}
        />
      ))}
    </div>
  );
}

/** Étincelle (petite étoile à 4 branches) qui crépite à une position fixe autour du cœur. */
function Spark({ angle, distance, delay, color }: { angle: number; distance: number; delay: number; color: string }) {
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  return (
    <m.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={color}
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ x, y, marginLeft: -7, marginTop: -7 }}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
      transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.6, delay, ease: "easeInOut" }}
    >
      <path d="M12 0C12 6 14 10 20 12C14 14 12 18 12 24C12 18 10 14 4 12C10 10 12 6 12 0Z" />
    </m.svg>
  );
}

const SPARKS = [
  { angle: -0.4, distance: 70, delay: 0, color: GOLD },
  { angle: 0.9, distance: 85, delay: 0.3, color: MAGENTA },
  { angle: 2.1, distance: 75, delay: 0.6, color: GOLD },
  { angle: 3.3, distance: 90, delay: 0.2, color: VIOLET },
  { angle: 4.5, distance: 72, delay: 0.5, color: MAGENTA },
  { angle: 5.6, distance: 82, delay: 0.8, color: GOLD },
];

/** Le cœur qui se charge, pulse fort, s'enfonce légèrement au clic. */
function ChargingHeart() {
  return (
    <m.svg
      viewBox="0 0 24 24"
      width="74"
      height="74"
      className="relative z-10"
      style={{ filter: `drop-shadow(0 0 18px ${MAGENTA}) drop-shadow(0 0 36px ${VIOLET})` }}
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d={HEART_PATH} fill={MAGENTA} />
    </m.svg>
  );
}

/** Éclair en zigzag qui flashe une fraction de seconde en travers de l'écran. */
function LightningFlash() {
  return (
    <>
      <m.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40"
        style={{ backgroundColor: "#fff" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.3, times: [0, 0.15, 1] }}
      />
      <m.svg
        aria-hidden
        viewBox="0 0 100 300"
        className="pointer-events-none fixed left-1/2 top-1/2 z-50 h-[70vh] w-auto -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.35, times: [0, 0.2, 1] }}
      >
        <m.path
          d="M60 0L20 140H50L30 300L85 110H52L60 0Z"
          fill={GOLD}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        />
      </m.svg>
    </>
  );
}

/** Confettis-cœurs qui explosent une seule fois depuis le centre. */
function HeartBurst() {
  const colors = [MAGENTA, GOLD, VIOLET, "#ffffff"];
  const pieces = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const distance = 130 + (i % 3) * 50;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 10 + (i % 4) * 5,
      color: colors[i % colors.length],
      rotate: (i * 47) % 360,
    };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      {pieces.map((p) => (
        <m.svg
          key={p.id}
          viewBox="0 0 24 24"
          width={p.size}
          height={p.size}
          className="absolute"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <path d={HEART_PATH} fill={p.color} />
        </m.svg>
      ))}
    </div>
  );
}

export default function SaintValentinCupidon({ content }: ThemeProps) {
  const [struck, setStruck] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const shakeControls = useAnimationControls();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleStrike = () => {
    if (struck) return;
    setStruck(true);
    shakeControls.start({
      x: [0, -10, 9, -7, 5, -3, 0],
      y: [0, 4, -4, 3, -2, 1, 0],
      transition: { duration: 0.45, ease: "easeOut" },
    });
    timers.current.push(setTimeout(() => setRevealed(true), 650));
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-14"
      style={{ backgroundColor: BG }}
    >
      <PulsingGlow />
      <AnimatePresence>{struck && !revealed && <LightningFlash />}</AnimatePresence>

      <m.div animate={shakeControls} className="relative z-10 flex flex-col items-center gap-7 text-center">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <m.div
              key="scene"
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-7"
            >
              <span className="font-display text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                Saint-Valentin
              </span>

              <button
                type="button"
                onClick={handleStrike}
                aria-label="Se faire frapper par l'amour"
                className="relative flex h-48 w-48 items-center justify-center"
              >
                <ChargingRings />
                {SPARKS.map((s, i) => (
                  <Spark key={i} {...s} />
                ))}
                <ChargingHeart />
                {struck && <HeartBurst />}
              </button>

              <div className="flex flex-col items-center gap-2">
                <h1 className="font-display max-w-[280px] text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                  Frappé par l&apos;amour
                </h1>
                {content.recipientFirstName && (
                  <p className="text-sm font-semibold" style={{ color: GOLD }}>
                    Pour {content.recipientFirstName}
                  </p>
                )}
              </div>

              {!struck && (
                <m.span
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-xs font-bold uppercase tracking-widest text-white/50"
                >
                  Touchez le cœur
                </m.span>
              )}
            </m.div>
          ) : (
            <m.div
              key="card"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border px-9 py-14 text-center"
              style={{
                borderColor: "rgba(255,201,74,0.3)",
                backgroundColor: CARD,
                boxShadow: `0 0 70px -10px ${MAGENTA}66, 0 30px 70px -20px rgba(0,0,0,0.7)`,
              }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: `${MAGENTA}26` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={MAGENTA}>
                  <path d={HEART_PATH} />
                </svg>
              </span>

              {content.recipientFirstName && (
                <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Pour {content.recipientFirstName}
                </h1>
              )}

              <p className="text-lg font-medium leading-relaxed tracking-tight text-white/85 sm:text-xl">
                {content.body}
              </p>

              {content.signature && (
                <p
                  className="mt-1 rounded-full px-4 py-1.5 text-sm font-bold text-white"
                  style={{ backgroundColor: VIOLET }}
                >
                  — {content.signature}
                </p>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </m.div>

      <span className="relative z-10 mt-9 text-[11px] font-semibold uppercase tracking-normal text-white/25">
        Créé avec QR Emotions
      </span>
    </main>
  );
}