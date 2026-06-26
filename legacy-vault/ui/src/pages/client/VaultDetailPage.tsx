import { useParams, Link } from 'react-router-dom'
import { MoreVertical, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { VisibilityArchitecture } from '@/components/legacy/VisibilityArchitecture'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { DataTable } from '@/components/legacy/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_VAULTS } from '@/lib/mock/fixtures'
import { redactVault, vaultVisibleToRole } from '@/lib/scope/redactVault'

export function VaultDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
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

  const vault = redactVault(raw, user.role, user.id)

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
          <DataTable
            columns={[
              {
                key: 'name',
                header: 'Asset Name',
                render: (r) => (
                  <span>
                    {r.name}{' '}
                    <span className="text-muted-foreground">(ID: {r.id})</span>
                  </span>
                ),
              },
              { key: 'heir', header: 'Intended Heir', render: (r) => r.intendedHeirLabel },
              {
                key: 'status',
                header: 'Status',
                render: (r) => <StatusBadge status={r.status} />,
              },
              {
                key: 'actions',
                header: 'Actions',
                render: () => (
                  <button type="button" className="text-muted-foreground" aria-label="Actions">
                    <MoreVertical className="size-4" />
                  </button>
                ),
              },
            ]}
            rows={vault.visibleAssets.map((a) => ({ ...a, id: a.id }))}
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
        <Card className="rounded-sm shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-xs tracking-wider uppercase">
              Last Verified Timestamp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 font-headline text-sm">
            <p>OCT 24, 2024 — 14:32:01 UTC</p>
            <p className="text-xs text-muted-foreground">HASH: 0x82f...a1c9</p>
          </CardContent>
        </Card>
      </div>

      <Link to="/vaults" className="inline-block text-sm text-primary underline">
        ← Back to vaults
      </Link>
    </div>
  )
}
