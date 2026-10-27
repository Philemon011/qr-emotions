"use client";

/**
 * Providers globaux de l'application.
 * Regroupe tout ce qui doit tourner côté client et englober toute l'app :
 * - LazyMotion (Framer Motion) : charge un bundle d'animations réduit
 *   au lieu d'importer toute la librairie, pour de meilleures perfs.
 * D'autres providers (thème, toasts, etc.) viendront s'ajouter ici plus tard.
 */

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // strict = false pour pouvoir utiliser motion.* directement sans le composant m
    <LazyMotion features={domAnimation} strict={false}>
      {children}
    </LazyMotion>
  );
}