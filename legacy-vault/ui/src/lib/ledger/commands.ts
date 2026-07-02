import type { ContractId } from '@daml/types'
import { getLedgerForParty, clearLedgerCache } from '@/lib/ledger/client'
import { ledgerPartyForSession, resolveLedgerPartyId } from '@/lib/ledger/parties'
import { damlJsonApiUrl } from '@/lib/ledger/config'
import { findOracleAssignment } from '@/lib/ledger/queries'
import * as Vault from '@daml.js/legacy-vault-0.1.0/lib/Vault'

export async function initiateVerificationOnLedger(
  testatorSessionId: string,
  vaultId: string,
): Promise<void> {
  const ledgerParty = ledgerPartyForSession(testatorSessionId)
  if (!ledgerParty) throw new Error('Testator has no ledger party mapping')

  const ledger = await getLedgerForParty(ledgerParty)
  const assignments = await ledger.query(Vault.OracleAssignment)
  const match = assignments.find(({ payload }) => payload.vaultId === vaultId)
  if (!match) throw new Error(`No OracleAssignment on ledger for ${vaultId}`)

  await ledger.exercise(Vault.OracleAssignment.InitiateVerification, match.contractId as ContractId<Vault.OracleAssignment>, {})
  clearLedgerCache()
}

export async function confirmReleaseOnLedger(
  oracleSessionId: string,
  vaultId: string,
  beneficiaryLedgerParty: string,
  beneficiaryLabel: string,
): Promise<void> {
  const ledgerParty = ledgerPartyForSession(oracleSessionId)
  if (!ledgerParty) throw new Error('Oracle has no ledger party mapping')

  const assignment = await findOracleAssignment(oracleSessionId, vaultId)
  if (!assignment) throw new Error(`No OracleAssignment on ledger for ${vaultId}`)

  const beneficiaryPartyId = await resolveLedgerPartyId(beneficiaryLedgerParty, damlJsonApiUrl)

  const ledger = await getLedgerForParty(ledgerParty)
  await ledger.exercise(Vault.OracleAssignment.ConfirmRelease, assignment.contractId as ContractId<Vault.OracleAssignment>, {
    beneficiary: beneficiaryPartyId,
    beneficiaryLabel,
  })
  clearLedgerCache()
}

/** VLT-001 demo beneficiary — primary heir on seeded ledger. */
export const DEMO_RELEASE_BENEFICIARY_PARTY = 'Heir_Alex'
export const DEMO_RELEASE_BENEFICIARY_LABEL = 'Alex Henderson'
