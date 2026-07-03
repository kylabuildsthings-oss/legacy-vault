import { cn } from '@/lib/utils'
import { resolveDataMode, type DataModePresentation } from '@/lib/ledger/dataMode'

const variantStyles: Record<DataModePresentation['variant'], string> = {
  success: 'border-[var(--lv-success)]/40 bg-[var(--lv-success)]/10 text-[var(--lv-success)]',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200',
  muted: 'border-border bg-muted/50 text-muted-foreground',
  destructive: 'border-destructive/40 bg-destructive/5 text-destructive',
}

interface DataModeBadgeProps {
  presentation: DataModePresentation
  errorDetail?: string | null
  className?: string
}

export function DataModeBadge({ presentation, errorDetail, className }: DataModeBadgeProps) {
  return (
    <div
      className={cn(
        'mb-6 rounded-sm border px-4 py-3 text-sm',
        variantStyles[presentation.variant],
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="font-headline text-[0.65rem] tracking-widest uppercase">
        {presentation.label}
      </div>
      <p className="mt-1 text-xs opacity-90">{presentation.detail}</p>
      {errorDetail && presentation.mode === 'live_error' ? (
        <p className="mt-2 text-xs opacity-80">{errorDetail}</p>
      ) : null}
      {presentation.mode === 'live_error' ? (
        <p className="mt-2 text-xs opacity-80">
          Start <code className="text-xs">./scripts/dev-ledger.sh</code> and{' '}
          <code className="text-xs">./scripts/dev-api.sh</code>, or set{' '}
          <code className="text-xs">VITE_USE_MOCK_LEDGER=true</code> in{' '}
          <code className="text-xs">.env.local</code> for demo fixtures.
        </p>
      ) : null}
    </div>
  )
}

export function StaticDataModeBadge() {
  return <DataModeBadge presentation={resolveDataMode()} />
}
