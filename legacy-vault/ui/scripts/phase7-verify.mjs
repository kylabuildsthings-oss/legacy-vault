/**
 * Phase 7 — programmatic ledger workflow smoke test (dev only).
 * Run: node scripts/phase7-verify.mjs
 */
import DamlLedger from '@daml/ledger'
import * as Vault from '@daml.js/legacy-vault-0.1.0/lib/Vault/index.js'

const API = 'http://localhost:7575'
const SECRET = 'secret'
const LEDGER_ID = 'sandbox'

function base64UrlEncode(bytes) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlEncodeJson(value) {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(value)))
}

async function token(party) {
  const header = base64UrlEncodeJson({ alg: 'HS256', typ: 'JWT' })
  const payload = base64UrlEncodeJson({
    'https://daml.com/ledger-api': {
      ledgerId: LEDGER_ID,
      applicationId: 'phase7-verify',
      actAs: [party],
      readAs: [party],
    },
  })
  const unsigned = `${header}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(unsigned))
  return `${unsigned}.${base64UrlEncode(new Uint8Array(sig))}`
}

async function partyId(displayName) {
  const t = await token(displayName)
  const res = await fetch(`${API}/v1/parties`, { headers: { Authorization: `Bearer ${t}` } })
  if (!res.ok) throw new Error(`parties failed: ${res.status}`)
  const body = await res.json()
  const row = (body.result ?? []).find((p) => p.displayName === displayName)
  if (!row) throw new Error(`Party not found: ${displayName}`)
  return row.identifier
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function main() {
  console.log('Phase 7 verify — connecting to', API)

  const sarahId = await partyId('Testator_Sarah')
  const alexId = await partyId('Heir_Alex')
  console.log('Parties resolved OK')

  const Ledger = DamlLedger.default ?? DamlLedger
  const sarahLedger = new Ledger({ token: await token(sarahId), httpBaseUrl: `${API}/` })
  const oracleId = await partyId('Oracle_Sterling')
  const oracleLedger = new Ledger({ token: await token(oracleId), httpBaseUrl: `${API}/` })
  const alexLedger = new Ledger({ token: await token(alexId), httpBaseUrl: `${API}/` })

  const assignments = await sarahLedger.query(Vault.OracleAssignment)
  assert(assignments.length >= 1, 'Sarah should see OracleAssignment')
  const vlt001 = assignments.find((a) => a.payload.vaultId === 'VLT-001')
  assert(vlt001, 'VLT-001 OracleAssignment missing')
  console.log('VLT-001 release status:', vlt001.payload.releaseStatus)

  if (vlt001.payload.releaseStatus === 'Idle') {
    await sarahLedger.exercise(Vault.OracleAssignment.InitiateVerification, vlt001.contractId, {})
    console.log('InitiateVerification exercised')
  } else if (vlt001.payload.releaseStatus === 'ReleaseTriggered') {
    console.log('Ledger already at ReleaseTriggered — restart dev-ledger.sh for fresh Idle seed')
    const alexSettlements = await alexLedger.query(Vault.SettlementRecord)
    const alexEvents = await alexLedger.query(Vault.LedgerEvent)
    assert(alexSettlements.length >= 1, 'Alex should see SettlementRecord')
    assert(alexEvents.length >= 2, 'Alex should see ledger events')
    console.log('Post-release state OK — settlements:', alexSettlements.length, 'events:', alexEvents.length)
    console.log('\nPhase 7 programmatic verify: PASS (already released)')
    return
  } else {
    console.log('Skipping InitiateVerification (status:', vlt001.payload.releaseStatus, ')')
  }

  const oracleAssignments = await oracleLedger.query(Vault.OracleAssignment)
  const pending = oracleAssignments.find((a) => a.payload.vaultId === 'VLT-001')
  assert(pending?.payload.releaseStatus === 'PendingVerification', 'Expected PendingVerification')
  console.log('Oracle sees PendingVerification')

  await oracleLedger.exercise(Vault.OracleAssignment.ConfirmRelease, pending.contractId, {
    beneficiary: alexId,
    beneficiaryLabel: 'Alex Henderson',
  })
  console.log('ConfirmRelease exercised')

  const alexSettlements = await alexLedger.query(Vault.SettlementRecord)
  assert(alexSettlements.length >= 1, 'Alex should see SettlementRecord')
  const alexEvents = await alexLedger.query(Vault.LedgerEvent)
  assert(alexEvents.length >= 2, 'Alex should see ledger events')
  console.log('Alex settlements:', alexSettlements.length, 'ledger events:', alexEvents.length)

  const sarahVaults = await sarahLedger.query(Vault.VaultAgreement)
  assert(sarahVaults.length === 1, 'Sarah should see 1 vault')
  console.log('Sarah vaults:', sarahVaults.length)

  console.log('\nPhase 7 programmatic verify: PASS')
}

main().catch((err) => {
  console.error('\nPhase 7 programmatic verify: FAIL')
  console.error(err)
  process.exit(1)
})
