create extension if not exists pgcrypto;

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_type text not null check (organization_type in ('trust_company', 'law_firm', 'family_office')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id text primary key,
  organization_id uuid references organizations(id) on delete set null,
  display_name text not null,
  role text not null check (role in ('hnwi', 'heir', 'oracle', 'admin')),
  ledger_party_display_name text,
  ledger_party_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vault_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id text not null references users(id) on delete cascade,
  name text not null,
  jurisdiction text not null,
  status text not null default 'draft' check (status in ('draft', 'ready_for_ledger', 'submitted', 'cancelled')),
  draft_payload jsonb not null default '{}'::jsonb,
  ledger_vault_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists document_metadata (
  id uuid primary key default gen_random_uuid(),
  vault_draft_id uuid references vault_drafts(id) on delete cascade,
  ledger_vault_id text,
  owner_user_id text not null references users(id) on delete cascade,
  file_name text not null,
  mime_type text not null,
  storage_uri text not null,
  checksum_sha256 text,
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id text references users(id) on delete set null,
  organization_id uuid references organizations(id) on delete set null,
  event_type text not null,
  target_type text not null,
  target_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists assistant_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users(id) on delete cascade,
  vault_draft_id uuid references vault_drafts(id) on delete set null,
  ledger_vault_id text,
  title text not null default 'Archival Assistant conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assistant_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references assistant_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists users_role_idx on users(role);
create index if not exists vault_drafts_owner_idx on vault_drafts(owner_user_id);
create index if not exists document_metadata_owner_idx on document_metadata(owner_user_id);
create index if not exists audit_events_target_idx on audit_events(target_type, target_id);
create index if not exists assistant_conversations_user_idx on assistant_conversations(user_id);
