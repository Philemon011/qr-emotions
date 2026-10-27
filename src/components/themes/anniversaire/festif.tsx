"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Cake, Star1 } from "iconsax-react";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Festif" — Anniversaire.
 * Carte façon "billet d'invitation VIP" (encoches + ligne perforée),
 * fond en bandes de fête (repeating-linear-gradient à arrêts nets, PAS
 * un dégradé lissé — c'est un motif de guirlande/bunting, technique
 * d'impression classique, différent des dégradés "IA" qu'on évite
 * ailleurs sur le site), halo lumineux coloré autour de la carte,
 * bouton avec pulsation continue. Confettis + ballons conservés.
 */

const CONFETTI_COLORS = [
  "var(--color-joie)",
  "var(--color-amour)",
  "var(--color-gratitude)",
  "var(--color-tendresse)",
  "var(--color-bonheur)",
  "#ffffff",
];

function Confetti() {
  const [pieces, setPieces] = useState<
    { id: number; left: number; delay: number; duration: number; repeatDelay: number; color: string; rotate: number }[]
  >([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3.5 + Math.random() * 2.5,
        repeatDelay: Math.random() * 1.5,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <m.span
          key={p.id}
          initial={{ opacity: 0, y: -30, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: 650, rotate: p.rotate }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: p.repeatDelay,
            ease: "linear",
          }}
          className="absolute h-2.5 w-1.5 rounded-[1px]"
          style={{ left: `${p.left}%`, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

function Balloon({ color, className, delay }: { color: string; className: string; delay: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -14, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`pointer-events-none absolute hidden sm:block ${className}`}
    >
      <svg width="46" height="64" viewBox="0 0 46 64" fill="none">
        <ellipse cx="23" cy="24" rx="23" ry="24" fill={color} />
        <path d="M23 48L20 52L23 56L26 52L23 48Z" fill={color} />
        <line x1="23" y1="56" x2="23" y2="64" stroke={color} strokeWidth="1.5" />
      </svg>
    </m.div>
  );
}

/** Ligne perforée avec encoches semi-circulaires — donne la forme "billet". */
function PerforatedLine() {
  return (
    <div className="relative h-6 w-full">
      {/* Encoche gauche : demi-cercle de la couleur du fond, "mord" dans la carte */}
      <span
        className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: "var(--color-festif-bg)" }}
      />
      {/* Encoche droite */}
      <span
        className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: "var(--color-festif-bg)" }}
      />
      {/* Ligne pointillée */}
      <div
        className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-t-2 border-dashed"
        style={{ borderColor: "var(--color-ink-100)" }}
      />
    </div>
  );
}

/** Talon du billet — bas de carte, avec l'icône de l'occasion. */
function TicketStub({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-b-[1.75rem] px-8 pb-8 pt-2 sm:px-12">
      {children}
    </div>
  );
}

export default function AnniversaireFestif({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{
        // Bandes de fête à arrêts nets (motif bunting/guirlande imprimée),
        // pas un dégradé lissé — chaque couleur a un début/fin net.
        backgroundImage: `repeating-linear-gradient(
          128deg,
          var(--color-festif-bg) 0px, var(--color-festif-bg) 90px,
          #ff2f61 90px, #ff2f61 96px,
          var(--color-festif-bg) 96px, var(--color-festif-bg) 190px,
          var(--color-bonheur) 190px, var(--color-bonheur) 196px
        )`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <Confetti />
      <Balloon color="var(--color-joie)" className="left-[8%] top-[12%]" delay={0} />
      <Balloon color="var(--color-tendresse)" className="right-[10%] top-[18%]" delay={0.3} />
      <Balloon color="var(--color-gratitude)" className="left-[12%] bottom-[14%]" delay={0.6} />
      <Balloon color="var(--color-bonheur)" className="right-[6%] bottom-[10%]" delay={0.9} />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-[1.75rem]"
            style={{
              backgroundColor: "var(--color-festif-card)",
              // Ombre classique + halo lumineux coloré, superposés
              boxShadow:
                "0 30px 70px -20px rgba(0,0,0,0.35), 0 0 90px -10px rgba(255,68,112,0.55)",
            }}
          >
            <div className="flex w-full flex-col items-center gap-6 px-8 pb-6 pt-12 text-center sm:px-12">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-normal text-white"
                style={{ backgroundColor: "var(--color-festif-bg)" }}
              >
                <Cake size={14} variant="Bold" color="#ffffff" />
                Anniversaire
              </span>

              <h1 className="max-w-[260px] font-display text-3xl font-bold leading-tight tracking-tight text-ink-950 sm:text-4xl">
                Un message vous attend !
              </h1>

              {content.recipientFirstName && (
                <p className="flex items-center gap-1.5 text-base font-semibold text-ink-500">
                  <Star1 size={15} variant="Bold" color="var(--color-bonheur)" />
                  Pour {content.recipientFirstName}
                </p>
              )}
            </div>

            <PerforatedLine />

            <TicketStub>
              <m.button
                type="button"
                onClick={() => setRevealed(true)}
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.94 }}
                className="relative mt-2 rounded-full px-10 py-4 text-base font-bold text-white"
                style={{ backgroundColor: "var(--color-festif-bg)" }}
              >
                {/* Halo pulsant en continu, pas seulement au survol */}
                <m.span
                  animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-festif-bg)" }}
                />
                <span className="relative">Découvrir</span>
              </m.button>
            </TicketStub>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center rounded-[1.75rem]"
            style={{
              backgroundColor: "var(--color-festif-card)",
              boxShadow:
                "0 30px 70px -20px rgba(0,0,0,0.35), 0 0 90px -10px rgba(255,68,112,0.55)",
            }}
          >
            <div className="flex w-full flex-col items-center gap-5 px-8 pb-6 pt-12 text-center sm:px-14">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: "var(--color-festif-bg)" }}
              >
                <Cake size={14} variant="Bold" color="#ffffff" />
                Anniversaire
              </span>

              {content.recipientFirstName && (
                <h1 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
                  Pour {content.recipientFirstName}
                </h1>
              )}

              <p className="text-lg font-medium leading-relaxed tracking-tight text-ink-700 sm:text-xl">
                {content.body}
              </p>
            </div>

            <PerforatedLine />

            <TicketStub>
              {content.signature ? (
                <p
                  className="rounded-full px-4 py-1.5 text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--color-bonheur)" }}
                >
                  — {content.signature}
                </p>
              ) : (
                <span className="h-1" />
              )}
            </TicketStub>
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-8 text-[11px] font-semibold uppercase tracking-normal text-white/70">
        Créé avec QR Emotions
      </span>
    </main>
  );
}