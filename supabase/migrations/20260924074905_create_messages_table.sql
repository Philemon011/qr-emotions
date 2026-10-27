-- Table principale des messages émotionnels.
-- Le owner_token permet au créateur de gérer son message sans compte
-- (voir discussion produit : plan à 3 niveaux pour ne jamais le perdre).
create table messages (
  id uuid primary key default gen_random_uuid(),

  -- Identifiant public, utilisé dans l'URL du message (/m/<slug>).
  -- Généré côté serveur avec nanoid, assez long pour ne pas être devinable.
  slug text unique not null,

  -- Jeton secret donné uniquement au créateur, pour désactiver/modifier
  -- son message plus tard. Ne doit JAMAIS être exposé publiquement.
  owner_token text unique not null,

  occasion_slug text not null,
  theme_slug text not null,

  recipient_first_name text,
  body text not null,
  signature text,

  -- Email optionnel du créateur, uniquement pour lui envoyer son lien
  -- de gestion en secours (jamais utilisé à d'autres fins).
  creator_email text,

  created_at timestamptz not null default now(),

  -- Reste NULL par défaut : aucune expiration automatique surprise.
  expires_at timestamptz,

  -- Désactivation douce (jamais de suppression physique de la ligne).
  disabled boolean not null default false
);

create index messages_slug_idx on messages (slug);
create index messages_owner_token_idx on messages (owner_token);

-- ============================================
-- SÉCURITÉ — Row Level Security
-- ============================================

alter table messages enable row level security;

-- Lecture publique autorisée UNIQUEMENT pour un message actif et non
-- expiré — c'est ce qui permet la page publique /m/[slug] de fonctionner
-- avec la clé anon, sans jamais exposer les messages désactivés/expirés.
create policy "Public can read active messages"
  on messages for select
  using (
    disabled = false
    and (expires_at is null or expires_at > now())
  );

-- Aucune policy d'insertion/modification/suppression pour le rôle anon :
-- ces opérations passeront exclusivement par des routes API côté serveur,
-- authentifiées avec la clé service_role (jamais exposée au navigateur).