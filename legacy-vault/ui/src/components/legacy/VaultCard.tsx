import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge, type VaultStatus } from '@/components/legacy/StatusBadge'
import { vaultImageFor } from '@/lib/mock/vaultImages'
import { cn } from '@/lib/utils'

export interface VaultCardProps {
  id: string
  name: string
  jurisdiction: string
  /** Display value — full AUM, allocation label, or verification status */
  valueLabel: string
  lastAccessed: string
  status: VaultStatus
  /** Shown above vault name for beneficiary views */
  testatorName?: string
  /** Label before value, e.g. Total Value / Allocation / Verification */
  valueCaption?: string
  imageUrl?: string
  onEnter?: () => void
  className?: string
}

export function VaultCard({
  name,
  jurisdiction,
  valueLabel,
  lastAccessed,
  status,
  testatorName,
  valueCaption = 'Total Value',
  imageUrl,
  onEnter,
  className,
}: VaultCardProps) {
  return (
    <Card className={cn('overflow-hidden rounded-sm p-0 shadow-none', className)}>
      <div
        className="h-36 bg-cover bg-center grayscale"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : vaultImageFor(jurisdiction),
        }}
      />
      <CardHeader className="px-4 pt-4">
        <p className="font-headline text-[0.65rem] tracking-widest text-muted-foreground uppercase">
          {jurisdiction}
        </p>
        {testatorName && (
          <p className="font-headline text-[0.65rem] tracking-wider text-muted-foreground">
            {testatorName}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-headline text-base">{name}</CardTitle>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-1 px-4 text-sm text-muted-foreground">
        <p>
          {valueCaption}: {valueLabel}
        </p>
        <p>Last Accessed: {lastAccessed}</p>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent px-4 pb-4">
        <Button
          type="button"
          className="w-full font-headline text-xs tracking-widest"
          onClick={onEnter}
        >
          ENTER VAULT
        </Button>
      </CardFooter>
    </Card>
  )
}
