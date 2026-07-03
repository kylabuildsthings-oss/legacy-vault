import { type ApiConfig, config } from '../config.js'
import { createDamlAccessToken } from './auth.js'

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

export interface PartyDirectory {
  idByDisplayName: Record<string, string>
  displayNameById: Record<string, string>
}

let cachedParties: PartyDirectory | null = null

export function ledgerPartyForSession(sessionUserId: string): string | undefined {
  return SESSION_TO_LEDGER_PARTY[sessionUserId.trim().toLowerCase()]
}

export function sessionIdForLedgerParty(partyId: string, partyLabels: PartyDirectory): string {
  const display = partyLabels.displayNameById[partyId]
  const displayToSession = Object.fromEntries(
    Object.entries(SESSION_TO_LEDGER_PARTY).map(([sessionId, displayName]) => [
      displayName,
      sessionId,
    ]),
  )

  if (display && displayToSession[display]) return displayToSession[display]
  if (partyId.includes('::')) {
    const hint = partyId.split('::')[0]
    for (const [displayName, sessionId] of Object.entries(displayToSession)) {
      if (hint.toLowerCase().includes(displayName.toLowerCase().replace(/_/g, ''))) {
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

export function getCachedPartyDirectory(): PartyDirectory | null {
  return cachedParties
}

export async function fetchPartyDirectory(
  token: string,
  appConfig: ApiConfig = config,
): Promise<PartyDirectory> {
  const base = appConfig.DAML_JSON_API.replace(/\/$/, '')
  const response = await fetch(`${base}/v1/parties`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to list ledger parties (${response.status})`)
  }

  const body = (await response.json()) as {
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

/** Resolve demo display name to the full ledger party id required in actAs/readAs. */
export async function resolveLedgerPartyId(
  ledgerPartyDisplayName: string,
  appConfig: ApiConfig = config,
): Promise<string> {
  const cached = getCachedPartyDirectory()
  const fromCache = cached?.idByDisplayName[ledgerPartyDisplayName]
  if (fromCache) return fromCache

  const bootstrapToken = createDamlAccessToken(ledgerPartyDisplayName, appConfig)
  const directory = await fetchPartyDirectory(bootstrapToken, appConfig)
  const resolved = directory.idByDisplayName[ledgerPartyDisplayName]
  if (!resolved) {
    throw new Error(`Ledger party not found: ${ledgerPartyDisplayName}`)
  }

  return resolved
}

export async function resolveSessionLedgerParty(
  sessionUserId: string,
  appConfig: ApiConfig = config,
): Promise<{ displayName: string; partyId: string; label: string }> {
  const displayName = ledgerPartyForSession(sessionUserId)
  if (!displayName) {
    throw new Error(`No ledger party mapped for session user ${sessionUserId}`)
  }

  const partyId = await resolveLedgerPartyId(displayName, appConfig)
  return {
    displayName,
    partyId,
    label: LEDGER_PARTY_LABELS[displayName] ?? displayName,
  }
}

export function clearPartyDirectoryCache(): void {
  cachedParties = null
}
