import { type ApiConfig, config } from '../config.js'
import { createDamlAccessToken } from './auth.js'
import { damlJsonApiRequest } from './jsonApi.js'
import { assembleVaultRecord, mapLedgerEvent, mapSecurityEvent } from './mappers.js'
import {
  fetchPartyDirectory,
  ledgerPartyForSession,
  resolveLedgerPartyId,
  type PartyDirectory,
} from './parties.js'
import type {
  DamlContract,
  CreateVaultInput,
  CreateVaultResult,
  HeirAllocation,
  LedgerEvent,
  LedgerVaultSnapshot,
  OracleAssignment,
  SecurityEventRecord,
  TokenizedAsset,
  UserRole,
  VaultAgreement,
} from './types.js'

function templateIds(appConfig: ApiConfig) {
  return {
    vaultAgreement: `${appConfig.DAML_PACKAGE_ID}:Vault:VaultAgreement`,
    tokenizedAsset: `${appConfig.DAML_PACKAGE_ID}:Vault:TokenizedAsset`,
    heirAllocation: `${appConfig.DAML_PACKAGE_ID}:Vault:HeirAllocation`,
    oracleAssignment: `${appConfig.DAML_PACKAGE_ID}:Vault:OracleAssignment`,
    ledgerEvent: `${appConfig.DAML_PACKAGE_ID}:Vault:LedgerEvent`,
    securityEventRecord: `${appConfig.DAML_PACKAGE_ID}:Vault:SecurityEventRecord`,
  } as const
}

interface QueryResponse<T> {
  result?: Array<DamlContract<T>>
}

interface CreateResponse {
  result?: { contractId: string }
}

async function queryTemplate<T>(
  templateId: string,
  token: string,
  appConfig: ApiConfig,
): Promise<Array<DamlContract<T>>> {
  const body = await damlJsonApiRequest<QueryResponse<T>>(
    '/v1/query',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ templateIds: [templateId] }),
    },
    appConfig,
  )

  return body.result ?? []
}

async function createContract<TPayload extends Record<string, unknown>>(
  templateId: string,
  payload: TPayload,
  token: string,
  appConfig: ApiConfig,
): Promise<string> {
  const body = await damlJsonApiRequest<CreateResponse>(
    '/v1/create',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ templateId, payload }),
    },
    appConfig,
  )

  const contractId = body.result?.contractId
  if (!contractId) throw new Error(`Daml create did not return a contract id for ${templateId}`)
  return contractId
}

async function exerciseChoice(
  templateId: string,
  contractId: string,
  choice: string,
  argument: Record<string, unknown>,
  token: string,
  appConfig: ApiConfig,
): Promise<void> {
  await damlJsonApiRequest<unknown>(
    '/v1/exercise',
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        templateId,
        contractId,
        choice,
        argument,
      }),
    },
    appConfig,
  )
}

async function loadPartyLabels(
  ledgerPartyDisplayName: string,
  appConfig: ApiConfig,
): Promise<PartyDirectory> {
  const bootstrapToken = createDamlAccessToken(ledgerPartyDisplayName, appConfig)
  return fetchPartyDirectory(bootstrapToken, appConfig)
}

