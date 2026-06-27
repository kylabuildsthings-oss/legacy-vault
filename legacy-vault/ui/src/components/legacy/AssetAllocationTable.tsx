import { MoreVertical } from 'lucide-react'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import {
  type AssetTableRow,
} from '@/lib/mock/tokenizedAssets'
import { AssetClassBadge, SettlementStatusText } from '@/components/legacy/TokenizedAssetBadges'

export function AssetAllocationTable({
  rows,
  showTokenColumns = true,
}: {
  rows: AssetTableRow[]
  showTokenColumns?: boolean
}) {
  return (
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
        ...(showTokenColumns
          ? [
              {
                key: 'tokenId',
                header: 'Token ID',
                render: (r: AssetTableRow) => (
                  <span className="font-headline text-xs">{r.tokenId}</span>
                ),
              },
              {
                key: 'class',
                header: 'Class',
                render: (r: AssetTableRow) => <AssetClassBadge assetClass={r.assetClass} />,
              },
              {
                key: 'settlement',
                header: 'Settlement',
                render: (r: AssetTableRow) => (
                  <SettlementStatusText status={r.settlementStatus} />
                ),
              },
            ]
          : []),
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
      rows={rows}
    />
  )
}
