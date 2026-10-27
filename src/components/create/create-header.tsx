import Link from "next/link";
import { ArrowLeft2, CloseCircle } from "iconsax-react";

/**
 * Header dédié au parcours de création — volontairement différent du
 * Header marketing (pas de nav, pas de CTA) : juste un moyen de revenir
 * en arrière ou de quitter, pour rester concentré sur la tâche.
 */

interface CreateHeaderProps {
  /** Lien de retour à l'étape précédente (absent à la toute première étape). */
  backHref?: string;
}

export function CreateHeader({ backHref }: CreateHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between px-5 sm:h-20 sm:px-8">
      {backHref ? (
        <Link
          href={backHref}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100/70"
          aria-label="Retour à l'étape précédente"
        >
          <ArrowLeft2 size={20} variant="Linear" color="#3a3a42" />
        </Link>
      ) : (
        <span className="w-10" />
      )}

      <Link href="/" className="font-display text-base font-semibold tracking-tight text-ink-950">
        QR Emotions
      </Link>

      <Link
        href="/"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100/70"
        aria-label="Quitter la création"
      >
        <CloseCircle size={20} variant="Linear" color="#3a3a42" />
      </Link>
    </header>
  );
}