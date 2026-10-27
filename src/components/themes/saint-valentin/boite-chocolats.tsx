"use client";

import "@fontsource/dancing-script/700.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Boîte de chocolats" : Saint-Valentin.
 * Vraie identité Saint-Valentin : rose poudré/lavande, boîte en forme de
 * cœur avec ruban satiné à nœud, couvercle qui s'ouvre en pivotant sur
 * une charnière, chocolats en relief révélés dedans, fleurs et cœurs en
 * courbes dispersés en fond. Aucune ligne droite dans la déco.
 */

const FONT_SCRIPT = "'Dancing Script', cursive";
const BOX = "var(--color-choco-box)";
const BOX_DARK = "var(--color-choco-box-dark)";
const RIBBON = "var(--color-choco-ribbon)";
const RIBBON_LIGHT = "var(--color-choco-ribbon-light)";
const GOLD = "var(--color-choco-gold)";

// Forme de cœur, viewBox 0 0 100 92 (plus large que haute, façon vraie boîte)
const BOX_HEART =
  "M50 92C50 92 4 58 4 30C4 13 16 2 32 2C42 2 49 8 50 18C51 8 58 2 68 2C84 2 96 13 96 30C96 58 50 92 50 92Z";

/** Petit chocolat : forme arrondie avec une ligne de relief, sans dégradé. */
function ChocolatePiece({ cx, cy, kind }: { cx: number; cy: number; kind: 0 | 1 | 2 }) {
  const fill = kind === 1 ? "#3a2214" : "#2a1810";
  if (kind === 0) {
    return (
      <g transform={`translate(${cx} ${cy})`}>
        <circle r="6.5" fill={fill} />
        <path d="M-3 -1C-1.5 -3 1.5 -3 3 -1C1.5 1 -1.5 1 -3 -1Z" fill="rgba(255,255,255,0.18)" />
      </g>
    );
  }
  if (kind === 1) {
    return (
      <g transform={`translate(${cx} ${cy})`}>
        <rect x="-6.5" y="-5.5" width="13" height="11" rx="3" fill={fill} />
        <path d="M-3.5 0L0 -3L3.5 0L0 3Z" fill="rgba(255,255,255,0.22)" />
      </g>
    );
  }
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r="6" fill={fill} />
      <path d="M-4 2C-2 -3 2 -3 4 2" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Rangée de chocolats en relief, positionnés à l'intérieur du cœur (clip). */
function ChocolateTray() {
  const positions: { x: number; y: number; kind: 0 | 1 | 2 }[] = [
    { x: 28, y: 40, kind: 0 },
    { x: 44, y: 34, kind: 1 },
    { x: 60, y: 34, kind: 2 },
    { x: 76, y: 40, kind: 0 },
    { x: 36, y: 54, kind: 2 },
    { x: 52, y: 50, kind: 0 },
    { x: 68, y: 54, kind: 1 },
  ];
  return (
    <g clipPath="url(#heartClip)">
      <path d={BOX_HEART} fill={BOX_DARK} />
      {positions.map((p, i) => (
        <m.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.5 + i * 0.06 }}
        >
          <ChocolatePiece cx={p.x} cy={p.y} kind={p.kind} />
        </m.g>
      ))}
    </g>
  );
}

/** Nœud de ruban satiné : deux boucles courbes + croisement + queues, avec un reflet clair (pas de dégradé). */
function RibbonBow() {
  return (
    <g transform="translate(50 6)">
      {/* Queues du ruban, tombant sur le couvercle */}
      <path d="M-3 2C-10 14 -14 24 -9 34C-6 26 -3 18 0 10Z" fill={RIBBON} />
      <path d="M3 2C10 14 14 24 9 34C6 26 3 18 0 10Z" fill={RIBBON} />

      {/* Boucle gauche */}
      <path d="M0 0C-16 -14 -30 -6 -26 6C-22 16 -8 14 0 4Z" fill={RIBBON} />
      <path d="M-3 0C-13 -8 -21 -3 -18 4C-15 10 -7 8 -3 3Z" fill={RIBBON_LIGHT} />

      {/* Boucle droite */}
      <path d="M0 0C16 -14 30 -6 26 6C22 16 8 14 0 4Z" fill={RIBBON} />
      <path d="M3 0C13 -8 21 -3 18 4C15 10 7 8 3 3Z" fill={RIBBON_LIGHT} />

      {/* Nœud central */}
      <circle r="6" fill={RIBBON} />
      <circle r="6" fill="none" stroke={RIBBON_LIGHT} strokeWidth="1.4" opacity="0.7" />
    </g>
  );
}

