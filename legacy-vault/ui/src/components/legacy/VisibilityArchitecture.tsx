import type { UserRole } from '@/lib/auth'
import type { ReleaseStatus, ScopedVault } from '@/lib/mock/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Lock, Unlock } from 'lucide-react'

function RedactedHeirBlock({ label }: { label: string }) {
  const match = label.match(/^(\d+) other heir\(s\) \[redacted\]$/)
  const count = match?.[1]

  return (
    <div className="space-y-1.5">
      {count && <p className="text-xs text-muted-foreground">{count} other heir(s)</p>}
      <div
        className="h-5 w-full rounded-sm bg-foreground"
        role="img"
        aria-label="Redacted heir information"
      />
      <p className="font-headline text-[0.55rem] tracking-widest text-muted-foreground uppercase">
        [redacted]
      </p>
    </div>
  )
}

function AccessCardItem({ item }: { item: string }) {
  if (/^\d+ other heir\(s\) \[redacted\]$/.test(item)) {
    return <RedactedHeirBlock label={item} />
  }

  if (item === 'Release pending verification') {
    return (
      <p className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 font-headline text-xs font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-200">
        {item}
      </p>
    )
  }

  return <p>{item}</p>
}

function AccessCard({
  title,
  items,
  locked,
  pending,
}: {
  title: string
  items: string[]
  locked: boolean
  pending?: boolean
}) {
  return (
    <Card
      className={cn(
        'rounded-sm shadow-none',
        pending && 'border-amber-500/40 bg-amber-500/5',
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-xs tracking-wider uppercase">{title}</CardTitle>
          {locked ? (
            <Lock className="size-4 text-muted-foreground" />
          ) : (
            <Unlock className="size-4 text-[var(--lv-success)]" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {items.map((item) => (
          <AccessCardItem key={item} item={item} />
        ))}
      </CardContent>
    </Card>
  )
}

function isReleasePending(releaseStatus: ReleaseStatus) {
  return releaseStatus === 'pending_verification'
}

export function VisibilityArchitecture({
  vault,
  role,
}: {
  vault: ScopedVault
  role: UserRole
}) {
  const releasePending = isReleasePending(vault.releaseStatus)

  const testatorItems =
    role === 'admin'
      ? [
          `Client: ${vault.testatorName}`,
          'Full structure visible',
          'Institutional oversight',
          'Unlocked',
        ]
      : role === 'hnwi'
        ? ['Full asset list visible', 'All heir names visible', 'Unlocked']
        : role === 'heir'
          ? [
              `Owner: ${vault.testatorName}`,
              'Full structure hidden',
              'Beneficiary view only',
              'Locked',
            ]
          : role === 'oracle'
            ? [
                `Client: ${vault.testatorName}`,
                'Assigned oracle: you',
                'Trigger oversight active',
                'Asset details withheld',
              ]
            : ['Full structure hidden', 'Testator-only view', 'Locked']

  const heirItems =
    role === 'admin' || role === 'hnwi'
      ? vault.visibleHeirs.map((h) => `${h.name} — ${h.allocationLabel}`)
      : role === 'heir'
        ? vault.visibleHeirs.length > 0
          ? [
              ...vault.visibleHeirs.map((h) => h.allocationLabel),
              ...(vault.redactedHeirCount > 0
                ? [`${vault.redactedHeirCount} other heir(s) [redacted]`]
                : []),
            ]
          : ['No allocation on this vault']
        : ['Other heirs redacted', 'Locked']

  const oracleItems =
    role === 'oracle'
      ? releasePending
        ? [
            'Release pending verification',
            'Trigger-only access',
            'No asset details',
            'Verification desk active',
          ]
        : [
            'Trigger-only access',
            'No asset details',
            'Verification desk active',
          ]
      : role === 'admin' || role === 'hnwi'
        ? releasePending
          ? ['Release pending verification', `Oracle: ${vault.oracleId}`, 'Trigger status visible']
          : [`Oracle: ${vault.oracleId}`, 'Trigger status visible']
        : releasePending
          ? ['Release pending verification', 'No asset details visible', 'Locked']
          : ['No asset details visible', 'Locked']

  const testatorCardLocked = role !== 'hnwi' && role !== 'admin'
  const heirCardLocked = role === 'oracle' || role === 'heir'
  const oracleCardLocked = role !== 'oracle' && role !== 'admin'
  const oracleCardPending = releasePending

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-headline text-sm tracking-widest uppercase">
          Visibility Architecture
        </h2>
        <p className="mt-1 text-sm italic text-muted-foreground">
          Verification of multi-party cryptographic permissions across the ledger.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <AccessCard title="Testator (Owner)" items={testatorItems} locked={testatorCardLocked} />
        <AccessCard title="Heirs (Observers)" items={heirItems} locked={heirCardLocked} />
        <AccessCard
          title="Oracle (Law Firm)"
          items={oracleItems}
          locked={oracleCardLocked}
          pending={oracleCardPending}
        />
      </div>
    </section>
  )
}
