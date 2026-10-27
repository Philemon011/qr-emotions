"use client";

import type { MessageContent } from "@/types/message";

/**
 * Formulaire de saisie du message. Contrôlé depuis le parent (page de
 * l'étape 3), pour que chaque frappe mette à jour l'aperçu en temps réel.
 * Champs conformes au cahier des charges (section 5) : prénom destinataire
 * et signature sont tous deux optionnels, seul le message est requis.
 */

interface MessageFormProps {
  content: MessageContent;
  onChange: (patch: Partial<MessageContent>) => void;
  accentColor: string;
}

const MAX_BODY_LENGTH = 400;

export function MessageForm({ content, onChange, accentColor }: MessageFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="recipient" className="text-sm font-semibold text-ink-950">
          Prénom du destinataire
          <span className="ml-1.5 font-normal text-ink-300">(optionnel)</span>
        </label>
        <input
          id="recipient"
          type="text"
          value={content.recipientFirstName ?? ""}
          onChange={(e) => onChange({ recipientFirstName: e.target.value })}
          placeholder="Ex : Sarah"
          maxLength={40}
          className="mt-2 w-full rounded-xl border border-ink-100 px-4 py-3 text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-300 focus:border-[color:var(--accent)]"
          style={{ ["--accent" as string]: accentColor }}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="body" className="text-sm font-semibold text-ink-950">
            Votre message
          </label>
          <span className="text-xs text-ink-300">
            {content.body.length}/{MAX_BODY_LENGTH}
          </span>
        </div>
        <textarea
          id="body"
          value={content.body}
          onChange={(e) => onChange({ body: e.target.value.slice(0, MAX_BODY_LENGTH) })}
          placeholder="Écrivez ce que vous ressentez..."
          rows={6}
          className="mt-2 w-full resize-none rounded-xl border border-ink-100 px-4 py-3 text-sm leading-relaxed text-ink-950 outline-none transition-colors placeholder:text-ink-300 focus:border-[color:var(--accent)]"
          style={{ ["--accent" as string]: accentColor }}
        />
      </div>

      <div>
        <label htmlFor="signature" className="text-sm font-semibold text-ink-950">
          Signature
          <span className="ml-1.5 font-normal text-ink-300">(optionnel)</span>
        </label>
        <input
          id="signature"
          type="text"
          value={content.signature ?? ""}
          onChange={(e) => onChange({ signature: e.target.value })}
          placeholder="Ex : Ton frère, Bel"
          maxLength={60}
          className="mt-2 w-full rounded-xl border border-ink-100 px-4 py-3 text-sm text-ink-950 outline-none transition-colors placeholder:text-ink-300 focus:border-[color:var(--accent)]"
          style={{ ["--accent" as string]: accentColor }}
        />
      </div>
    </div>
  );
}