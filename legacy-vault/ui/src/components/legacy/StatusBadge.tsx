import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type VaultStatus =
  | 'active'
  | 'verified'
  | 'archived'
  | 'draft'
  | 'revoked'
  | 'blocked'
  | 'flagged'
  | 'pending'

const statusStyles: Record<VaultStatus, string> = {
  active: 'bg-[#3d7a4a]/15 text-[#3d7a4a] border-[#3d7a4a]/30',
  verified: 'bg-[#3d7a4a]/15 text-[#3d7a4a] border-[#3d7a4a]/30',
  archived: 'bg-muted text-muted-foreground border-border',
  draft: 'bg-[#c47a2c]/15 text-[#c47a2c] border-[#c47a2c]/30',
  revoked: 'bg-destructive/10 text-destructive border-destructive/30',
  blocked: 'bg-destructive/10 text-destructive border-destructive/30',
  flagged: 'bg-[#c47a2c]/15 text-[#c47a2c] border-[#c47a2c]/30',
  pending: 'bg-[#c47a2c]/15 text-[#c47a2c] border-[#c47a2c]/30',
}

const statusLabels: Record<VaultStatus, string> = {
  active: 'ACTIVE',
  verified: 'VERIFIED',
  archived: 'ARCHIVED',
  draft: 'DRAFT',
  revoked: 'REVOKED',
  blocked: 'BLOCKED',
  flagged: 'FLAGGED',
  pending: 'PENDING',
}

export function StatusBadge({
  status,
  className,
}: {
  status: VaultStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-headline text-[0.65rem] tracking-wider',
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </Badge>
  )
}
