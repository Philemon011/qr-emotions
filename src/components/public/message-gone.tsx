import Link from "next/link";
import { MessageQuestion } from "iconsax-react";

/**
 * Affiché quand un slug ne correspond à aucun message actif — que ce
 * soit parce qu'il n'a jamais existé, qu'il a expiré, ou qu'il a été
 * désactivé par son créateur. Volontairement générique (on ne révèle
 * jamais lequel de ces 3 cas s'est produit, pour ne pas donner
 * d'information exploitable).
 */
export function MessageGone() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper-50 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper-100">
        <MessageQuestion size={28} variant="Bold" color="var(--color-ink-300)" />
      </span>
      <div>
        <h1 className="text-xl font-semibold text-ink-950">Ce message n&apos;est plus disponible</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-500">
          Le lien a peut-être expiré, ou le message a été retiré par son créateur.
        </p>
      </div>
      <Link
        href="/"
        className="mt-2 rounded-full bg-[var(--color-brand-500)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-600)]"
      >
        Découvrir QR Emotions
      </Link>
    </main>
  );
}