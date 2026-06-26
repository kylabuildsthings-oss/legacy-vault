import { Link, useParams } from 'react-router-dom'
import { MoreVertical, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { VisibilityArchitecture } from '@/components/legacy/VisibilityArchitecture'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { DataTable } from '@/components/legacy/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_VAULTS } from '@/lib/mock/fixtures'
import { redactVault, vaultVisibleToRole } from '@/lib/scope/redactVault'

export function AdminVaultDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
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

  const vault = redactVault(raw, 'admin', user.id)
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
        </div>
      </div>

      <VisibilityArchitecture vault={vault} role="admin" />

      <section className="space-y-3">
        <h2 className="font-headline text-sm tracking-widest uppercase">Asset Allocation</h2>

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
