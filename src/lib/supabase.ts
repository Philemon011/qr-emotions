import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté navigateur/lecture publique, utilisant la clé
 * "anon". Les policies RLS de la table `messages` s'appliquent
 * automatiquement avec ce client (voir migration) — il ne peut lire que
 * les messages actifs et non expirés, et n'a aucun droit d'écriture.
 *
 * Pour les opérations d'écriture (création, désactivation), utiliser
 * `supabaseAdmin` (src/lib/supabase-admin.ts) exclusivement dans des
 * routes API côté serveur — jamais ce client-ci.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);