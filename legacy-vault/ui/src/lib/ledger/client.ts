import Ledger from '@daml/ledger'
import { createDevAccessToken } from '@/lib/ledger/auth'
import { damlJsonApiUrl, damlLedgerHttpUrl } from '@/lib/ledger/config'
import { resolveLedgerPartyId } from '@/lib/ledger/parties'

// Vite's CJS→ESM interop can expose the real constructor under `.default`.
const LedgerCtor = ((Ledger as unknown as { default?: unknown }).default ?? Ledger) as new (opts: {
  token: string
  httpBaseUrl: string
}) => Ledger

const ledgerCache = new Map<string, Promise<Ledger>>()

export async function getLedgerForParty(ledgerPartyDisplayName: string): Promise<Ledger> {
  const existing = ledgerCache.get(ledgerPartyDisplayName)
  if (existing) return existing

  const promise = resolveLedgerPartyId(ledgerPartyDisplayName, damlJsonApiUrl).then(
    async (partyId) => {
      const token = await createDevAccessToken(partyId)
      return new LedgerCtor({
        token,
        httpBaseUrl: damlLedgerHttpUrl,
      })
    },
  )
  ledgerCache.set(ledgerPartyDisplayName, promise)
  return promise
}

export function clearLedgerCache(): void {
  ledgerCache.clear()
}
