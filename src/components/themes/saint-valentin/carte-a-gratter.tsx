"use client";

import "@fontsource/dancing-script/700.css";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, m } from "framer-motion";
import type { ThemeProps } from "@/types/message";

/**
 * Thème "Carte à gratter" : Saint-Valentin.
 * Une vraie couche de foil doré est dessinée sur un <canvas> ; le
 * destinataire la gratte au doigt (ou à la souris). Un petit masque
 * basse résolution (64x64) suit exactement les zones grattées, ce qui
 * permet de mesurer la progression de façon fiable et peu coûteuse.
 * Au-delà du seuil, la carte se dévoile d'elle-même avec une explosion
 * de cœurs. Un bouton "Révéler directement" garde le thème accessible.
 */

const FONT_SCRIPT = "'Dancing Script', cursive";

const RASPBERRY = "var(--color-gratter-bg)";
const CREAM = "var(--color-gratter-card)";
const GOLD = "var(--color-gratter-gold)";
const INK = "var(--color-gratter-ink)";

// Le canvas ne lit pas les variables CSS : ces teintes sont écrites en
// dur et doivent rester cohérentes avec --color-gratter-gold dans globals.css.
const FOIL_BASE = "#dcae4c";
const FOIL_HEART = "rgba(255, 244, 214, 0.5)";
const FOIL_SPECKLE_DARK = "rgba(120, 78, 10, 0.22)";
const FOIL_SPECKLE_LIGHT = "rgba(255, 255, 255, 0.32)";
const FOIL_TEXT = "#7a4a08";

const BRUSH_DIAMETER = 46; // en px CSS : la taille d'un doigt
const REVEAL_THRESHOLD = 0.45; // part de surface grattée qui déclenche la révélation
const MASK_SIZE = 64;

const HEART_PATH =
  "M12 21.5C12 21.5 2 14.5 2 8.2C2 4.9 4.6 2.5 7.7 2.5C9.6 2.5 11.2 3.5 12 5.1C12.8 3.5 14.4 2.5 16.3 2.5C19.4 2.5 22 4.9 22 8.2C22 14.5 12 21.5 12 21.5Z";

// Motif de petits cœurs en fond de page (SVG en data-URI, aucune image à charger)
const HEART_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g fill="rgba(255,255,255,0.08)"><path transform="translate(6 6) scale(0.75)" d="${HEART_PATH}"/><path transform="translate(40 38)" d="${HEART_PATH}"/></g></svg>`
)}")`;

// Explosion de cœurs : positions calculées une fois, sans aléatoire
const BURST = Array.from({ length: 14 }).map((_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const distance = 110 + (i % 3) * 38;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 24,
    size: 16 + (i % 4) * 6,
    color: ["#ff4d7d", "#f4d58d", "#ffffff", "#e0a83a"][i % 4],
  };
});

/** Petit générateur pseudo-aléatoire à graine : le foil garde le même aspect à chaque tracé. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Dessine la couche à gratter : aplat doré, bandes de reflet, cœurs gaufrés, grain et texte. */
function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number) {
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = FOIL_BASE;
  ctx.fillRect(0, 0, w, h);

  // Bandes de reflet en biais, à aplat net (pas de dégradé)
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  const stripe = 56 * dpr;
  for (let x = 0; x < w + h * 0.6; x += stripe * 3) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripe, 0);
    ctx.lineTo(x + stripe - h * 0.6, h);
    ctx.lineTo(x - h * 0.6, h);
    ctx.closePath();
    ctx.fill();
  }

  // Cœurs en filigrane, disposés en quinconce
  const heart = new Path2D(HEART_PATH);
  const cell = 46 * dpr;
  const heartScale = (15 * dpr) / 24;
  ctx.fillStyle = FOIL_HEART;
  for (let row = 0; row * cell * 0.9 < h + cell; row++) {
    for (let col = 0; col * cell < w + cell; col++) {
      ctx.save();
      ctx.translate(col * cell + (row % 2) * (cell / 2), row * cell * 0.9);
      ctx.scale(heartScale, heartScale);
      ctx.fill(heart);
      ctx.restore();
    }
  }

  // Grain métallique
  const rand = mulberry32(42);
  const specks = Math.round((w * h) / (dpr * dpr) / 40);
  for (let i = 0; i < specks; i++) {
    const size = (0.6 + rand() * 1.4) * dpr;
    ctx.fillStyle = rand() > 0.5 ? FOIL_SPECKLE_DARK : FOIL_SPECKLE_LIGHT;
    ctx.fillRect(rand() * w, rand() * h, size, size);
  }

  // Texte "GRATTEZ ICI", en relief (une ombre claire sous le texte foncé)
  const fontSize = Math.min(26 * dpr, w / 9);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${fontSize}px 'Google Sans Flex Variable', sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.fillText("GRATTEZ ICI", w / 2, h / 2 + 1.5 * dpr);
  ctx.fillStyle = FOIL_TEXT;
  ctx.fillText("GRATTEZ ICI", w / 2, h / 2);
}

