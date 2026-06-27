import { useMemo } from 'react'
import type { UserRole } from '@/lib/auth'
import { useReleaseWorkflow } from '@/context/ReleaseWorkflowContext'
import {
  MOCK_ADMIN_CLIENTS,
  MOCK_LEDGER,
  MOCK_SECURITY,
  MOCK_VAULTS,
  formatAum,
} from '@/lib/mock/fixtures'
import {
  buildReleaseLedgerEntries,
  buildReleaseSecurityEvents,
  getEffectiveReleaseStatus,
} from '@/lib/mock/releaseWorkflow'
import type { ReleaseStatus, VaultRecord, VaultScopeResult } from '@/lib/mock/types'
import { redactVault, vaultVisibleToRole } from '@/lib/scope/redactVault'

function scopeVault<T extends VaultRecord>(
  vault: T,
  role: UserRole,
  partyId: string,
  releaseStatus: ReleaseStatus,
) {
  return {
    ...redactVault(vault, role, partyId),
    releaseStatus,
  }
}

export function getVaultScope(
  role: UserRole,
  partyId: string,
  overrides: Record<string, ReleaseStatus> = {},
): VaultScopeResult {
  const visibleVaults = MOCK_VAULTS.filter((v) => vaultVisibleToRole(v, role, partyId))
  const scopedVaults = visibleVaults.map((v) =>
    scopeVault(v, role, partyId, getEffectiveReleaseStatus(v, overrides)),
  )

  const totalNumeric =
    role === 'hnwi'
      ? visibleVaults.reduce((sum, v) => sum + v.totalValueNumeric, 0)
      : role === 'admin'
        ? MOCK_VAULTS.reduce((sum, v) => sum + v.totalValueNumeric, 0)
        : 0

  const pendingReleases = scopedVaults.filter(
    (v) => v.releaseStatus === 'pending_verification',
  ).length

  let ledgerEntries = MOCK_LEDGER.filter((e) => {
    if (role === 'admin') return true
    return e.viewerIds.includes(partyId)
  })

  let securityEvents = MOCK_SECURITY.filter((e) => {
    if (role === 'admin') return true
    return e.viewerIds.includes(partyId)
  })

  for (const vault of visibleVaults) {
    const releaseStatus = getEffectiveReleaseStatus(vault, overrides)
    ledgerEntries = [...buildReleaseLedgerEntries(vault.id, vault.name, releaseStatus), ...ledgerEntries]
    securityEvents = [
      ...buildReleaseSecurityEvents(vault.id, vault.name, releaseStatus),
      ...securityEvents,
    ]
  }

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
  const { getReleaseStatus, releaseVersion } = useReleaseWorkflow()
  return useMemo(
    () => {
      const overrides: Record<string, ReleaseStatus> = {}
      for (const vault of MOCK_VAULTS) {
        overrides[vault.id] = getReleaseStatus(vault)
      }
      return getVaultScope(role, partyId, overrides)
    },
    [role, partyId, getReleaseStatus, releaseVersion],
  )
}

export function getAdminClients() {
  return MOCK_ADMIN_CLIENTS
}

export function getAdminVaults(overrides: Record<string, ReleaseStatus> = {}) {
  return MOCK_VAULTS.map((v) => ({
    ...v,
    releaseStatus: getEffectiveReleaseStatus(v, overrides),
  }))
}

export function countPendingReleaseVaults(overrides: Record<string, ReleaseStatus> = {}) {
  return MOCK_VAULTS.filter(
    (v) => getEffectiveReleaseStatus(v, overrides) === 'pending_verification',
  ).length
}
