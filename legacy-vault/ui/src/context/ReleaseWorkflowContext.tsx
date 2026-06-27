import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ReleaseStatus, VaultRecord } from '@/lib/mock/types'
import {
  getEffectiveReleaseStatus,
  readReleaseOverrides,
  writeReleaseOverrides,
} from '@/lib/mock/releaseWorkflow'

export { clearReleaseOverrides } from '@/lib/mock/releaseWorkflow'

interface ReleaseWorkflowContextValue {
  getReleaseStatus: (vault: Pick<VaultRecord, 'id' | 'releaseStatus'>) => ReleaseStatus
  confirmRelease: (vaultId: string) => void
  setPendingVerification: (vaultId: string) => void
  releaseVersion: number
}

const ReleaseWorkflowContext = createContext<ReleaseWorkflowContextValue | null>(null)

export function ReleaseWorkflowProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, ReleaseStatus>>(readReleaseOverrides)
  const [releaseVersion, setReleaseVersion] = useState(0)

  const bump = useCallback((next: Record<string, ReleaseStatus>) => {
    writeReleaseOverrides(next)
    setOverrides(next)
    setReleaseVersion((v) => v + 1)
  }, [])

  const getReleaseStatus = useCallback(
    (vault: Pick<VaultRecord, 'id' | 'releaseStatus'>) =>
      getEffectiveReleaseStatus(vault, overrides),
    [overrides],
  )

  const confirmRelease = useCallback(
    (vaultId: string) => {
      bump({ ...overrides, [vaultId]: 'release_triggered' })
    },
    [bump, overrides],
  )

  const setPendingVerification = useCallback(
    (vaultId: string) => {
      bump({ ...overrides, [vaultId]: 'pending_verification' })
    },
    [bump, overrides],
  )

  const value = useMemo(
    () => ({ getReleaseStatus, confirmRelease, setPendingVerification, releaseVersion }),
    [getReleaseStatus, confirmRelease, setPendingVerification, releaseVersion],
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
