import type { UserRole } from '@/lib/auth'
import type { ScopedVault } from '@/lib/mock/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Lock, Unlock } from 'lucide-react'

function AccessCard({
  title,
  items,
  locked,
}: {
  title: string
  items: string[]
  locked: boolean
}) {
  return (
    <Card className="rounded-sm shadow-none">
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
      <CardContent className="space-y-1 text-sm">
        {items.map((item) => (
          <p
            key={item}
            className={cn(item.includes('[redacted]') && 'rounded bg-foreground/10 px-2 py-1 text-muted-foreground')}
          >
            {item}
          </p>
        ))}
      </CardContent>
    </Card>
  )
}

export function VisibilityArchitecture({
  vault,
  role,
}: {
  vault: ScopedVault
  role: UserRole
}) {
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
      ? [
          'Trigger-only access',
          'Release pending verification',
          'No asset details',
          'Verification desk active',
        ]
      : role === 'admin' || role === 'hnwi'
        ? [`Oracle: ${vault.oracleId}`, 'Trigger status visible']
        : ['No asset details visible', 'Release pending verification', 'Locked']

  const testatorCardLocked = role !== 'hnwi' && role !== 'admin'
  const heirCardLocked = role === 'oracle' || role === 'heir'
  const oracleCardLocked = role !== 'oracle' && role !== 'admin'

  return (
    <section className="space-y-3">
      <h2 className="font-headline text-sm tracking-widest uppercase">
        Visibility Architecture
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <AccessCard title="Testator (Owner)" items={testatorItems} locked={testatorCardLocked} />
        <AccessCard title="Heirs (Observers)" items={heirItems} locked={heirCardLocked} />
        <AccessCard title="Oracle (Law Firm)" items={oracleItems} locked={oracleCardLocked} />
      </div>
    </section>
  )
}
