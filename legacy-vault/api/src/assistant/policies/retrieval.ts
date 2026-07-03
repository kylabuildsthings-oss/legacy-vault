import type { SessionUser } from '../../auth/users.js'
import type { UserRole } from '../../ledger/types.js'
import type { AssistantCitation } from '../types.js'

/** Document row shape for retrieval policy (matches document_metadata + future ACL columns). */
export interface DocumentRecord {
  id: string
  ownerUserId: string
  ledgerVaultId?: string | null
  fileName: string
  mimeType: string
  /** Future migration: explicit role ACL on uploaded files. */
  visibleToRoles?: UserRole[]
  /** Future migration: e.g. will, beneficiary_summary, oracle_verification_packet */
  documentType?: string
}

export interface DocumentChunk {
  documentId: string
  fileName: string
  excerpt: string
  vaultId?: string
}

export interface AuthorizedAssistantContext {
  user: SessionUser
  vaultId?: string
  ledgerCitations: AssistantCitation[]
  documentChunks: DocumentChunk[]
  /** Reduced ledger fields safe to include in an LLM prompt for this role. */
  ledgerContextSummary: string
}

/** Which roles may retrieve documents for a vault they can see on Canton. */
export const ROLE_DOCUMENT_ACCESS: Record<
  UserRole,
  {
    canRetrieveDocuments: boolean
    allowedDocumentTypes: string[] | 'all_owned_or_vault_scoped'
    description: string
  }
> = {
  hnwi: {
    canRetrieveDocuments: true,
    allowedDocumentTypes: 'all_owned_or_vault_scoped',
    description: 'Testator may retrieve their own uploads and vault-linked wills/RWA docs.',
  },
  heir: {
    canRetrieveDocuments: true,
    allowedDocumentTypes: ['beneficiary_summary', 'allocation_notice', 'payout_instruction'],
    description:
      'Heirs retrieve only beneficiary-facing documents — never full testator wills or other heirs.',
  },
  oracle: {
    canRetrieveDocuments: true,
    allowedDocumentTypes: ['oracle_verification_packet', 'release_trigger', 'death_certificate'],
    description: 'Oracle retrieves workflow/legal verification docs — not asset registry detail.',
  },
  admin: {
    canRetrieveDocuments: true,
    allowedDocumentTypes: ['compliance_summary', 'audit_export', 'vault_overview'],
    description: 'Admin retrieves oversight/compliance metadata — not privileged legal content by default.',
  },
}

function documentMatchesRolePolicy(document: DocumentRecord, role: UserRole): boolean {
  const policy = ROLE_DOCUMENT_ACCESS[role]
  if (!policy.canRetrieveDocuments) return false

  if (document.visibleToRoles?.length) {
    return document.visibleToRoles.includes(role)
  }

  if (policy.allowedDocumentTypes === 'all_owned_or_vault_scoped') {
    return true
  }

  if (!document.documentType) {
    return role === 'hnwi'
  }

  return policy.allowedDocumentTypes.includes(document.documentType)
}

/**
 * Filters document metadata to rows the session user is allowed to retrieve.
 * Must be called with documents already scoped to visible ledger vault IDs.
 */
export function filterAuthorizedDocuments(
  user: SessionUser,
  documents: DocumentRecord[],
  visibleVaultIds: string[],
): DocumentRecord[] {
  const visibleSet = new Set(visibleVaultIds)

  return documents.filter((document) => {
    if (document.ledgerVaultId) {
      if (!visibleSet.has(document.ledgerVaultId)) return false
    } else if (document.ownerUserId !== user.id) {
      return false
    }

    return documentMatchesRolePolicy(document, user.role)
  })
}

export function authorizedDocumentIds(
  user: SessionUser,
  documents: DocumentRecord[],
  visibleVaultIds: string[],
): string[] {
  return filterAuthorizedDocuments(user, documents, visibleVaultIds).map((doc) => doc.id)
}
