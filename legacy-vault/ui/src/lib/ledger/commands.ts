import { apiFetch } from '@/lib/api/client'

async function postLedgerCommand(path: string, body: Record<string, unknown>): Promise<void> {
  const response = await apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`Backend ledger command failed (${response.status}): ${await response.text()}`)
  }
}

export async function initiateVerificationOnLedger(
  testatorSessionId: string,
  vaultId: string,
): Promise<void> {
  void testatorSessionId
  await postLedgerCommand(`/vaults/${vaultId}/initiate-verification`, {
  })
}

export async function confirmReleaseOnLedger(
  oracleSessionId: string,
  vaultId: string,
  beneficiaryLedgerParty: string,
  beneficiaryLabel: string,
): Promise<void> {
  void oracleSessionId
  await postLedgerCommand(`/vaults/${vaultId}/confirm-release`, {
    beneficiaryLedgerParty,
    beneficiaryLabel,
  })
}

/** VLT-001 demo beneficiary — primary heir on seeded ledger. */
export const DEMO_RELEASE_BENEFICIARY_PARTY = 'Heir_Alex'
export const DEMO_RELEASE_BENEFICIARY_LABEL = 'Alex Henderson'
