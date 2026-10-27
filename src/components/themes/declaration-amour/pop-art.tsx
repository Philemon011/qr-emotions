"use client";

import "@fontsource/bangers/400.css";

import { useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Pop Art" : Déclaration d'amour.
 * Codes de la BD américaine des années 60 : contours noirs épais, ombres
 * DURES décalées (jamais de flou), trame de points (Ben-Day), bulle de
 * dialogue, onomatopées, cœur-mascotte. Toutes les animations sont des
 * ressorts (spring) pour un côté "pop" vif et tactile.
 * Aucune valeur aléatoire : rendu identique serveur/client (pas d'erreur
 * d'hydratation possible).
 */

const FONT_COMIC = "'Bangers', sans-serif";
const INK = "var(--color-pop-ink)";
const RED = "var(--color-pop-red)";
const BLUE = "var(--color-pop-blue)";
const YELLOW = "var(--color-pop-yellow)";

const HEART_PATH =
  "M12 21.5C12 21.5 2 14.5 2 8.2C2 4.9 4.6 2.5 7.7 2.5C9.6 2.5 11.2 3.5 12 5.1C12.8 3.5 14.4 2.5 16.3 2.5C19.4 2.5 22 4.9 22 8.2C22 14.5 12 21.5 12 21.5Z";

/** Texte à contour noir épais + ombre dure : la signature visuelle du pop art. */
const outlinedText = (fill: string, shadow = 3): CSSProperties => ({
  color: fill,
  WebkitTextStroke: `4px ${INK}`,
  paintOrder: "stroke fill",
  textShadow: `${shadow}px ${shadow}px 0 ${INK}`,
});

/** Points d'une étoile "explosion" (comme les bulles POW! des comics). */
function starburstPoints(spikes: number, outer: number, inner: number, cx: number, cy: number) {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    // toFixed : garantit un rendu strictement identique serveur/client
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(" ");
}
const BURST_POINTS = starburstPoints(14, 96, 74, 100, 100);

/** Explosion qui jaillit en ressort et oscille légèrement, avec une onomatopée. */
function Starburst({
  className,
  color,
  size,
  children,
}: {
  className: string;
  color: string;
  size: number;
  children: ReactNode;
}) {
  return (
    <m.div
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: -12 }}
      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.3 }}
      className={`pointer-events-none absolute z-20 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <m.svg
        viewBox="0 0 200 200"
        overflow="visible"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <polygon points={BURST_POINTS} fill={INK} transform="translate(6 6)" />
        <polygon points={BURST_POINTS} fill={color} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      </m.svg>
      <span
        className="relative text-center leading-none"
        style={{ fontFamily: FONT_COMIC, fontSize: size * 0.2, ...outlinedText("#ffffff", 2) }}
      >
        {children}
      </span>
    </m.div>
  );
}

/** Cœur BD : aplat de couleur, contour noir, reflet blanc, ombre dure. Il se balance en boucle. */
function PopHeart({
  className,
  size,
  rotate,
  color = RED,
  delay = 0,
}: {
  className: string;
  size: number;
  rotate: number;
  color?: string;
  delay?: number;
}) {
  return (
    <m.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`pointer-events-none absolute ${className}`}
      style={{ filter: `drop-shadow(3px 3px 0 ${INK})` }}
      initial={{ rotate }}
      animate={{ rotate: [rotate - 7, rotate + 7, rotate - 7], scale: [1, 1.07, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <path d={HEART_PATH} fill={color} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5.6 8C5.6 6.6 6.7 5.5 8 5.4" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
    </m.svg>
  );
}

/** Cœur-mascotte avec un visage : c'est lui qui "parle" dans la bulle. */
function HeartMascot({ size }: { size: number }) {
  return (
    <m.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className="shrink-0"
      style={{ filter: `drop-shadow(4px 4px 0 ${INK})` }}
      animate={{ y: [0, -7, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d={HEART_PATH} fill={RED} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.6 8C5.6 6.6 6.7 5.5 8 5.4" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8.9" cy="10" r="1.15" fill={INK} />
      <circle cx="15.1" cy="10" r="1.15" fill={INK} />
      <circle cx="9.3" cy="9.6" r="0.4" fill="#ffffff" />
      <circle cx="15.5" cy="9.6" r="0.4" fill="#ffffff" />
      <path d="M9.4 12.6C10.6 14.2 13.4 14.2 14.6 12.6" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="6.9" cy="12.4" rx="1.2" ry="0.8" fill="#ff8fa3" />
      <ellipse cx="17.1" cy="12.4" rx="1.2" ry="0.8" fill="#ff8fa3" />
    </m.svg>
  );
}

/** Onomatopée façon autocollant, en bordure d'écran (masquée sur petit écran). */
function Sticker({
  className,
  bg,
  fg,
  rotate,
  children,
}: {
  className: string;
  bg: string;
  fg: string;
  rotate: number;
  children: ReactNode;
}) {
  return (
    <span
      className={`pointer-events-none absolute hidden rounded-md border-4 px-3 py-1 text-2xl sm:block ${className}`}
      style={{
        fontFamily: FONT_COMIC,
        backgroundColor: bg,
        color: fg,
        borderColor: INK,
        boxShadow: `4px 4px 0 ${INK}`,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </span>
  );
}

/** Bulle de dialogue avec sa queue, qui pointe vers le cœur-mascotte. */
function SpeechBubble({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <m.div
      initial={{ scale: 0.6, opacity: 0, rotate: -3 }}
      animate={{ scale: 1, opacity: 1, rotate: -1 }}
      transition={{ type: "spring", stiffness: 300, damping: 16, delay }}
      className="relative w-full rounded-[2rem] border-4 bg-white px-7 py-7 text-left"
      style={{ borderColor: INK, boxShadow: `7px 7px 0 ${INK}` }}
    >
      {children}
      {/* Queue : un triangle noir + un triangle blanc légèrement décalé, pour simuler le contour */}
      <span
        className="absolute -bottom-[22px] left-12 h-0 w-0"
        style={{
          borderLeft: "14px solid transparent",
          borderRight: "14px solid transparent",
          borderTop: `22px solid ${INK}`,
        }}
      />
      <span
        className="absolute -bottom-[13px] left-[52px] h-0 w-0"
        style={{
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "17px solid #ffffff",
        }}
      />
    </m.div>
  );
}

export default function DeclarationPopArt({ content }: ThemeProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{
        backgroundColor: YELLOW,
        // Trame de points façon impression Ben-Day
        backgroundImage: "radial-gradient(rgba(255,45,85,0.35) 2.5px, transparent 2.5px)",
        backgroundSize: "22px 22px",
      }}
    >
      <PopHeart className="left-[5%] top-[7%]" size={54} rotate={-14} />
      <PopHeart className="right-[6%] top-[32%]" size={40} rotate={16} color={BLUE} delay={0.4} />
      <PopHeart className="bottom-[9%] left-[7%]" size={46} rotate={10} color="#ffffff" delay={0.2} />
      <PopHeart className="bottom-[7%] right-[9%]" size={62} rotate={-8} delay={0.8} />
      <Sticker className="left-[4%] top-[44%]" bg="#ffffff" fg={RED} rotate={-10}>
        SMACK !
      </Sticker>
      <Sticker className="right-[5%] top-[13%]" bg={BLUE} fg="#ffffff" rotate={8}>
        LOVE !
      </Sticker>

      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div
            key="gate"
            initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
            transition={{ type: "spring", stiffness: 280, damping: 16 }}
            className="relative z-10 w-full max-w-sm"
          >
            <Starburst className="-right-6 -top-14 sm:-right-16" color={BLUE} size={130}>
              WAOUH !
            </Starburst>

            <div
              className="relative flex flex-col items-center gap-5 rounded-[1.75rem] border-4 bg-white px-7 py-12 text-center sm:px-10"
              style={{ borderColor: INK, boxShadow: `10px 10px 0 ${INK}` }}
            >
              <span
                className="rounded-full border-[3px] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: BLUE, borderColor: INK }}
              >
                Déclaration d&apos;amour
              </span>

              <HeartMascot size={92} />

              <h1
                className="break-words text-5xl leading-[0.95] tracking-wide sm:text-6xl"
                style={{ fontFamily: FONT_COMIC, ...outlinedText(RED) }}
              >
                Un message vous attend !
              </h1>

              {content.recipientFirstName && (
                <span
                  className="rotate-2 rounded-lg border-[3px] px-4 py-1.5 font-display text-base font-bold text-ink-950"
                  style={{ backgroundColor: YELLOW, borderColor: INK, boxShadow: `3px 3px 0 ${INK}` }}
                >
                  Pour {content.recipientFirstName}
                </span>
              )}

              {/* Bouton "pressable" : au clic, il s'enfonce et son ombre disparaît presque */}
              <m.button
                type="button"
                onClick={() => setRevealed(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ x: 5, y: 5, boxShadow: `1px 1px 0 ${INK}` }}
                className="mt-1 rounded-full border-4 px-9 py-3.5 text-2xl tracking-wider text-white"
                style={{
                  fontFamily: FONT_COMIC,
                  backgroundColor: RED,
                  borderColor: INK,
                  boxShadow: `6px 6px 0 ${INK}`,
                }}
              >
                Découvrir !
              </m.button>
            </div>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center gap-8"
          >
            {content.recipientFirstName && (
              <h1
                className="break-words text-center text-5xl leading-none tracking-wide sm:text-7xl"
                style={{ fontFamily: FONT_COMIC, ...outlinedText("#ffffff", 4) }}
              >
                Pour {content.recipientFirstName} !
              </h1>
            )}

            <SpeechBubble delay={0.15}>
              <p className="font-display text-lg font-semibold leading-relaxed tracking-tight text-ink-950 sm:text-xl">
                {content.body}
              </p>
            </SpeechBubble>

            <div className="flex w-full items-center gap-4 pl-4">
              <HeartMascot size={92} />
              {content.signature && (
                <m.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.5 }}
                  className="rounded-lg border-4 px-4 py-2 text-2xl text-white"
                  style={{
                    fontFamily: FONT_COMIC,
                    backgroundColor: RED,
                    borderColor: INK,
                    boxShadow: `5px 5px 0 ${INK}`,
                  }}
                >
                  {content.signature}
                </m.span>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <span
        className="relative z-10 mt-10 text-[11px] font-bold uppercase tracking-normal"
        style={{ color: INK }}
      >
        Créé avec QR Emotions
      </span>
    </main>
  );
}