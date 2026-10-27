"use client";

import "@fontsource/poppins/300.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Heart } from "iconsax-react";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Doux" — Anniversaire.
 * À l'opposé de Festif : palette pastel très calme, formes organiques
 * qui respirent lentement (pas de confettis explosifs), pétales qui
 * tombent au ralenti, typographie légère tout en minuscules, carte aux
 * bords très arrondis sans ombre dure.
 */

/** Grande forme organique en fond, qui "respire" (légère pulsation lente). */
function Blob({
  color,
  className,
  delay,
  size,
}: {
  color: string;
  className: string;
  delay: number;
  size: number;
}) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 0.7, scale: [0.95, 1.05, 0.95] }}
      transition={{
        opacity: { duration: 1, delay },
        scale: { duration: 8, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`pointer-events-none absolute rounded-full blur-2xl ${className}`}
      style={{ backgroundColor: color, width: size, height: size }}
    />
  );
}

/** Pétales qui tombent très lentement, en douceur, jamais brusque. */
function FallingPetals() {
  const [petals, setPetals] = useState<
    { id: number; left: number; delay: number; duration: number; repeatDelay: number; size: number; drift: number }[]
  >([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 9 + Math.random() * 5,
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
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            y: 650,
            x: p.drift,
            rotate: 90,
          }}
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
            backgroundColor: "var(--color-doux-accent)",
          }}
        />
      ))}
    </div>
  );
}

/** Cœurs décoratifs géants et très pâles en fond de carte, pour éviter le vide. */
function CardDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[3rem]">
      <Heart
        size={140}
        variant="Bold"
        color="var(--color-doux-accent)"
        style={{ position: "absolute", top: "-6%", left: "-10%", opacity: 0.06, transform: "rotate(-15deg)" }}
      />
      <Heart
        size={90}
        variant="Bold"
        color="var(--color-doux-accent)"
        style={{ position: "absolute", bottom: "-4%", right: "-6%", opacity: 0.07, transform: "rotate(12deg)" }}
      />
      <Heart
        size={50}
        variant="Bold"
        color="var(--color-doux-accent)"
        style={{ position: "absolute", top: "20%", right: "8%", opacity: 0.06, transform: "rotate(8deg)" }}
      />
    </div>
  );
}

export default function AnniversaireDoux({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-doux-bg)" }}
    >
      <Blob color="var(--color-doux-blob-1)" className="-left-24 -top-24" size={340} delay={0} />
      <Blob color="var(--color-doux-blob-2)" className="-bottom-28 -right-20" size={380} delay={0.4} />
      <Blob color="var(--color-doux-blob-1)" className="right-1/3 top-1/4" size={160} delay={0.8} />

      <FallingPetals />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 rounded-[3rem] px-10 py-16 text-center sm:px-14 sm:py-20"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 40px 80px -30px rgba(217,155,176,0.35)",
            }}
          >
            <CardDecor />
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-doux-blob-1)" }}
            >
              <Heart size={22} variant="Bold" color="var(--color-doux-accent)" />
            </span>

            <span
              className="text-xs font-light tracking-normal"
              style={{ color: "var(--color-doux-accent)" }}
            >
              anniversaire
            </span>

            <h1
              className="max-w-[220px] text-2xl leading-relaxed tracking-tight text-ink-950 sm:text-3xl"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}
            >
              un message vous attend
            </h1>

            {content.recipientFirstName && (
              <p className="text-sm font-light tracking-normal text-ink-500">
                pour {content.recipientFirstName.toLowerCase()}
              </p>
            )}

            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-2 rounded-full px-9 py-3.5 text-sm font-normal tracking-normal text-white transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: "var(--color-doux-accent)" }}
            >
              découvrir
            </button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-[3rem] px-10 py-16 text-center sm:px-16 sm:py-20"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 40px 80px -30px rgba(217,155,176,0.35)",
            }}
          >
             <CardDecor />
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-doux-blob-1)" }}
            >
              <Heart size={22} variant="Bold" color="var(--color-doux-accent)" />
            </span>

            {content.recipientFirstName && (
              <h1
                className="text-2xl tracking-tight text-ink-950 sm:text-3xl"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}
              >
                pour {content.recipientFirstName.toLowerCase()}
              </h1>
            )}

            <p
              className="text-base leading-loose tracking-tight text-ink-700 sm:text-lg"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}
            >
              {content.body}
            </p>

            {content.signature && (
              <p className="text-sm font-light italic tracking-wide text-ink-500">
                — {content.signature.toLowerCase()}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span
        className="relative z-10 mt-10 text-[11px] font-light tracking-normal text-ink-300"
      >
        créé avec qr emotions
      </span>
    </main>
  );
}