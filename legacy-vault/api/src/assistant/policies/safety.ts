import type { UserRole } from '../../ledger/types.js'
import type { VaultRecord } from '../../ledger/types.js'

/** Patterns that must not be executed from chat — use explicit UI actions instead. */
const BLOCKED_MUTATION_PHRASES = [
  'confirm release',
  'initiate verification',
  'transfer asset',
  'revoke vault',
  'delete vault',
  'sign transaction',
  'execute payout',
] as const

export interface MessageSafetyResult {
  allowed: boolean
  reason?: string
}

export function validateUserMessage(message: string): MessageSafetyResult {
  const normalized = message.toLowerCase().trim()

  for (const phrase of BLOCKED_MUTATION_PHRASES) {
    if (normalized.includes(phrase)) {
      return {
        allowed: false,
        reason: `Use the product UI for "${phrase}" actions — the assistant cannot execute ledger mutations from chat.`,
      }
    }
  }

  if (normalized.length > 4_000) {
    return { allowed: false, reason: 'Message exceeds maximum length.' }
  }

  return { allowed: true }
}

/** Fields each role may see in an LLM prompt derived from Canton snapshot. */
const ROLE_LEDGER_FIELDS: Record<UserRole, Array<keyof VaultRecord | 'heirs' | 'assets'>> = {
  hnwi: ['id', 'name', 'jurisdiction', 'status', 'releaseStatus', 'heirs', 'assets'],
  heir: ['id', 'name', 'releaseStatus', 'heirs', 'assets'],
  oracle: ['id', 'name', 'releaseStatus'],
  admin: ['id', 'name', 'jurisdiction', 'status', 'releaseStatus', 'testatorName'],
}

export function buildLedgerContextSummary(role: UserRole, vault: VaultRecord | null): string {
  if (!vault) {
    return 'No vault visible to this role in the current Canton session.'
  }

  const allowed = new Set(ROLE_LEDGER_FIELDS[role])
  const parts: string[] = [`Vault ${vault.id}: ${vault.name}`]

  if (allowed.has('jurisdiction')) parts.push(`Jurisdiction: ${vault.jurisdiction}`)
  if (allowed.has('status')) parts.push(`Status: ${vault.status}`)
  if (allowed.has('releaseStatus')) parts.push(`Release: ${vault.releaseStatus ?? 'idle'}`)
  if (allowed.has('testatorName')) parts.push(`Testator: ${vault.testatorName}`)

  if (allowed.has('heirs') && vault.heirs.length) {
    parts.push(
      `Heirs: ${vault.heirs.map((h) => `${h.name} (${h.allocationLabel})`).join('; ')}`,
    )
  }

  if (allowed.has('assets') && vault.assets.length) {
    const assetSummary =
      role === 'oracle'
        ? `${vault.assets.length} tokenized assets (registry detail withheld for oracle role)`
        : vault.assets
            .map((a) => `${a.name} [${a.tokenId}] → ${a.intendedHeirLabel}`)
            .join('; ')
    parts.push(`Assets: ${assetSummary}`)
  }

  return parts.join('. ')
}

export interface ResponseSafetyResult {
  ok: boolean
  reason?: string
}

/** Post-generation checks before returning an LLM answer to the client. */
export function validateAssistantResponse(
  message: string,
  citationCount: number,
): ResponseSafetyResult {
  if (!message.trim()) {
    return { ok: false, reason: 'Empty assistant response.' }
  }

  if (message.length > 12_000) {
    return { ok: false, reason: 'Assistant response exceeds maximum length.' }
  }

  if (citationCount === 0 && message.length > 500) {
    return {
      ok: false,
      reason: 'Long responses must include citations to ledger or document sources.',
    }
  }

  return { ok: true }
}

export const ASSISTANT_SAFETY_RULES = {
  noLedgerMutationsFromChat: true,
  requireCitationsForLongAnswers: true,
  maxUserMessageLength: 4_000,
  maxAssistantResponseLength: 12_000,
  logPromptsInProduction: false,
  fallbackOnProviderError: true,
} as const
