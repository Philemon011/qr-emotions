"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Eye } from "iconsax-react";
import { CreateHeader } from "@/components/create/create-header";
import { ProgressSteps } from "@/components/create/progress-steps";
import { MessageForm } from "@/components/create/message-form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getOccasion, getTheme } from "@/lib/occasions";
import { getThemeComponent } from "@/lib/theme-registry";
import { getThemePreview } from "@/lib/theme-previews";
import type { MessageContent } from "@/types/message";
import { useRouter } from "next/navigation";
import { ExpirationSelector } from "@/components/create/expiration-selector";
import { type ExpirationDays } from "@/lib/validation";

/** Clé localStorage partagée entre l'éditeur et l'aperçu plein écran. */
function previewStorageKey(occasionSlug: string, themeSlug: string) {
  return `qr-emotions-preview:${occasionSlug}:${themeSlug}`;
}

export default function ThemeEditorPage({
  params,
}: {
  params: Promise<{ occasion: string; theme: string }>;
}) {
  const { occasion: occasionSlug, theme: themeSlug } = use(params);

  const occasion = getOccasion(occasionSlug);
  const theme = occasion ? getTheme(occasionSlug, themeSlug) : undefined;
  const ThemeComponent = getThemeComponent(occasionSlug, themeSlug);

  if (!occasion || !theme || !ThemeComponent) {
    notFound();
  }

  const preview = getThemePreview(themeSlug);

  const [content, setContent] = useState<MessageContent>({
    recipientFirstName: "",
    body: "",
    signature: "",
  });

  const handleChange = (patch: Partial<MessageContent>) => {
    setContent((prev) => ({ ...prev, ...patch }));
  };

  // Écrit dans localStorage à chaque frappe — l'onglet d'aperçu plein
  // écran écoute ces changements via l'évènement `storage` et se met à
  // jour instantanément, sans rechargement.
  useEffect(() => {
    localStorage.setItem(previewStorageKey(occasionSlug, themeSlug), JSON.stringify(content));
  }, [content, occasionSlug, themeSlug]);

  const isValid = content.body.trim().length > 0;
  const [creatorEmail, setCreatorEmail] = useState("");
  const [expirationDays, setExpirationDays] = useState<ExpirationDays>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasionSlug,
          themeSlug,
          recipientFirstName: content.recipientFirstName,
          body: content.body,
          signature: content.signature,
          creatorEmail: creatorEmail || undefined,
          expiresInDays: expirationDays,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Une erreur est survenue. Réessayez.");
        setIsSubmitting(false);
        return;
      }

      // Le owner_token ne transite qu'une seule fois, via l'URL de cette
      // redirection — jamais stocké ailleurs côté serveur après ça.
      router.push(
        `/creer/succes?slug=${data.slug}&token=${data.ownerToken}${data.expiresAt ? `&expiresAt=${encodeURIComponent(data.expiresAt)}` : ""
        }`
      );
    } catch {
      setSubmitError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <CreateHeader backHref={`/creer/${occasionSlug}`} />

      <div className="mt-4">
        <ProgressSteps current={3} />
      </div>

      <Container className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-lg text-center lg:max-w-none">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: occasion.color }}
          >
            {occasion.emoji} {occasion.label} · {theme.label}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tighter text-ink-950 sm:text-4xl">
            Écrivez votre message
          </h1>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[1fr_300px] lg:items-start lg:gap-16">
          {/* Formulaire */}
          <div>
            <MessageForm content={content} onChange={handleChange} accentColor={preview.accent} />

            <div className="mt-8">
              <ExpirationSelector
                value={expirationDays}
                onChange={setExpirationDays}
                accentColor={preview.accent}
              />
            </div>
            <div className="mt-8 rounded-xl border border-ink-100 bg-paper-100 p-4">
              <label htmlFor="creatorEmail" className="text-sm font-semibold text-ink-950">
                Votre email
                <span className="ml-1.5 font-normal text-ink-500">(recommandé)</span>
              </label>
              <p className="mt-1 text-xs text-ink-500">
                Pour recevoir votre lien de gestion en secours — utile si vous
                perdez le lien après création. Jamais utilisé à d&apos;autres fins.
              </p>
              <input
                id="creatorEmail"
                type="email"
                value={creatorEmail}
                onChange={(e) => setCreatorEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="mt-3 w-full rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-300 focus:border-[color:var(--color-brand-500)]"
              />
            </div>

            {submitError && (
              <p className="mt-4 text-sm font-medium text-[var(--color-amour)]">{submitError}</p>
            )}

            <Button
              size="lg"
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit}
              className="mt-4 w-full border-none bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)] lg:w-auto"
            >
              {isSubmitting ? "Génération en cours..." : "Générer mon QR Code"}
            </Button>
            {!isValid && (
              <p className="mt-2 text-xs text-ink-300">
                Écrivez votre message pour continuer.
              </p>
            )}
          </div>

          {/* Carte d'appel vers l'aperçu plein écran */}
          <div
            className="flex flex-col items-center gap-4 rounded-3xl border border-ink-100 bg-paper-50 px-6 py-9 text-center shadow-soft lg:sticky lg:top-24"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-500)]/10"
            >
              <Eye size={24} variant="Bold" color="var(--color-brand-500)" />
            </span>

            <div>
              <p className="text-base font-semibold text-ink-950">Aperçu en direct</p>
              <p className="mt-1.5 text-sm text-ink-500">
                Voyez exactement ce que verra{" "}
                {content.recipientFirstName ? content.recipientFirstName : "votre destinataire"},
                mis à jour en temps réel pendant que vous écrivez.
              </p>
            </div>


            <a
              href={`/creer/${occasionSlug}/${themeSlug}/apercu`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 w-full rounded-full bg-[var(--color-brand-500)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-600)]"
            >
              Voir l&apos;aperçu plein écran
            </a>

            <p className="text-xs text-ink-300">S&apos;ouvre dans un nouvel onglet</p>
          </div>
        </div>
      </Container>
    </div>
  );
}