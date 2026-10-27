"use client";

import "@fontsource/dancing-script/700.css";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Rideau de velours" : Saint-Valentin.
 * Deux pans de velours (plis simulés par des bandes de rouges alternés,
 * jamais un dégradé lissé) glissent sur les côtés avec une légère
 * compression d'étoffe pendant le mouvement, révélant le message sous
 * un projecteur (halo doux via box-shadow, pas de background-gradient).
 * Cantonnière + frange dorée en haut, embrasses à pompon une fois ouvert.
 */

const FONT_SCRIPT = "'Dancing Script', cursive";
const RED = "var(--color-rideau-red)";
const RED_DARK = "var(--color-rideau-red-dark)";
const GOLD = "var(--color-rideau-gold)";
const STAGE = "var(--color-rideau-stage)";

const HEART_PATH =
  "M12 21.5C12 21.5 2 14.5 2 8.2C2 4.9 4.6 2.5 7.7 2.5C9.6 2.5 11.2 3.5 12 5.1C12.8 3.5 14.4 2.5 16.3 2.5C19.4 2.5 22 4.9 22 8.2C22 14.5 12 21.5 12 21.5Z";

/** Un pan de velours : plis en bandes alternées + reflet en haut, jamais de dégradé lissé. */
function VelvetPanel({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute inset-y-0 h-full w-full"
      style={{
        [side]: 0,
        backgroundColor: RED,
        backgroundImage: `repeating-linear-gradient(
          90deg,
          ${RED} 0px, ${RED} 10px,
          ${RED_DARK} 10px, ${RED_DARK} 14px,
          ${RED} 14px, ${RED} 24px,
          rgba(255,255,255,0.06) 24px, rgba(255,255,255,0.06) 27px
        )`,
      } as React.CSSProperties}
    >
      {/* Reflet lumineux en haut de l'étoffe, une bande nette, pas un fondu */}
      <div className="absolute inset-x-0 top-0 h-10" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
      {/* Frange dorée en bas du pan */}
      <div className="absolute inset-x-0 bottom-0 flex h-5" style={{ backgroundColor: GOLD }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="flex-1 border-x" style={{ borderColor: "rgba(0,0,0,0.15)" }} />
        ))}
      </div>
    </div>
  );
}

/** Cantonnière (bandeau) en haut de scène, avec sa propre frange dorée. */
function Valance() {
  return (
    <div className="absolute inset-x-0 top-0 z-20 h-14" style={{ backgroundColor: RED_DARK }}>
      <div className="flex h-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: i % 2 === 0 ? RED_DARK : "#3a0810" }} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-4" style={{ backgroundColor: GOLD }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="flex-1 border-x" style={{ borderColor: "rgba(0,0,0,0.15)" }} />
        ))}
      </div>
    </div>
  );
}

/** Embrasse : corde dorée + pompon, tient le rideau ouvert sur un côté. */
function Tieback({ side }: { side: "left" | "right" }) {
  return (
    <svg
      width="46"
      height="90"
      viewBox="0 0 46 90"
      className="absolute bottom-24"
      style={{ [side]: 6 } as React.CSSProperties}
    >
      <path d="M23 0V52" stroke={GOLD} strokeWidth="3" />
      <circle cx="23" cy="64" r="13" fill={GOLD} />
      <circle cx="23" cy="64" r="13" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1="23" y1="77" x2={16 + i * 2.6} y2="90" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** Petites particules de lumière qui montent doucement dans le halo du projecteur. */
function LightMotes() {
  const [motes, setMotes] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
  useEffect(() => {
    setMotes(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        left: 20 + Math.random() * 60,
        delay: Math.random() * 4,
        duration: 5 + Math.random() * 3,
      }))
    );
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m2) => (
        <m.span
          key={m2.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 0.8, 0], y: -220 }}
          transition={{ duration: m2.duration, delay: m2.delay, repeat: Infinity, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full"
          style={{ left: `${m2.left}%`, bottom: "10%", backgroundColor: GOLD }}
        />
      ))}
    </div>
  );
}

export default function SaintValentinRideauVelours({ content }: ThemeProps) {
  const [open, setOpen] = useState(false);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: STAGE }}
    >
      {/* Halo de projecteur : ombre douce circulaire, pas un background-gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ boxShadow: `0 0 140px 90px rgba(212,169,74,0.14)`, backgroundColor: "rgba(212,169,74,0.1)" }}
      />
      <LightMotes />

      {/* Scène : lignes au sol, façon planches de théâtre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 46px)`,
        }}
      />

      {/* Message, révélé au centre */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 px-8 text-center">
        {!open && (
          <m.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD }}
          >
            Une déclaration vous attend
          </m.span>
        )}

        <AnimatePresence>
          {open && (
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center gap-5"
            >
              <span className="rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: RED, color: "#fff" }}>
                Saint-Valentin
              </span>

              {content.recipientFirstName && (
                <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                  Pour {content.recipientFirstName}
                </h1>
              )}

              <p className="text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
                {content.body}
              </p>

              {content.signature && (
                <p style={{ fontFamily: FONT_SCRIPT, fontSize: "2rem", color: GOLD }}>
                  {content.signature}
                </p>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rideaux */}
      <div className="absolute inset-0 z-30 overflow-hidden">
        <AnimatePresence>
          {!open && (
            <>
              <m.div
                key="left"
                className="absolute inset-y-0 left-0 w-1/2"
                initial={{ x: 0, scaleX: 1 }}
                exit={{ x: "-92%", scaleX: 0.72, transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] } }}
              >
                <VelvetPanel side="left" />
              </m.div>
              <m.div
                key="right"
                className="absolute inset-y-0 right-0 w-1/2"
                initial={{ x: 0, scaleX: 1 }}
                exit={{ x: "92%", scaleX: 0.72, transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] } }}
              >
                <VelvetPanel side="right" />
              </m.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {open && (
        <>
          <Tieback side="left" />
          <Tieback side="right" />
        </>
      )}

      <Valance />

      {!open && (
        <m.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="absolute bottom-16 z-40 rounded-full border-2 px-9 py-3.5 text-sm font-semibold uppercase tracking-wide"
          style={{ borderColor: GOLD, color: GOLD, backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          Lever le rideau
        </m.button>
      )}

      <span className="absolute bottom-6 z-40 text-[11px] font-semibold uppercase tracking-normal" style={{ color: "rgba(255,255,255,0.4)" }}>
        Créé avec QR Emotions
      </span>
    </main>
  );
}