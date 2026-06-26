import { Link } from 'react-router-dom'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import type { ScopedVault } from '@/lib/mock/types'
import { groupVaultsByTestator } from '@/lib/scope/vaultDisplay'

interface OracleClientDeskProps {
  vaults: ScopedVault[]
}

function jurisdictionsLabel(vaults: ScopedVault[]): string {
  return [...new Set(vaults.map((v) => v.jurisdiction))].join(' · ')
}

export function OracleClientDesk({ vaults }: OracleClientDeskProps) {
  const clients = groupVaultsByTestator(vaults).map((group) => ({
    id: group.testatorId,
    testatorName: group.testatorName,
    vaults: group.vaults,
    jurisdictions: jurisdictionsLabel(group.vaults),
    hasPending: group.vaults.some((v) => v.status === 'pending'),
  }))

  return (
    <DataTable
      columns={[
        {
          key: 'client',
          header: 'Client',
          render: (r) => <span className="font-medium">{r.testatorName}</span>,
        },
        {
          key: 'vaults',
          header: 'Assigned Vaults',
          render: (r) => (
            <span className="space-x-1">
              {r.vaults.map((vault, index) => (
                <span key={vault.id}>
                  {index > 0 && <span className="text-muted-foreground"> · </span>}
                  <Link to={`/vaults/${vault.id}`} className="text-primary underline">
                    {vault.name}
                  </Link>
                </span>
              ))}
            </span>
          ),
        },
        {
          key: 'jurisdictions',
          header: 'Jurisdictions',
          render: (r) => r.jurisdictions,
        },
        {
          key: 'pending',
          header: 'Verification',
          render: (r) =>
            r.hasPending ? (
              <StatusBadge status="pending" />
            ) : (
              <StatusBadge status="verified" />
            ),
        },
        {
          key: 'actions',
          header: 'Actions',
          render: (r) => (
            <div className="flex flex-col gap-1">
              {r.vaults.map((vault) => (
                <Link
                  key={vault.id}
                  to={`/vaults/${vault.id}`}
                  className="font-headline text-[0.65rem] tracking-wider text-primary underline"
                >
                  Review {vault.name} →
                </Link>
              ))}
            </div>
          ),
        },
      ]}
      rows={clients}
      emptyMessage="No clients assigned to your verification desk."
    />
  )
}
