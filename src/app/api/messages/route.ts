import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getOccasion, getTheme } from "@/lib/occasions";
import {
  MAX_BODY_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SIGNATURE_LENGTH,
  EXPIRATION_OPTIONS,
} from "@/lib/validation";
import { sendManagementEmail } from "@/lib/email";
import { reserveEmailSend } from "@/lib/email-rate-limit";

/**
 * POST /api/messages
 * Seule porte d'entrée pour créer un message (jamais directement depuis
 * le navigateur). Toutes les entrées sont validées ici, côté serveur.
 *
 * L'email de secours est une option "au mieux" : le message est d'abord
 * créé et enregistré, PUIS on tente l'envoi. Quoi qu'il arrive avec
 * l'email (plafond atteint, SMTP en panne), le message existe et le
 * créateur reçoit son lien de gestion à l'écran.
 */

// Alphabet sans caractères ambigus (pas de 0/O, 1/l/I)
const generateSlug = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 10);
const generateOwnerToken = customAlphabet(
  "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ",
  32
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254; // limite standard d'une adresse email

/** Résultat de la tentative d'envoi, renvoyé à l'interface. */
type EmailStatus = "not_requested" | "sent" | "failed" | "rate_limited";

/** Ne garde qu'une vraie chaîne de caractères : tout autre type JSON est ignoré. */
const asString = (value: unknown) => (typeof value === "string" ? value : undefined);

export async function POST(request: NextRequest) {
  // --- Lecture du corps de la requête ---
  let raw: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Corps invalide");
    }
    raw = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const occasionSlug = asString(raw.occasionSlug);
  const themeSlug = asString(raw.themeSlug);
  const recipientFirstName = asString(raw.recipientFirstName);
  const body = asString(raw.body);
  const signature = asString(raw.signature);
  const email = asString(raw.creatorEmail)?.trim() || undefined;
  const expiresInDays = raw.expiresInDays;

  // --- Validation de l'occasion et du thème ---
  if (!occasionSlug || !themeSlug) {
    return NextResponse.json({ error: "Occasion et thème requis." }, { status: 400 });
  }
  const occasion = getOccasion(occasionSlug);
  const theme = occasion ? getTheme(occasionSlug, themeSlug) : undefined;
  if (!occasion || !theme) {
    return NextResponse.json({ error: "Occasion ou thème invalide." }, { status: 400 });
  }

  // --- Validation du message ---
  const trimmedBody = (body ?? "").trim();
  if (trimmedBody.length === 0) {
    return NextResponse.json({ error: "Le message ne peut pas être vide." }, { status: 400 });
  }
  if (trimmedBody.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "Message trop long." }, { status: 400 });
  }

  // --- Validation des champs optionnels ---
  if (recipientFirstName && recipientFirstName.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Prénom trop long." }, { status: 400 });
  }
  if (signature && signature.length > MAX_SIGNATURE_LENGTH) {
    return NextResponse.json({ error: "Signature trop longue." }, { status: 400 });
  }
  if (email && (email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email))) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  // --- Validation de la durée d'expiration ---
  const allowedDays: (number | null)[] = EXPIRATION_OPTIONS.map((o) => o.value);
  if (
    expiresInDays !== undefined &&
    expiresInDays !== null &&
    (typeof expiresInDays !== "number" || !allowedDays.includes(expiresInDays))
  ) {
    return NextResponse.json({ error: "Durée d'expiration invalide." }, { status: 400 });
  }
  const expiresAt =
    typeof expiresInDays === "number"
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

  // --- Création du message ---
  const slug = generateSlug();
  const ownerToken = generateOwnerToken();

  const { error } = await supabaseAdmin.from("messages").insert({
    slug,
    owner_token: ownerToken,
    occasion_slug: occasionSlug,
    theme_slug: themeSlug,
    recipient_first_name: recipientFirstName?.trim() || null,
    body: trimmedBody,
    signature: signature?.trim() || null,
    creator_email: email ?? null,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Erreur d'insertion Supabase:", error.message);
    return NextResponse.json({ error: "Erreur lors de la création du message." }, { status: 500 });
  }

  // --- Email de secours (au mieux, n'empêche jamais la création) ---
  let emailStatus: EmailStatus = "not_requested";

  if (email) {
    const reservation = await reserveEmailSend(request, email);

    if (!reservation.allowed) {
      // "unavailable" = problème technique de notre côté ; sinon plafond atteint
      emailStatus = reservation.reason === "unavailable" ? "failed" : "rate_limited";
    } else {
      const { sent } = await sendManagementEmail({
        to: email,
        slug,
        ownerToken,
        recipientFirstName: recipientFirstName?.trim() || null,
        expiresAt,
      });
      emailStatus = sent ? "sent" : "failed";
    }
  }

  return NextResponse.json({
    slug,
    ownerToken,
    expiresAt,
    emailStatus,
    publicUrl: `/m/${slug}`,
    manageUrl: `/gerer/${slug}?token=${ownerToken}`,
  });
}