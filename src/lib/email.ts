import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Envoi de l'email de secours (lien de gestion), via le SMTP de Google.
 * Tout le projet passe par `sendManagementEmail` : si on change de service
 * (Resend, etc.), seul ce fichier est à modifier.
 * "server-only" fait échouer le build si ce fichier est importé par erreur
 * dans un composant client, ce qui exposerait les identifiants SMTP.
 */

interface ManagementEmailParams {
  to: string;
  slug: string;
  ownerToken: string;
  recipientFirstName?: string | null;
  expiresAt?: string | null;
}

let transporter: Transporter | null = null;

/** Crée la connexion SMTP une seule fois, puis la réutilise. */
function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !pass) {
    throw new Error("Configuration SMTP incomplète (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD).");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = TLS direct ; 587 = STARTTLS
    auth: { user, pass },
    // Délais courts : un SMTP lent ne doit jamais bloquer la création du message
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });

  return transporter;
}

/** Neutralise le HTML dans toute valeur saisie par un utilisateur avant de l'insérer dans l'email. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Construit le sujet, la version HTML et la version texte brut de l'email. */
function buildEmail(params: {
  manageUrl: string;
  publicUrl: string;
  recipientFirstName?: string | null;
  expiresAt?: string | null;
}) {
  const { manageUrl, publicUrl, recipientFirstName, expiresAt } = params;

  // Sujet volontairement fixe : aucune donnée saisie par l'utilisateur dedans
  const subject = "Votre lien de gestion - QR Emotions";

  const forWhom = recipientFirstName ? ` pour ${recipientFirstName}` : "";
  const expiryLine = expiresAt
    ? `Ce message sera disponible jusqu'au ${formatDate(expiresAt)}.`
    : "Ce message n'a pas de date d'expiration.";

  const text = [
    `Votre message${forWhom} est prêt.`,
    "",
    "Lien de gestion (pour modifier, désactiver ou supprimer votre message) :",
    manageUrl,
    "",
    "Gardez-le précieusement : toute personne qui possède ce lien peut modifier ou supprimer votre message. Ne le partagez pas.",
    "",
    "Lien public (à partager, c'est celui du QR Code) :",
    publicUrl,
    "",
    expiryLine,
    "",
    "Vous recevez cet email parce que cette adresse a été saisie lors de la création d'un message sur QR Emotions. Si ce n'est pas vous, vous pouvez l'ignorer, ou utiliser le lien de gestion pour supprimer le message.",
  ].join("\n");

  const html = `
<div style="background:#f7f7f9;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0em;text-transform:uppercase;color:#8b5cf6;">QR Emotions</p>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0a0a0c;">Votre message${escapeHtml(forWhom)} est prêt</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3a3a42;">
      Voici votre lien de gestion : il vous permet de modifier, désactiver ou supprimer votre message à tout moment.
    </p>

    <a href="${escapeHtml(manageUrl)}" style="display:inline-block;background:#8b5cf6;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 28px;border-radius:999px;">Gérer mon message</a>

    <p style="margin:24px 0 6px;font-size:12px;color:#6b6b75;">Si le bouton ne fonctionne pas, copiez ce lien :</p>
    <p style="margin:0;font-size:12px;line-height:1.5;color:#3a3a42;word-break:break-all;">${escapeHtml(manageUrl)}</p>

    <div style="margin:28px 0;padding:16px;background:#fff8e6;border-radius:12px;font-size:13px;line-height:1.6;color:#5a4410;">
      <strong>Gardez cet email précieusement.</strong> Toute personne qui possède ce lien peut modifier ou supprimer votre message. Ne le partagez pas : partagez uniquement le lien public ou le QR Code.
    </div>

    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0a0a0c;">Lien public (celui du QR Code)</p>
    <p style="margin:0 0 20px;font-size:13px;line-height:1.5;color:#3a3a42;word-break:break-all;">${escapeHtml(publicUrl)}</p>

    <p style="margin:0 0 20px;font-size:13px;color:#6b6b75;">${escapeHtml(expiryLine)}</p>

    <hr style="border:none;border-top:1px solid #e8e8ec;margin:24px 0;" />
    <p style="margin:0;font-size:12px;line-height:1.6;color:#a8a8b3;">
      Vous recevez cet email parce que cette adresse a été saisie lors de la création d'un message sur QR Emotions. Si ce n'est pas vous, vous pouvez l'ignorer, ou utiliser le lien de gestion pour supprimer le message.
    </p>
  </div>
</div>`;

  return { subject, html, text };
}

/**
 * Envoie le lien de gestion au créateur du message.
 * Ne lève JAMAIS d'erreur : si l'envoi échoue, le message existe déjà et
 * doit rester utilisable. On renvoie simplement { sent: false } pour que
 * l'interface puisse prévenir l'utilisateur.
 */
export async function sendManagementEmail(
  params: ManagementEmailParams
): Promise<{ sent: boolean }> {
  try {
    const siteUrl = process.env.SITE_URL?.replace(/\/+$/, "");
    const from = process.env.EMAIL_FROM;

    if (!siteUrl || !from) {
      throw new Error("SITE_URL ou EMAIL_FROM manquant.");
    }

    const publicUrl = `${siteUrl}/m/${params.slug}`;
    const manageUrl = `${siteUrl}/gerer/${params.slug}?token=${encodeURIComponent(params.ownerToken)}`;

    const { subject, html, text } = buildEmail({
      manageUrl,
      publicUrl,
      recipientFirstName: params.recipientFirstName,
      expiresAt: params.expiresAt,
    });

    await getTransporter().sendMail({ from, to: params.to, subject, html, text });
    return { sent: true };
  } catch (error) {
    // On ne journalise que le message d'erreur : jamais le lien ni le jeton
    console.error(
      "Échec de l'envoi de l'email de gestion :",
      error instanceof Error ? error.message : "erreur inconnue"
    );
    return { sent: false };
  }
}