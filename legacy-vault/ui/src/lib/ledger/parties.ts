/** Maps demo UI logins ↔ ledger party display names (CONTRACT_SPEC.md). */

import { createDevAccessToken } from '@/lib/ledger/auth'

export const SESSION_TO_LEDGER_PARTY: Record<string, string> = {
  'sarah.m': 'Testator_Sarah',
  'alex.h': 'Heir_Alex',
  'oracle@lawfirm': 'Oracle_Sterling',
  'admin@legacyvault': 'Admin_Trust',
}

export const LEDGER_PARTY_LABELS: Record<string, string> = {
  Testator_Sarah: 'Sarah Mitchell',
  Heir_Alex: 'Alex Henderson',
  Heir_Maya: 'Maya Mitchell',
  Oracle_Sterling: 'Sterling & Co.',
  Admin_Trust: 'Trust Admin',
}

const LEDGER_DISPLAY_TO_SESSION: Record<string, string> = {
  Testator_Sarah: 'sarah.m',
  Heir_Alex: 'alex.h',
  Heir_Maya: 'heir.maya',
  Oracle_Sterling: 'oracle@lawfirm',
  Admin_Trust: 'admin@legacyvault',
}

export function ledgerPartyForSession(sessionUserId: string): string | undefined {
  return SESSION_TO_LEDGER_PARTY[sessionUserId.trim().toLowerCase()]
}

export function sessionIdForLedgerParty(partyId: string, partyLabels: PartyDirectory): string {
  const display = partyLabels.displayNameById[partyId]
  if (display && LEDGER_DISPLAY_TO_SESSION[display]) {
    return LEDGER_DISPLAY_TO_SESSION[display]
  }
  if (partyId.includes('::')) {
    const hint = partyId.split('::')[0]
    for (const [name, sessionId] of Object.entries(LEDGER_DISPLAY_TO_SESSION)) {
      if (hint.toLowerCase().includes(name.toLowerCase().replace(/_/g, ''))) {
        return sessionId
      }
    }
  }
  return partyId
}

export function labelForLedgerParty(partyId: string, partyLabels: PartyDirectory): string {
  const display = partyLabels.displayNameById[partyId]
  if (display && LEDGER_PARTY_LABELS[display]) return LEDGER_PARTY_LABELS[display]
  return display ?? partyId
}

export interface PartyDirectory {
  idByDisplayName: Record<string, string>
  displayNameById: Record<string, string>
}

let cachedParties: PartyDirectory | null = null

export async function fetchPartyDirectory(
  httpBaseUrl: string,
  token: string,
): Promise<PartyDirectory> {
  const base = httpBaseUrl.replace(/\/$/, '')
  const res = await fetch(`${base}/v1/parties`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new Error(`Failed to list parties (${res.status})`)
  }
  const body = (await res.json()) as {
    result?: Array<{ identifier: string; displayName?: string }>
  }
  const idByDisplayName: Record<string, string> = {}
  const displayNameById: Record<string, string> = {}
  for (const row of body.result ?? []) {
    if (row.displayName) {
      idByDisplayName[row.displayName] = row.identifier
      displayNameById[row.identifier] = row.displayName
    }
  }
  cachedParties = { idByDisplayName, displayNameById }
  return cachedParties
}

/** Resolve demo display name → full ledger party id (required for JSON API actAs). */
export async function resolveLedgerPartyId(
  ledgerPartyDisplayName: string,
  httpBaseUrl: string,
): Promise<string> {
  const cached = getCachedPartyDirectory()
  const fromCache = cached?.idByDisplayName[ledgerPartyDisplayName]
  if (fromCache) return fromCache

  const bootstrapToken = await createDevAccessToken(ledgerPartyDisplayName)
  const directory = await fetchPartyDirectory(httpBaseUrl, bootstrapToken)
  const resolved = directory.idByDisplayName[ledgerPartyDisplayName]
  if (!resolved) {
    throw new Error(`Ledger party not found: ${ledgerPartyDisplayName}`)
  }
  return resolved
}

export function getCachedPartyDirectory(): PartyDirectory | null {
  return cachedParties
}
