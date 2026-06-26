import { MOCK_LEDGER } from '@/lib/mock/fixtures'
import { testatorNameByVaultId } from '@/lib/scope/vaultDisplay'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { StatCard } from '@/components/legacy/StatCard'
import { Landmark } from 'lucide-react'

export function AdminLedgerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold">Global System Ledger</h1>
        <p className="text-sm text-muted-foreground">
          Cross-client immutable transaction record.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Transactions (24h)" value="47" icon={Landmark} />
        <StatCard label="Pending Confirmations" value="3" sublabel="Multi-sig approval" icon={Landmark} />
        <StatCard label="Total AUM" value="$12.4B" icon={Landmark} />
      </div>
      <DataTable
        columns={[
          { key: 'ts', header: 'Timestamp', render: (r) => r.timestamp },
          {
            key: 'client',
            header: 'Client',
            render: (r) => testatorNameByVaultId(r.vaultId),
          },
          { key: 'vault', header: 'Vault', render: (r) => r.vaultName },
          { key: 'action', header: 'Type', render: (r) => r.action },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <StatusBadge status={r.status} />,
          },
        ]}
        rows={MOCK_LEDGER}
      />
    </div>
  )
}
