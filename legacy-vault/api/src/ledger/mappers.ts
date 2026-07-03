import { labelForLedgerParty, sessionIdForLedgerParty, type PartyDirectory } from './parties.js'
import type {
  DamlReleaseStatus,
  DamlSettlementStatus,
  DamlVaultStatus,
  HeirAllocation,
  LedgerEntry,
  LedgerEvent,
  ReleaseStatus,
  SecurityEvent,
  SecurityEventRecord,
  SettlementStatus,
  TokenizedAsset,
  VaultAgreement,
  VaultRecord,
  VaultStatus,
} from './types.js'

interface VaultParts {
  agreement?: VaultAgreement
  oracle?: {
    vaultId: string
    vaultName: string
    testator: string
    oracle: string
    releaseStatus: DamlReleaseStatus
  }
  heirs: HeirAllocation[]
  assets: TokenizedAsset[]
}

function formatAum(value: number): string {
  if (!value) return '$0'
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(3)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  return `$${value.toLocaleString()}`
}

export function mapReleaseStatus(status: DamlReleaseStatus): ReleaseStatus {
  switch (status) {
    case 'PendingVerification':
      return 'pending_verification'
    case 'ReleaseTriggered':
      return 'release_triggered'
    case 'Idle':
    default:
      return 'idle'
  }
}

export function mapVaultStatus(status: DamlVaultStatus): VaultStatus {
  switch (status) {
    case 'Verified':
      return 'verified'
    case 'Archived':
      return 'archived'
    case 'Pending':
      return 'pending'
    case 'Active':
    default:
      return 'active'
  }
}

export function mapSettlementStatus(status: DamlSettlementStatus): SettlementStatus {
  switch (status) {
    case 'PendingRelease':
      return 'pending_release'
    case 'Settled':
      return 'settled'
    case 'Registered':
    default:
      return 'registered'
  }
}

function mapIntegrityStatus(value: string): SecurityEvent['integrityStatus'] {
  if (value === 'flagged' || value === 'blocked') return value
  return 'verified'
}

export function assembleVaultRecord(
  vaultId: string,
  parts: VaultParts,
  partyLabels: PartyDirectory,
): VaultRecord | null {
  const { agreement, oracle, heirs, assets } = parts
  if (!agreement && !oracle && heirs.length === 0 && assets.length === 0) return null

  const name = agreement?.name ?? oracle?.vaultName ?? heirs[0]?.vaultName ?? vaultId
  const testatorParty = agreement?.testator ?? oracle?.testator ?? heirs[0]?.testator ?? ''
  const oracleParty = agreement?.oracle ?? oracle?.oracle ?? ''
  const releaseStatus = oracle ? mapReleaseStatus(oracle.releaseStatus) : 'idle'

  const vaultAssets = assets.map((asset) => ({
    id: asset.assetId,
    name: asset.name,
    tokenId: asset.tokenId,
    assetClass: asset.assetClass,
    settlementStatus: mapSettlementStatus(asset.settlementStatus),
    intendedHeirId: sessionIdForLedgerParty(asset.intendedHeir, partyLabels),
    intendedHeirLabel: labelForLedgerParty(asset.intendedHeir, partyLabels),
    status: mapVaultStatus(asset.status),
  }))

  const totalValueNumeric = agreement?.totalValueNumeric
    ? Number(agreement.totalValueNumeric)
    : vaultAssets.length > 0
      ? 1_240_000_000
      : 0

  return {
    id: vaultId,
    name,
    jurisdiction: agreement?.jurisdiction ?? 'Geneva, CH',
    totalValue: formatAum(totalValueNumeric),
    totalValueNumeric,
    lastAccessed: agreement?.lastAccessed ?? new Date().toISOString().slice(0, 10),
    status: agreement ? mapVaultStatus(agreement.status) : 'verified',
    testatorId: sessionIdForLedgerParty(testatorParty, partyLabels),
    testatorName: labelForLedgerParty(testatorParty, partyLabels),
    oracleId: sessionIdForLedgerParty(oracleParty, partyLabels),
    releaseStatus,
    heirs: heirs.map((heir) => ({
      id: sessionIdForLedgerParty(heir.heir, partyLabels),
      name: labelForLedgerParty(heir.heir, partyLabels),
      allocationLabel: heir.allocationLabel,
    })),
    assets: vaultAssets,
  }
}

export function mapLedgerEvent(event: LedgerEvent, partyLabels: PartyDirectory): LedgerEntry {
  return {
    id: event.eventId,
    timestamp: new Date().toISOString(),
    vaultId: event.vaultId,
    vaultName: event.vaultName,
    action: event.action,
    status: mapVaultStatus(event.status),
    viewerIds: event.viewers.map((partyId) => sessionIdForLedgerParty(partyId, partyLabels)),
  }
}

export function mapSecurityEvent(
  event: SecurityEventRecord,
  partyLabels: PartyDirectory,
): SecurityEvent {
  return {
    id: event.eventId,
    timestamp: new Date().toISOString(),
    eventType: event.eventType,
    targetAsset: event.targetAsset,
    vaultId: event.vaultId,
    integrityStatus: mapIntegrityStatus(event.integrityStatus),
    viewerIds: event.viewers.map((partyId) => sessionIdForLedgerParty(partyId, partyLabels)),
  }
}
