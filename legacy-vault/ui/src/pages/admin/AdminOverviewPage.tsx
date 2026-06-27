import { Link } from 'react-router-dom'
import { useReleaseWorkflow } from '@/context/ReleaseWorkflowContext'
import {
  countPendingReleaseVaults,
  getAdminClients,
  getAdminVaults,
} from '@/lib/scope/useVaultScope'
import { StatCard } from '@/components/legacy/StatCard'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { Building2, Clock, Users } from 'lucide-react'
import { MOCK_VAULTS } from '@/lib/mock/fixtures'

export function AdminOverviewPage() {
  const { getReleaseStatus } = useReleaseWorkflow()
  const overrides = Object.fromEntries(
    MOCK_VAULTS.map((v) => [v.id, getReleaseStatus(v)]),
  )
  const clients = getAdminClients()
  const vaults = getAdminVaults(overrides)
  const pendingCount = countPendingReleaseVaults(overrides)
  const pendingVaults = vaults.filter((v) => v.releaseStatus === 'pending_verification')

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-2xl font-bold">Trust Manager Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Clients" value="24" sublabel="+2 this month" icon={Users} />
        <StatCard label="Total AUM" value="$12.4B" sublabel="Institutional grade" icon={Building2} />
        <StatCard label="Active Vaults" value={String(vaults.length)} icon={Building2} />
        <StatCard
          label="Pending Releases"
          value={String(pendingCount).padStart(2, '0')}
          sublabel={
            pendingCount > 0 ? `${pendingCount} awaiting oracle confirmation` : 'Queue clear'
          }
          icon={Clock}
        />
      </div>

      {pendingVaults.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-headline text-sm tracking-widest uppercase">Pending Releases</h2>
          <p className="text-sm text-muted-foreground">
            Vaults awaiting oracle release confirmation before atomic settlement on Canton.
          </p>
          <DataTable
            columns={[
              {
                key: 'vault',
                header: 'Vault',
                render: (r) => (
                  <Link to={`/admin/vaults/${r.id}`} className="text-primary underline">
                    {r.name}
                  </Link>
                ),
              },
              { key: 'client', header: 'Client', render: (r) => r.testatorName },
              { key: 'id', header: 'Vault ID', render: (r) => r.id },
              {
                key: 'status',
                header: 'Release Status',
                render: () => <StatusBadge status="pending" />,
              },
            ]}
            rows={pendingVaults.map((v) => ({ ...v, id: v.id }))}
          />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-headline text-sm tracking-widest uppercase">Client Directory</h2>
        <DataTable
          columns={[
            { key: 'name', header: 'Name', render: (r) => (
              <Link to={`/admin/clients/${r.id}`} className="text-primary underline">
                {r.name}
              </Link>
            ) },
            { key: 'vaults', header: 'Vaults', render: (r) => String(r.vaultCount) },
            { key: 'aum', header: 'Total Assets', render: (r) => r.totalAssets },
            {
              key: 'status',
              header: 'Status',
              render: () => <StatusBadge status="active" />,
            },
          ]}
          rows={clients.map((c) => ({ ...c, id: c.id }))}
        />
      </section>
    </div>
  )
}
