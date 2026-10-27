"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Écrin" : Demande en mariage.
 * Un coffret en velours s'ouvre au clic (couvercle qui pivote sur une
 * vraie charnière), révélant une bague sur un coussin, avec un diamant
 * taillé en facettes nettes (géométrie précise, pas de dessin organique)
 * qui lance un flash de lumière et scintille.
 */

const BG = "var(--color-ecrin-bg)";
const VELVET = "var(--color-ecrin-velvet)";
const GOLD = "var(--color-ecrin-gold)";
const DIAMOND = "var(--color-ecrin-diamond)";

/** Diamant taillé : facettes en triangles nets, avec un éclat qui tourne lentement. */
function Diamond({ size = 34 }: { size?: number }) {
  return (
    <m.svg
      viewBox="0 0 40 36"
      width={size}
      height={size * 0.9}
      animate={{ filter: ["drop-shadow(0 0 2px #fff)", "drop-shadow(0 0 10px #fff)", "drop-shadow(0 0 2px #fff)"] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <polygon points="8,10 32,10 20,2" fill={DIAMOND} opacity="0.95" />
      <polygon points="0,10 8,10 20,34" fill="#cfe9ff" opacity="0.9" />
      <polygon points="32,10 40,10 20,34" fill="#9fd0f2" opacity="0.9" />
      <polygon points="8,10 20,34 32,10" fill={DIAMOND} />
      <polygon points="8,10 20,2 14,10" fill="#ffffff" opacity="0.8" />
      <line x1="8" y1="10" x2="32" y2="10" stroke="#5a7a90" strokeWidth="0.5" />
      <line x1="8" y1="10" x2="20" y2="34" stroke="#5a7a90" strokeWidth="0.4" />
      <line x1="32" y1="10" x2="20" y2="34" stroke="#5a7a90" strokeWidth="0.4" />
    </m.svg>
  );
}

/** Petite étincelle en croix, qui apparaît et disparaît à intervalles. */
function Glint({ style, delay }: { style: React.CSSProperties; delay: number }) {
  return (
    <m.svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      className="pointer-events-none absolute"
      style={style}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, delay, ease: "easeInOut" }}
    >
      <path d="M12 0C12 6 14 10 20 12C14 14 12 18 12 24C12 18 10 14 4 12C10 10 12 6 12 0Z" fill={DIAMOND} />
    </m.svg>
  );
}

/** Anneau en or, avec le diamant posé dessus, sur un coussin en creux. */
function RingOnCushion() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Coussin : rectangle arrondi en velours, avec une fente centrale en creux */}
      <div className="relative flex h-16 w-40 items-center justify-center rounded-xl" style={{ backgroundColor: VELVET, boxShadow: "inset 0 4px 10px rgba(0,0,0,0.4)" }}>
        <div className="h-3 w-28 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />
      </div>

      {/* Bague, posée au-dessus de la fente */}
      <m.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: -34, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="absolute flex flex-col items-center"
      >
        <Diamond />
        <svg width="46" height="18" viewBox="0 0 46 18" className="-mt-1">
          <path d="M4 9C4 4 12 1 23 1C34 1 42 4 42 9C42 14 34 17 23 17C12 17 4 14 4 9Z" fill="none" stroke={GOLD} strokeWidth="3" />
        </svg>
      </m.div>
    </div>
  );
}

/** Le coffret : socle + couvercle qui pivote sur une charnière au fond. */
function RingBox({ open }: { open: boolean }) {
  return (
    <div className="relative" style={{ perspective: 600 }}>
      {/* Socle */}
      <div
        className="relative flex h-40 w-56 items-end justify-center overflow-hidden rounded-t-md rounded-b-2xl pb-5"
        style={{ backgroundColor: VELVET, border: `2px solid ${GOLD}`, boxShadow: "0 25px 60px -16px rgba(0,0,0,0.6)" }}
      >
        {open && <RingOnCushion />}
        {open && (
          <>
            <Glint style={{ left: "30%", top: "20%" }} delay={0} />
            <Glint style={{ right: "26%", top: "28%" }} delay={0.6} />
          </>
        )}
      </div>

      {/* Couvercle */}
      <m.div
        className="absolute inset-x-0 top-0 h-24 origin-bottom rounded-t-2xl"
        style={{
          backgroundColor: VELVET,
          border: `2px solid ${GOLD}`,
          transformStyle: "preserve-3d",
          boxShadow: "0 10px 20px -8px rgba(0,0,0,0.4)",
        }}
        animate={open ? { rotateX: 125 } : { rotateX: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
      >
        <div className="flex h-full items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 20.5C12 20.5 2 13.5 2 7.3C2 4.1 4.6 1.5 7.8 1.5C9.8 1.5 11.2 2.6 12 4.3C12.8 2.6 14.2 1.5 16.2 1.5C19.4 1.5 22 4.1 22 7.3C22 13.5 12 20.5 12 20.5Z" stroke={GOLD} strokeWidth="1.4" />
          </svg>
        </div>
      </m.div>
    </div>
  );
}

/** Points de lumière flous, qui dérivent doucement en fond (bokeh). */
function Bokeh() {
  const [dots, setDots] = useState<{ id: number; top: string; left: string; size: number; delay: number }[]>([]);
  useEffect(() => {
    setDots(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 20 + Math.random() * 40,
        delay: Math.random() * 3,
      }))
    );
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <m.span
          key={d.id}
          className="absolute rounded-full blur-xl"
          style={{ top: d.top, left: d.left, width: d.size, height: d.size, backgroundColor: GOLD }}
          animate={{ opacity: [0.04, 0.12, 0.04], y: [0, -16, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
        />
      ))}
    </div>
  );
}

export default function DemandeMariageEcrin({ content }: ThemeProps) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    setTimeout(() => setRevealed(true), 1300);
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-14"
      style={{ backgroundColor: BG }}
    >
      <Bokeh />

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="scene"
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center gap-7 text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-normal" style={{ color: GOLD }}>
              Demande en mariage
            </span>

            <button type="button" onClick={handleOpen} aria-label="Ouvrir l'écrin">
              <RingBox open={open} />
            </button>

            {content.recipientFirstName && (
              <p className="text-sm font-medium" style={{ color: "#fdf6e8", opacity: 0.7 }}>
                Pour {content.recipientFirstName}
              </p>
            )}

            {!open && (
              <m.span
                animate={{ opacity: [0.4, 0.85, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#fdf6e8" }}
              >
                Ouvrez l&apos;écrin
              </m.span>
            )}
          </m.div>
        ) : (
          <m.div
            key="card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border px-9 py-14 text-center"
            style={{
              borderColor: `${GOLD}4D`,
              backgroundColor: VELVET,
              boxShadow: "0 30px 70px -20px rgba(0,0,0,0.6)",
            }}
          >
            <Diamond size={30} />

            {content.recipientFirstName && (
              <h1 className="text-2xl font-semibold" style={{ color: "#fdf6e8" }}>
                Pour {content.recipientFirstName}
              </h1>
            )}

            <p className="text-lg font-medium leading-relaxed" style={{ color: "#fdf6e8", opacity: 0.9 }}>
              {content.body}
            </p>

            {content.signature && (
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: GOLD }}>
                {content.signature}
              </p>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <span className="relative z-10 mt-9 text-[11px] font-semibold uppercase tracking-normal" style={{ color: GOLD, opacity: 0.5 }}>
        Créé avec QR Emotions
      </span>
    </main>
  );
}