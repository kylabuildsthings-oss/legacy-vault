import type { ContractId } from '@daml/types'
import type { UserRole } from '@/lib/auth'
import type { LedgerEntry, SecurityEvent, VaultRecord } from '@/lib/mock/types'
import { getLedgerForParty } from '@/lib/ledger/client'
import {
  assembleVaultRecord,
  mapLedgerEvent,
  mapSecurityEvent,
} from '@/lib/ledger/mappers'
import {
  fetchPartyDirectory,
  ledgerPartyForSession,
  type PartyDirectory,
} from '@/lib/ledger/parties'
import { createDevAccessToken } from '@/lib/ledger/auth'
import { damlJsonApiUrl } from '@/lib/ledger/config'
import * as Vault from '@daml.js/legacy-vault-0.1.0/lib/Vault'

export interface LedgerVaultSnapshot {
  vaults: VaultRecord[]
  ledgerEntries: LedgerEntry[]
  securityEvents: SecurityEvent[]
  oracleAssignments: Array<{
    contractId: ContractId<Vault.OracleAssignment>
    payload: Vault.OracleAssignment
  }>
}

async function loadPartyLabels(ledgerParty: string): Promise<PartyDirectory> {
  const token = await createDevAccessToken(ledgerParty)
  return fetchPartyDirectory(damlJsonApiUrl, token)
}

export async function fetchLedgerSnapshot(
  role: UserRole,
  sessionUserId: string,
): Promise<LedgerVaultSnapshot> {
  const ledgerParty = ledgerPartyForSession(sessionUserId)
  if (!ledgerParty) {
    throw new Error(`No ledger party mapped for session user ${sessionUserId}`)
  }

  const partyLabels = await loadPartyLabels(ledgerParty)
  const ledger = await getLedgerForParty(ledgerParty)

  const vaultParts = new Map<
    string,
    {
      agreement?: Vault.VaultAgreement
      oracle?: Vault.OracleAssignment
      heirs: Vault.HeirAllocation[]
      assets: Vault.TokenizedAsset[]
    }
  >()

  function ensureVault(vaultId: string) {
    if (!vaultParts.has(vaultId)) {
      vaultParts.set(vaultId, { heirs: [], assets: [] })
    }
    return vaultParts.get(vaultId)!
  }

  const oracleAssignments: Array<{
    contractId: ContractId<Vault.OracleAssignment>
    payload: Vault.OracleAssignment
  }> = []

  if (role === 'admin' || role === 'hnwi') {
    const agreements = await ledger.query(Vault.VaultAgreement)
    for (const { contractId, payload } of agreements) {
      const parts = ensureVault(payload.vaultId)
      parts.agreement = payload
      void contractId
    }
  }

  const assignments = await ledger.query(Vault.OracleAssignment)
  for (const { contractId, payload } of assignments) {
    const parts = ensureVault(payload.vaultId)
    parts.oracle = payload
    oracleAssignments.push({ contractId, payload })
  }

  const allocations = await ledger.query(Vault.HeirAllocation)
  for (const { payload } of allocations) {
    const parts = ensureVault(payload.vaultId)
    parts.heirs.push(payload)
  }

  const assets = await ledger.query(Vault.TokenizedAsset)
  for (const { payload } of assets) {
    const parts = ensureVault(payload.vaultId)
    parts.assets.push(payload)
  }

  const vaults: VaultRecord[] = []
  for (const [vaultId, parts] of vaultParts) {
    const record = assembleVaultRecord(vaultId, parts, partyLabels)
    if (record) vaults.push(record)
  }

  const ledgerEvents = await ledger.query(Vault.LedgerEvent)
  const ledgerEntries = ledgerEvents.map(({ payload }) => mapLedgerEvent(payload, partyLabels))

  const securityRows = await ledger.query(Vault.SecurityEventRecord)
  const securityEvents = securityRows.map(({ payload }) =>
    mapSecurityEvent(payload, partyLabels),
  )

  return { vaults, ledgerEntries, securityEvents, oracleAssignments }
}

export async function findOracleAssignment(
  sessionUserId: string,
  vaultId: string,
): Promise<{
  contractId: ContractId<Vault.OracleAssignment>
  payload: Vault.OracleAssignment
} | null> {
  const snapshot = await fetchLedgerSnapshot('oracle', sessionUserId)
  return snapshot.oracleAssignments.find((a) => a.payload.vaultId === vaultId) ?? null
}
