import { useParams, Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useReleaseWorkflow } from '@/context/ReleaseWorkflowContext'
import { VisibilityArchitecture } from '@/components/legacy/VisibilityArchitecture'
import { AssetAllocationTable } from '@/components/legacy/AssetAllocationTable'
import { BeneficiaryPayoutCard } from '@/components/legacy/BeneficiaryPayoutCard'
import { LastVerifiedTimestampCard } from '@/components/legacy/LastVerifiedTimestampCard'
import { ReleaseConfirmBanner } from '@/components/legacy/ReleaseConfirmBanner'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_VAULTS } from '@/lib/mock/fixtures'
import { countTokenizedHoldings } from '@/lib/mock/tokenizedAssets'
import { redactVault, vaultVisibleToRole } from '@/lib/scope/redactVault'

export function VaultDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { getReleaseStatus, confirmRelease } = useReleaseWorkflow()
  if (!user || !id) return null

  const raw = MOCK_VAULTS.find((v) => v.id === id)
  if (!raw || !vaultVisibleToRole(raw, user.role, user.id)) {
    return (
      <p className="text-muted-foreground">
        Vault not found or not visible for your role.{' '}
        <Link to="/vaults" className="text-primary underline">
          Back to vaults
        </Link>
      </p>
    )
  }

  const releaseStatus = getReleaseStatus(raw)
  const vault = { ...redactVault(raw, user.role, user.id), releaseStatus }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <StatusBadge status={vault.status} />
            <span className="font-headline text-xs text-muted-foreground">{vault.id}</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">{vault.name}</h1>
          <p className="text-sm text-muted-foreground">{vault.jurisdiction}</p>
          {user.role === 'hnwi' && vault.visibleAssets.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {countTokenizedHoldings([vault])} tokenized holding
              {countTokenizedHoldings([vault]) !== 1 ? 's' : ''} · Canton registry
            </p>
          )}
          {user.role === 'heir' && (
            <p className="mt-2 text-sm text-muted-foreground">
              Testator: <span className="font-medium text-foreground">{vault.testatorName}</span>
              {' · '}
              {vault.id}
            </p>
          )}
          {user.role === 'oracle' && (
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>
                Client: <span className="font-medium text-foreground">{vault.testatorName}</span>
                {' · '}
                {vault.id}
              </p>
              <p>
                Assigned for trigger oversight — asset details withheld until release.
              </p>
            </div>
          )}
        </div>
        {user.role === 'hnwi' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="font-headline text-xs tracking-wider">
              Edit Vault
            </Button>
            <Button variant="destructive" size="sm" className="font-headline text-xs tracking-wider">
              Revoke Vault
            </Button>
          </div>
        )}
      </div>

      {user.role === 'oracle' && (
        <ReleaseConfirmBanner
          vaultId={vault.id}
          vaultName={vault.name}
          testatorName={vault.testatorName}
          releaseStatus={releaseStatus}
          onConfirm={() => confirmRelease(vault.id)}
        />
      )}

      {user.role === 'heir' && (
        <BeneficiaryPayoutCard vault={vault} heirId={user.id} />
      )}

      <VisibilityArchitecture vault={vault} role={user.role} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-sm tracking-widest uppercase">Asset Allocation</h2>
          {user.role === 'hnwi' && (
            <Button variant="outline" size="sm" className="font-headline text-[0.65rem] tracking-wider">
              + ADD NEW ASSET
            </Button>
          )}
        </div>

        {vault.visibleAssets.length > 0 ? (
          <AssetAllocationTable
            rows={vault.visibleAssets.map((a) => ({ ...a, id: a.id }))}
            showTokenColumns={user.role !== 'oracle'}
          />
        ) : (
          <p className="rounded border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            {user.role === 'oracle'
              ? 'No asset details visible until release conditions are met.'
              : 'No assets visible for your access level.'}
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
            conditions are met.
          </CardContent>
        </Card>
        <LastVerifiedTimestampCard />
      </div>

      <Link to="/vaults" className="inline-block text-sm text-primary underline">
        ← Back to vaults
      </Link>
    </div>
  )
}
