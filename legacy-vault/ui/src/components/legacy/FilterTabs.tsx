import { cn } from '@/lib/utils'

export function FilterTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-sm px-3 py-1.5 font-headline text-[0.65rem] tracking-wider uppercase transition-colors',
            active === tab.id
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-card text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
