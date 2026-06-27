import { Building2, Clock, Landmark } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { StatCard } from '@/components/legacy/StatCard'
import { BeneficiaryPayoutCard } from '@/components/legacy/BeneficiaryPayoutCard'
import { OracleClientDesk } from '@/components/legacy/OracleClientDesk'
import { TokenizedHoldingsTable } from '@/components/legacy/TokenizedHoldingsTable'
import { VaultCard } from '@/components/legacy/VaultCard'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useVaultScope } from '@/lib/scope/useVaultScope'
import {
  groupVaultsByTestator,
  oracleDeskSubheading,
  showTestatorOnCard,
  vaultOverviewSectionHeading,
  vaultValueCaption,
  vaultValueLine,
} from '@/lib/scope/vaultDisplay'
import { flattenTokenizedHoldings } from '@/lib/mock/tokenizedAssets'

export function OverviewPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  const scope = useVaultScope(user.role, user.id)
  const firstName = user.displayName.split(' ')[0]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Vault Overview</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {user.role === 'hnwi' && (
              <>
                Welcome back, {firstName}. Your tokenized real-world assets are secured across{' '}
                {scope.vaults.length} global jurisdictions. System status: Optimal.
              </>
            )}
            {user.role === 'heir' && (
              <>
                Welcome, {firstName}. You have beneficiary access to {scope.vaults.length}{' '}
                vault{scope.vaults.length !== 1 ? 's' : ''}. Allocation details only.
              </>
            )}
            {user.role === 'oracle' && (
              <>
                Sterling verification desk. {oracleDeskSubheading(scope.vaults)} for trigger
                oversight. Asset details withheld until release.
              </>
            )}
          </p>
        </div>
        {scope.canCreateVault && (
          <Link to="/vaults/new" className={cn(buttonVariants(), 'font-headline text-xs tracking-widest')}>
            CREATE NEW VAULT
          </Link>
        )}
      </div>

      {scope.stats.showFinancialTotals && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total Assets"
            value={scope.stats.totalAssetsLabel}
            trend={user.role === 'hnwi' ? '+1.2% THIS QUARTER' : undefined}
            sublabel={user.role !== 'hnwi' ? 'Role-scoped view' : undefined}
            icon={Landmark}
          />
          <StatCard
            label="Active Vaults"
            value={String(scope.stats.activeVaults)}
            sublabel="Encrypted status: clear"
            icon={Building2}
          />
          <StatCard
            label="Pending Releases"
            value={String(scope.stats.pendingReleases)}
            sublabel="Next review: June 2024"
            icon={Clock}
          />
        </div>
      )}

      {user.role === 'hnwi' && scope.vaults.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="font-headline text-sm tracking-widest uppercase">
              Tokenized Holdings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-world assets registered on Canton — token IDs synced across vaults.
            </p>
          </div>
          <TokenizedHoldingsTable rows={flattenTokenizedHoldings(scope.vaults)} />
        </section>
      )}

      {user.role === 'heir' && (
        <>
          {scope.vaults
            .filter((v) => v.releaseStatus === 'release_triggered')
            .map((vault) => (
              <BeneficiaryPayoutCard key={vault.id} vault={vault} heirId={user.id} />
            ))}
          <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Your Allocation"
            value={scope.stats.totalAssetsLabel}
            sublabel="Beneficiary view only"
            icon={Landmark}
          />
          <StatCard
            label="Assigned Vaults"
            value={String(scope.stats.activeVaults)}
            sublabel="Encrypted status: clear"
            icon={Building2}
          />
          <StatCard
            label="Pending Releases"
            value={String(scope.stats.pendingReleases)}
            sublabel="Awaiting oracle trigger"
            icon={Clock}
          />
          </div>
        </>
      )}

      {user.role === 'oracle' && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Assigned Clients"
            value={String(groupVaultsByTestator(scope.vaults).length)}
            icon={Building2}
          />
          <StatCard label="Assigned Vaults" value={String(scope.vaults.length)} icon={Clock} />
          <StatCard label="Asset Details" value="Hidden" sublabel="Until release trigger" icon={Landmark} />
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="font-headline text-sm tracking-widest uppercase">
            {vaultOverviewSectionHeading(user.role)}
          </h2>
          {user.role === 'oracle' && (
            <p className="mt-1 text-sm text-muted-foreground">
              Verification desk — asset details withheld until release trigger.
            </p>
          )}
        </div>
        {scope.vaults.length === 0 ? (
          <p className="text-sm text-muted-foreground">No vaults visible for your role.</p>
        ) : user.role === 'oracle' ? (
          <OracleClientDesk vaults={scope.vaults} />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {scope.vaults.map((vault) => (
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
      </section>
    </div>
  )
}
