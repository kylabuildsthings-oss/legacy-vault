import { type ApiConfig, config } from '../config.js'
import { createDamlAccessToken } from './auth.js'
import { resolveLedgerPartyId } from './parties.js'

export interface LedgerClientContext {
  displayName: string
  partyId: string
  token: string
}

export async function createLedgerClientContext(
  ledgerPartyDisplayName: string,
  appConfig: ApiConfig = config,
): Promise<LedgerClientContext> {
  const partyId = await resolveLedgerPartyId(ledgerPartyDisplayName, appConfig)

  return {
    displayName: ledgerPartyDisplayName,
    partyId,
    token: createDamlAccessToken(partyId, appConfig),
  }
}

export async function damlJsonApiRequest<T>(
  path: string,
  token: string,
  init: RequestInit = {},
  appConfig: ApiConfig = config,
): Promise<T> {
  const base = appConfig.DAML_JSON_API.replace(/\/$/, '')
  const timeoutSignal = AbortSignal.timeout(10_000)
  const response = await fetch(`${base}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    signal: init.signal ?? timeoutSignal,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Daml JSON API request failed (${response.status}): ${detail}`)
  }

  return (await response.json()) as T
}
