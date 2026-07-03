import type { UserRole } from '@/lib/auth'
import { apiJson } from '@/lib/api/client'
import type { LedgerEntry, SecurityEvent, VaultRecord } from '@/lib/mock/types'

export interface LedgerVaultSnapshot {
  vaults: VaultRecord[]
  ledgerEntries: LedgerEntry[]
  securityEvents: SecurityEvent[]
}

export async function fetchLedgerSnapshot(
  role: UserRole,
  sessionUserId: string,
): Promise<LedgerVaultSnapshot> {
  void role
  void sessionUserId
  const body = await apiJson<{ result: LedgerVaultSnapshot }>('/vaults')
  return body.result
}
