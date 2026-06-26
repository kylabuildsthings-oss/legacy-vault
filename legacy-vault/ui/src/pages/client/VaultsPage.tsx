import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { OracleClientDesk } from '@/components/legacy/OracleClientDesk'
import { VaultCard } from '@/components/legacy/VaultCard'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useVaultScope } from '@/lib/scope/useVaultScope'
import {
  oracleDeskSubheading,
  showTestatorOnCard,
  vaultsPageHeading,
  vaultsPageSubheading,
  vaultValueCaption,
  vaultValueLine,
} from '@/lib/scope/vaultDisplay'

export function VaultsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  const { vaults, canCreateVault } = useVaultScope(user.role, user.id)

  const subheading =
    user.role === 'oracle'
      ? oracleDeskSubheading(vaults)
      : vaultsPageSubheading(user.role, vaults.length)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">{vaultsPageHeading(user.role)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
          {user.role === 'oracle' && (
            <p className="mt-1 text-sm text-muted-foreground">
              Select a client vault below to review verification status.
            </p>
          )}
        </div>
        {canCreateVault && (
          <Link
            to="/vaults/new"
            className={cn(buttonVariants(), 'font-headline text-xs tracking-widest')}
          >
            CREATE NEW VAULT
          </Link>
        )}
      </div>

      {vaults.length === 0 ? (
        <p className="rounded border border-dashed border-border p-8 text-center text-muted-foreground">
          No vaults assigned to your account.
        </p>
      ) : user.role === 'oracle' ? (
        <OracleClientDesk vaults={vaults} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vaults.map((vault) => (
            <VaultCard
              key={vault.id}
              id={vault.id}
              name={vault.name}
              jurisdiction={vault.jurisdiction}
              valueLabel={vaultValueLine(vault, user.role)}
              valueCaption={vaultValueCaption(user.role)}
              testatorName={showTestatorOnCard(user.role) ? vault.testatorName : undefined}
              lastAccessed={vault.lastAccessed}
              status={vault.status}
              onEnter={() => navigate(`/vaults/${vault.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
