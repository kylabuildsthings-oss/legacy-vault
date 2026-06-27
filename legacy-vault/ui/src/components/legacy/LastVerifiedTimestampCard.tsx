import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LastVerifiedTimestampCard() {
  return (
    <Card className="rounded-sm shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xs tracking-wider uppercase">
          Last Verified Timestamp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 font-headline text-sm">
        <p className="flex items-center gap-1.5">
          <CheckCircle2 className="size-4 text-[var(--lv-success)]" />
          OCT 24, 2024 — 14:32:01 UTC
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-[var(--lv-success)]" />
          HASH: 0x82f...a1c9 · Verified
        </p>
      </CardContent>
    </Card>
  )
}
