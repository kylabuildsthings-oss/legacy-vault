import type { VaultStatus } from '@/components/legacy/StatusBadge'
import type { UserRole } from '@/lib/auth'

export type AssetClass = 'RWA' | 'NFT' | 'Security'

export type SettlementStatus = 'registered' | 'pending_release' | 'settled'

export interface VaultAsset {
  id: string
  name: string
  tokenId: string
  assetClass: AssetClass
  settlementStatus: SettlementStatus
  intendedHeirId: string
  intendedHeirLabel: string
  status: VaultStatus
}

export interface VaultHeir {
  id: string
  name: string
  allocationLabel: string
}

export type ReleaseStatus = 'idle' | 'pending_verification' | 'release_triggered'

export interface VaultRecord {
  id: string
  name: string
  jurisdiction: string
  totalValue: string
  totalValueNumeric: number
  lastAccessed: string
  status: VaultStatus
  testatorId: string
  testatorName: string
  oracleId: string
  releaseStatus?: ReleaseStatus
  heirs: VaultHeir[]
  assets: VaultAsset[]
}

export interface ScopedVault extends VaultRecord {
  visibility: 'full' | 'allocation' | 'trigger'
  visibleAssets: VaultAsset[]
  visibleHeirs: VaultHeir[]
  redactedHeirCount: number
  releaseStatus: ReleaseStatus
}

export interface LedgerEntry {
  id: string
  timestamp: string
  vaultId: string
  vaultName: string
  action: string
  status: VaultStatus
  viewerIds: string[]
}

export interface SecurityEvent {
  id: string
  timestamp: string
  eventType: string
  targetAsset: string
  vaultId: string
  integrityStatus: 'verified' | 'flagged' | 'blocked'
  viewerIds: string[]
}

export interface AdminClient {
  id: string
  name: string
  vaultCount: number
  totalAssets: string
  status: 'active' | 'inactive'
}

export interface VaultScopeStats {
  totalAssetsLabel: string
  activeVaults: number
  pendingReleases: number
  showFinancialTotals: boolean
}

export interface VaultScopeResult {
  role: UserRole
  partyId: string
  vaults: ScopedVault[]
  stats: VaultScopeStats
  ledgerEntries: LedgerEntry[]
  securityEvents: SecurityEvent[]
  canCreateVault: boolean
}
