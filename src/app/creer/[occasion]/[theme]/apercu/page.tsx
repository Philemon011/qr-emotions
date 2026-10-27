"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-react";
import { getThemeComponent } from "@/lib/theme-registry";
import type { MessageContent } from "@/types/message";

function previewStorageKey(occasionSlug: string, themeSlug: string) {
  return `qr-emotions-preview:${occasionSlug}:${themeSlug}`;
}

/**
 * Aperçu plein écran — lit le contenu depuis localStorage au chargement,
 * PUIS écoute l'évènement `storage` (déclenché automatiquement dans cet
 * onglet dès que l'onglet d'édition modifie localStorage) pour se mettre
 * à jour en temps réel, sans aucun rechargement de page.
 */
export default function ThemePreviewPage({
  params,
}: {
  params: Promise<{ occasion: string; theme: string }>;
}) {
  const { occasion: occasionSlug, theme: themeSlug } = use(params);
  const ThemeComponent = getThemeComponent(occasionSlug, themeSlug);
  const storageKey = previewStorageKey(occasionSlug, themeSlug);

  const [content, setContent] = useState<MessageContent | null>(null);

  useEffect(() => {
    const readContent = () => {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          setContent(JSON.parse(raw));
          return;
        } catch {
          // ignore, on retombe sur le contenu vide ci-dessous
        }
      }
      setContent({ body: "" });
    };

    readContent();

    // Se déclenche automatiquement dans CET onglet quand l'onglet
    // d'édition (autre onglet) modifie localStorage — c'est le mécanisme
    // qui permet la mise à jour en temps réel entre les deux onglets.
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        readContent();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  if (!ThemeComponent) {
    notFound();
  }

  if (!content) {
    return null;
  }

  return (
    <div className="relative">
      <Link
        href={`/creer/${occasionSlug}/${themeSlug}`}
        className="fixed left-4 top-4 z-50 flex h-10 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-semibold text-ink-950 shadow-card backdrop-blur-sm"
      >
        <ArrowLeft2 size={16} variant="Linear" color="#0a0a0c" />
        Retour à l&apos;édition
      </Link>
      <ThemeComponent content={content} />
    </div>
  );
}