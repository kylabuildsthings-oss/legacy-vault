import type { QueryResultRow } from 'pg'

import { getPool } from './pool.js'

export interface OrganizationRecord extends QueryResultRow {
  id: string
  name: string
  organization_type: 'trust_company' | 'law_firm' | 'family_office'
}

export interface UserRecord extends QueryResultRow {
  id: string
  organization_id: string | null
  display_name: string
  role: 'hnwi' | 'heir' | 'oracle' | 'admin'
  ledger_party_display_name: string | null
  ledger_party_id: string | null
}

export interface VaultDraftRecord extends QueryResultRow {
  id: string
  owner_user_id: string
  name: string
  jurisdiction: string
  status: 'draft' | 'ready_for_ledger' | 'submitted' | 'cancelled'
  draft_payload: Record<string, unknown>
  ledger_vault_id: string | null
}

export interface DocumentMetadataRecord extends QueryResultRow {
  id: string
  vault_draft_id: string | null
  ledger_vault_id: string | null
  owner_user_id: string
  file_name: string
  mime_type: string
  storage_uri: string
  checksum_sha256: string | null
}

export interface AuditEventRecord extends QueryResultRow {
  id: string
  actor_user_id: string | null
  organization_id: string | null
  event_type: string
  target_type: string
  target_id: string
  metadata: Record<string, unknown>
}

export async function findUserById(userId: string): Promise<UserRecord | null> {
  const result = await getPool().query<UserRecord>('select * from users where id = $1', [userId])
  return result.rows[0] ?? null
}

export async function listOrganizations(): Promise<OrganizationRecord[]> {
  const result = await getPool().query<OrganizationRecord>(
    'select * from organizations order by created_at asc',
  )
  return result.rows
}

export async function createVaultDraft(input: {
  ownerUserId: string
  name: string
  jurisdiction: string
  draftPayload?: Record<string, unknown>
}): Promise<VaultDraftRecord> {
  const result = await getPool().query<VaultDraftRecord>(
    `insert into vault_drafts (owner_user_id, name, jurisdiction, draft_payload)
     values ($1, $2, $3, $4)
     returning *`,
    [input.ownerUserId, input.name, input.jurisdiction, input.draftPayload ?? {}],
  )
  return result.rows[0]!
}

export async function listVaultDraftsForUser(ownerUserId: string): Promise<VaultDraftRecord[]> {
  const result = await getPool().query<VaultDraftRecord>(
    'select * from vault_drafts where owner_user_id = $1 order by updated_at desc',
    [ownerUserId],
  )
  return result.rows
}

export async function createDocumentMetadata(input: {
  ownerUserId: string
  fileName: string
  mimeType: string
  storageUri: string
  vaultDraftId?: string | null
  ledgerVaultId?: string | null
  checksumSha256?: string | null
}): Promise<DocumentMetadataRecord> {
  const result = await getPool().query<DocumentMetadataRecord>(
    `insert into document_metadata (
       owner_user_id, file_name, mime_type, storage_uri, vault_draft_id, ledger_vault_id, checksum_sha256
     )
     values ($1, $2, $3, $4, $5, $6, $7)
     returning *`,
    [
      input.ownerUserId,
      input.fileName,
      input.mimeType,
      input.storageUri,
      input.vaultDraftId ?? null,
      input.ledgerVaultId ?? null,
      input.checksumSha256 ?? null,
    ],
  )
  return result.rows[0]!
}

export async function recordAuditEvent(input: {
  eventType: string
  targetType: string
  targetId: string
  actorUserId?: string | null
  organizationId?: string | null
  metadata?: Record<string, unknown>
}): Promise<AuditEventRecord> {
  const result = await getPool().query<AuditEventRecord>(
    `insert into audit_events (
       actor_user_id, organization_id, event_type, target_type, target_id, metadata
     )
     values ($1, $2, $3, $4, $5, $6)
     returning *`,
    [
      input.actorUserId ?? null,
      input.organizationId ?? null,
      input.eventType,
      input.targetType,
      input.targetId,
      input.metadata ?? {},
    ],
  )
  return result.rows[0]!
}

export async function createAssistantConversation(input: {
  userId: string
  title?: string
  vaultDraftId?: string | null
  ledgerVaultId?: string | null
}): Promise<{ id: string }> {
  const result = await getPool().query<{ id: string }>(
    `insert into assistant_conversations (user_id, title, vault_draft_id, ledger_vault_id)
     values ($1, $2, $3, $4)
     returning id`,
    [
      input.userId,
      input.title ?? 'Archival Assistant conversation',
      input.vaultDraftId ?? null,
      input.ledgerVaultId ?? null,
    ],
  )
  return result.rows[0]!
}

export async function addAssistantMessage(input: {
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  citations?: unknown[]
}): Promise<{ id: string }> {
  const result = await getPool().query<{ id: string }>(
    `insert into assistant_messages (conversation_id, role, content, citations)
     values ($1, $2, $3, $4)
     returning id`,
    [input.conversationId, input.role, input.content, input.citations ?? []],
  )
  return result.rows[0]!
}
