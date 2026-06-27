import { Link, useParams } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useReleaseWorkflow } from '@/context/ReleaseWorkflowContext'
import { VisibilityArchitecture } from '@/components/legacy/VisibilityArchitecture'
import { AssetAllocationTable } from '@/components/legacy/AssetAllocationTable'
import { LastVerifiedTimestampCard } from '@/components/legacy/LastVerifiedTimestampCard'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_VAULTS } from '@/lib/mock/fixtures'
import { countTokenizedHoldings } from '@/lib/mock/tokenizedAssets'
import { redactVault, vaultVisibleToRole } from '@/lib/scope/redactVault'

export function AdminVaultDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { getReleaseStatus } = useReleaseWorkflow()
  if (!user || !id) return null

  const raw = MOCK_VAULTS.find((v) => v.id === id)
  if (!raw || !vaultVisibleToRole(raw, 'admin', user.id)) {
    return (
      <p className="text-muted-foreground">
        Vault not found or not visible for your role.{' '}
        <Link to="/admin/vaults" className="text-primary underline">
          Back to registry
        </Link>
      </p>
    )
  }

  const vault = {
    ...redactVault(raw, 'admin', user.id),
    releaseStatus: getReleaseStatus(raw),
  }
  const backTo = `/admin/clients/${vault.testatorId}`

  return (
    <div className="space-y-8">
      <div>
        <Link to={backTo} className="text-sm text-primary underline">
          ← Back to {vault.testatorName}
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <StatusBadge status={vault.status} />
            <span className="font-headline text-xs text-muted-foreground">{vault.id}</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">{vault.name}</h1>
          <p className="text-sm text-muted-foreground">{vault.jurisdiction}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Client: <span className="font-medium text-foreground">{vault.testatorName}</span>
            {' · '}
            {vault.id}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Institutional oversight — read-only administrative view.
          </p>
          {vault.visibleAssets.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {countTokenizedHoldings([vault])} tokenized holding
              {countTokenizedHoldings([vault]) !== 1 ? 's' : ''} · Canton registry
            </p>
          )}
        </div>
      </div>

      <VisibilityArchitecture vault={vault} role="admin" />

      <section className="space-y-3">
        <h2 className="font-headline text-sm tracking-widest uppercase">Asset Allocation</h2>

        {vault.visibleAssets.length > 0 ? (
          <AssetAllocationTable rows={vault.visibleAssets.map((a) => ({ ...a, id: a.id }))} />
        ) : (
          <p className="rounded border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No assets registered for this vault.
          </p>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-sm shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-headline text-xs tracking-wider uppercase">
              <Shield className="size-4" />
              Vault Security Protocol
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This vault uses zero-knowledge proofs (ZKP) so only the testator sees the full
            structure. Heirs and oracles verify existence without seeing contents until release
            conditions are met. Trust administrators have institutional read access for oversight.
          </CardContent>
        </Card>
        <LastVerifiedTimestampCard />
      </div>

      <div className="flex gap-4 text-sm">
        <Link to={backTo} className="text-primary underline">
          ← Back to {vault.testatorName}
        </Link>
        <Link to="/admin/vaults" className="text-primary underline">
          Global Vault Registry
        </Link>
      </div>
    </div>
  )
}