/** Rangée d'ampoules de chapiteau qui clignotent en alternance (déco façon loterie). */
function MarqueeBulbs() {
  return (
    <div aria-hidden className="flex items-center justify-between px-1">
      {Array.from({ length: 13 }).map((_, i) => (
        <m.span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: "#fff3cf", boxShadow: "0 0 6px #fff3cf" }}
          animate={{ opacity: i % 2 === 0 ? [1, 0.25, 1] : [0.25, 1, 0.25] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/** Petite étoile du bandeau. */
function StarMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={INK} aria-hidden>
      <path d="M12 0C12 6 14 10 20 12C14 14 12 18 12 24C12 18 10 14 4 12C10 10 12 6 12 0Z" />
    </svg>
  );
}

/** Cœur en contour, qui flotte doucement sur le fond de page. */
function FloatingHeart({
  className,
  size,
  rotate,
  delay,
}: {
  className: string;
  size: number;
  rotate: number;
  delay: number;
}) {
  return (
    <m.svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{ rotate }}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <path d={HEART_PATH} stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" strokeLinejoin="round" />
    </m.svg>
  );
}

/** Pièce qui zigzague sur le foil pour montrer le geste, puis disparaît au premier contact. */
function CoinHint() {
  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute z-10"
      style={{ marginLeft: -22, marginTop: -22 }}
      initial={{ opacity: 0, left: "18%", top: "18%" }}
      animate={{
        opacity: 1,
        left: ["18%", "78%", "22%", "74%", "30%"],
        top: ["18%", "34%", "52%", "70%", "84%"],
      }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{
        opacity: { duration: 0.4 },
        left: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        top: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ filter: "drop-shadow(2px 3px 0 rgba(74,11,31,0.35))" }}>
        <circle cx="22" cy="22" r="20" fill="#f4d58d" stroke={INK} strokeWidth="2.5" />
        <circle cx="22" cy="22" r="14" fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 3" />
        <g transform="translate(11 11) scale(0.92)">
          <path d={HEART_PATH} fill={RASPBERRY} />
        </g>
      </svg>
    </m.div>
  );
}

export default function SaintValentinCarteAGratter({ content }: ThemeProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const draggingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const touchedRef = useRef(false);
  const doneRef = useRef(false);
  const lastCheckRef = useRef(0);

  const [touched, setTouched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const reveal = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    draggingRef.current = false;
    setDone(true);
    // Petite vibration sur mobile, si le navigateur la supporte
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(15);
    }
  }, []);

  /** Mesure la part de surface grattée à partir du masque 64x64. */
  const checkProgress = useCallback(() => {
    const mask = maskRef.current;
    if (!mask || doneRef.current) return;
    const mctx = mask.getContext("2d", { willReadFrequently: true });
    if (!mctx) return;
    const { data } = mctx.getImageData(0, 0, MASK_SIZE, MASK_SIZE);
    let alphaSum = 0;
    for (let i = 3; i < data.length; i += 4) alphaSum += data[i];
    const covered = alphaSum / (255 * MASK_SIZE * MASK_SIZE);
    setProgress(covered);
    if (covered >= REVEAL_THRESHOLD) reveal();
  }, [reveal]);

  // Initialisation du canvas et adaptation à la taille de la carte
  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;

    const mask = document.createElement("canvas");
    mask.width = MASK_SIZE;
    mask.height = MASK_SIZE;
    maskRef.current = mask;

    let cancelled = false;
    let observer: ResizeObserver | null = null;

    const setup = () => {
      if (cancelled) return;
      observer = new ResizeObserver(() => {
        if (doneRef.current) return;
        const cssW = box.clientWidth;
        const cssH = box.clientHeight;
        if (cssW < 2 || cssH < 2) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2); // plafonné à 2 pour rester fluide
        const newW = Math.round(cssW * dpr);
        const newH = Math.round(cssH * dpr);
        if (canvas.width === newW && canvas.height === newH) return;

        // Si l'utilisateur a déjà gratté, on garde ses traces en redimensionnant
        let snapshot: HTMLCanvasElement | null = null;
        if (touchedRef.current && canvas.width > 0 && canvas.height > 0) {
          snapshot = document.createElement("canvas");
          snapshot.width = canvas.width;
          snapshot.height = canvas.height;
          snapshot.getContext("2d")?.drawImage(canvas, 0, 0);
        }

        canvas.width = newW;
        canvas.height = newH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        paintFoil(ctx, newW, newH, dpr);

        if (snapshot) {
          // "destination-in" ne garde le foil que là où l'ancien tracé était encore intact
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(snapshot, 0, 0, newW, newH);
          ctx.globalCompositeOperation = "source-over";
        }
      });
      observer.observe(box);
    };

    // On attend le chargement des polices pour que le texte du foil soit dessiné avec la bonne
    if (document.fonts?.ready) {
      document.fonts.ready.then(setup);
    } else {
      setup();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  /** Gratte de `from` jusqu'au point courant, sur le foil ET sur le masque de mesure. */
  const scratchTo = (clientX: number, clientY: number, from: { x: number; y: number } | null) => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const fromX = from?.x ?? x;
    const fromY = from?.y ?? y;
    const scale = canvas.width / rect.width;

    // 1) On efface le foil
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = BRUSH_DIAMETER * scale;
    ctx.beginPath();
    ctx.moveTo(fromX * scale, fromY * scale);
    ctx.lineTo(x * scale + 0.01, y * scale);
    ctx.stroke();

    // 2) On reporte le même trait sur le masque, en coordonnées normalisées
    const mctx = mask?.getContext("2d", { willReadFrequently: true });
    if (mctx) {
      mctx.setTransform(MASK_SIZE / rect.width, 0, 0, MASK_SIZE / rect.height, 0, 0);
      mctx.lineCap = "round";
      mctx.lineJoin = "round";
      mctx.lineWidth = BRUSH_DIAMETER;
      mctx.strokeStyle = "#000";
      mctx.beginPath();
      mctx.moveTo(fromX, fromY);
      mctx.lineTo(x + 0.01, y);
      mctx.stroke();
    }

    return { x, y };
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (doneRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    if (!touchedRef.current) {
      touchedRef.current = true;
      setTouched(true);
    }
    lastPointRef.current = scratchTo(e.clientX, e.clientY, null);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current || doneRef.current) return;
    lastPointRef.current = scratchTo(e.clientX, e.clientY, lastPointRef.current);
    const now = performance.now();
    if (now - lastCheckRef.current > 120) {
      lastCheckRef.current = now;
      checkProgress();
    }
  };

  const handlePointerEnd = () => {
    draggingRef.current = false;
    lastPointRef.current = null;
    checkProgress();
  };

  // Texte d'encouragement selon l'avancement
  const ratio = Math.min(1, progress / REVEAL_THRESHOLD);
  const hint = !touched
    ? "Grattez avec votre doigt"
    : ratio < 0.33
      ? "Continuez…"
      : ratio < 0.66
        ? "Vous y êtes presque…"
        : "Encore un peu !";

  const longBody = content.body.length > 180;

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-14"
      style={{ backgroundColor: RASPBERRY, backgroundImage: HEART_PATTERN }}
    >
      <FloatingHeart className="left-[6%] top-[9%]" size={70} rotate={-12} delay={0} />
      <FloatingHeart className="right-[7%] top-[16%]" size={48} rotate={14} delay={0.6} />
      <FloatingHeart className="bottom-[12%] left-[9%]" size={56} rotate={9} delay={1.2} />
      <FloatingHeart className="bottom-[8%] right-[6%]" size={84} rotate={-10} delay={0.3} />

      <m.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem]"
        style={{ backgroundColor: CREAM, boxShadow: "0 30px 70px -20px rgba(0,0,0,0.5)" }}
      >
        {/* Bandeau doré façon ticket de loterie */}
        <div className="flex flex-col gap-2.5 px-4 py-3.5" style={{ backgroundColor: GOLD }}>
          <MarqueeBulbs />
          <div className="flex items-center justify-center gap-3" style={{ color: INK }}>
            <StarMark />
            <span className="font-display text-sm font-extrabold uppercase tracking-normal ">
              Carte à gratter
            </span>
            <StarMark />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 px-5 pb-7 pt-7 text-center sm:px-8">
          <span
            className="rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-normal text-white"
            style={{ backgroundColor: RASPBERRY }}
          >
            Saint-Valentin
          </span>

          <h1
            className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl"
            style={{ color: INK }}
          >
            Une surprise vous attend
          </h1>

          {content.recipientFirstName && (
            <p className="text-sm font-semibold" style={{ color: INK, opacity: 0.65 }}>
              Pour {content.recipientFirstName}
            </p>
          )}

          {/* Zone à gratter + explosion de cœurs à la révélation */}
          <div className="relative mt-1 w-full">
            <div
              ref={boxRef}
              className="relative w-full overflow-hidden rounded-2xl border-[3px] border-dashed bg-white"
              style={{ borderColor: "rgba(74,11,31,0.3)" }}
            >
              {/* Le message, sous le foil */}
              <m.div
                animate={done ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex min-h-[230px] flex-col items-center justify-center gap-4 px-6 py-8 text-center"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2"
                  style={{ opacity: 0.06 }}
                >
                  <path d={HEART_PATH} fill={RASPBERRY} />
                </svg>

                <p
                  className={`relative break-words font-display font-bold leading-snug tracking-tight ${
                    longBody ? "text-lg" : "text-xl sm:text-2xl"
                  }`}
                  style={{ color: INK }}
                >
                  {content.body}
                </p>

                {content.signature && (
                  <p className="relative" style={{ fontFamily: FONT_SCRIPT, fontSize: "1.9rem", color: RASPBERRY }}>
                    {content.signature}
                  </p>
                )}
              </m.div>

              {/* La couche à gratter */}
              <canvas
                ref={canvasRef}
                aria-hidden
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                className={`absolute inset-0 h-full w-full touch-none cursor-crosshair transition-opacity duration-700 ${
                  done ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              />

              <AnimatePresence>{!touched && !done && <CoinHint />}</AnimatePresence>
            </div>

            {done && (
              <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {BURST.map((p) => (
                  <m.svg
                    key={p.id}
                    viewBox="0 0 24 24"
                    width={p.size}
                    height={p.size}
                    className="absolute"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: p.x, y: p.y, scale: 1, opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  >
                    <path d={HEART_PATH} fill={p.color} />
                  </m.svg>
                ))}
              </div>
            )}
          </div>

          {/* Progression, puis mot de la fin */}
          <div className="w-full max-w-xs" aria-live="polite">
            {!done ? (
              <>
                <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "rgba(74,11,31,0.12)" }}>
                  <m.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: RASPBERRY }}
                    animate={{ width: `${Math.round(ratio * 100)}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold" style={{ color: INK, opacity: 0.7 }}>
                  {hint}
                </p>
              </>
            ) : (
              <m.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ fontFamily: FONT_SCRIPT, fontSize: "1.8rem", color: RASPBERRY }}
              >
                Joyeuse Saint-Valentin
              </m.p>
            )}
          </div>
        </div>
      </m.div>

      {!done && (
        <button
          type="button"
          onClick={reveal}
          className="relative z-10 mt-6 text-xs font-semibold underline underline-offset-4"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Révéler directement
        </button>
      )}

      <span className="relative z-10 mt-6 text-[11px] font-semibold uppercase tracking-normal text-white/60">
        Créé avec QR Emotions
      </span>
    </main>
  );
}