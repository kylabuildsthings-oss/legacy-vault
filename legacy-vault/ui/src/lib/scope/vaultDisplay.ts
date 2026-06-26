import type { UserRole } from '@/lib/auth'
import { MOCK_VAULTS } from '@/lib/mock/fixtures'
import type { ScopedVault } from '@/lib/mock/types'

export interface TestatorVaultGroup {
  testatorId: string
  testatorName: string
  vaults: ScopedVault[]
}

export function vaultValueLine(vault: ScopedVault, role: UserRole): string {
  if (vault.visibility === 'full' || role === 'hnwi' || role === 'admin') {
    return vault.totalValue
  }
  if (vault.visibility === 'trigger' || role === 'oracle') {
    return 'Verification only'
  }
  const allocation = vault.visibleHeirs[0]?.allocationLabel
  return allocation ?? 'Your allocation'
}

export function vaultTitle(vault: ScopedVault, role: UserRole): string {
  if (role === 'hnwi' || role === 'admin') {
    return vault.name
  }
  return `${vault.testatorName} · ${vault.name}`
}

export function vaultsPageHeading(role: UserRole): string {
  switch (role) {
    case 'hnwi':
      return 'Your Vaults'
    case 'heir':
      return 'Beneficiary Vaults'
    case 'oracle':
      return 'Assigned Client Vaults'
    default:
      return 'Vaults'
  }
}

export function vaultsPageSubheading(role: UserRole, vaultCount: number): string {
  const noun = vaultCount === 1 ? 'vault' : 'vaults'
  switch (role) {
    case 'hnwi':
      return `${vaultCount} private ${noun} under your stewardship`
    case 'heir':
      return `${vaultCount} ${noun} where you are named beneficiary`
    case 'oracle':
      return `${vaultCount} ${noun} assigned for verification across your clients`
    default:
      return `${vaultCount} ${noun} visible for your role`
  }
}

export function vaultOverviewSectionHeading(role: UserRole): string {
  switch (role) {
    case 'hnwi':
      return 'Your Private Vaults'
    case 'heir':
      return 'Beneficiary Vaults'
    case 'oracle':
      return 'Assigned Clients'
    default:
      return 'Vaults'
  }
}

export function groupVaultsByTestator(vaults: ScopedVault[]): TestatorVaultGroup[] {
  const byTestator = new Map<string, TestatorVaultGroup>()

  for (const vault of vaults) {
    const existing = byTestator.get(vault.testatorId)
    if (existing) {
      existing.vaults.push(vault)
    } else {
      byTestator.set(vault.testatorId, {
        testatorId: vault.testatorId,
        testatorName: vault.testatorName,
        vaults: [vault],
      })
    }
  }

  return [...byTestator.values()].sort((a, b) =>
    a.testatorName.localeCompare(b.testatorName),
  )
}

export function testatorNameByVaultId(vaultId: string): string {
  const vault = MOCK_VAULTS.find((v) => v.id === vaultId)
  return vault?.testatorName ?? '—'
}

export function vaultNameByVaultId(vaultId: string): string {
  const vault = MOCK_VAULTS.find((v) => v.id === vaultId)
  return vault?.name ?? vaultId
}

export function vaultLabelById(vaultId: string): string {
  const vault = MOCK_VAULTS.find((v) => v.id === vaultId)
  if (!vault) return vaultId
  return `${vault.testatorName} · ${vault.name}`
}

export function oracleDeskSubheading(vaults: ScopedVault[]): string {
  const clientCount = groupVaultsByTestator(vaults).length
  const vaultCount = vaults.length
  const clientNoun = clientCount === 1 ? 'client' : 'clients'
  const vaultNoun = vaultCount === 1 ? 'vault' : 'vaults'
  return `${clientCount} ${clientNoun} · ${vaultCount} ${vaultNoun} assigned for verification`
}

export function showTestatorOnCard(role: UserRole): boolean {
  return role === 'heir'
}

export function vaultValueCaption(role: UserRole): string {
  switch (role) {
    case 'heir':
      return 'Allocation'
    case 'oracle':
      return 'Verification'
    default:
      return 'Total Value'
  }
}