export async function fetchLedgerSnapshotForSession(
  role: UserRole,
  sessionUserId: string,
  appConfig: ApiConfig = config,
): Promise<LedgerVaultSnapshot> {
  const ledgerPartyDisplayName = ledgerPartyForSession(sessionUserId)
  if (!ledgerPartyDisplayName) {
    throw new Error(`No ledger party mapped for session user ${sessionUserId}`)
  }

  const partyLabels = await loadPartyLabels(ledgerPartyDisplayName, appConfig)
  const partyId = await resolveLedgerPartyId(ledgerPartyDisplayName, appConfig)
  const token = createDamlAccessToken(partyId, appConfig)
  const templates = templateIds(appConfig)

  const vaultParts = new Map<
    string,
    {
      agreement?: VaultAgreement
      oracle?: OracleAssignment
      heirs: HeirAllocation[]
      assets: TokenizedAsset[]
    }
  >()

  function ensureVault(vaultId: string) {
    if (!vaultParts.has(vaultId)) {
      vaultParts.set(vaultId, { heirs: [], assets: [] })
    }
    return vaultParts.get(vaultId)!
  }

  if (role === 'admin' || role === 'hnwi') {
    const agreements = await queryTemplate<VaultAgreement>(
      templates.vaultAgreement,
      token,
      appConfig,
    )
    for (const { payload } of agreements) {
      if (payload.status === 'Archived') continue
      ensureVault(payload.vaultId).agreement = payload
    }
  }

  const [assignments, allocations, assets, ledgerEvents, securityRows] = await Promise.all([
    queryTemplate<OracleAssignment>(templates.oracleAssignment, token, appConfig),
    queryTemplate<HeirAllocation>(templates.heirAllocation, token, appConfig),
    queryTemplate<TokenizedAsset>(templates.tokenizedAsset, token, appConfig),
    queryTemplate<LedgerEvent>(templates.ledgerEvent, token, appConfig),
    queryTemplate<SecurityEventRecord>(templates.securityEventRecord, token, appConfig),
  ])

  for (const { payload } of assignments) {
    const parts = ensureVault(payload.vaultId)
    const expectedName = parts.agreement?.name
    if (!expectedName || payload.vaultName === expectedName) {
      parts.oracle = payload
    }
  }
  for (const { payload } of allocations) {
    const parts = ensureVault(payload.vaultId)
    const expectedName = parts.agreement?.name
    if (!expectedName || payload.vaultName === expectedName) {
      parts.heirs.push(payload)
    }
  }
  for (const { payload } of assets) {
    ensureVault(payload.vaultId).assets.push(payload)
  }

  const vaults = Array.from(vaultParts.entries())
    .map(([vaultId, parts]) => assembleVaultRecord(vaultId, parts, partyLabels))
    .filter((vault): vault is NonNullable<typeof vault> => Boolean(vault))

  return {
    vaults,
    ledgerEntries: ledgerEvents.map(({ payload }) => mapLedgerEvent(payload, partyLabels)),
    securityEvents: securityRows.map(({ payload }) => mapSecurityEvent(payload, partyLabels)),
  }
}

function nextVaultId(): string {
  return `VLT-${Date.now().toString().slice(-6)}`
}

function allocationLabel(index: number, total: number, fallback?: string): string {
  if (fallback) return fallback
  if (total <= 1) return 'Primary heir — 100%'
  if (index === 0) return 'Primary heir — 60%'
  if (index === 1) return 'Secondary heir — 40%'
  return `Additional heir — ${index + 1}`
}

