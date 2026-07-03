import { useAuth } from '@/context/AuthContext'
import { DataModeBadge } from '@/components/layout/DataModeBadge'
import { hasBackendAuth, isLiveConfigured, resolveDataMode } from '@/lib/ledger/dataMode'
import { useVaultScope } from '@/lib/scope/useVaultScope'

export function LedgerScopeBanner() {
  const { user } = useAuth()
  if (!user) return null

  if (!isLiveConfigured() || !hasBackendAuth()) {
    return <DataModeBadge presentation={resolveDataMode()} />
  }

  return <LiveLedgerScopeBanner role={user.role} partyId={user.id} />
}

function LiveLedgerScopeBanner({
  role,
  partyId,
}: {
  role: Parameters<typeof useVaultScope>[0]
  partyId: string
}) {
  const scope = useVaultScope(role, partyId)
  const presentation = resolveDataMode({
    loading: scope.loading,
    error: scope.error ?? null,
  })

  if (presentation.mode === 'live') {
    return <DataModeBadge presentation={presentation} />
  }

  return (
    <DataModeBadge presentation={presentation} errorDetail={scope.errorDetail ?? null} />
  )
}
