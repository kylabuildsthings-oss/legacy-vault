import { useAuth } from '@/context/AuthContext'
import { ledgerDiagnostics, useMockLedger } from '@/lib/ledger/config'
import { useVaultScope } from '@/lib/scope/useVaultScope'

export function LedgerScopeBanner() {
  const { user } = useAuth()
  if (!user || useMockLedger) return null

  const scope = useVaultScope(user.role, user.id)

  if (scope.loading) {
    return (
      <div className="mb-6 rounded-sm border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        Connecting to Canton ledger…{' '}
        <span className="text-xs opacity-70">({ledgerDiagnostics.fetchBaseUrl})</span>
      </div>
    )
  }

  if (scope.error) {
    return (
      <div className="mb-6 rounded-sm border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <div className="font-medium">Ledger unavailable: {scope.error}</div>
        {scope.errorDetail ? (
          <div className="mt-1 text-xs opacity-80">{scope.errorDetail}</div>
        ) : null}
        <div className="mt-2 text-xs opacity-80">
          Start <code className="text-xs">./scripts/dev-ledger.sh</code>, or set{' '}
          <code className="text-xs">VITE_USE_MOCK_LEDGER=true</code> in{' '}
          <code className="text-xs">.env.local</code> for mock mode. See the browser console for
          full diagnostics.
        </div>
      </div>
    )
  }

  return null
}
