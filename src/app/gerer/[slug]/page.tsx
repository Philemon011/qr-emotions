"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Warning2, TickCircle, MessageQuestion, Trash } from "iconsax-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getOccasion, getTheme } from "@/lib/occasions";
import { MAX_BODY_LENGTH, MAX_NAME_LENGTH, MAX_SIGNATURE_LENGTH } from "@/lib/validation";

interface MessageInfo {
  occasion_slug: string;
  theme_slug: string;
  recipient_first_name: string | null;
  body: string;
  signature: string | null;
  created_at: string;
  disabled: boolean;
  expires_at: string | null;
}

export default function ManageMessagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [message, setMessage] = useState<MessageInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "invalid" | "ready">("loading");
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmingDisable, setConfirmingDisable] = useState(false);

  // --- État du formulaire de modification ---
  const [isEditing, setIsEditing] = useState(false);
  const [editRecipient, setEditRecipient] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editSignature, setEditSignature] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaved, setEditSaved] = useState(false);

  // --- État de la suppression définitive ---
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/messages/${slug}/manage?token=${token}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: MessageInfo) => {
        setMessage(data);
        setEditRecipient(data.recipient_first_name ?? "");
        setEditBody(data.body);
        setEditSignature(data.signature ?? "");
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [slug, token]);

  const toggleDisabled = async () => {
    if (!message) return;
    setIsUpdating(true);
    const res = await fetch(`/api/messages/${slug}/manage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, disabled: !message.disabled }),
    });
    if (res.ok) {
      setMessage({ ...message, disabled: !message.disabled });
    }
    setIsUpdating(false);
    setConfirmingDisable(false);
  };

  const saveEdits = async () => {
    setEditError(null);
    if (editBody.trim().length === 0) {
      setEditError("Le message ne peut pas être vide.");
      return;
    }
    setIsUpdating(true);
    const res = await fetch(`/api/messages/${slug}/manage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        recipientFirstName: editRecipient,
        messageBody: editBody,
        signature: editSignature,
      }),
    });
    const data = await res.json();
    setIsUpdating(false);

    if (!res.ok) {
      setEditError(data.error ?? "Une erreur est survenue.");
      return;
    }

    setMessage({
      ...message!,
      recipient_first_name: editRecipient.trim() || null,
      body: editBody.trim(),
      signature: editSignature.trim() || null,
    });
    setIsEditing(false);
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 3000);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/messages/${slug}/manage`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      router.push("/creer/supprime");
    } else {
      setIsDeleting(false);
    }
  };

  if (status === "loading") {
    return (
      <Container className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-100 border-t-ink-950" />
      </Container>
    );
  }

  if (status === "invalid") {
    return (
      <Container className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper-100">
          <MessageQuestion size={28} variant="Bold" color="var(--color-ink-300)" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-ink-950">Lien de gestion invalide</h1>
          <p className="mt-2 max-w-xs text-sm text-ink-500">
            Ce lien est incorrect ou incomplet. Vérifiez que vous avez copié
            l&apos;intégralité du lien reçu à la création de votre message.
          </p>
        </div>
      </Container>
    );
  }

  if (!message) return null;

  const occasion = getOccasion(message.occasion_slug);
  const theme = occasion ? getTheme(message.occasion_slug, message.theme_slug) : undefined;
  const canDelete = deleteConfirmText === "SUPPRIMER";

  return (
    <Container className="flex min-h-screen flex-col items-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: message.disabled ? "var(--color-ink-300)" : "var(--color-tendresse)" }}
          >
            {message.disabled ? "Désactivé" : "Actif"}
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tighter text-ink-950">
            Gérer votre message
          </h1>
          {occasion && theme && (
            <p className="mt-1.5 text-sm text-ink-500">
              {occasion.emoji} {occasion.label} · {theme.label}
            </p>
          )}
        </div>

        {/* ===== Aperçu / Modification ===== */}
        <div className="mt-8 rounded-2xl border border-ink-100 bg-paper-50 p-5">
          {!isEditing ? (
            <>
              {message.recipient_first_name && (
                <p className="text-sm font-semibold text-ink-950">Pour {message.recipient_first_name}</p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{message.body}</p>
              {message.signature && (
                <p className="mt-2 text-xs italic text-ink-500">— {message.signature}</p>
              )}
              <p className="mt-4 text-xs text-ink-300">
                Créé le {new Date(message.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
                            <p className="mt-1 text-xs text-ink-300">
                {message.expires_at
                  ? `Expire le ${new Date(message.expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`
                  : "N'expire jamais"}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
                {editSaved && (
                  <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-tendresse)]">
                    <TickCircle size={14} variant="Bold" color="var(--color-tendresse)" />
                    Enregistré
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 text-left">
              <div>
                <label className="text-xs font-semibold text-ink-950">
                  Prénom du destinataire <span className="font-normal text-ink-300">(optionnel)</span>
                </label>
                <input
                  value={editRecipient}
                  onChange={(e) => setEditRecipient(e.target.value)}
                  maxLength={MAX_NAME_LENGTH}
                  className="mt-1.5 w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-950 outline-none focus:border-[color:var(--color-brand-500)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-950">Message</label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value.slice(0, MAX_BODY_LENGTH))}
                  rows={4}
                  className="mt-1.5 w-full resize-none rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-950 outline-none focus:border-[color:var(--color-brand-500)]"
                />
                <span className="mt-1 block text-right text-[11px] text-ink-300">
                  {editBody.length}/{MAX_BODY_LENGTH}
                </span>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-950">
                  Signature <span className="font-normal text-ink-300">(optionnel)</span>
                </label>
                <input
                  value={editSignature}
                  onChange={(e) => setEditSignature(e.target.value)}
                  maxLength={MAX_SIGNATURE_LENGTH}
                  className="mt-1.5 w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-950 outline-none focus:border-[color:var(--color-brand-500)]"
                />
              </div>

              {editError && <p className="text-xs font-medium text-[var(--color-amour)]">{editError}</p>}

              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={saveEdits}
                  disabled={isUpdating}
                  className="border-none bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)]"
                >
                  {isUpdating ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ===== Désactivation ===== */}
        <div className="mt-6 rounded-2xl border border-ink-100 p-5">
          {!confirmingDisable ? (
            <>
              <p className="text-sm font-semibold text-ink-950">
                {message.disabled ? "Réactiver ce message" : "Désactiver ce message"}
              </p>
              <p className="mt-1 text-xs text-ink-500">
                {message.disabled
                  ? "Le message redeviendra visible pour quiconque scanne le QR Code."
                  : "Le QR Code ne montrera plus ce message à qui le scanne. Réversible à tout moment."}
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => (message.disabled ? toggleDisabled() : setConfirmingDisable(true))}
                disabled={isUpdating}
                className="mt-4"
              >
                {message.disabled ? "Réactiver" : "Désactiver"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5">
                <Warning2 size={18} variant="Bold" color="var(--color-bonheur)" className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-ink-950">
                  Confirmez-vous vouloir désactiver ce message ?
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setConfirmingDisable(false)}>
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={toggleDisabled}
                  disabled={isUpdating}
                  className="border-none bg-[var(--color-amour)] text-white hover:opacity-90"
                >
                  {isUpdating ? "..." : "Oui, désactiver"}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* ===== Suppression définitive — zone dangereuse, clairement séparée ===== */}
        <div className="mt-6 rounded-2xl border-2 border-[var(--color-amour)]/30 bg-[var(--color-amour)]/5 p-5">
          <div className="flex items-start gap-2.5">
            <Trash size={18} variant="Bold" color="var(--color-amour)" className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-ink-950">Supprimer définitivement</p>
              <p className="mt-1 text-xs text-ink-500">
                Action irréversible. Le message sera effacé pour toujours, et le
                QR Code déjà imprimé ne mènera plus à rien. Tapez{" "}
                <strong>SUPPRIMER</strong> ci-dessous pour confirmer.
              </p>
            </div>
          </div>

          <input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Tapez SUPPRIMER"
            className="mt-4 w-full rounded-lg border border-[var(--color-amour)]/40 bg-white px-3 py-2 text-sm text-ink-950 outline-none focus:border-[var(--color-amour)]"
          />

          <Button
            size="sm"
            onClick={confirmDelete}
            disabled={!canDelete || isDeleting}
            className="mt-3 border-none bg-[var(--color-amour)] text-white hover:opacity-90"
          >
            {isDeleting ? "Suppression..." : "Supprimer définitivement"}
          </Button>
        </div>
      </div>
    </Container>
  );
}