/** La boîte complète : socle (avec chocolats visibles quand ouverte) + couvercle qui pivote. */
function HeartBox({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width="220" height="220" className="overflow-visible sm:h-[260px] sm:w-[260px]">
      <defs>
        <clipPath id="heartClip">
          <path d={BOX_HEART} />
        </clipPath>
      </defs>

      {/* Socle de la boîte */}
      <path d={BOX_HEART} fill={BOX} stroke={GOLD} strokeWidth="2" />
      <path d={BOX_HEART} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="6" strokeDasharray="0 1" opacity="0" />

      {open && <ChocolateTray />}

      {/* Couvercle, pivote depuis le bas du cœur (charnière) */}
      <m.g
        initial={false}
        animate={open ? { rotate: -38, y: -6, x: -4 } : { rotate: 0, y: 0, x: 0 }}
        transition={{ type: "spring", stiffness: 170, damping: 16 }}
        style={{ transformOrigin: "50px 92px" }}
      >
        <path d={BOX_HEART} fill={BOX} stroke={GOLD} strokeWidth="2.5" />
        <path d="M18 30C30 18 70 18 82 30" stroke="rgba(255,255,255,0.12)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <RibbonBow />
      </m.g>
    </svg>
  );
}

/** Fleur toute en courbes (pétales ovales autour d'un cœur), flotte doucement. */
function FlowerDoodle({ className, size, color, delay }: { className: string; size: number; color: string; delay: number }) {
  return (
    <m.svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={`pointer-events-none absolute ${className}`}
      style={{ opacity: 0.5 }}
      animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx="20" cy="11" rx="6" ry="9" fill={color} transform={`rotate(${angle} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4.5" fill={GOLD} />
    </m.svg>
  );
}

/** Cœur au contour tout en courbes, flottant. */
function FloatingHeart({ className, size, color, delay }: { className: string; size: number; color: string; delay: number }) {
  return (
    <m.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`pointer-events-none absolute ${className}`}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ opacity: 0.6 }}
    >
      <path
        d="M12 20.5C12 20.5 2 13.5 2 7.3C2 4.1 4.6 1.5 7.8 1.5C9.8 1.5 11.2 2.6 12 4.3C12.8 2.6 14.2 1.5 16.2 1.5C19.4 1.5 22 4.1 22 7.3C22 13.5 12 20.5 12 20.5Z"
        fill={color}
      />
    </m.svg>
  );
}

export default function SaintValentinBoiteChocolats({ content }: ThemeProps) {
  const [open, setOpen] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-14"
      style={{ backgroundColor: "var(--color-choco-bg)" }}
    >
      {/* Halo lavande doux en fond, pas de dégradé linéaire */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--color-choco-bg2)", opacity: 0.55 }}
      />

      <FlowerDoodle className="left-[6%] top-[10%]" size={54} color={RIBBON_LIGHT} delay={0} />
      <FlowerDoodle className="right-[8%] top-[16%]" size={40} color="var(--color-choco-bg2)" delay={0.8} />
      <FloatingHeart className="left-[10%] bottom-[16%]" size={44} color={RIBBON} delay={0.3} />
      <FloatingHeart className="right-[9%] bottom-[10%]" size={34} color="var(--color-choco-bg2)" delay={1} />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {!open && (
          <m.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-normal"
            style={{ color: RIBBON }}
          >
            Saint-Valentin
          </m.span>
        )}

        <button
          type="button"
          onClick={() => !open && setOpen(true)}
          aria-label="Ouvrir la boîte"
          className="cursor-pointer"
        >
          <HeartBox open={open} />
        </button>

        <AnimatePresence mode="wait">
          {!open ? (
            <m.div
              key="gate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <h1 style={{ fontFamily: FONT_SCRIPT, fontSize: "2.4rem", color: "var(--color-choco-box-dark)" }}>
                Une boîte de douceurs
              </h1>
              {content.recipientFirstName && (
                <p className="text-sm font-semibold" style={{ color: RIBBON }}>
                  pour {content.recipientFirstName}
                </p>
              )}
              <m.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="text-xs font-semibold uppercase tracking-normal"
                style={{ color: "var(--color-choco-box-dark)", opacity: 0.5 }}
              >
                Touchez la boîte pour l&apos;ouvrir
              </m.span>
            </m.div>
          ) : (
            <m.div
              key="content"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
              className="mt-2 flex w-full max-w-sm flex-col items-center gap-5 rounded-[2rem] px-8 py-9"
              style={{ backgroundColor: "#fff", boxShadow: "0 25px 60px -18px rgba(122,23,52,0.35)" }}
            >
              {content.recipientFirstName && (
                <h1 className="text-2xl font-semibold" style={{ color: "var(--color-choco-box-dark)" }}>
                  Pour {content.recipientFirstName}
                </h1>
              )}
              <p className="text-lg font-medium leading-relaxed" style={{ color: "var(--color-choco-box-dark)" }}>
                {content.body}
              </p>
              {content.signature && (
                <p style={{ fontFamily: FONT_SCRIPT, fontSize: "1.9rem", color: RIBBON }}>
                  {content.signature}
                </p>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <span
        className="relative z-10 mt-9 text-[11px] font-semibold uppercase tracking-normal"
        style={{ color: "var(--color-choco-box-dark)", opacity: 0.4 }}
      >
        Créé avec QR Emotions
      </span>
    </main>
  );
}