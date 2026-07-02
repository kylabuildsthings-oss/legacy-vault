import { useEffect, useMemo, useState } from 'react'
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
import { ledgerDiagnostics, useMockLedger } from '@/lib/ledger/config'
import { redactVault, vaultVisibleToRole } from '@/lib/scope/redactVault'

const LEDGER_FETCH_TIMEOUT_MS = 8000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `Ledger request timed out after ${ms / 1000}s — the browser could not reach the JSON API.`,
            ),
          ),
        ms,
      ),
    ),
  ])
}

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

function buildVaultScope(
  role: UserRole,
  partyId: string,
  sourceVaults: VaultRecord[],
  ledgerEntries: VaultScopeResult['ledgerEntries'],
  securityEvents: VaultScopeResult['securityEvents'],
  overrides: Record<string, ReleaseStatus> = {},
): VaultScopeResult {
  const visibleVaults = sourceVaults.filter((v) => vaultVisibleToRole(v, role, partyId))
  const scopedVaults = visibleVaults.map((v) =>
    scopeVault(v, role, partyId, getEffectiveReleaseStatus(v, overrides)),
  )

  const totalNumeric =
    role === 'hnwi'
      ? visibleVaults.reduce((sum, v) => sum + v.totalValueNumeric, 0)
      : role === 'admin'
        ? sourceVaults.reduce((sum, v) => sum + v.totalValueNumeric, 0)
        : 0

  const pendingReleases = scopedVaults.filter(
    (v) => v.releaseStatus === 'pending_verification',
  ).length

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

export function getVaultScope(
  role: UserRole,
  partyId: string,
  overrides: Record<string, ReleaseStatus> = {},
  sourceVaults: VaultRecord[] = MOCK_VAULTS,
): VaultScopeResult {
  const visibleVaults = sourceVaults.filter((v) => vaultVisibleToRole(v, role, partyId))

  let ledgerEntries = MOCK_LEDGER.filter((e) => {
    if (role === 'admin') return true
    return e.viewerIds.includes(partyId)
  })

  let securityEvents = MOCK_SECURITY.filter((e) => {
    if (role === 'admin') return true
    return e.viewerIds.includes(partyId)
  })

  if (sourceVaults === MOCK_VAULTS) {
    for (const vault of visibleVaults) {
      const releaseStatus = getEffectiveReleaseStatus(vault, overrides)
      ledgerEntries = [
        ...buildReleaseLedgerEntries(vault.id, vault.name, releaseStatus),
        ...ledgerEntries,
      ]
      securityEvents = [
        ...buildReleaseSecurityEvents(vault.id, vault.name, releaseStatus),
        ...securityEvents,
      ]
    }
  }

  return buildVaultScope(role, partyId, sourceVaults, ledgerEntries, securityEvents, overrides)
}

const EMPTY_SCOPE: VaultScopeResult = {
  role: 'hnwi',
  partyId: '',
  vaults: [],
  stats: {
    totalAssetsLabel: '$0',
    activeVaults: 0,
    pendingReleases: 0,
    showFinancialTotals: false,
  },
  ledgerEntries: [],
  securityEvents: [],
  canCreateVault: false,
}

export function useVaultScope(role: UserRole, partyId: string): VaultScopeResult {
  const { getReleaseStatus, releaseVersion } = useReleaseWorkflow()
  const [ledgerScope, setLedgerScope] = useState<VaultScopeResult | null>(null)
  const [ledgerLoading, setLedgerLoading] = useState(!useMockLedger)
  const [ledgerError, setLedgerError] = useState<string | null>(null)
  const [ledgerErrorDetail, setLedgerErrorDetail] = useState<string | null>(null)

  useEffect(() => {
    if (useMockLedger) return

    let cancelled = false
    setLedgerLoading(true)
    console.info('[LegacyVault] Ledger fetch starting', { role, partyId, diagnostics: ledgerDiagnostics })

    void (async () => {
      try {
        const snapshot = await withTimeout(
          (async () => {
            const { fetchLedgerSnapshot } = await import('@/lib/ledger/queries')
            return fetchLedgerSnapshot(role, partyId)
          })(),
          LEDGER_FETCH_TIMEOUT_MS,
        )
        if (cancelled) return
        const overrides: Record<string, ReleaseStatus> = {}
        for (const vault of snapshot.vaults) {
          overrides[vault.id] = vault.releaseStatus ?? 'idle'
        }
        const scoped = buildVaultScope(
          role,
          partyId,
          snapshot.vaults,
          snapshot.ledgerEntries.filter((e) => role === 'admin' || e.viewerIds.includes(partyId)),
          snapshot.securityEvents.filter(
            (e) => role === 'admin' || e.viewerIds.includes(partyId),
          ),
          overrides,
        )
        setLedgerScope({ ...scoped, ledgerConnected: true })
        setLedgerError(null)
        setLedgerErrorDetail(null)
      } catch (err: unknown) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Ledger connection failed'
        const detail = `API: ${ledgerDiagnostics.fetchBaseUrl} · ledger: ${ledgerDiagnostics.ledgerHttpUrl} · origin: ${ledgerDiagnostics.browserOrigin}`
        console.error('[LegacyVault] Ledger fetch failed:', message, {
          role,
          partyId,
          diagnostics: ledgerDiagnostics,
          error: err,
        })
        setLedgerError(message)
        setLedgerErrorDetail(detail)
        setLedgerScope(null)
      } finally {
        if (!cancelled) setLedgerLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [role, partyId, releaseVersion])

  const mockResult = useMemo(
    () => {
      const overrides: Record<string, ReleaseStatus> = {}
      for (const vault of MOCK_VAULTS) {
        overrides[vault.id] = getReleaseStatus(vault)
      }
      return getVaultScope(role, partyId, overrides)
    },
    [role, partyId, getReleaseStatus, releaseVersion],
  )

  if (useMockLedger) {
    return mockResult
  }

  if (ledgerLoading) {
    return { ...EMPTY_SCOPE, role, partyId, loading: true, ledgerConnected: true }
  }

  if (ledgerError) {
    return {
      ...EMPTY_SCOPE,
      role,
      partyId,
      error: ledgerError,
      errorDetail: ledgerErrorDetail,
      ledgerConnected: false,
    }
  }

  return ledgerScope ?? { ...EMPTY_SCOPE, role, partyId, ledgerConnected: true }
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
