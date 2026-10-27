"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Heart } from "iconsax-react";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Néon" — Déclaration d'amour.
 * Ambiance vitrine de nuit : texte avec halo lumineux qui tremblote
 * légèrement (vrai tube néon), grille de sol futuriste en perspective,
 * artefacts glitch (décalage RGB furtif) qui traversent l'écran par
 * instants, cœur néon qui bourdonne. Le thème "fou" de la collection.
 */

/** Applique un halo lumineux multi-couches (glow néon réaliste) via text-shadow empilés. */
function neonGlow(color: string) {
  return {
    color: "#ffffff",
    textShadow: `0 0 4px #fff, 0 0 10px #fff, 0 0 20px ${color}, 0 0 40px ${color}, 0 0 80px ${color}`,
  };
}

/** Le texte néon "tremblote" très légèrement, comme un vrai tube électrique instable. */
function FlickerWrapper({ children }: { children: React.ReactNode }) {
  return (
    <m.span
      animate={{ opacity: [1, 1, 0.85, 1, 1, 0.9, 1, 1, 1, 0.8, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "linear", times: [0, 0.1, 0.12, 0.14, 0.4, 0.42, 0.44, 0.7, 0.85, 0.87, 1] }}
    >
      {children}
    </m.span>
  );
}

/** Grille de sol en perspective, style synthwave — pur CSS, pas d'image. */
function PerspectiveGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] overflow-hidden"
      style={{ perspective: "300px" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: "rotateX(75deg)",
          backgroundImage: `
            linear-gradient(rgba(162,75,255,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(162,75,255,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />
    </div>
  );
}

/** Artefact glitch furtif : décalage RGB bref sur une bande horizontale, à intervalles irréguliers. */
function GlitchFlash() {
  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      animate={{ opacity: [0, 0, 1, 0, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.5, times: [0, 0.94, 0.95, 0.96, 1], ease: "linear" }}
    >
      <div className="absolute inset-x-0 top-[35%] h-[6px] bg-[var(--color-neon-cyan)] mix-blend-screen" style={{ transform: "translateX(-3px)" }} />
      <div className="absolute inset-x-0 top-[35%] h-[6px] bg-[var(--color-neon-pink)] mix-blend-screen" style={{ transform: "translateX(3px)" }} />
    </m.div>
  );
}

/** Cœur néon en contour, qui bourdonne (léger jitter d'opacité rapide, façon enseigne électrique). */
function NeonHeart() {
  return (
    <m.div
      animate={{ opacity: [1, 1, 0.7, 1, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.5, 0.52, 0.54, 1], ease: "linear" }}
      className="relative flex h-16 w-16 items-center justify-center"
    >
      <Heart
        size={36}
        variant="Outline"
        color="var(--color-neon-pink)"
        style={{ filter: "drop-shadow(0 0 6px var(--color-neon-pink)) drop-shadow(0 0 18px var(--color-neon-pink))" }}
      />
    </m.div>
  );
}

/** Particules lumineuses (poussière électrique) qui montent lentement. */
function ElectricDust() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; duration: number; repeatDelay: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ["var(--color-neon-pink)", "var(--color-neon-cyan)", "var(--color-neon-violet)"];
    setParticles(
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 5 + Math.random() * 3,
        repeatDelay: Math.random() * 2,
        color: colors[i % colors.length],
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <m.span
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: -650 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, repeatDelay: p.repeatDelay, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full"
          style={{ left: `${p.left}%`, bottom: 0, backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}` }}
        />
      ))}
    </div>
  );
}

export default function DeclarationNeon({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-neon-bg)" }}
    >
      <PerspectiveGrid />
      <ElectricDust />
      <GlitchFlash />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 rounded-2xl border px-8 py-14 text-center sm:px-12 sm:py-16"
            style={{
              borderColor: "rgba(255,46,230,0.4)",
              backgroundColor: "rgba(15,6,25,0.7)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 0 60px -10px var(--color-neon-pink), 0 0 100px -20px var(--color-neon-violet)",
            }}
          >
            <NeonHeart />

            <FlickerWrapper>
              <span
                className="font-display text-xs font-bold uppercase tracking-[0.3em]"
                style={neonGlow("var(--color-neon-cyan)")}
              >
                Déclaration d&apos;amour
              </span>
            </FlickerWrapper>

            <FlickerWrapper>
              <h1
                className="font-display max-w-[280px] text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl"
                style={neonGlow("var(--color-neon-pink)")}
              >
                Un message vous attend
              </h1>
            </FlickerWrapper>

            {content.recipientFirstName && (
              <p className="text-sm font-semibold tracking-wide text-white/50">
                Pour {content.recipientFirstName}
              </p>
            )}

            <m.button
              type="button"
              onClick={() => setRevealed(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="mt-1 rounded-full border-2 px-10 py-4 text-sm font-bold uppercase tracking-wide"
              style={{
                borderColor: "var(--color-neon-cyan)",
                color: "#ffffff",
                textShadow: "0 0 8px var(--color-neon-cyan)",
                boxShadow: "0 0 20px -2px var(--color-neon-cyan), inset 0 0 20px -8px var(--color-neon-cyan)",
              }}
            >
              Découvrir
            </m.button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border px-8 py-14 text-center sm:px-14 sm:py-16"
            style={{
              borderColor: "rgba(255,46,230,0.4)",
              backgroundColor: "rgba(15,6,25,0.7)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 0 60px -10px var(--color-neon-pink), 0 0 100px -20px var(--color-neon-violet)",
            }}
          >
            <NeonHeart />

            {content.recipientFirstName && (
              <FlickerWrapper>
                <h1
                  className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl"
                  style={neonGlow("var(--color-neon-pink)")}
                >
                  Pour {content.recipientFirstName}
                </h1>
              </FlickerWrapper>
            )}

            <p className="text-lg font-medium leading-relaxed tracking-tight text-white/90 sm:text-xl">
              {content.body}
            </p>

            {content.signature && (
              <p
                className="mt-1 text-base font-bold uppercase tracking-wide"
                style={neonGlow("var(--color-neon-cyan)")}
              >
                — {content.signature}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span
        className="relative z-10 mt-8 text-[11px] font-semibold uppercase tracking-normal"
        style={{ color: "var(--color-neon-violet)", opacity: 0.7 }}
      >
        Créé avec QR Emotions
      </span>
    </main>
  );
}