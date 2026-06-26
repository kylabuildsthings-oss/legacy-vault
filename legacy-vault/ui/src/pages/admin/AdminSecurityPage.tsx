import { MOCK_SECURITY } from '@/lib/mock/fixtures'
import { testatorNameByVaultId } from '@/lib/scope/vaultDisplay'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import type { VaultStatus } from '@/components/legacy/StatusBadge'
import { StatCard } from '@/components/legacy/StatCard'
import { Shield } from 'lucide-react'

const integrityToStatus: Record<string, VaultStatus> = {
  verified: 'verified',
  flagged: 'flagged',
  blocked: 'blocked',
}

export function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold">Security Operations Center</h1>
        <p className="text-sm text-muted-foreground">
          Real-time cryptographic oversight and access integrity monitoring.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Security Events (24h)" value="1,247" icon={Shield} />
        <StatCard label="Critical Alerts" value="2" sublabel="Immediate action" icon={Shield} />
        <StatCard label="Attempts Blocked" value="8" icon={Shield} />
      </div>
      <DataTable
        columns={[
          { key: 'ts', header: 'Timestamp', render: (r) => r.timestamp },
          {
            key: 'client',
            header: 'Client',
            render: (r) => testatorNameByVaultId(r.vaultId),
          },
          { key: 'target', header: 'Vault', render: (r) => r.targetAsset },
          { key: 'type', header: 'Event Type', render: (r) => r.eventType },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <StatusBadge status={integrityToStatus[r.integrityStatus] ?? 'verified'} />
            ),
          },
        ]}
        rows={MOCK_SECURITY}
      />
    </div>
  )
}
