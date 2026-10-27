"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent, useInView, m, AnimatePresence } from "framer-motion";
import { Heart, Colorfilter, Edit2, ScanBarcode, Send2 } from "iconsax-react";
import QRCode from "qrcode";
import { Container } from "@/components/ui/container";

/**
 * Section "Comment ça marche".
 * - Desktop (lg+) : scrollytelling — carte sticky qui se transforme au scroll
 * - Mobile/tablette (<lg) : cartes empilées, chacune révélée au scroll normal
 *
 * Chaque étape a maintenant sa propre icône (pas juste un numéro), et la
 * carte-message a des motifs décoratifs en fond — même traitement visuel
 * que la carte "Un message vous attend" de la section précédente, pour
 * une cohérence globale et éviter l'effet "écran vide".
 */

const STEPS = [
  {
    icon: Heart,
    title: "Choisissez une occasion",
    description: "Anniversaire, déclaration, remerciement... sélectionnez ce qui correspond au moment que vous voulez créer.",
    color: "var(--color-amour)",
  },
  {
    icon: Colorfilter,
    title: "Choisissez un thème",
    description: "Chaque occasion propose plusieurs styles visuels — trouvez celui qui vous ressemble vraiment.",
    color: "var(--color-gratitude)",
  },
  {
    icon: Edit2,
    title: "Écrivez votre message",
    description: "Quelques mots suffisent. Vous voyez le résultat prendre forme en temps réel.",
    color: "var(--color-joie)",
  },
  {
    icon: ScanBarcode,
    title: "Générez votre QR Code",
    description: "Un QR Code unique est créé pour votre message, prêt à être téléchargé.",
    color: "var(--color-tendresse)",
  },
  {
    icon: Send2,
    title: "Partagez-le",
    description: "Envoyez-le sur WhatsApp, Instagram ou Facebook, ou faites-le scanner en personne.",
    color: "var(--color-bonheur)",
  },
];

const MESSAGE_PREVIEW = "Joyeux anniversaire ! Que cette année t'apporte...";

/** Effet "machine à écrire" doux, se joue une fois que `active` passe à true. */
function TypedText({ active }: { active: boolean }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(MESSAGE_PREVIEW.slice(0, i));
      if (i >= MESSAGE_PREVIEW.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <p className="text-sm font-medium leading-relaxed text-ink-950">
      {displayed}
      <span className="animate-pulse">|</span>
    </p>
  );
}

/** Vrai QR Code généré, révélé par balayage vertical. */
function QrPreview({ active }: { active: boolean }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL("https://qr-emotions.app/m/apercu", {
      width: 160,
      margin: 0,
      color: { dark: "#0a0a0cff", light: "#00000000" },
    }).then(setDataUrl);
  }, []);

  if (!dataUrl) return <div className="h-16 w-16" />;

  return (
    <m.div
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: active ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-16 w-16"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="Aperçu du QR Code généré" className="h-16 w-16" />
    </m.div>
  );
}

/**
 * Carte-message — utilisée dans les deux versions (desktop sticky et
 * mobile empilée). Motifs décoratifs en fond (icône de l'étape, géante et
 * très pâle) pour éviter l'effet "carte vide", cohérent avec le reste du site.
 */
function MessageCard({ step, stepIndex }: { step: (typeof STEPS)[number]; stepIndex: number }) {
  const StepIcon = step.icon;
  return (
    <m.div
      className="relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-2xl border border-ink-100 p-6 shadow-card"
      animate={{ backgroundColor: `${step.color}14` }}
      transition={{ duration: 0.5 }}
    >
      {/* Motifs décoratifs en fond */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <m.div
          animate={{ rotate: -12 }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", top: "-8%", right: "-14%" }}
        >
          <StepIcon size={110} variant="Bold" color={step.color} style={{ opacity: 0.1 }} />
        </m.div>
        <m.div
          animate={{ rotate: 18 }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", bottom: "6%", left: "-10%" }}
        >
          <StepIcon size={60} variant="Bold" color={step.color} style={{ opacity: 0.1 }} />
        </m.div>
      </div>

      {/* Badge occasion/thème */}
      <span
        className="relative inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-white transition-colors duration-500"
        style={{ backgroundColor: step.color }}
      >
        {stepIndex === 0 && "Anniversaire"}
        {stepIndex === 1 && "Thème : Doux"}
        {stepIndex >= 2 && "Anniversaire · Doux"}
      </span>

      {/* Icône centrale de l'étape en cours, + message qui s'écrit */}
      <div className="relative flex flex-1 flex-col items-start justify-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: `${step.color}26` }}
        >
          <StepIcon size={20} variant="Bold" color={step.color} />
        </span>
        {stepIndex >= 2 && <TypedText active={stepIndex >= 2} />}
      </div>

      <AnimatePresence>
        {stepIndex >= 3 && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center justify-between"
          >
            <QrPreview active={stepIndex >= 3} />
            {stepIndex >= 4 && (
              <m.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: step.color }}
              >
                <Send2 size={16} variant="Bold" color="#ffffff" />
              </m.span>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

/** Une étape complète en mobile : titre/description + sa propre carte. */
function MobileStep({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.55 });
  const StepIcon = step.icon;

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-start gap-4">
        <span
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${step.color}26` }}
        >
          <StepIcon size={18} variant="Bold" color={step.color} />
        </span>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-300">
            Étape {index + 1}
          </span>
          <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-ink-950">
            {step.title}
          </h3>
          <p className="mt-1 text-sm text-ink-500">{step.description}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[220px]">
        <MessageCard step={step} stepIndex={isInView ? index : Math.max(0, index - 1)} />
      </div>
    </m.div>
  );
}

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(STEPS.length - 1, Math.floor(latest * STEPS.length));
    setActiveStep(step);
  });

  return (
    <div id="comment-ca-marche">
      {/* ===== DESKTOP / TABLETTE LARGE — scrollytelling ===== */}
      <section
        id="comment-ca-marche"
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: `${STEPS.length * 90}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden py-10">
          <Container className="grid w-full grid-cols-2 items-center gap-16">
            <div className="flex flex-col gap-8">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-300">
                Comment ça marche
              </span>
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === activeStep;
                return (
                  <div key={step.title} className="flex items-start gap-4">
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: isActive ? step.color : "var(--color-ink-100)",
                      }}
                    >
                      <StepIcon
                        size={18}
                        variant="Bold"
                        color={isActive ? "#ffffff" : "var(--color-ink-500)"}
                      />
                    </span>
                    <div>
                      <h3
                        className="text-xl font-semibold tracking-tight transition-colors duration-300"
                        style={{
                          color: isActive ? "var(--color-ink-950)" : "var(--color-ink-300)",
                        }}
                      >
                        {step.title}
                      </h3>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <m.p
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="max-w-sm overflow-hidden text-base text-ink-500"
                          >
                            {step.description}
                          </m.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto w-full max-w-xs">
              <MessageCard step={STEPS[activeStep]} stepIndex={activeStep} />
            </div>
          </Container>
        </div>
      </section>

      {/* ===== MOBILE / TABLETTE — cartes empilées, scroll normal ===== */}
      <section className="py-20 lg:hidden">
        <Container>
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-300">
              Comment ça marche
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tighter text-ink-950">
              De l&apos;idée au message reçu
            </h2>
          </div>

          <div className="mt-14 flex flex-col gap-16">
            {STEPS.map((step, index) => (
              <MobileStep key={step.title} step={step} index={index} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}