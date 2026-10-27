"use client";

import { m } from "framer-motion";
import {
  Cake,
  Heart,
  Diamonds,
  HeartTick,
  Award,
  Gift,
  ArrowRight,
} from "iconsax-react";
import { Container } from "@/components/ui/container";

/**
 * Section "Occasions" — aperçu des occasions principales disponibles.
 * Pas de photos ni d'emojis ici : des icônes Iconsax colorées suffisent
 * largement pour une grille de sélection, et restent plus lisibles/nettes
 * qu'une photo à cette échelle. Les vrais visages/émotions humaines sont
 * réservés au Hero et à l'expérience destinataire, où ils ont plus d'impact.
 *
 * On affiche volontairement les 6 occasions les plus parlantes, avec une
 * dernière carte "+ d'autres" qui indique clairement qu'il y en a bien plus
 * (le cahier des charges en prévoit 10) sans surcharger la landing.
 */

const OCCASIONS = [
  { icon: Cake, label: "Anniversaire", color: "var(--color-joie)" },
  { icon: Heart, label: "Saint-Valentin", color: "var(--color-amour)" },
  { icon: Diamonds, label: "Demande en mariage", color: "var(--color-tendresse)" },
  { icon: HeartTick, label: "Déclaration d'amour", color: "var(--color-bonheur)" },
  { icon: Award, label: "Félicitations", color: "var(--color-gratitude)" },
  { icon: Gift, label: "Remerciement", color: "var(--color-amour)" },
];

export function OccasionsPreview() {
  return (
    <section id="occasions" className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <m.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs font-semibold uppercase tracking-wide text-ink-300"
          >
            Occasions
          </m.span>
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="mt-2 text-3xl font-semibold tracking-tighter text-ink-950 sm:text-4xl"
          >
            Un message pour chaque moment
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-4 text-base text-ink-500 sm:text-lg"
          >
            Et ce n'est qu'un aperçu — bien d'autres occasions vous attendent.
          </m.p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {OCCASIONS.map((occasion, index) => (
            <m.div
              key={occasion.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-paper-50 px-4 py-7 text-center shadow-soft transition-shadow hover:shadow-card"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${occasion.color}1A` }}
              >
                <occasion.icon size={22} variant="Bold" color={occasion.color} />
              </span>
              <span className="text-sm font-semibold text-ink-950 sm:text-base">
                {occasion.label}
              </span>
            </m.div>
          ))}

          {/* Carte "+ d'autres occasions" — signale qu'il y en a bien plus */}
          <m.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: OCCASIONS.length * 0.05 }}
            whileHover={{ y: -4 }}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-300 bg-paper-100 px-4 py-7 text-center transition-colors hover:border-ink-950"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-50">
              <ArrowRight size={20} variant="Linear" color="var(--color-ink-500)" />
            </span>
            <span className="text-sm font-semibold text-ink-500 sm:text-base">
              Et bien d'autres
            </span>
          </m.a>
        </div>
      </Container>
    </section>
  );
}