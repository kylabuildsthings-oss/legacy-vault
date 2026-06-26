import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { DataTable } from '@/components/legacy/DataTable'
import { StatCard } from '@/components/legacy/StatCard'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { FilterTabs } from '@/components/legacy/FilterTabs'
import { useVaultScope } from '@/lib/scope/useVaultScope'
import { testatorNameByVaultId } from '@/lib/scope/vaultDisplay'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Clock, Landmark, ListChecks } from 'lucide-react'

const LEDGER_TABS = [
  { id: 'all', label: 'All Activity' },
  { id: 'vault', label: 'Vault Updates' },
  { id: 'transfer', label: 'Asset Transfers' },
  { id: 'security', label: 'Security Events' },
]

export function LedgerPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  if (!user) return null

  const scope = useVaultScope(user.role, user.id)

  const filtered = useMemo(() => {
    let rows = scope.ledgerEntries
    if (tab === 'security') {
      rows = rows.filter((r) => r.action.toLowerCase().includes('auth'))
    } else if (tab === 'vault') {
      rows = rows.filter((r) =>
        ['Heir Added', 'Account Sync'].some((a) => r.action.includes(a)),
      )
    } else if (tab === 'transfer') {
      rows = rows.filter((r) => r.action.includes('Revaluation'))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.vaultName.toLowerCase().includes(q) ||
          testatorNameByVaultId(r.vaultId).toLowerCase().includes(q) ||
          r.action.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      )
    }
    return rows
  }, [scope.ledgerEntries, tab, search])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Ledger & Activity</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          A comprehensive immutable record of all vault operations and security events
          visible to your role.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Transactions"
          value={`${scope.ledgerEntries.length} Units`}
          icon={ListChecks}
        />
        <StatCard
          label="Last Activity"
          value="Today, 14:22 UTC"
          icon={Clock}
        />
        <StatCard
          label="Pending Confirmations"
          value={`${scope.stats.pendingReleases} ACTIVE`}
          icon={Landmark}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterTabs tabs={LEDGER_TABS} active={tab} onChange={setTab} />
        <div className="flex gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[140px] font-headline text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-56 pl-8"
              placeholder="Search ID or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
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
          { key: 'action', header: 'Action', render: (r) => r.action },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <StatusBadge status={r.status} />,
          },
        ]}
        rows={filtered}
        emptyMessage="No ledger entries match your filters."
      />

      <p className="text-xs text-muted-foreground">
        Showing 1–{filtered.length} of {scope.ledgerEntries.length} records
      </p>
    </div>
  )
}
