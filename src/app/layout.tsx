import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

/**
 * Metadata globale du site.
 * À affiner projet par projet (titre/description définitifs, domaine réel,
 * images OG dédiées) une fois le nom de marque et le domaine arrêtés.
 */
export const metadata: Metadata = {
  title: {
    default: "QR Emotions — Des mots qui deviennent des moments",
    template: "%s | QR Emotions",
  },
  description:
    "Créez un message qui touche le cœur en quelques secondes, et transmettez-le grâce à un QR Code unique.",
  // Empêche l'indexation tant qu'on est en développement.
  // À retirer / passer à true avant la mise en production.
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Empêche le zoom automatique sur mobile lors du focus d'un champ,
  // pour une expérience plus "app native".
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}