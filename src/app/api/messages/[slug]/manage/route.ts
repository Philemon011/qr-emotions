import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { MAX_BODY_LENGTH, MAX_NAME_LENGTH, MAX_SIGNATURE_LENGTH } from "@/lib/validation";

async function verifyOwnership(slug: string, token: string | null) {
  if (!token) return null;

  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("owner_token, occasion_slug, theme_slug, recipient_first_name, body, signature, created_at, expires_at, disabled")
    .eq("slug", slug)
    .single();

  if (error || !data || data.owner_token !== token) return null;
  return data;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = request.nextUrl.searchParams.get("token");

  const message = await verifyOwnership(slug, token);
  if (!message) {
    return NextResponse.json({ error: "Lien de gestion invalide." }, { status: 403 });
  }

  const { owner_token, ...safeMessage } = message;
  return NextResponse.json(safeMessage);
}

/**
 * PATCH : bascule l'état actif/désactivé ET/OU met à jour le contenu
 * du message (prénom, texte, signature). Les deux types de changement
 * peuvent être envoyés ensemble ou séparément — seuls les champs
 * présents dans le corps de la requête sont modifiés.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let body: {
    token?: string;
    disabled?: boolean;
    recipientFirstName?: string;
    messageBody?: string;
    signature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const message = await verifyOwnership(slug, body.token ?? null);
  if (!message) {
    return NextResponse.json({ error: "Lien de gestion invalide." }, { status: 403 });
  }

  const updates: Record<string, string | boolean | null> = {};

  if (typeof body.disabled === "boolean") {
    updates.disabled = body.disabled;
  }

  // Champs de contenu — uniquement si explicitement envoyés (permet un
  // simple toggle "disabled" sans devoir renvoyer tout le contenu).
  if (body.messageBody !== undefined) {
    const trimmed = body.messageBody.trim();
    if (trimmed.length === 0) {
      return NextResponse.json({ error: "Le message ne peut pas être vide." }, { status: 400 });
    }
    if (trimmed.length > MAX_BODY_LENGTH) {
      return NextResponse.json({ error: "Message trop long." }, { status: 400 });
    }
    updates.body = trimmed;
  }

  if (body.recipientFirstName !== undefined) {
    if (body.recipientFirstName.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: "Prénom trop long." }, { status: 400 });
    }
    updates.recipient_first_name = body.recipientFirstName.trim() || null;
  }

  if (body.signature !== undefined) {
    if (body.signature.length > MAX_SIGNATURE_LENGTH) {
      return NextResponse.json({ error: "Signature trop longue." }, { status: 400 });
    }
    updates.signature = body.signature.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucune modification fournie." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("messages").update(updates).eq("slug", slug);

  if (error) {
    console.error("Erreur de mise à jour Supabase:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE : suppression DÉFINITIVE du message (pas un simple disabled).
 * Irréversible — le token est vérifié comme pour toute autre opération,
 * et c'est à l'interface de forcer une confirmation stricte avant
 * d'appeler cette route (voir page de gestion : retaper "SUPPRIMER").
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const message = await verifyOwnership(slug, body.token ?? null);
  if (!message) {
    return NextResponse.json({ error: "Lien de gestion invalide." }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("messages").delete().eq("slug", slug);

  if (error) {
    console.error("Erreur de suppression Supabase:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}