export async function createVaultForSession(
  sessionUserId: string,
  input: CreateVaultInput,
  appConfig: ApiConfig = config,
): Promise<CreateVaultResult> {
  const testatorDisplayName = ledgerPartyForSession(sessionUserId)
  if (!testatorDisplayName) {
    throw new Error(`No ledger party mapped for session user ${sessionUserId}`)
  }

  const templates = templateIds(appConfig)
  const testator = await resolveLedgerPartyId(testatorDisplayName, appConfig)
  const admin = await resolveLedgerPartyId('Admin_Trust', appConfig)
  const oracle = await resolveLedgerPartyId(input.oracleLedgerParty ?? 'Oracle_Sterling', appConfig)
  const token = createDamlAccessToken(testator, appConfig)
  const vaultId = nextVaultId()
  const vaultName = input.name.trim()
  const heirs = input.heirs.length > 0 ? input.heirs : [{ name: 'Alex Henderson', ledgerParty: 'Heir_Alex' }]

  const heirParties = await Promise.all(
    heirs.map(async (heir, index) => {
      const fallbackParty = index === 0 ? 'Heir_Alex' : 'Heir_Maya'
      return {
        ...heir,
        party: await resolveLedgerPartyId(heir.ledgerParty ?? fallbackParty, appConfig),
      }
    }),
  )

  const vaultAgreement = await createContract(
    templates.vaultAgreement,
    {
      vaultId,
      name: vaultName,
      jurisdiction: input.jurisdiction,
      totalValueNumeric: `${input.totalValueNumeric ?? 1_240_000_000}.0`,
      lastAccessed: new Date().toISOString().slice(0, 10),
      status: 'Active',
      testator,
      oracle,
      admin,
    },
    token,
    appConfig,
  )

  const oracleAssignment = await createContract(
    templates.oracleAssignment,
    {
      vaultId,
      vaultName,
      testator,
      oracle,
      admin,
      releaseStatus: 'Idle',
    },
    token,
    appConfig,
  )

  const heirAllocations: string[] = []
  for (const [index, heir] of heirParties.entries()) {
    const assetIds = input.assets
      .map((asset, assetIndex) => ({ assetId: `AST-${vaultId}-${assetIndex + 1}`, intendedHeirIndex: asset.intendedHeirIndex ?? 0 }))
      .filter((asset) => asset.intendedHeirIndex === index)
      .map((asset) => asset.assetId)

    heirAllocations.push(
      await createContract(
        templates.heirAllocation,
        {
          vaultId,
          vaultName,
          heir: heir.party,
          allocationLabel: allocationLabel(index, heirParties.length, heir.allocationLabel),
          assetIds,
          testator,
          admin,
        },
        token,
        appConfig,
      ),
    )
  }

  const tokenizedAssets: string[] = []
  for (const [index, asset] of input.assets.entries()) {
    const intendedHeir = heirParties[asset.intendedHeirIndex ?? 0] ?? heirParties[0]
    tokenizedAssets.push(
      await createContract(
        templates.tokenizedAsset,
        {
          assetId: `AST-${vaultId}-${index + 1}`,
          vaultId,
          name: asset.name,
          tokenId: asset.tokenId,
          assetClass: asset.assetClass,
          settlementStatus: index === 0 ? 'Registered' : 'PendingRelease',
          intendedHeir: intendedHeir.party,
          status: 'Active',
          testator,
          admin,
        },
        token,
        appConfig,
      ),
    )
  }

  return {
    vaultId,
    contracts: {
      vaultAgreement,
      oracleAssignment,
      heirAllocations,
      tokenizedAssets,
    },
  }
}

async function findOracleAssignment(
  sessionUserId: string,
  vaultId: string,
  appConfig: ApiConfig,
): Promise<{ assignment: DamlContract<OracleAssignment>; token: string } | null> {
  const ledgerPartyDisplayName = ledgerPartyForSession(sessionUserId)
  if (!ledgerPartyDisplayName) {
    throw new Error(`No ledger party mapped for session user ${sessionUserId}`)
  }

  const partyId = await resolveLedgerPartyId(ledgerPartyDisplayName, appConfig)
  const token = createDamlAccessToken(partyId, appConfig)
  const templates = templateIds(appConfig)
  const assignments = await queryTemplate<OracleAssignment>(
    templates.oracleAssignment,
    token,
    appConfig,
  )
  const assignment = assignments.find(({ payload }) => payload.vaultId === vaultId)

  return assignment ? { assignment, token } : null
}

export async function initiateVerificationForSession(
  sessionUserId: string,
  vaultId: string,
  appConfig: ApiConfig = config,
): Promise<void> {
  const match = await findOracleAssignment(sessionUserId, vaultId, appConfig)
  if (!match) throw new Error(`No OracleAssignment on ledger for ${vaultId}`)

  await exerciseChoice(
    templateIds(appConfig).oracleAssignment,
    match.assignment.contractId,
    'InitiateVerification',
    {},
    match.token,
    appConfig,
  )
}

