import type { UserRole } from '@/lib/auth'
import type { ScopedVault, VaultRecord } from '@/lib/mock/types'

export function redactVault(
  vault: VaultRecord,
  role: UserRole,
  partyId: string,
): ScopedVault {
  const releaseStatus = vault.releaseStatus ?? 'idle'

  if (role === 'hnwi' || role === 'admin') {
    return {
      ...vault,
      visibility: 'full',
      visibleAssets: vault.assets,
      visibleHeirs: vault.heirs,
      redactedHeirCount: 0,
      releaseStatus,
    }
  }

  if (role === 'heir') {
    const ownHeir = vault.heirs.find((h) => h.id === partyId)
    const ownAssets = vault.assets.filter((a) => a.intendedHeirId === partyId)
    return {
      ...vault,
      visibility: 'allocation',
      totalValue: ownHeir ? vault.totalValue : '—',
      visibleAssets: ownAssets,
      visibleHeirs: ownHeir ? [ownHeir] : [],
      redactedHeirCount: Math.max(0, vault.heirs.length - (ownHeir ? 1 : 0)),
      releaseStatus,
    }
  }

  // oracle
  return {
    ...vault,
    visibility: 'trigger',
    totalValue: '—',
    visibleAssets: [],
    visibleHeirs: [],
    redactedHeirCount: vault.heirs.length,
    releaseStatus,
  }
}

export function vaultVisibleToRole(
  vault: VaultRecord,
  role: UserRole,
  partyId: string,
): boolean {
  switch (role) {
    case 'admin':
      return true
    case 'hnwi':
      return vault.testatorId === partyId
    case 'heir':
      return vault.heirs.some((h) => h.id === partyId)
    case 'oracle':
      return vault.oracleId === partyId
    default:
      return false
  }
}
