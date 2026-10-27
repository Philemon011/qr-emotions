"use client";

import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { RotatingWord } from "@/components/ui/rotating-word";
import { RiWhatsappFill, RiInstagramFill, RiFacebookFill } from "react-icons/ri";
import { SectionBackdrop } from "@/components/ui/section-backdrop";
import { TickCircle } from "iconsax-react";
import { Star1 } from "iconsax-react";
import Link from "next/link";
/**
 * Section Hero — mise en page 2 colonnes.
 * Le mot dynamique est placé en toute fin de phrase pour éviter tout
 * décalage/espace vide quand sa largeur change.
 *
 * ⚠️ PLACEHOLDER À REMPLACER (signalé 📷) :
 * - Visuel de droite → photo réelle d'une personne souriante avec son téléphone
 */

const EMOTION_WORDS = ["de la joie", "de l'amour", "de la gratitude", "de la tendresse", "du bonheur"];
const EMOTION_COLORS = [
  "var(--color-joie)",
  "var(--color-amour)",
  "var(--color-gratitude)",
  "var(--color-tendresse)",
  "var(--color-bonheur)",
];

// Curseurs flottants type "collaboration en direct" (façon Figma) :
// une flèche colorée + étiquette accrochée juste en dessous.
const CURSORS = [
  { label: "Joie", color: "var(--color-joie)", className: "-left-6 top-4" },
  { label: "Gratitude", color: "var(--color-gratitude)", className: "-right-2 top-1/2" },
  { label: "Tendresse", color: "var(--color-tendresse)", className: "-left-2 bottom-8" },
];

function FloatingCursor({
  label,
  color,
  className,
  delay,
}: {
  label: string;
  color: string;
  className: string;
  delay: number;
}) {
  return (
    <m.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`absolute hidden select-none flex-col items-start lg:flex ${className}`}
    >
      {/* Pointeur type curseur de collaboration en direct, bout arrondi */}
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 1.5L14 6.5L8 8.3L6.3 14L2 1.5Z"
          fill={color}
          stroke={color}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      {/* Étiquette accrochée sous le curseur */}
      <span
        className="mt-0.5 ml-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-soft"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
    </m.span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pb-32">

      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Colonne gauche — texte */}
        <div className="flex flex-col items-start text-left">
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-semibold tracking-tighter text-ink-950 sm:text-5xl lg:text-6xl"
          >
            En un simple scan, transmettez{" "}
            <RotatingWord
              words={EMOTION_WORDS}
              colors={EMOTION_COLORS}
              className="font-semibold tracking-tighter"
            />
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-6 max-w-md text-[15px] font-normal leading-relaxed tracking-tight text-ink-500 sm:text-base"
          >
            Un thème, quelques mots, un QR Code — votre message est prêt en
            moins d&apos;une minute, et il va vraiment droit au cœur.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              asChild
              className="border-none bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)]"
            >
              <Link href="/creer">Créer mon message</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#exemples">Voir un exemple</a>
            </Button>
          </m.div>

          {/* Ligne de réassurance */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5"
          >
            {["Gratuit", "Sans inscription", "Prêt en 1 minute"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs font-medium text-ink-300">
                <TickCircle size={14} variant="Bold" color="var(--color-amour)" />
                {item}
              </span>
            ))}
          </m.div>

          {/* Bloc de confiance — avatars + note.
              ⚠️ PLACEHOLDER : note et texte à remplacer par de vraies
              données une fois les premiers retours disponibles. Ne jamais
              inventer de vrais chiffres/avis avant d'en avoir. */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="mt-7 flex items-center gap-3"
          >
            <div className="flex -space-x-2.5">
              {["/images/avatars/avatar-1.jpg", "/images/avatars/avatar-2.jpg", "/images/avatars/avatar-3.jpg", "/images/avatars/avatar-4.jpg"].map(
                (src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-paper-50 object-cover"
                  />
                )
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star1 key={i} size={13} variant="Bold" color="var(--color-joie)" />
                ))}
                <span className="ml-1.5 text-sm font-semibold text-ink-950">4.9/5</span>
              </div>
              <p className="text-xs text-ink-300">Déjà adopté par des centaines de personnes</p>
            </div>
          </m.div>
        </div>

        {/* Colonne droite — visuel + curseurs flottants autour */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:mx-0"
        >
          {CURSORS.map((cursor, i) => (
            <FloatingCursor key={cursor.label} {...cursor} delay={i * 0.1} />
          ))}

          {/* Photo réelle */}
          <img
            src="/images/hero-photo.png"
            alt="Une personne souriante tenant son téléphone, découvrant un message"
            width={600}
            height={700}
            className="aspect-[6/7] w-full rounded-xl object-cover shadow-card"
          />
        </m.div>
      </Container>
    </section>
  );
}