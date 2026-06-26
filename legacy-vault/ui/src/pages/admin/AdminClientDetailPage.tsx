import { Link, useParams } from 'react-router-dom'
import { MOCK_VAULTS, formatAum } from '@/lib/mock/fixtures'
import { getAdminClients } from '@/lib/scope/useVaultScope'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import type { VaultStatus } from '@/components/legacy/StatusBadge'
import { StatCard } from '@/components/legacy/StatCard'
import { Building2, Vault } from 'lucide-react'

export function AdminClientDetailPage() {
  const { testatorId } = useParams<{ testatorId: string }>()
  if (!testatorId) return null

  const client = getAdminClients().find((c) => c.id === testatorId)
  const vaults = MOCK_VAULTS.filter((v) => v.testatorId === testatorId)
  const totalAum = formatAum(vaults.reduce((sum, v) => sum + v.totalValueNumeric, 0))

  if (!client) {
    return (
      <p className="text-muted-foreground">
        Client not found.{' '}
        <Link to="/admin" className="text-primary underline">
          Back to dashboard
        </Link>
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/admin" className="text-sm text-primary underline">
          ← Back to Client Directory
        </Link>
        <h1 className="mt-4 font-headline text-2xl font-bold">{client.name}</h1>
        <p className="text-sm text-muted-foreground">Client ID: {client.id}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Vaults" value={String(vaults.length)} icon={Vault} />
        <StatCard label="Total AUM" value={totalAum} icon={Building2} />
        <StatCard label="Status" value={client.status.toUpperCase()} icon={Building2} />
      </div>

      <section className="space-y-3">
        <h2 className="font-headline text-sm tracking-widest uppercase">Assigned Vaults</h2>
        {vaults.length > 0 ? (
          <DataTable
            columns={[
              {
                key: 'id',
                header: 'Vault ID',
                render: (r) => (
                  <Link to={`/admin/vaults/${r.id}`} className="text-primary underline">
                    {r.id}
                  </Link>
                ),
              },
              {
                key: 'name',
                header: 'Vault Name',
                render: (r) => (
                  <Link to={`/admin/vaults/${r.id}`} className="text-primary underline">
                    {r.name}
                  </Link>
                ),
              },
              { key: 'jurisdiction', header: 'Jurisdiction', render: (r) => r.jurisdiction },
              { key: 'aum', header: 'AUM', render: (r) => r.totalValue },
              {
                key: 'status',
                header: 'Status',
                render: (r) => <StatusBadge status={r.status as VaultStatus} />,
              },
            ]}
            rows={vaults.map((v) => ({ ...v, id: v.id }))}
          />
        ) : (
          <p className="rounded border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No vaults registered for this client in the global registry.
          </p>
        )}
      </section>
    </div>
  )
}
