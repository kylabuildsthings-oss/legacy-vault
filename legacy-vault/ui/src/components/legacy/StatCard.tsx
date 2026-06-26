import type { LucideIcon } from 'lucide-react'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  sublabel,
  trend,
  icon: Icon,
  className,
}: {
  label: string
  value: string
  sublabel?: string
  trend?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Card className={cn('rounded-sm shadow-none', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline text-[0.65rem] font-normal tracking-widest text-muted-foreground uppercase">
          {label}
        </CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground" strokeWidth={1.5} />}
      </CardHeader>
      <CardContent>
        <p className="font-headline text-2xl font-bold tracking-tight">{value}</p>
        {trend && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--lv-success)]">
            <TrendingUp className="size-3" />
            {trend}
          </p>
        )}
        {sublabel && !trend && (
          <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
        )}
      </CardContent>
    </Card>
  )
}
