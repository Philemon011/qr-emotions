"use client";

import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/dancing-script/700.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

const FONT_SERIF = "'Playfair Display', serif";
const FONT_SCRIPT = "'Dancing Script', cursive";

function Monogram() {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-full border"
      style={{ borderColor: "var(--color-elegant-accent)" }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 1L12.5 7.5L19 10L12.5 12.5L10 19L7.5 12.5L1 10L7.5 7.5L10 1Z"
          stroke="var(--color-elegant-accent)"
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
        stroke="var(--color-elegant-accent)"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Grand monogramme en filigrane, positionné derrière la carte pour occuper l'espace. */
function WatermarkMonogram() {
  return (
    <svg
      aria-hidden
      width="520"
      height="520"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2"
      style={{ opacity: 0.05 }}
    >
      <path
        d="M10 1L12.5 7.5L19 10L12.5 12.5L10 19L7.5 12.5L1 10L7.5 7.5L10 1Z"
        stroke="var(--color-elegant-accent)"
        strokeWidth="0.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Ornements de coin agrandis, en double-trait pour plus de présence. */
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
          style={{ transform: `rotate(${mark.rotate}deg)`, opacity: 0.5 }}
        >
          <path d="M1 1V22M1 1H22" stroke="var(--color-elegant-accent)" strokeWidth="1" />
          <path d="M8 8V16M8 8H16" stroke="var(--color-elegant-accent)" strokeWidth="1" />
        </svg>
      ))}
    </>
  );
}

/**
 * Particules dorées en chute infinie.
 * Générées UNIQUEMENT après le montage côté client (useEffect), jamais
 * pendant le rendu serveur — évite toute erreur d'hydratation liée à
 * Math.random() qui donnerait des valeurs différentes serveur/client.
 */
function GoldDust() {
  const [particles, setParticles] = useState<
  { id: number; left: number; delay: number; duration: number; repeatDelay: number; size: number }[]
>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 2.5,
        repeatDelay: Math.random() * 2,
        size: 2 + Math.random() * 2,
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
            backgroundColor: "var(--color-elegant-accent)",
          }}
        />
      ))}
    </div>
  );
}

export default function AnniversaireElegant({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{
        backgroundColor: "var(--color-elegant-bg)",
        backgroundImage: "radial-gradient(rgba(176,141,87,0.15) 0.8px, transparent 0.8px)",
        backgroundSize: "22px 22px",
        boxShadow: "inset 0 0 12vw rgba(10,10,12,0.08)",
      }}
    >
      <CornerMarks />
      <WatermarkMonogram />
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
              className="absolute inset-0 rounded-lg border"
              style={{ borderColor: "var(--color-elegant-accent)", opacity: 0.4 }}
            />
            <div
              className="relative flex w-full flex-col items-center gap-7 rounded-md border px-8 py-14 text-center sm:px-12 sm:py-16"
              style={{
                borderColor: "var(--color-elegant-accent)",
                backgroundColor: "#fffdf9",
                boxShadow: "0 24px 60px -20px rgba(10,10,12,0.18)",
                margin: "10px",
              }}
            >
              <Monogram />
              <span className="text-xs font-semibold uppercase tracking-normal text-ink-500">
                Anniversaire
              </span>
              <h1
                className="max-w-[240px] text-3xl leading-snug tracking-tight text-ink-950 sm:text-4xl"
                style={{ fontFamily: FONT_SERIF, fontWeight: 600 }}
              >
                Un message vous attend
              </h1>
              {content.recipientFirstName && (
                <p className="text-sm tracking-normal text-ink-500">
                  Pour {content.recipientFirstName}
                </p>
              )}
              <Flourish />
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-1 rounded-full border px-9 py-3 text-xs font-semibold uppercase tracking-normal text-ink-950 transition-colors duration-300 hover:bg-ink-950 hover:text-white"
                style={{ borderColor: "var(--color-elegant-accent)" }}
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
              className="absolute inset-0 rounded-lg border"
              style={{ borderColor: "var(--color-elegant-accent)", opacity: 0.4 }}
            />
            <div
              className="relative flex w-full flex-col items-center gap-6 rounded-md border px-8 py-14 text-center sm:px-14 sm:py-16"
              style={{
                borderColor: "var(--color-elegant-accent)",
                backgroundColor: "#fffdf9",
                boxShadow: "0 24px 60px -20px rgba(10,10,12,0.18)",
                margin: "10px",
              }}
            >
              <Monogram />
              <span className="text-xs font-semibold uppercase tracking-normal text-ink-500">
                Anniversaire
              </span>
              {content.recipientFirstName && (
                <h1
                  className="text-3xl tracking-tight text-ink-950 sm:text-4xl"
                  style={{ fontFamily: FONT_SERIF, fontWeight: 600 }}
                >
                  Pour {content.recipientFirstName}
                </h1>
              )}
              <Flourish />
              <p
                className="text-lg leading-loose tracking-tight text-ink-700 sm:text-xl"
                style={{ fontFamily: FONT_SERIF, fontWeight: 500 }}
              >
                {content.body}
              </p>
              {content.signature && (
                <>
                  <Flourish />
                  <p className="text-2xl text-ink-950" style={{ fontFamily: FONT_SCRIPT }}>
                    {content.signature}
                  </p>
                </>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Signature de marque discrète, en bas d'écran — occupe l'espace résiduel */}
      <span
        className="relative z-10 mt-10 text-[11px] uppercase tracking-normal text-ink-300"
      >
        Créé avec QR Emotions
      </span>
    </main>
  );
}