export async function confirmReleaseForSession(
  sessionUserId: string,
  vaultId: string,
  beneficiaryLedgerParty = 'Heir_Alex',
  beneficiaryLabel = 'Alex Henderson',
  appConfig: ApiConfig = config,
): Promise<void> {
  const match = await findOracleAssignment(sessionUserId, vaultId, appConfig)
  if (!match) throw new Error(`No OracleAssignment on ledger for ${vaultId}`)

  const beneficiaryPartyId = await resolveLedgerPartyId(beneficiaryLedgerParty, appConfig)

  await exerciseChoice(
    templateIds(appConfig).oracleAssignment,
    match.assignment.contractId,
    'ConfirmRelease',
    {
      beneficiary: beneficiaryPartyId,
      beneficiaryLabel,
    },
    match.token,
    appConfig,
  )
}

// Renames a vault by archiving and recreating its name-bearing contracts using the
// built-in Archive choice + create. This works on any package version (including older
// vaults created before rename choices existed) and does not require a Daml rebuild.
export async function renameVaultForSession(
  sessionUserId: string,
  vaultId: string,
  newName: string,
  appConfig: ApiConfig = config,
): Promise<void> {
  const trimmedName = newName.trim()
  if (!trimmedName) throw new Error('Vault name is required')

  const ledgerPartyDisplayName = ledgerPartyForSession(sessionUserId)
  if (!ledgerPartyDisplayName) {
    throw new Error(`No ledger party mapped for session user ${sessionUserId}`)
  }

  const partyId = await resolveLedgerPartyId(ledgerPartyDisplayName, appConfig)
  const token = createDamlAccessToken(partyId, appConfig)
  const templates = templateIds(appConfig)

  const agreements = await queryTemplate<VaultAgreement>(
    templates.vaultAgreement,
    token,
    appConfig,
  )
  const agreement = agreements.find(
    ({ payload }) => payload.vaultId === vaultId && payload.status !== 'Archived',
  )
  if (!agreement) throw new Error(`No VaultAgreement on ledger for ${vaultId}`)

  const { payload } = agreement
  await exerciseChoice(
    templates.vaultAgreement,
    agreement.contractId,
    'Archive',
    {},
    token,
    appConfig,
  )
  await createContract(
    templates.vaultAgreement,
    {
      vaultId: payload.vaultId,
      name: trimmedName,
      jurisdiction: payload.jurisdiction,
      totalValueNumeric: payload.totalValueNumeric,
      lastAccessed: payload.lastAccessed,
      status: payload.status,
      testator: payload.testator,
      oracle: payload.oracle,
      admin: payload.admin,
    },
    token,
    appConfig,
  )

  const assignments = await queryTemplate<OracleAssignment>(
    templates.oracleAssignment,
    token,
    appConfig,
  )
  for (const assignment of assignments.filter(({ payload: row }) => row.vaultId === vaultId)) {
    const oraclePayload = assignment.payload
    await exerciseChoice(
      templates.oracleAssignment,
      assignment.contractId,
      'Archive',
      {},
      token,
      appConfig,
    )
    await createContract(
      templates.oracleAssignment,
      {
        vaultId: oraclePayload.vaultId,
        vaultName: trimmedName,
        testator: oraclePayload.testator,
        oracle: oraclePayload.oracle,
        admin: oraclePayload.admin,
        releaseStatus: oraclePayload.releaseStatus,
      },
      token,
      appConfig,
    )
  }

  const allocations = await queryTemplate<HeirAllocation>(
    templates.heirAllocation,
    token,
    appConfig,
  )
  for (const allocation of allocations.filter(({ payload: row }) => row.vaultId === vaultId)) {
    const heirPayload = allocation.payload
    await exerciseChoice(
      templates.heirAllocation,
      allocation.contractId,
      'Archive',
      {},
      token,
      appConfig,
    )
    await createContract(
      templates.heirAllocation,
      {
        vaultId: heirPayload.vaultId,
        vaultName: trimmedName,
        heir: heirPayload.heir,
        allocationLabel: heirPayload.allocationLabel,
        assetIds: heirPayload.assetIds,
        testator: heirPayload.testator,
        admin: heirPayload.admin,
      },
      token,
      appConfig,
    )
  }
}
