import { useMemo } from 'react'
import type { UserRole } from '@/lib/auth'
import {
  MOCK_ADMIN_CLIENTS,
  MOCK_LEDGER,
  MOCK_SECURITY,
  MOCK_VAULTS,
  formatAum,
} from '@/lib/mock/fixtures'
import type { VaultScopeResult } from '@/lib/mock/types'
import { redactVault, vaultVisibleToRole } from '@/lib/scope/redactVault'

export function getVaultScope(role: UserRole, partyId: string): VaultScopeResult {
  const visibleVaults = MOCK_VAULTS.filter((v) =>
    vaultVisibleToRole(v, role, partyId),
  )
  const scopedVaults = visibleVaults.map((v) => redactVault(v, role, partyId))

  const totalNumeric =
    role === 'hnwi'
      ? visibleVaults.reduce((sum, v) => sum + v.totalValueNumeric, 0)
      : role === 'admin'
        ? MOCK_VAULTS.reduce((sum, v) => sum + v.totalValueNumeric, 0)
        : 0

  const pendingReleases = scopedVaults.filter((v) => v.status === 'pending').length

  const ledgerEntries = MOCK_LEDGER.filter((e) => {
    if (role === 'admin') return true
    return e.viewerIds.includes(partyId)
  })

  const securityEvents = MOCK_SECURITY.filter((e) => {
    if (role === 'admin') return true
    return e.viewerIds.includes(partyId)
  })

  return {
    role,
    partyId,
    vaults: scopedVaults,
    stats: {
      totalAssetsLabel:
        role === 'oracle'
          ? '—'
          : role === 'heir'
            ? formatAum(
                scopedVaults.reduce(
                  (sum, v) =>
                    v.visibleAssets.length > 0
                      ? sum + v.totalValueNumeric * 0.4
                      : sum,
                  0,
                ),
              ) || '$0'
            : formatAum(totalNumeric),
      activeVaults: scopedVaults.filter(
        (v) => v.status === 'active' || v.status === 'verified',
      ).length,
      pendingReleases,
      showFinancialTotals: role === 'hnwi' || role === 'admin',
    },
    ledgerEntries,
    securityEvents,
    canCreateVault: role === 'hnwi',
  }
}

export function useVaultScope(role: UserRole, partyId: string): VaultScopeResult {
  return useMemo(() => getVaultScope(role, partyId), [role, partyId])
}

export function getAdminClients() {
  return MOCK_ADMIN_CLIENTS
}

export function getAdminVaults() {
  return MOCK_VAULTS
}
