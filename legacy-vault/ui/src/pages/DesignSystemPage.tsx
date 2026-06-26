import { Building2, Clock, Landmark, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/legacy/DataTable'
import { StatCard } from '@/components/legacy/StatCard'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { VaultCard } from '@/components/legacy/VaultCard'
import { Link } from 'react-router-dom'

const ledgerRows = [
  {
    id: '1',
    timestamp: '14:22:09 UTC',
    vault: 'My Will',
    action: 'Biometric Authentication',
    status: 'verified' as const,
  },
  {
    id: '2',
    timestamp: '11:05:41 UTC',
    vault: 'Family Trust',
    action: 'Asset Revaluation',
    status: 'verified' as const,
  },
]

export function DesignSystemPage() {
  return (
    <div className="min-h-svh bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-2">
          <p className="font-headline text-xs tracking-widest text-muted-foreground uppercase">
            Step 3 — Design system
          </p>
          <h1 className="font-headline text-3xl font-bold">Legacy Vault Components</h1>
          <p className="text-muted-foreground">
            Stitch tokens: Primary #C49B6C · Neutral #F8F6F2 · Space Mono + Inter
          </p>
          <Link
            to="/login"
            className="inline-flex h-7 items-center rounded-lg border border-border px-2.5 text-sm hover:bg-muted"
          >
            Back to login
          </Link>
        </header>

        <section className="space-y-4">
          <h2 className="font-headline text-sm tracking-widest uppercase">Status badges</h2>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="active" />
            <StatusBadge status="verified" />
            <StatusBadge status="archived" />
            <StatusBadge status="draft" />
            <StatusBadge status="revoked" />
            <StatusBadge status="flagged" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-sm tracking-widest uppercase">Stat cards</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Total Assets"
              value="$4.238B"
              sublabel="+1.2% this quarter"
              icon={Landmark}
            />
            <StatCard
              label="Active Vaults"
              value="3"
              sublabel="Encrypted status: clear"
              icon={Building2}
            />
            <StatCard
              label="Pending Releases"
              value="0"
              sublabel="Next review: June 2024"
              icon={Clock}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-sm tracking-widest uppercase">Vault cards</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <VaultCard
              id="vlt-001"
              name="My Will"
              jurisdiction="Geneva, CH"
              valueLabel="$1.24B"
              lastAccessed="2024-05-21"
              status="verified"
            />
            <VaultCard
              id="vlt-002"
              name="Family Trust"
              jurisdiction="Zurich, CH"
              valueLabel="$842.1M"
              lastAccessed="2024-05-22"
              status="archived"
            />
            <VaultCard
              id="vlt-003"
              name="Investment Portfolio"
              jurisdiction="London, UK"
              valueLabel="$2.15B"
              lastAccessed="2024-05-20"
              status="active"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-sm tracking-widest uppercase">Data table</h2>
          <DataTable
            columns={[
              { key: 'ts', header: 'Timestamp', render: (r) => r.timestamp },
              { key: 'vault', header: 'Vault', render: (r) => r.vault },
              { key: 'action', header: 'Action', render: (r) => r.action },
              {
                key: 'status',
                header: 'Status',
                render: (r) => <StatusBadge status={r.status} />,
              },
            ]}
            rows={ledgerRows}
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-sm tracking-widest uppercase">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outlined</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

        <section className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="size-4" />
          Components ready for Step 4 shells and Step 5 screens.
        </section>
      </div>
    </div>
  )
}
