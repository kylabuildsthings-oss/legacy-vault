export type UserRole = 'hnwi' | 'heir' | 'oracle' | 'admin'
export type VaultStatus = 'active' | 'verified' | 'archived' | 'pending'
export type AssetClass = 'RWA' | 'NFT' | 'Security'
export type SettlementStatus = 'registered' | 'pending_release' | 'settled'
export type ReleaseStatus = 'idle' | 'pending_verification' | 'release_triggered'

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

export interface LedgerVaultSnapshot {
  vaults: VaultRecord[]
  ledgerEntries: LedgerEntry[]
  securityEvents: SecurityEvent[]
}

export interface CreateVaultInput {
  name: string
  jurisdiction: string
  totalValueNumeric?: number
  oracleLedgerParty?: string
  heirs: Array<{
    name: string
    ledgerParty?: string
    allocationLabel?: string
  }>
  assets: Array<{
    name: string
    tokenId: string
    assetClass: AssetClass
    intendedHeirIndex?: number
  }>
}

export interface CreateVaultResult {
  vaultId: string
  contracts: {
    vaultAgreement: string
    oracleAssignment: string
    heirAllocations: string[]
    tokenizedAssets: string[]
  }
}

export interface DamlContract<T> {
  contractId: string
  payload: T
}

export type DamlVaultStatus = 'Active' | 'Verified' | 'Archived' | 'Pending'
export type DamlReleaseStatus = 'Idle' | 'PendingVerification' | 'ReleaseTriggered'
export type DamlSettlementStatus = 'Registered' | 'PendingRelease' | 'Settled'

export interface VaultAgreement {
  vaultId: string
  name: string
  jurisdiction: string
  totalValueNumeric: string
  lastAccessed: string
  status: DamlVaultStatus
  testator: string
  oracle: string
  admin: string
}

export interface TokenizedAsset {
  assetId: string
  vaultId: string
  name: string
  tokenId: string
  assetClass: AssetClass
  settlementStatus: DamlSettlementStatus
  intendedHeir: string
  status: DamlVaultStatus
  testator: string
  admin: string
}

export interface HeirAllocation {
  vaultId: string
  vaultName: string
  heir: string
  allocationLabel: string
  assetIds: string[]
  testator: string
  admin: string
}

export interface OracleAssignment {
  vaultId: string
  vaultName: string
  testator: string
  oracle: string
  admin: string
  releaseStatus: DamlReleaseStatus
}

export interface LedgerEvent {
  eventId: string
  vaultId: string
  vaultName: string
  action: string
  status: DamlVaultStatus
  viewers: string[]
}

export interface SecurityEventRecord {
  eventId: string
  vaultId: string
  eventType: string
  targetAsset: string
  integrityStatus: string
  viewers: string[]
}
