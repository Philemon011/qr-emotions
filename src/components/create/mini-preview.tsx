import type { MessageContent } from "@/types/message";
import type { ThemePreview } from "@/lib/theme-previews";

/**
 * Aperçu compact et STATIQUE (pas le vrai composant animé) — juste des
 * blocs de couleur + le texte tronqué proprement (line-clamp). Comme il
 * ne contient aucune vraie mise en page complexe, aucun risque de
 * débordement ou de mauvais centrage, quel que soit l'écran. Pour
 * l'aperçu fidèle et complet, voir le bouton "Aperçu plein écran".
 */

interface MiniPreviewProps {
  content: MessageContent;
  preview: ThemePreview;
  occasionEmoji: string;
  occasionLabel: string;
  themeLabel: string;
}

export function MiniPreview({
  content,
  preview,
  occasionEmoji,
  occasionLabel,
  themeLabel,
}: MiniPreviewProps) {
  return (
    <div
      className="flex aspect-[3/4] w-full max-w-[300px] flex-col items-center justify-center gap-4 rounded-3xl p-6 text-center"
      style={{ backgroundColor: preview.bg }}
    >
      <div
        className="flex w-full flex-1 flex-col items-center justify-center gap-3 rounded-2xl px-5 py-8"
        style={{ backgroundColor: preview.card, boxShadow: "0 16px 40px -14px rgba(0,0,0,0.3)" }}
      >
        <span
          className="rounded-full px-3 py-1 text-[11px] font-semibold"
          style={{ backgroundColor: `${preview.accent}26`, color: preview.accent }}
        >
          {occasionEmoji} {occasionLabel}
        </span>

        {content.recipientFirstName && (
          <p className="text-sm font-semibold" style={{ color: preview.textOnCard }}>
            Pour {content.recipientFirstName}
          </p>
        )}

        <p
          className="line-clamp-4 text-sm leading-relaxed"
          style={{ color: preview.textOnCard, opacity: content.body ? 1 : 0.4 }}
        >
          {content.body || "Votre message apparaîtra ici..."}
        </p>

        {content.signature && (
          <p className="text-xs italic opacity-80" style={{ color: preview.textOnCard }}>
            — {content.signature}
          </p>
        )}
      </div>

      <span className="text-xs font-medium" style={{ color: preview.textOnCard, opacity: 0.7 }}>
        Thème {themeLabel}
      </span>
    </div>
  );
}