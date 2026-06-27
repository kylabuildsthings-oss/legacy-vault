import { Link } from 'react-router-dom'
import { DataTable } from '@/components/legacy/DataTable'
import type { TokenizedHoldingRow } from '@/lib/mock/tokenizedAssets'
import { AssetClassBadge, SettlementStatusText } from '@/components/legacy/TokenizedAssetBadges'

export function TokenizedHoldingsTable({ rows }: { rows: TokenizedHoldingRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No tokenized holdings in your vaults.</p>
    )
  }

  return (
    <DataTable
      columns={[
        { key: 'asset', header: 'Asset', render: (r) => r.assetName },
        {
          key: 'tokenId',
          header: 'Token ID',
          render: (r) => <span className="font-headline text-xs">{r.tokenId}</span>,
        },
        {
          key: 'class',
          header: 'Class',
          render: (r) => <AssetClassBadge assetClass={r.assetClass} />,
        },
        {
          key: 'vault',
          header: 'Vault',
          render: (r) => (
            <Link to={`/vaults/${r.vaultId}`} className="text-primary underline">
              {r.vaultName}
            </Link>
          ),
        },
        { key: 'heir', header: 'Intended Heir', render: (r) => r.intendedHeirLabel },
        {
          key: 'settlement',
          header: 'Settlement',
          render: (r) => <SettlementStatusText status={r.settlementStatus} />,
        },
      ]}
      rows={rows.map((r) => ({ ...r, id: r.id }))}
    />
  )
}
