-- Restreint l'accès en lecture publique (rôle anon) aux seules colonnes
-- non sensibles. Même si la policy RLS autorise la lecture de la LIGNE
-- d'un message actif, ceci empêche la lecture des colonnes owner_token
-- et creator_email par ce rôle, quelle que soit la requête envoyée.
revoke select on messages from anon;

grant select (
  slug,
  occasion_slug,
  theme_slug,
  recipient_first_name,
  body,
  signature,
  created_at,
  expires_at,
  disabled
) on messages to anon;