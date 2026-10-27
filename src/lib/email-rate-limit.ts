import "server-only";
import { createHmac } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Plafonds d'envoi de l'email de gestion, pour éviter qu'on utilise le
 * compte Gmail du projet pour spammer des inconnus.
 * - Par adresse email : 5 envois / 24 h (protection principale)
 * - Par IP : 20 envois / 1 h (large, car beaucoup d'utilisateurs mobiles
 *   partagent la même IP publique)
 * Aucune IP ni adresse n'est stockée en clair : seulement un HMAC.
 */

const EMAIL_LIMIT = 5;
const EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;
const IP_LIMIT = 20;
const IP_WINDOW_MS = 60 * 60 * 1000;

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "email_limit" | "ip_limit" | "unavailable" };

/** Empreinte HMAC-SHA256 avec la clé secrète du serveur. */
function hmac(value: string) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("RATE_LIMIT_SECRET manquant.");
  return createHmac("sha256", secret).update(value).digest("hex");
}

/**
 * Normalise une adresse pour qu'on ne contourne pas le plafond avec des
 * variantes qui arrivent dans la même boîte : casse, sous-adresses
 * (+quelquechose) et points dans les adresses Gmail.
 */
export function normalizeEmail(email: string) {
  const cleaned = email.trim().toLowerCase();
  const [rawLocal, rawDomain] = cleaned.split("@");
  if (!rawLocal || !rawDomain) return cleaned;

  let local = rawLocal.split("+")[0] || rawLocal;
  let domain = rawDomain;
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") local = local.replace(/\./g, "");
  return `${local}@${domain}`;
}

/**
 * Adresse IP du visiteur. Derrière un hébergeur comme Vercel, l'en-tête
 * x-forwarded-for est posé par l'infrastructure. Si l'IP est introuvable
 * ou falsifiable, la limite par email reste la vraie protection.
 */
export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Extrait un message lisible d'une erreur (celles de Supabase ne sont pas des instances d'Error). */
function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "erreur inconnue";
}

/** Compte les envois récents associés à une empreinte, sur une fenêtre donnée. */
async function countSince(column: "ip_hash" | "email_hash", hash: string, windowMs: number) {
  const since = new Date(Date.now() - windowMs).toISOString();
  const { count, error } = await supabaseAdmin
    .from("email_sends")
    .select("id", { count: "exact", head: true })
    .eq(column, hash)
    .gte("created_at", since);

  if (error) throw error;
  return count ?? 0;
}

/**
 * Vérifie les plafonds ET réserve un envoi en une seule étape : la ligne
 * est insérée AVANT l'envoi réel, pour que deux requêtes simultanées ne
 * passent pas toutes les deux. Un envoi qui échoue ensuite compte quand
 * même, ce qui évite qu'on martèle le serveur avec des tentatives.
 *
 * En cas de problème technique (base injoignable, clé manquante), on
 * REFUSE l'envoi plutôt que de le laisser passer : le message est créé
 * quand même, seul l'email est sacrifié.
 */
export async function reserveEmailSend(request: Request, email: string): Promise<RateLimitResult> {
  try {
    const ipHash = hmac(`ip:${getClientIp(request)}`);
    const emailHash = hmac(`email:${normalizeEmail(email)}`);

    const [emailCount, ipCount] = await Promise.all([
      countSince("email_hash", emailHash, EMAIL_WINDOW_MS),
      countSince("ip_hash", ipHash, IP_WINDOW_MS),
    ]);

    if (emailCount >= EMAIL_LIMIT) return { allowed: false, reason: "email_limit" };
    if (ipCount >= IP_LIMIT) return { allowed: false, reason: "ip_limit" };

    const { error } = await supabaseAdmin
      .from("email_sends")
      .insert({ ip_hash: ipHash, email_hash: emailHash });

    if (error) throw error;
    return { allowed: true };
  } catch (error) {
    console.error("Vérification du plafond d'envois impossible :", errorMessage(error));
    return { allowed: false, reason: "unavailable" };
  }
}