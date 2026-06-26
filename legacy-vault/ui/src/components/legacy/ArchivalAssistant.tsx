import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function ArchivalAssistant() {
  return (
    <Card className="rounded-sm border-border bg-card shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 font-headline text-xs tracking-wider uppercase">
          <Sparkles className="size-4 text-primary" />
          Archival Assistant
          <span className="ml-auto text-[0.55rem] font-normal text-muted-foreground normal-case">
            OpenClaw Active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          I recommend designating your spouse and children as primary heirs with clear
          allocation percentages. This ensures immediate asset transfer upon trigger.
        </p>
        <p>
          I&apos;ve analyzed your &apos;Family Trust&apos; assets. Two items lack cryptographic
          verification. Would you like me to initiate the verification process now?
        </p>
        <p className="font-headline text-xs text-[var(--lv-success)]">
          Oracle connection: [STABLE]
        </p>
        <Button variant="outline" size="sm" className="w-full font-headline text-[0.65rem] tracking-widest">
          GET HELP
        </Button>
        <div
          className="mt-4 h-32 rounded-sm bg-cover bg-center grayscale"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #d9d2c8 0%, #6b6560 100%)',
          }}
          aria-hidden
        />
      </CardContent>
    </Card>
  )
}
