import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getOccasion, getTheme } from "@/lib/occasions";
import { MAX_BODY_LENGTH, MAX_NAME_LENGTH, MAX_SIGNATURE_LENGTH, EXPIRATION_OPTIONS } from "@/lib/validation";

/**
 * POST /api/messages
 * Crée un nouveau message. C'est la SEULE porte d'entrée pour insérer
 * un message en base — jamais directement depuis le navigateur avec la
 * clé anon (qui n'a d'ailleurs aucune policy d'insertion, voir migration).
 *
 * Validations effectuées :
 * - occasion/thème doivent exister réellement (pas de valeur arbitraire)
 * - le message ne doit pas être vide, avec une longueur maximale raisonnable
 * - les champs optionnels sont bien optionnels, mais bornés en longueur
 */

// Alphabet sans caractères ambigus (pas de 0/O, 1/l/I) pour un slug
// lisible si jamais quelqu'un doit le retaper à la main.
const generateSlug = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 10);
const generateOwnerToken = customAlphabet(
  "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ",
  32
);


export async function POST(request: NextRequest) {
    let payload: {
    occasionSlug?: string;
    themeSlug?: string;
    recipientFirstName?: string;
    body?: string;
    signature?: string;
    creatorEmail?: string;
    expiresInDays?: number | null;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const { occasionSlug, themeSlug, recipientFirstName, body, signature, creatorEmail, expiresInDays } = payload;

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


     // --- Validation de la durée d'expiration ---
  const allowedDays: (number | null)[] = EXPIRATION_OPTIONS.map((o) => o.value);
  if (expiresInDays !== undefined && expiresInDays !== null && !allowedDays.includes(expiresInDays)) {
    return NextResponse.json({ error: "Durée d'expiration invalide." }, { status: 400 });
  }

  const expiresAt =
    expiresInDays != null
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

  // --- Validation des champs optionnels ---
  if (recipientFirstName && recipientFirstName.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Prénom trop long." }, { status: 400 });
  }
  if (signature && signature.length > MAX_SIGNATURE_LENGTH) {
    return NextResponse.json({ error: "Signature trop longue." }, { status: 400 });
  }
  if (creatorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creatorEmail)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

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
    creator_email: creatorEmail?.trim() || null,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Erreur d'insertion Supabase:", error);
    return NextResponse.json({ error: "Erreur lors de la création du message." }, { status: 500 });
  }

  return NextResponse.json({
    slug,
    ownerToken,
    expiresAt,
    publicUrl: `/m/${slug}`,
    manageUrl: `/gerer/${slug}?token=${ownerToken}`,
  });
}