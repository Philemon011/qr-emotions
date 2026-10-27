"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { TickCircle, Copy, Warning2 } from "iconsax-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";


/**
 * Écran de succès après création d'un message.
 * Affiche le QR Code + lien public (à partager), et le lien de gestion
 * (owner_token) avec un avertissement fort — c'est la SEULE fois que ce
 * lien est montré aussi clairement, d'où l'importance du design ici.
 */
export default function SuccessPage() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");
    const token = searchParams.get("token");
      const expiresAtParam = searchParams.get("expiresAt");

    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [copiedPublic, setCopiedPublic] = useState(false);
    const [copiedManage, setCopiedManage] = useState(false);

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = `${origin}/m/${slug}`;
    const manageUrl = `${origin}/gerer/${slug}?token=${token}`;

    useEffect(() => {
        if (!slug) return;
        QRCode.toDataURL(publicUrl, {
            width: 400,
            margin: 1,
            color: { dark: "#0a0a0c", light: "#ffffff" },
        }).then(setQrDataUrl);
    }, [slug, publicUrl]);

    const copy = async (text: string, which: "public" | "manage") => {
        await navigator.clipboard.writeText(text);
        if (which === "public") {
            setCopiedPublic(true);
            setTimeout(() => setCopiedPublic(false), 2000);
        } else {
            setCopiedManage(true);
            setTimeout(() => setCopiedManage(false), 2000);
        }
    };

    if (!slug || !token) {
        return (
            <Container className="flex min-h-screen flex-col items-center justify-center text-center">
                <p className="text-ink-500">Lien invalide ou expiré.</p>
            </Container>
        );
    }

    return (
        <Container className="flex min-h-screen flex-col items-center justify-center py-16">
            <div className="flex max-w-md flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-tendresse)]/15">
                    <TickCircle size={32} variant="Bold" color="var(--color-tendresse)" />
                </span>

                <h1 className="mt-5 text-3xl font-semibold tracking-tighter text-ink-950">
                    Votre message est prêt !
                </h1>
                <p className="mt-2 text-base text-ink-500">
                    Voici votre QR Code — téléchargez-le ou partagez le lien directement.
                </p>

                        {expiresAtParam ? (
          <p className="mt-1 text-xs text-ink-300">
            Ce message sera disponible jusqu&apos;au{" "}
            {new Date(expiresAtParam).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            .
          </p>
        ) : (
          <p className="mt-1 text-xs text-ink-300">Ce message n&apos;expire jamais.</p>
        )}

                {/* QR Code */}
                <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
                    {qrDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={qrDataUrl} alt="QR Code de votre message" className="h-48 w-48" />
                    ) : (
                        <div className="h-48 w-48 animate-pulse rounded-lg bg-paper-100" />
                    )}
                </div>

                {qrDataUrl && (

                    <a href={qrDataUrl}
                        download={`qr-emotions-${slug}.png`}
                        className="mt-4 text-sm font-semibold text-ink-500 underline decoration-ink-100 underline-offset-4 transition-colors hover:text-ink-950"
                    >
                        Télécharger l&apos;image du QR Code
                    </a>
                )}

                {/* Lien public */}
                <div className="mt-8 flex w-full items-center gap-2 rounded-xl border border-ink-100 bg-paper-100 px-4 py-3">
                    <span className="flex-1 truncate text-left text-sm text-ink-700">{publicUrl}</span>
                    <button
                        type="button"
                        onClick={() => copy(publicUrl, "public")}
                        className="flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-ink-950 shadow-soft"
                    >
                        <Copy size={14} variant="Linear" color="#0a0a0c" />
                        {copiedPublic ? "Copié !" : "Copier"}
                    </button>
                </div>

                {/* Lien de gestion — mise en avant forte, avertissement */}
                <div className="mt-6 w-full rounded-2xl border-2 border-[var(--color-bonheur)] bg-[var(--color-bonheur)]/8 p-5 text-left">
                    <div className="flex items-start gap-2.5">
                        <Warning2 size={20} variant="Bold" color="var(--color-bonheur)" className="mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-ink-950">
                                Gardez précieusement ce lien de gestion
                            </p>
                            <p className="mt-1 text-xs text-ink-500">
                                C&apos;est le seul moyen de désactiver ou modifier votre message
                                plus tard. Nous ne pourrons pas vous le renvoyer si vous le perdez
                                {creatorEmailNotice(searchParams)}.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3">

                        <a href={manageUrl}
                            className="flex-1 truncate text-left text-sm text-ink-700 underline decoration-ink-100 underline-offset-2 hover:text-ink-950"
                        >
                            {manageUrl}
                        </a>
                        <button
                            type="button"
                            onClick={() => copy(manageUrl, "manage")}
                            className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-brand-500)] px-3 text-xs font-semibold text-white"
                        >
                            <Copy size={14} variant="Linear" color="#ffffff" />
                            {copiedManage ? "Copié !" : "Copier"}
                        </button>
                    </div>
                </div>

                <Button
                    size="lg"
                    className="mt-8 w-full border-none bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)]"
                    onClick={() => (window.location.href = "/creer")}
                >
                    Créer un autre message
                </Button>
            </div>
        </Container>
    );
}

/** Ajuste le message d'avertissement selon qu'un email a été fourni ou non. */
function creatorEmailNotice(searchParams: URLSearchParams) {
    return searchParams.get("email") ? " (sauf via l'email envoyé)" : "";
}