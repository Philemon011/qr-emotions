import { supabase } from "@/lib/supabase";
import { getThemeComponent } from "@/lib/theme-registry";
import { MessageGone } from "@/components/public/message-gone";
import type { Metadata } from "next";

/**
 * Page publique du message — ce que voit le destinataire en scannant le
 * QR Code. La lecture passe par le client "anon" (jamais le service_role
 * ici), donc la policy RLS "Public can read active messages" s'applique
 * automatiquement : un message désactivé ou expiré ne remonte tout
 * simplement pas, sans qu'on ait besoin de vérifier ça nous-mêmes.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getMessage(slug: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("occasion_slug, theme_slug, recipient_first_name, body, signature")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const message = await getMessage(slug);

  return {
    title: message ? "Un message vous attend — QR Emotions" : "Message introuvable",
    // On ne met jamais le contenu du message dans les métadonnées
    // publiques (aperçus de lien) : il doit rester une surprise réservée
    // au destinataire qui clique/scanne, pas visible dans une preview.
    description: "Découvrez le message qui vous a été envoyé.",
    robots: { index: false, follow: false },
  };
}

export default async function PublicMessagePage({ params }: PageProps) {
  const { slug } = await params;
  const message = await getMessage(slug);

  if (!message) {
    return <MessageGone />;
  }

  const ThemeComponent = getThemeComponent(message.occasion_slug, message.theme_slug);

  if (!ThemeComponent) {
    // Cas de sécurité : thème supprimé/renommé après la création du
    // message. Ne devrait normalement jamais arriver en usage réel.
    return <MessageGone />;
  }

  return (
    <ThemeComponent
      content={{
        recipientFirstName: message.recipient_first_name ?? undefined,
        body: message.body,
        signature: message.signature ?? undefined,
      }}
    />
  );
}