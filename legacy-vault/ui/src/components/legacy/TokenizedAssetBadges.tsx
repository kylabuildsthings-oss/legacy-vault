import type { AssetClass, SettlementStatus } from '@/lib/mock/types'
import { cn } from '@/lib/utils'
import { assetClassLabel, settlementStatusClass, settlementStatusLabel } from '@/lib/mock/tokenizedAssets'

export function AssetClassBadge({ assetClass }: { assetClass: AssetClass }) {
  return (
    <span
      className={cn(
        'inline-block rounded border border-border px-2 py-0.5 font-headline text-[0.6rem] tracking-wider',
        assetClass === 'RWA' && 'border-[#3d7a4a]/30 bg-[#3d7a4a]/10 text-[#3d7a4a]',
        assetClass === 'NFT' && 'border-primary/30 bg-primary/10 text-primary',
        assetClass === 'Security' && 'border-border bg-muted text-muted-foreground',
      )}
    >
      {assetClassLabel(assetClass)}
    </span>
  )
}

export function SettlementStatusText({ status }: { status: SettlementStatus }) {
  return (
    <span className={cn('font-medium', settlementStatusClass(status))}>
      {settlementStatusLabel(status)}
    </span>
  )
}
