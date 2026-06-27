import type { AssetClass, ScopedVault, SettlementStatus, VaultAsset } from '@/lib/mock/types'

export interface TokenizedAssetDraft {
  id: string
  label: string
  type: AssetClass
}

/** Wizard mockup assets — IDs align with vault detail fixtures */
export const TOKENIZED_ASSETS: TokenizedAssetDraft[] = [
  { id: 'NFT-7721', label: 'Primary Residence (NYC)', type: 'NFT' },
  { id: 'TKN-9004', label: 'Family Trust Funds', type: 'RWA' },
]

export interface TokenizedHoldingRow {
  id: string
  assetName: string
  tokenId: string
  assetClass: AssetClass
  vaultId: string
  vaultName: string
  intendedHeirLabel: string
  settlementStatus: SettlementStatus
}

export function settlementStatusLabel(status: SettlementStatus): string {
  switch (status) {
    case 'registered':
      return 'Registered'
    case 'pending_release':
      return 'Pending release'
    case 'settled':
      return 'Settled'
  }
}

export function assetClassLabel(assetClass: AssetClass): string {
  return assetClass
}

export function settlementStatusClass(status: SettlementStatus): string {
  switch (status) {
    case 'registered':
      return 'text-[var(--lv-success)]'
    case 'pending_release':
      return 'text-[#c47a2c]'
    case 'settled':
      return 'text-[var(--lv-success)]'
  }
}

export function flattenTokenizedHoldings(vaults: ScopedVault[]): TokenizedHoldingRow[] {
  const rows: TokenizedHoldingRow[] = []
  for (const vault of vaults) {
    for (const asset of vault.visibleAssets) {
      rows.push({
        id: asset.id,
        assetName: asset.name,
        tokenId: asset.tokenId,
        assetClass: asset.assetClass,
        vaultId: vault.id,
        vaultName: vault.name,
        intendedHeirLabel: asset.intendedHeirLabel,
        settlementStatus: asset.settlementStatus,
      })
    }
  }
  return rows
}

export function countTokenizedHoldings(vaults: ScopedVault[]): number {
  return vaults.reduce((sum, v) => sum + v.visibleAssets.length, 0)
}

export type AssetTableRow = VaultAsset & { id: string }
