import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/context/AuthContext'
import type { ReleaseStatus, VaultRecord } from '@/lib/mock/types'
import {
  getEffectiveReleaseStatus,
  readReleaseOverrides,
  writeReleaseOverrides,
} from '@/lib/mock/releaseWorkflow'
import { useMockLedger } from '@/lib/ledger/config'

export { clearReleaseOverrides } from '@/lib/mock/releaseWorkflow'

interface ReleaseWorkflowContextValue {
  getReleaseStatus: (vault: Pick<VaultRecord, 'id' | 'releaseStatus'>) => ReleaseStatus
  confirmRelease: (vaultId: string) => Promise<void>
  setPendingVerification: (vaultId: string) => Promise<void>
  releaseVersion: number
  workflowError: string | null
}

const ReleaseWorkflowContext = createContext<ReleaseWorkflowContextValue | null>(null)

export function ReleaseWorkflowProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [overrides, setOverrides] = useState<Record<string, ReleaseStatus>>(readReleaseOverrides)
  const [releaseVersion, setReleaseVersion] = useState(0)
  const [workflowError, setWorkflowError] = useState<string | null>(null)

  const bump = useCallback((next: Record<string, ReleaseStatus>) => {
    writeReleaseOverrides(next)
    setOverrides(next)
    setReleaseVersion((v) => v + 1)
  }, [])

  const bumpLedger = useCallback(() => {
    setWorkflowError(null)
    setReleaseVersion((v) => v + 1)
  }, [])

  const getReleaseStatus = useCallback(
    (vault: Pick<VaultRecord, 'id' | 'releaseStatus'>) => {
      if (!useMockLedger) {
        return vault.releaseStatus ?? overrides[vault.id] ?? 'idle'
      }
      return getEffectiveReleaseStatus(vault, overrides)
    },
    [overrides],
  )

  const confirmRelease = useCallback(
    async (vaultId: string) => {
      if (!useMockLedger) {
        if (!user) return
        try {
          const {
            confirmReleaseOnLedger,
            DEMO_RELEASE_BENEFICIARY_PARTY,
            DEMO_RELEASE_BENEFICIARY_LABEL,
          } = await import('@/lib/ledger/commands')
          await confirmReleaseOnLedger(
            user.id,
            vaultId,
            DEMO_RELEASE_BENEFICIARY_PARTY,
            DEMO_RELEASE_BENEFICIARY_LABEL,
          )
          bumpLedger()
        } catch (err: unknown) {
          setWorkflowError(err instanceof Error ? err.message : 'Confirm release failed')
        }
        return
      }
      bump({ ...overrides, [vaultId]: 'release_triggered' })
    },
    [bump, bumpLedger, overrides, user],
  )

  const setPendingVerification = useCallback(
    async (vaultId: string) => {
      if (!useMockLedger) {
        if (!user) return
        try {
          const { initiateVerificationOnLedger } = await import('@/lib/ledger/commands')
          await initiateVerificationOnLedger(user.id, vaultId)
          bumpLedger()
        } catch (err: unknown) {
          setWorkflowError(err instanceof Error ? err.message : 'Initiate verification failed')
        }
        return
      }
      bump({ ...overrides, [vaultId]: 'pending_verification' })
    },
    [bump, bumpLedger, overrides, user],
  )

  const value = useMemo(
    () => ({
      getReleaseStatus,
      confirmRelease,
      setPendingVerification,
      releaseVersion,
      workflowError,
    }),
    [getReleaseStatus, confirmRelease, setPendingVerification, releaseVersion, workflowError],
  )

  return (
    <ReleaseWorkflowContext.Provider value={value}>{children}</ReleaseWorkflowContext.Provider>
  )
}

export function useReleaseWorkflow() {
  const ctx = useContext(ReleaseWorkflowContext)
  if (!ctx) {
    throw new Error('useReleaseWorkflow must be used within ReleaseWorkflowProvider')
  }
  return ctx
}
