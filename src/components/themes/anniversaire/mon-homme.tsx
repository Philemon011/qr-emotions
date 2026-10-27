"use client";

import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Mon Homme" — Anniversaire (pour souhaiter à un partenaire homme).
 * Pendant masculin du thème "Amoureux" : ambre/cuivre sur fond anthracite,
 * Playfair Display (pas de script manuscrit), particules qui montent
 * comme de la fumée/braise plutôt que des pétales qui tombent, lignes
 * nettes plutôt que bordures très arrondies.
 */

const FONT_SERIF = "'Playfair Display', serif";

/** Monogramme sobre : nœud papillon en trait fin. */
function EmberMark() {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center border"
      style={{ borderColor: "var(--color-monhomme-accent)" }}
    >
      <svg width="22" height="14" viewBox="0 0 28 18" fill="none">
        <path
          d="M14 9L4 2V16L14 9Z M14 9L24 2V16L14 9Z"
          stroke="var(--color-monhomme-accent)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="9" r="2" fill="var(--color-monhomme-accent)" />
      </svg>
    </div>
  );
}

/** Particules ambrées qui montent lentement, façon braises/fumée — mouvement ascendant, pas de chute. */
function RisingEmbers() {
  const [embers, setEmbers] = useState<
    { id: number; left: number; delay: number; duration: number; repeatDelay: number; size: number; drift: number }[]
  >([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 4,
        repeatDelay: Math.random() * 2.5,
        size: 2 + Math.random() * 2.5,
        drift: Math.random() * 30 - 15,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {embers.map((e) => (
        <m.span
          key={e.id}
          initial={{ opacity: 0, y: 20, x: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: -650, x: e.drift }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            repeatDelay: e.repeatDelay,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            left: `${e.left}%`,
            bottom: 0,
            width: e.size,
            height: e.size,
            backgroundColor: "var(--color-monhomme-accent)",
          }}
        />
      ))}
    </div>
  );
}

/** Lueur ambrée chaude, discrète, qui pulse très lentement au centre. */
function AmberGlow() {
  return (
    <m.div
      aria-hidden
      animate={{ opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{ backgroundColor: "var(--color-monhomme-accent)", opacity: 0.1 }}
    />
  );
}

/** Flammes décoratives géantes et très pâles en fond de carte, pour éviter le vide. */
function CardDecor() {
    const bowtiePath = "M14 9L4 2V16L14 9Z M14 9L24 2V16L14 9Z";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg
        width="180"
        height="116"
        viewBox="0 0 28 18"
        fill="none"
        style={{ position: "absolute", top: "-10%", right: "-14%", opacity: 0.05, transform: "rotate(12deg)" }}
      >
        <path d={bowtiePath} stroke="var(--color-monhomme-accent)" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        width="110"
        height="71"
        viewBox="0 0 28 18"
        fill="none"
        style={{ position: "absolute", bottom: "-6%", left: "-8%", opacity: 0.06, transform: "rotate(-10deg)" }}
      >
        <path d={bowtiePath} stroke="var(--color-monhomme-accent)" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        width="60"
        height="39"
        viewBox="0 0 28 18"
        fill="none"
        style={{ position: "absolute", top: "22%", left: "6%", opacity: 0.05, transform: "rotate(6deg)" }}
      >
        <path d={bowtiePath} stroke="var(--color-monhomme-accent)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function AnniversaireMonHomme({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-monhomme-bg)" }}
    >
      <AmberGlow />
      <RisingEmbers />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 border px-8 py-14 text-center sm:px-12 sm:py-16"
            style={{
              borderColor: "rgba(192,133,82,0.3)",
              backgroundColor: "var(--color-monhomme-card)",
              boxShadow: "0 30px 70px -20px rgba(0,0,0,0.6)",
            }}
          >
            <CardDecor />
            <EmberMark />

            <span
              className="text-xs font-semibold uppercase tracking-normal"
              style={{ color: "var(--color-monhomme-accent)" }}
            >
              Anniversaire
            </span>

            <h1
              className="max-w-[260px] text-2xl leading-snug tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: FONT_SERIF, fontWeight: 600 }}
            >
              Un message vous attend
            </h1>

            {content.recipientFirstName && (
              <p className="text-sm tracking-wide text-white/50">
                Pour {content.recipientFirstName}
              </p>
            )}

            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-1 border px-9 py-3 text-xs font-semibold uppercase tracking-normal text-white transition-colors duration-300 hover:bg-[color:var(--color-monhomme-accent)] hover:text-[color:var(--color-monhomme-bg)]"
              style={{ borderColor: "var(--color-monhomme-accent)" }}
            >
              Découvrir
            </button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 border px-8 py-14 text-center sm:px-14 sm:py-16"
            style={{
              borderColor: "rgba(192,133,82,0.3)",
              backgroundColor: "var(--color-monhomme-card)",
              boxShadow: "0 30px 70px -20px rgba(0,0,0,0.6)",
            }}
          >
            <CardDecor />
            <EmberMark />

            {content.recipientFirstName && (
              <h1
                className="text-2xl tracking-tight text-white sm:text-3xl"
                style={{ fontFamily: FONT_SERIF, fontWeight: 600 }}
              >
                Pour {content.recipientFirstName}
              </h1>
            )}

            <p
              className="text-lg leading-loose tracking-tight text-white/80 sm:text-xl"
              style={{ fontFamily: FONT_SERIF, fontWeight: 500 }}
            >
              {content.body}
            </p>

            {content.signature && (
              <p
                className="text-base tracking-wide"
                style={{ color: "var(--color-monhomme-accent)" }}
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