import type { LedgerVaultSnapshot, UserRole, VaultRecord } from '../../ledger/types.js'
import type { SessionUser } from '../../auth/users.js'
import type { AssistantCitation } from '../types.js'
import {
  type AuthorizedAssistantContext,
  type DocumentChunk,
  type DocumentRecord,
  authorizedDocumentIds,
  filterAuthorizedDocuments,
} from './retrieval.js'
import { buildLedgerContextSummary, validateUserMessage } from './safety.js'

export interface AssembleContextInput {
  user: SessionUser
  snapshot: LedgerVaultSnapshot | null
  vaultId?: string
  documents?: DocumentRecord[]
  chunks?: DocumentChunk[]
}

function selectVault(snapshot: LedgerVaultSnapshot | null, vaultId?: string): VaultRecord | null {
  if (!snapshot?.vaults.length) return null
  if (vaultId) {
    return snapshot.vaults.find((vault) => vault.id === vaultId) ?? snapshot.vaults[0] ?? null
  }
  return snapshot.vaults[0] ?? null
}

function buildLedgerCitations(vault: VaultRecord): AssistantCitation[] {
  const citations: AssistantCitation[] = [
    { label: vault.id, source: `Canton vault: ${vault.name}` },
  ]
  for (const asset of vault.assets.slice(0, 3)) {
    citations.push({ label: asset.tokenId, source: `Tokenized asset: ${asset.name}` })
  }
  return citations
}

/**
 * Assembles the authorized context package passed to LLM/RAG providers.
 * Canton snapshot is assumed role-scoped before this function is called.
 */
export function assembleAuthorizedContext(input: AssembleContextInput): AuthorizedAssistantContext {
  const { user, snapshot, vaultId, documents = [], chunks = [] } = input
  const vault = selectVault(snapshot, vaultId)
  const visibleVaultIds = snapshot?.vaults.map((v) => v.id) ?? []

  const authorizedDocs = filterAuthorizedDocuments(user, documents, visibleVaultIds)
  const authorizedIds = new Set(authorizedDocs.map((doc) => doc.id))
  const authorizedChunks = chunks.filter((chunk) => authorizedIds.has(chunk.documentId))

  return {
    user,
    vaultId: vault?.id ?? vaultId,
    ledgerCitations: vault ? buildLedgerCitations(vault) : [],
    documentChunks: authorizedChunks,
    ledgerContextSummary: buildLedgerContextSummary(user.role, vault),
  }
}

export function visibleVaultIdsForSnapshot(snapshot: LedgerVaultSnapshot | null): string[] {
  return snapshot?.vaults.map((vault) => vault.id) ?? []
}

export { authorizedDocumentIds, filterAuthorizedDocuments }
