"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Heart } from "iconsax-react";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Passion" — Déclaration d'amour.
 * Direction volontairement intense/théâtrale : fond noir dramatique,
 * halo cramoisi puissant, cœur qui bat fort avec des ondes de choc qui
 * irradient, ligne ECG animée (pouls qui s'affole), braises rouges qui
 * montent. Conçu pour trancher radicalement avec le thème "Timide".
 */

/** Halo cramoisi puissant, respire fort au centre du fond. */
function CrimsonGlow() {
  return (
    <m.div
      aria-hidden
      animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.1, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{ backgroundColor: "var(--color-passion-glow)", opacity: 0.2 }}
    />
  );
}

/** Ondes de choc concentriques qui irradient depuis le cœur, façon sonar/battement. */
function ShockRings() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2">
      {[0, 0.5, 1].map((delay) => (
        <m.span
          key={delay}
          initial={{ scale: 0.6, opacity: 0.5 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay }}
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: "var(--color-passion-accent)" }}
        />
      ))}
    </div>
  );
}

/** Cœur qui bat FORT — amplitude bien plus marquée qu'un simple pouls discret. */
function IntenseHeartbeat() {
  return (
    <m.span
      animate={{ scale: [1, 1.3, 1, 1.22, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 1] }}
      className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full"
      style={{ backgroundColor: "var(--color-passion-accent)" }}
    >
      <Heart size={26} variant="Bold" color="#ffffff" />
    </m.span>
  );
}

/** Ligne d'ECG animée — trace un battement de cœur qui se dessine en boucle. */
function EcgLine() {
  return (
    <svg width="180" height="36" viewBox="0 0 180 36" fill="none" className="opacity-70">
      <m.path
        d="M0 18H45L54 4L64 32L74 18H92L100 10L108 26L116 18H180"
        stroke="var(--color-passion-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

/** Braises rouges qui montent lentement — même mécanique que "Mon Homme", teinte cramoisie. */
function RisingSparks() {
  const [sparks, setSparks] = useState<
    { id: number; left: number; delay: number; duration: number; repeatDelay: number; size: number; drift: number }[]
  >([]);

  useEffect(() => {
    setSparks(
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 5 + Math.random() * 3,
        repeatDelay: Math.random() * 2,
        size: 2 + Math.random() * 2.5,
        drift: Math.random() * 30 - 15,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((s) => (
        <m.span
          key={s.id}
          initial={{ opacity: 0, y: 20, x: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: -650, x: s.drift }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{ left: `${s.left}%`, bottom: 0, width: s.size, height: s.size, backgroundColor: "var(--color-passion-accent)" }}
        />
      ))}
    </div>
  );
}

/** Cœurs géants en filigrane, en fond de carte. */
function CardDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Heart size={200} variant="Bold" color="var(--color-passion-accent)" style={{ position: "absolute", top: "-14%", right: "-16%", opacity: 0.07, transform: "rotate(-10deg)" }} />
      <Heart size={120} variant="Bold" color="var(--color-passion-accent)" style={{ position: "absolute", bottom: "-8%", left: "-10%", opacity: 0.08, transform: "rotate(14deg)" }} />
    </div>
  );
}

export default function DeclarationPassion({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-passion-bg)" }}
    >
      <CrimsonGlow />
      <RisingSparks />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 overflow-hidden rounded-2xl border px-8 py-14 text-center sm:px-12 sm:py-16"
            style={{
              borderColor: "rgba(224,17,58,0.4)",
              backgroundColor: "var(--color-passion-card)",
              boxShadow: "0 0 90px -10px rgba(255,45,85,0.4), 0 30px 70px -20px rgba(0,0,0,0.7)",
            }}
          >
            <CardDecor />

            <ShockRings />
            <IntenseHeartbeat />

            <span
              className="font-display text-xs font-bold uppercase tracking-normal"
              style={{ color: "var(--color-passion-accent)" }}
            >
              Déclaration d&apos;amour
            </span>

            <h1 className="font-display max-w-[260px] text-3xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl">
              Un message vous attend
            </h1>

            {content.recipientFirstName && (
              <p className="text-sm font-semibold tracking-wide text-white/60">
                Pour {content.recipientFirstName}
              </p>
            )}

            <EcgLine />

            <m.button
              type="button"
              onClick={() => setRevealed(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="mt-1 rounded-full px-10 py-4 text-sm font-bold uppercase tracking-wide text-white"
              style={{
                backgroundColor: "var(--color-passion-accent)",
                boxShadow: "0 0 40px -6px var(--color-passion-glow)",
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
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 overflow-hidden rounded-2xl border px-8 py-14 text-center sm:px-14 sm:py-16"
            style={{
              borderColor: "rgba(224,17,58,0.4)",
              backgroundColor: "var(--color-passion-card)",
              boxShadow: "0 0 90px -10px rgba(255,45,85,0.4), 0 30px 70px -20px rgba(0,0,0,0.7)",
            }}
          >
            <CardDecor />
            <IntenseHeartbeat />

            {content.recipientFirstName && (
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                Pour {content.recipientFirstName}
              </h1>
            )}

            <p className="text-lg font-medium leading-relaxed tracking-tight text-white/85 sm:text-xl">
              {content.body}
            </p>

            {content.signature && (
              <p
                className="mt-1 rounded-full px-4 py-1.5 text-sm font-bold text-white"
                style={{ backgroundColor: "var(--color-passion-accent)" }}
              >
                — {content.signature}
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