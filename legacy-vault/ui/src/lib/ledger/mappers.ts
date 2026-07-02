import type { VaultStatus } from '@/components/legacy/StatusBadge'
import type { Party } from '@daml/types'
import type {
  AssetClass,
  LedgerEntry,
  ReleaseStatus,
  SecurityEvent,
  SettlementStatus,
  VaultAsset,
  VaultHeir,
  VaultRecord,
} from '@/lib/mock/types'
import { formatAum } from '@/lib/mock/fixtures'
import {
  labelForLedgerParty,
  sessionIdForLedgerParty,
  type PartyDirectory,
} from '@/lib/ledger/parties'
import type * as DamlVault from '@daml.js/legacy-vault-0.1.0/lib/Vault'

type DamlReleaseStatus = DamlVault.ReleaseStatus
type DamlVaultStatus = DamlVault.VaultStatus
type DamlAssetClass = DamlVault.AssetClass
type DamlSettlementStatus = DamlVault.SettlementStatus

export function mapReleaseStatus(status: DamlReleaseStatus): ReleaseStatus {
  switch (status) {
    case 'Idle':
      return 'idle'
    case 'PendingVerification':
      return 'pending_verification'
    case 'ReleaseTriggered':
      return 'release_triggered'
    default:
      return 'idle'
  }
}

export function mapVaultStatus(status: DamlVaultStatus): VaultStatus {
  switch (status) {
    case 'Active':
      return 'active'
    case 'Verified':
      return 'verified'
    case 'Archived':
      return 'archived'
    case 'Pending':
      return 'pending'
    default:
      return 'active'
  }
}

export function mapAssetClass(assetClass: DamlAssetClass): AssetClass {
  return assetClass
}

export function mapSettlementStatus(status: DamlSettlementStatus): SettlementStatus {
  switch (status) {
    case 'Registered':
      return 'registered'
    case 'PendingRelease':
      return 'pending_release'
    case 'Settled':
      return 'settled'
    default:
      return 'registered'
  }
}

export function mapIntegrityStatus(
  value: string,
): SecurityEvent['integrityStatus'] {
  if (value === 'flagged' || value === 'blocked') return value
  return 'verified'
}

interface VaultParts {
  agreement?: DamlVault.VaultAgreement
  oracle?: DamlVault.OracleAssignment
  heirs: DamlVault.HeirAllocation[]
  assets: DamlVault.TokenizedAsset[]
}

export function assembleVaultRecord(
  vaultId: string,
  parts: VaultParts,
  partyLabels: PartyDirectory,
): VaultRecord | null {
  const { agreement, oracle, heirs, assets } = parts
  if (!agreement && !oracle && heirs.length === 0 && assets.length === 0) {
    return null
  }

  const name = agreement?.name ?? oracle?.vaultName ?? heirs[0]?.vaultName ?? vaultId
  const testatorParty = agreement?.testator ?? oracle?.testator ?? heirs[0]?.testator ?? ''
  const oracleParty = agreement?.oracle ?? oracle?.oracle ?? ''
  const testatorId = sessionIdForLedgerParty(testatorParty, partyLabels)
  const oracleId = sessionIdForLedgerParty(oracleParty, partyLabels)
  const releaseStatus = oracle ? mapReleaseStatus(oracle.releaseStatus) : 'idle'

  const vaultHeirs: VaultHeir[] = heirs.map((h) => ({
    id: sessionIdForLedgerParty(h.heir, partyLabels),
    name: labelForLedgerParty(h.heir, partyLabels),
    allocationLabel: h.allocationLabel,
  }))

  const vaultAssets: VaultAsset[] = assets.map((a) => ({
    id: a.assetId,
    name: a.name,
    tokenId: a.tokenId,
    assetClass: mapAssetClass(a.assetClass),
    settlementStatus: mapSettlementStatus(a.settlementStatus),
    intendedHeirId: sessionIdForLedgerParty(a.intendedHeir, partyLabels),
    intendedHeirLabel: labelForLedgerParty(a.intendedHeir, partyLabels),
    status: mapVaultStatus(a.status),
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
    testatorId,
    testatorName: labelForLedgerParty(testatorParty, partyLabels),
    oracleId,
    releaseStatus,
    heirs: vaultHeirs,
    assets: vaultAssets,
  }
}

export function mapLedgerEvent(
  event: DamlVault.LedgerEvent,
  partyLabels: PartyDirectory,
): LedgerEntry {
  return {
    id: event.eventId,
    timestamp: new Date().toISOString(),
    vaultId: event.vaultId,
    vaultName: event.vaultName,
    action: event.action,
    status: mapVaultStatus(event.status),
    viewerIds: event.viewers.map((p: Party) => sessionIdForLedgerParty(p, partyLabels)),
  }
}

export function mapSecurityEvent(
  event: DamlVault.SecurityEventRecord,
  partyLabels: PartyDirectory,
): SecurityEvent {
  return {
    id: event.eventId,
    timestamp: new Date().toISOString(),
    eventType: event.eventType,
    targetAsset: event.targetAsset,
    vaultId: event.vaultId,
    integrityStatus: mapIntegrityStatus(event.integrityStatus),
    viewerIds: event.viewers.map((p: Party) => sessionIdForLedgerParty(p, partyLabels)),
  }
}
