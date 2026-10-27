"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUp2 } from "iconsax-react";

/**
 * Bouton flottant "remonter en haut de page".
 * N'apparaît qu'après un certain scroll (pour ne pas polluer l'écran
 * quand on est déjà en haut du Hero), et disparaît si on remonte.
 */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Apparaît après avoir dépassé la hauteur d'un écran
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          type="button"
          onClick={scrollToTop}
          aria-label="Remonter en haut de la page"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-500)] text-white shadow-float hover:bg-[var(--color-brand-600)] sm:bottom-8 sm:right-8"
        >
          <ArrowUp2 size={20} variant="Bold" color="#ffffff" />
        </m.button>
      )}
    </AnimatePresence>
  );
}