"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { HambergerMenu, CloseSquare, Heart } from "iconsax-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Header principal du site — version "vivante" et colorée.
 * - Logo : pastille dégradée + wordmark
 * - Nav : liens en pilules avec hover doux
 * - CTA : dégradé brand (rose vif) au lieu du noir neutre précédent
 */

const NAV_LINKS = [
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Occasions", href: "#occasions" },
  { label: "Exemples", href: "#exemples" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100/60 bg-paper-50/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand-500)]">
            <Heart size={18} variant="Bold" color="#ffffff" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-950 sm:text-xl">
            QR Emotions
          </span>
        </a>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (

            <a key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100/70 hover:text-ink-950"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
                <div className="hidden lg:block">
          <Button
            size="sm"
            asChild
            className="border-none bg-[var(--color-brand-500)] text-white shadow-[0_8px_24px_-8px_var(--color-brand-500)] hover:bg-[var(--color-brand-600)]"
          >
            <Link href="/creer">Créer un message</Link>
          </Button>
        </div>

                {/* Bouton burger — visible uniquement sous lg */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-950 lg:hidden"
        >
          {isMenuOpen ? (
            <CloseSquare size={24} variant="Linear" color="#0a0a0c" />
          ) : (
            <HambergerMenu size={24} variant="Linear" color="#0a0a0c" />
          )}
        </button>
      </Container>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute inset-x-0 top-full lg:hidden",
              "border-b border-ink-100/60 bg-paper-50 shadow-card"
            )}
          >
            <Container className="flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link) => (

                <a key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md px-2 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-ink-100/60 hover:text-ink-950"
                >
                  {link.label}
                </a>
              ))}
                            <Button
                asChild
                className="mt-4 w-full border-none bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)]"
              >
                <Link href="/creer" onClick={() => setIsMenuOpen(false)}>
                  Créer un message
                </Link>
              </Button>
            </Container>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}