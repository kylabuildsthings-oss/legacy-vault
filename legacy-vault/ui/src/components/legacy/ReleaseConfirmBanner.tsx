import { useState } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ReleaseStatus } from '@/lib/mock/types'

interface ReleaseConfirmBannerProps {
  vaultId: string
  vaultName: string
  testatorName: string
  releaseStatus: ReleaseStatus
  onConfirm: () => void
}

export function ReleaseConfirmBanner({
  vaultId,
  vaultName,
  testatorName,
  releaseStatus,
  onConfirm,
}: ReleaseConfirmBannerProps) {
  const [confirmed, setConfirmed] = useState(false)

  if (releaseStatus === 'idle') return null

  if (releaseStatus === 'release_triggered' || confirmed) {
    return (
      <Card className="rounded-sm border-[var(--lv-success)]/40 bg-[var(--lv-success)]/5 shadow-none">
        <CardContent className="flex items-start gap-3 pt-6">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--lv-success)]" />
          <div className="space-y-1">
            <p className="font-headline text-sm font-semibold tracking-wide uppercase">
              Release trigger confirmed
            </p>
            <p className="text-sm text-muted-foreground">
              Atomic settlement queued for {vaultName} ({vaultId}). Beneficiary payout and ledger
              entries are now visible to authorized parties on Canton.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-sm border-amber-500/40 bg-amber-500/5 shadow-none">
      <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="font-headline text-sm font-semibold tracking-wide uppercase">
              Release verification pending
            </p>
            <p className="text-sm text-muted-foreground">
              {testatorName} · {vaultName} ({vaultId}) — death certificate and trigger conditions
              verified. Confirm release to queue atomic settlement on Canton.
            </p>
          </div>
        </div>
        <Button
          className="font-headline text-xs tracking-wider"
          onClick={() => {
            onConfirm()
            setConfirmed(true)
          }}
        >
          Confirm release trigger
        </Button>
      </CardContent>
    </Card>
  )
}
