"use client";

import "@fontsource/poppins/300.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Heart } from "iconsax-react";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Timide" — Déclaration d'amour.
 * Ambiance d'un aveu murmuré, hésitant : le texte se révèle mot par mot
 * avec un timing irrégulier (comme une hésitation réelle, pas un rythme
 * mécanique), un cœur qui "tremble" légèrement plutôt qu'un battement
 * franc, et un bouton qui semble hésiter avant qu'on ne clique dessus.
 */

/** Cœur qui tremble doucement — rotation aléatoire légère, pas un battement franc. */
function TremblingHeart() {
  return (
    <m.span
      animate={{ rotate: [0, -4, 3, -2, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="flex h-14 w-14 items-center justify-center rounded-full"
      style={{ backgroundColor: "rgba(232,170,187,0.2)" }}
    >
      <Heart size={22} variant="Bold" color="var(--color-timide-accent)" />
    </m.span>
  );
}

/** Grande forme pastel qui respire lentement en fond. */
function SoftBlob({ className, size, delay }: { className: string; size: number; delay: number }) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 0.6, scale: [0.95, 1.05, 0.95] }}
      transition={{
        opacity: { duration: 1, delay },
        scale: { duration: 9, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ backgroundColor: "var(--color-timide-accent)", width: size, height: size }}
    />
  );
}

/**
 * Révèle le texte mot par mot, avec un timing LÉGÈREMENT IRRÉGULIER
 * (variation aléatoire du délai) pour simuler une hésitation naturelle,
 * plutôt qu'un rythme mécanique parfaitement régulier.
 */
function HesitantText({ text, active }: { text: string; active: boolean }) {
  const words = text.split(" ");
  const [delays] = useState(() => {
    let acc = 0;
    return words.map(() => {
      acc += 0.12 + Math.random() * 0.14;
      return acc;
    });
  });

  if (!active) return null;

  return (
    <p className="flex flex-wrap justify-center gap-x-1.5 text-base leading-relaxed text-ink-700 sm:text-lg" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
      {words.map((word, i) => (
        <m.span
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delays[i] }}
        >
          {word}
        </m.span>
      ))}
    </p>
  );
}

export default function DeclarationTimide({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{ backgroundColor: "var(--color-timide-bg)" }}
    >
      <SoftBlob className="-left-20 -top-20" size={320} delay={0} />
      <SoftBlob className="-bottom-24 -right-16" size={280} delay={0.4} />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 rounded-[2.5rem] px-9 py-14 text-center sm:px-12 sm:py-16"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 30px 70px -25px rgba(232,170,187,0.5)",
            }}
          >
            <TremblingHeart />

            <span
              className="text-xs font-light tracking-normal"
              style={{ color: "var(--color-timide-accent)" }}
            >
              quelqu&apos;un a quelque chose à vous dire
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

            {/* Bouton qui hésite légèrement avant le clic — micro-tremblement continu discret */}
            <m.button
              type="button"
              onClick={() => setRevealed(true)}
              animate={{ x: [0, -1, 1, -1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 rounded-full px-9 py-3.5 text-sm font-normal tracking-normal text-white"
              style={{ backgroundColor: "var(--color-timide-accent)" }}
            >
              lire le message
            </m.button>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-[2.5rem] px-9 py-14 text-center sm:px-16 sm:py-16"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 30px 70px -25px rgba(232,170,187,0.5)",
            }}
          >
            <TremblingHeart />

            {content.recipientFirstName && (
              <h1
                className="text-2xl tracking-tight text-ink-950 sm:text-3xl"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}
              >
                pour {content.recipientFirstName.toLowerCase()}
              </h1>
            )}

            <HesitantText text={content.body} active={revealed} />

            {content.signature && (
              <p className="text-sm font-light italic tracking-wide text-ink-500">
                — {content.signature.toLowerCase()}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-10 text-[11px] font-light tracking-normal text-ink-300">
        créé avec qr emotions
      </span>
    </main>
  );
}