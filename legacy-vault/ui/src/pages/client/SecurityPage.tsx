import { useMemo, useState } from 'react'
import { Fingerprint, FileText, UserPlus, RefreshCw, Shield, Key } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { DataTable } from '@/components/legacy/DataTable'
import { StatusBadge } from '@/components/legacy/StatusBadge'
import { TimeRangeToggle } from '@/components/legacy/TimeRangeToggle'
import type { VaultStatus } from '@/components/legacy/StatusBadge'
import { useVaultScope } from '@/lib/scope/useVaultScope'
import { testatorNameByVaultId } from '@/lib/scope/vaultDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const integrityToStatus: Record<string, VaultStatus> = {
  verified: 'verified',
  flagged: 'flagged',
  blocked: 'blocked',
}

const eventIcons: Record<string, typeof Fingerprint> = {
  'Biometric Authentication': Fingerprint,
  'Asset Revaluation': RefreshCw,
  'Heir Added': UserPlus,
  'Oracle Check-in': Shield,
}

export function SecurityPage() {
  const { user } = useAuth()
  const [range, setRange] = useState<'30' | '90' | 'all'>('90')
  if (!user) return null

  const { securityEvents } = useVaultScope(user.role, user.id)

  const filtered = useMemo(() => {
    if (range === 'all') return securityEvents
    return securityEvents
  }, [securityEvents, range])

  const auditId = user.role === 'hnwi' ? '8842-X' : user.id.slice(0, 8).toUpperCase()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Security Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.displayName} · Vault Audit Trail {auditId}
          </p>
        </div>
        <TimeRangeToggle value={range} onChange={setRange} />
      </div>

      <DataTable
        columns={[
          { key: 'ts', header: 'Timestamp (UTC)', render: (r) => r.timestamp },
          {
            key: 'client',
            header: 'Client',
            render: (r) => testatorNameByVaultId(r.vaultId),
          },
          {
            key: 'type',
            header: 'Event Type',
            render: (r) => {
              const Icon = eventIcons[r.eventType] ?? FileText
              return (
                <span className="flex items-center gap-2">
                  <Icon className="size-3.5 text-muted-foreground" />
                  {r.eventType}
                </span>
              )
            },
          },
          { key: 'target', header: 'Target Asset', render: (r) => r.targetAsset },
          {
            key: 'status',
            header: 'Integrity Status',
            render: (r) => (
              <StatusBadge status={integrityToStatus[r.integrityStatus] ?? 'verified'} />
            ),
          },
        ]}
        rows={filtered}
        emptyMessage="No security events for your role."
      />

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of 258 archive events ·{' '}
        <button type="button" className="text-primary underline">
          DOWNLOAD AUDIT PDF
        </button>
        {' · '}
        <button type="button" className="text-primary underline">
          Next Page →
        </button>
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-sm shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-headline text-xs tracking-wider uppercase">
              <Shield className="size-4" />
              Security Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Logs are cryptographically hashed and distributed across private ledger
              infrastructure. Any modification triggers an immediate cross-institutional
              verification event.
            </p>
            <button type="button" className="font-headline text-[0.65rem] tracking-wider text-primary">
              REVIEW PROTOCOLS →
            </button>
          </CardContent>
        </Card>
        <Card className="rounded-sm shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-headline text-xs tracking-wider uppercase">
              <Key className="size-4" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Vaults are secured with multi-factor biometric encryption. Your hardware key
              is the root of trust for all ledger interactions.
            </p>
            <div className="flex gap-2">
              <span className="rounded border border-border px-2 py-1 font-headline text-xs">
                ID: 0042
              </span>
              <span className="rounded border border-[var(--lv-success)]/30 bg-[var(--lv-success)]/10 px-2 py-1 font-headline text-xs text-[var(--lv-success)]">
                ● ACTIVE
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
