import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé service_role — a tous les droits (bypasse
 * les policies RLS), donc NE DOIT JAMAIS être importé dans un composant
 * client ni exposé au navigateur. Le package "server-only" fait planter
 * le build si ce fichier est accidentellement importé côté client, par
 * sécurité supplémentaire.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);