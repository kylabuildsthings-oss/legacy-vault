import { Link } from 'react-router-dom'
import { getAdminVaults } from '@/lib/scope/useVaultScope'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import type { VaultStatus } from '@/components/legacy/StatusBadge'

export function AdminVaultsPage() {
  const vaults = getAdminVaults()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold">Global Vault Registry</h1>
        <p className="text-sm text-muted-foreground">
          Administrative oversight of all institutional and private asset vaults.
        </p>
      </div>
      <DataTable
        columns={[
          { key: 'id', header: 'Vault ID', render: (r) => (
            <Link to={`/admin/vaults/${r.id}`} className="text-primary underline">
              {r.id}
            </Link>
          ) },
          { key: 'client', header: 'Client', render: (r) => r.testatorName },
          { key: 'name', header: 'Vault Name', render: (r) => (
            <Link to={`/admin/vaults/${r.id}`} className="text-primary underline">
              {r.name}
            </Link>
          ) },
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
    </div>
  )
}
