import { Link } from 'react-router-dom'
import { getAdminClients, getAdminVaults } from '@/lib/scope/useVaultScope'
import { StatCard } from '@/components/legacy/StatCard'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { Building2, Clock, Users } from 'lucide-react'

export function AdminOverviewPage() {
  const clients = getAdminClients()
  const vaults = getAdminVaults()

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-2xl font-bold">Trust Manager Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Clients" value="24" sublabel="+2 this month" icon={Users} />
        <StatCard label="Total AUM" value="$12.4B" sublabel="Institutional grade" icon={Building2} />
        <StatCard label="Active Vaults" value={String(vaults.length)} icon={Building2} />
        <StatCard label="Pending Releases" value="03" sublabel="Awaiting finalization" icon={Clock} />
      </div>

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
