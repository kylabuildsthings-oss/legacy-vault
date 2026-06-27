import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { heirPayoutLabel } from '@/lib/mock/releaseWorkflow'
import type { ScopedVault } from '@/lib/mock/types'

interface BeneficiaryPayoutCardProps {
  vault: ScopedVault
  heirId: string
}

export function BeneficiaryPayoutCard({ vault, heirId }: BeneficiaryPayoutCardProps) {
  if (vault.releaseStatus !== 'release_triggered') return null

  const heir = vault.visibleHeirs.find((h) => h.id === heirId) ?? vault.heirs.find((h) => h.id === heirId)
  const payoutAmount = heirPayoutLabel(vault, heirId)

  return (
    <Card className="rounded-sm border-primary/30 bg-primary/5 shadow-none">
      <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="space-y-1">
            <p className="font-headline text-sm font-semibold tracking-wide uppercase">
              Beneficiary payout pending
            </p>
            <p className="text-sm text-muted-foreground">
              {vault.name} ({vault.id}) — atomic settlement queued on Canton.
              {heir && (
                <>
                  {' '}
                  Your allocation: {heir.allocationLabel}
                  {payoutAmount ? ` · est. ${payoutAmount}` : ''}.
                </>
              )}
            </p>
          </div>
        </div>
        <Link
          to={`/vaults/${vault.id}`}
          className="font-headline text-xs tracking-wider text-primary underline"
        >
          View vault →
        </Link>
      </CardContent>
    </Card>
  )
}
