"use client";

import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/dancing-script/700.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Luxe" — Anniversaire.
 * Direction volontairement plus sombre et architecturée qu'Élégant :
 * fond quasi noir, or plus saturé, angles nets (pas de coins arrondis),
 * titres en majuscules espacées façon plaque gravée.
 */

const FONT_SERIF = "'Playfair Display', serif";
const FONT_SCRIPT = "'Dancing Script', cursive";

/** Blason/couronne simplifié — remplace le losange du thème Élégant. */
function Crest() {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center border"
      style={{ borderColor: "var(--color-luxe-accent)" }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 8L6 6L9 9L12 4L15 9L18 6L21 8L19 18H5L3 8Z"
          stroke="var(--color-luxe-accent)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Flourish() {
  return (
    <svg width="90" height="14" viewBox="0 0 90 14" fill="none">
      <path
        d="M0 7H32M58 7H90M45 7L38 1M45 7L38 13M45 7L52 1M45 7L52 13"
        stroke="var(--color-luxe-accent)"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Filigrane géant du blason, en fond, très pâle. */
function WatermarkCrest() {
  return (
    <svg
      aria-hidden
      width="480"
      height="480"
      viewBox="0 0 24 24"
      fill="none"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2"
      style={{ opacity: 0.04 }}
    >
      <path
        d="M3 8L6 6L9 9L12 4L15 9L18 6L21 8L19 18H5L3 8Z"
        stroke="var(--color-luxe-accent)"
        strokeWidth="0.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Ornements de coin à angles nets (pas de coins arrondis), plus architecturés. */
function CornerMarks() {
  const marks = [
    { className: "left-6 top-6 sm:left-12 sm:top-12", rotate: 0 },
    { className: "right-6 top-6 sm:right-12 sm:top-12", rotate: 90 },
    { className: "bottom-6 right-6 sm:bottom-12 sm:right-12", rotate: 180 },
    { className: "bottom-6 left-6 sm:bottom-12 sm:left-12", rotate: 270 },
  ];
  return (
    <>
      {marks.map((mark, i) => (
        <svg
          key={i}
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          className={`pointer-events-none absolute ${mark.className}`}
          style={{ transform: `rotate(${mark.rotate}deg)`, opacity: 0.6 }}
        >
          <path d="M1 1V22M1 1H22" stroke="var(--color-luxe-accent)" strokeWidth="1" />
        </svg>
      ))}
    </>
  );
}

/** Poussière dorée, plus rare et plus lente que sur Élégant (effet plus précieux sur fond sombre). */
function GoldDust() {
  const [particles, setParticles] = useState<
    { id: number; left: number; delay: number; duration: number; repeatDelay: number; size: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 3,
        repeatDelay: 1 + Math.random() * 3,
        size: 1.5 + Math.random() * 2,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <m.span
          key={p.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: [0, 1, 1, 0], y: 600 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.repeatDelay,
            ease: "easeIn",
          }}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: "var(--color-luxe-accent)",
          }}
        />
      ))}
    </div>
  );
}

export default function AnniversaireLuxe({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{
        backgroundColor: "var(--color-luxe-bg)",
        backgroundImage: "radial-gradient(rgba(212,175,55,0.08) 0.8px, transparent 0.8px)",
        backgroundSize: "24px 24px",
        boxShadow: "inset 0 0 14vw rgba(0,0,0,0.5)",
      }}
    >
      <CornerMarks />
      <WatermarkCrest />
      <GoldDust />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 p-2"
          >
            <div
              className="absolute inset-0 border"
              style={{ borderColor: "var(--color-luxe-accent)", opacity: 0.3 }}
            />
            <div
              className="relative flex w-full flex-col items-center gap-7 border px-8 py-14 text-center sm:px-12 sm:py-16"
              style={{
                borderColor: "var(--color-luxe-accent)",
                backgroundColor: "var(--color-luxe-card)",
                boxShadow: "0 24px 70px -20px rgba(0,0,0,0.7)",
                margin: "10px",
              }}
            >
              <Crest />
              <span
                className="text-xs font-semibold uppercase tracking-normal"
                style={{ color: "var(--color-luxe-accent)" }}
              >
                Anniversaire
              </span>
              <h1
                className="max-w-[260px] text-2xl uppercase leading-snug tracking-[0.08em] text-white sm:text-3xl"
                style={{ fontFamily: FONT_SERIF, fontWeight: 600 }}
              >
                Un message vous attend
              </h1>
              {content.recipientFirstName && (
                <p className="text-sm tracking-normal text-white/60">
                  Pour {content.recipientFirstName}
                </p>
              )}
              <Flourish />
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-1 border px-9 py-3 text-xs font-semibold uppercase tracking-normal text-white transition-colors duration-300 hover:bg-white hover:text-black"
                style={{ borderColor: "var(--color-luxe-accent)" }}
              >
                Découvrir
              </button>
            </div>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-2 p-2"
          >
            <div
              className="absolute inset-0 border"
              style={{ borderColor: "var(--color-luxe-accent)", opacity: 0.3 }}
            />
            <div
              className="relative flex w-full flex-col items-center gap-6 border px-8 py-14 text-center sm:px-14 sm:py-16"
              style={{
                borderColor: "var(--color-luxe-accent)",
                backgroundColor: "var(--color-luxe-card)",
                boxShadow: "0 24px 70px -20px rgba(0,0,0,0.7)",
                margin: "10px",
              }}
            >
              <Crest />
              <span
                className="text-xs font-semibold uppercase tracking-normal"
                style={{ color: "var(--color-luxe-accent)" }}
              >
                Anniversaire
              </span>
              {content.recipientFirstName && (
                <h1
                  className="text-2xl uppercase tracking-[0.06em] text-white sm:text-3xl"
                  style={{ fontFamily: FONT_SERIF, fontWeight: 600 }}
                >
                  Pour {content.recipientFirstName}
                </h1>
              )}
              <Flourish />
              <p
                className="text-lg leading-loose tracking-tight text-white/80 sm:text-xl"
                style={{ fontFamily: FONT_SERIF, fontWeight: 500 }}
              >
                {content.body}
              </p>
              {content.signature && (
                <>
                  <Flourish />
                  <p
                    className="text-2xl"
                    style={{ fontFamily: FONT_SCRIPT, color: "var(--color-luxe-accent)" }}
                  >
                    {content.signature}
                  </p>
                </>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-10 text-[11px] uppercase tracking-normal text-white/30">
        Créé avec QR Emotions
      </span>
    </main>
  );
}