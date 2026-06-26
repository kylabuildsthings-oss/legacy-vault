import { cn } from '@/lib/utils'

const RANGES = ['30', '90', 'all'] as const
const LABELS: Record<(typeof RANGES)[number], string> = {
  '30': 'Last 30 days',
  '90': '90 days',
  all: 'All',
}

export function TimeRangeToggle({
  value,
  onChange,
}: {
  value: (typeof RANGES)[number]
  onChange: (v: (typeof RANGES)[number]) => void
}) {
  return (
    <div className="inline-flex rounded-sm border border-border bg-card p-0.5">
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className={cn(
            'px-3 py-1 font-headline text-[0.65rem] tracking-wider uppercase',
            value === range
              ? 'rounded-sm bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {LABELS[range]}
        </button>
      ))}
    </div>
  )
}
