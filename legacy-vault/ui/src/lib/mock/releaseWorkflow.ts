import type { LedgerEntry, ReleaseStatus, SecurityEvent, VaultRecord } from '@/lib/mock/types'

const STORAGE_KEY = 'legacy-vault-release-overrides'

export function readReleaseOverrides(): Record<string, ReleaseStatus> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, ReleaseStatus>
  } catch {
    return {}
  }
}

export function writeReleaseOverrides(overrides: Record<string, ReleaseStatus>) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export function clearReleaseOverrides() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getEffectiveReleaseStatus(
  vault: Pick<VaultRecord, 'id' | 'releaseStatus'>,
  overrides: Record<string, ReleaseStatus>,
): ReleaseStatus {
  return overrides[vault.id] ?? vault.releaseStatus ?? 'idle'
}

export function buildReleaseLedgerEntries(
  vaultId: string,
  vaultName: string,
  releaseStatus: ReleaseStatus,
): LedgerEntry[] {
  if (releaseStatus !== 'release_triggered') return []

  return [
    {
      id: `led-release-${vaultId}`,
      timestamp: 'Just now',
      vaultId,
      vaultName,
      action: 'Release trigger confirmed — atomic settlement queued',
      status: 'verified',
      viewerIds: ['sarah.m', 'alex.h', 'oracle@lawfirm', 'admin@legacyvault'],
    },
    {
      id: `led-payout-${vaultId}`,
      timestamp: 'Just now',
      vaultId,
      vaultName,
      action: 'Beneficiary payout — Alex Henderson — pending',
      status: 'pending',
      viewerIds: ['sarah.m', 'alex.h', 'admin@legacyvault'],
    },
  ]
}

export function buildReleaseSecurityEvents(
  vaultId: string,
  vaultName: string,
  releaseStatus: ReleaseStatus,
): SecurityEvent[] {
  if (releaseStatus !== 'release_triggered') return []

  return [
    {
      id: `sec-release-${vaultId}`,
      timestamp: 'Just now',
      eventType: 'Release Trigger Confirmed',
      targetAsset: vaultName,
      vaultId,
      integrityStatus: 'verified',
      viewerIds: ['oracle@lawfirm', 'sarah.m', 'admin@legacyvault'],
    },
    {
      id: `sec-settlement-${vaultId}`,
      timestamp: 'Just now',
      eventType: 'Atomic Settlement Queued',
      targetAsset: vaultName,
      vaultId,
      integrityStatus: 'verified',
      viewerIds: ['sarah.m', 'alex.h', 'oracle@lawfirm', 'admin@legacyvault'],
    },
  ]
}

export function heirPayoutLabel(vault: VaultRecord, heirId: string): string | null {
  const heir = vault.heirs.find((h) => h.id === heirId)
  if (!heir) return null
  const match = heir.allocationLabel.match(/(\d+)%/)
  const pct = match ? Number(match[1]) / 100 : 0.4
  const amount = vault.totalValueNumeric * pct
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  return `$${amount.toLocaleString()}`
}
