import { Heart } from "iconsax-react";
import { Container } from "@/components/ui/container";

/**
 * Footer — sobre et fonctionnel, cohérent avec le logo du Header.
 * Liens à ajuster une fois les pages secondaires (mentions légales,
 * confidentialité...) créées.
 */

const FOOTER_LINKS = [
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Occasions", href: "#occasions" },
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-100 py-10">
      <Container className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-brand-500)]">
            <Heart size={16} variant="Bold" color="#ffffff" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-ink-950">
            QR Emotions
          </span>
        </a>

        {/* Liens */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            
            <a  key={link.href}
              href={link.href}
              className="text-sm text-ink-500 transition-colors hover:text-ink-950"
            >
              {link.label}
            </a>
          ))}
        </nav>

                {/* Copyright + crédit */}
        <span className="text-sm text-ink-300">
          © {new Date().getFullYear()} QR Emotions — Fait par{" "}
          
          <a
            href="https://philemondev.tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink-500 underline decoration-ink-100 underline-offset-2 transition-colors hover:text-ink-950"
          >
            Etounde Lumière
          </a>
        </span>
      </Container>
    </footer>
  );
}