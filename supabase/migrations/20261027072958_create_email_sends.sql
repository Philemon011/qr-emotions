-- Journal des envois d'emails de gestion, utilisé uniquement pour limiter
-- les abus (plafond par adresse email et par IP). On ne stocke jamais l'IP
-- ni l'email en clair : seulement des empreintes SHA-256 salées côté serveur.
create table email_sends (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ip_hash text not null,
  email_hash text not null
);

-- Index pour compter rapidement les envois récents par IP et par email
create index email_sends_ip_idx on email_sends (ip_hash, created_at desc);
create index email_sends_email_idx on email_sends (email_hash, created_at desc);

-- ============================================
-- SÉCURITÉ
-- ============================================

alter table email_sends enable row level security;

-- Aucune policy : ni le rôle anon ni les utilisateurs authentifiés ne
-- peuvent lire ou écrire cette table. Seules les routes API serveur
-- (clé service_role, qui contourne RLS) y ont accès.
revoke all on email_sends from anon, authenticated;