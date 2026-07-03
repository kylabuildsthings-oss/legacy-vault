import type { SessionUser } from '../auth/users.js'
import type { LedgerVaultSnapshot, VaultRecord } from '../ledger/types.js'
import type { AssistantCitation, AssistantQueryInput, AssistantQueryResult } from './types.js'

export type AssistantTopic = 'heirs' | 'assets' | 'oracle' | 'release'

export interface AssistantIntentClassification {
  query: string
  guidanceIntent: boolean
  topic: AssistantTopic | null
}

const GUIDANCE_INTENT_PHRASES = [
  'how',
  'what if',
  'what are',
  'what happens',
  'can i',
  'should i',
  'change',
  'update',
  'modify',
  'edit',
  'add',
  'remove',
  'revoke',
  'replace',
  'designate',
  'set up',
  'explain',
] as const

export function normalizeAssistantQuery(value: string): string {
  return value.toLowerCase().trim()
}

export function hasGuidanceIntent(query: string): boolean {
  return GUIDANCE_INTENT_PHRASES.some((phrase) => query.includes(phrase))
}

export function detectTopic(query: string): AssistantTopic | null {
  if (query.includes('heir') || query.includes('beneficiary') || query.includes('allocation')) {
    return 'heirs'
  }
  if (
    query.includes('token') ||
    query.includes('rwa') ||
    query.includes('asset') ||
    query.includes('holding')
  ) {
    return 'assets'
  }
  if (query.includes('oracle') || query.includes('trigger') || query.includes('verification')) {
    return 'oracle'
  }
  if (query.includes('release') || query.includes('settlement') || query.includes('payout')) {
    return 'release'
  }
  return null
}

export function classifyAssistantMessage(message: string): AssistantIntentClassification {
  const query = normalizeAssistantQuery(message)
  return {
    query,
    guidanceIntent: hasGuidanceIntent(query),
    topic: detectTopic(query),
  }
}

function selectVault(snapshot: LedgerVaultSnapshot | null, vaultId?: string): VaultRecord | null {
  if (!snapshot?.vaults.length) return null
  if (vaultId) {
    return snapshot.vaults.find((vault) => vault.id === vaultId) ?? snapshot.vaults[0] ?? null
  }
  return snapshot.vaults[0] ?? null
}

function summarizeAssets(vault: VaultRecord): string {
  if (!vault.assets.length) return 'I do not see tokenized assets attached to this vault yet.'

  return vault.assets
    .map(
      (asset) =>
        `${asset.name} (${asset.tokenId}, ${asset.assetClass}) is currently ${asset.settlementStatus.replace(/_/g, ' ')} for ${asset.intendedHeirLabel}.`,
    )
    .join(' ')
}

function summarizeHeirs(vault: VaultRecord): string {
  if (!vault.heirs.length) return 'No heirs are currently visible for this vault.'

  return vault.heirs
    .map((heir) => `${heir.name}: ${heir.allocationLabel}`)
    .join('; ')
}

function buildCitations(vault: VaultRecord): AssistantCitation[] {
  const citations: AssistantCitation[] = [
    { label: vault.id, source: `Canton vault: ${vault.name}` },
  ]
  for (const asset of vault.assets.slice(0, 3)) {
    citations.push({ label: asset.tokenId, source: `Tokenized asset: ${asset.name}` })
  }
  return citations
}

function guidanceForHeirs(vault: VaultRecord, user: SessionUser): string {
  const current = summarizeHeirs(vault)

  switch (user.role) {
    case 'hnwi':
      return `To designate or change heirs on ${vault.name}, open the vault wizard and set allocation labels (e.g. 60% / 40%). Each heir becomes an HeirAllocation contract on Canton tied to the VaultAgreement. If release verification is already pending, re-initiate verification after changes. Current structure: ${current}.`
    case 'heir':
      return `As a beneficiary on ${vault.name}, you can view your permitted allocation but cannot change heir designations — those are set by the testator on Canton. Your visible allocation: ${current}.`
    case 'oracle':
      return `As the assigned oracle for ${vault.name}, you oversee release triggers but do not modify heir allocations. Heir structure is testator-defined: ${current}.`
    case 'admin':
      return `As trust administrator, you have oversight of ${vault.name} but heir designations are controlled by the testator through the vault wizard. Visible structure: ${current}. Use the admin pending-releases queue to monitor workflow state.`
  }
}

function guidanceForAssets(vault: VaultRecord, user: SessionUser): string {
  const current = summarizeAssets(vault)

  switch (user.role) {
    case 'hnwi':
      return `To add or update tokenized assets on ${vault.name}, use the vault wizard at /vaults/new. Each asset becomes a TokenizedAsset contract with a registry ID, asset class (RWA, NFT, or Security), and intended heir. Settlement status tracks registered → pending_release → settled on Canton. Current holdings: ${current}.`
    case 'heir':
      return `Tokenized RWAs on ${vault.name} are registered by the testator. As a beneficiary, Canton exposes only assets and registry fields scoped to your party — not the full estate. Current visible holdings: ${current}.`
    case 'oracle':
      return `Oracles on ${vault.name} perform trigger oversight without full asset detail until release conditions are met. You do not register or modify tokenized holdings. Testator-registered assets: ${current}.`
    case 'admin':
      return `As administrator, you can observe token registry metadata on ${vault.name} for compliance oversight. Asset registration is testator-driven via the vault wizard. Current registry snapshot: ${current}.`
  }
}

function guidanceForOracle(vault: VaultRecord, user: SessionUser): string {
  const status = vault.releaseStatus ?? 'idle'

  switch (user.role) {
    case 'hnwi':
      return `To start the oracle trigger on ${vault.name}, use Initiate verification in this assistant or on the vault page. That notifies your assigned oracle and sets release to pending verification. Current status: ${status}. The oracle confirms only after you initiate — they cannot trigger release unilaterally.`
    case 'oracle':
      return `As the assigned oracle for ${vault.name}, you confirm release only after the testator initiates verification. Current workflow status: ${status}. When verification is pending, open the vault and use Confirm release trigger — that queues atomic settlement and audit records on Canton.`
    case 'heir':
      return `Oracle verification on ${vault.name} is between the testator and assigned law firm. As a beneficiary, you observe payout status once release advances — you cannot initiate or confirm triggers. Current status: ${status}.`
    case 'admin':
      return `Oracle workflow on ${vault.name} is testator-initiated and oracle-confirmed. Current status: ${status}. Monitor pending items from the admin dashboard; you do not execute oracle confirmations directly.`
  }
}

function guidanceForRelease(vault: VaultRecord, user: SessionUser): string {
  const status = vault.releaseStatus ?? 'idle'

  switch (user.role) {
    case 'hnwi':
      return `Release on ${vault.name} follows: you initiate verification → oracle confirms trigger → beneficiary settlement records appear on Canton. Current status: ${status}. Settlement, ledger entries, and security events are recorded atomically for parties who should observe them.`
    case 'heir':
      return `On release for ${vault.name}, you will see beneficiary payout status and ledger settlements scoped to your allocation — not other heirs' shares. Current status: ${status}. Check the dashboard payout card and Ledger Settlements tab once the oracle confirms.`
    case 'oracle':
      return `Release for ${vault.name} advances when you confirm the trigger after testator verification. Current status: ${status}. Confirmation queues atomic settlement: tokenized holdings move to payout status, ledger entries record the event, and security logs capture the audit trail.`
    case 'admin':
      return `Release oversight for ${vault.name}: testator initiates → oracle confirms → settlements queue on Canton. Current status: ${status}. Use the admin Pending Releases queue to track vaults awaiting oracle action or settlement completion.`
  }
}

function guidanceResponse(
  topic: AssistantTopic,
  vault: VaultRecord,
  user: SessionUser,
): string {
  switch (topic) {
    case 'heirs':
      return guidanceForHeirs(vault, user)
    case 'assets':
      return guidanceForAssets(vault, user)
    case 'oracle':
      return guidanceForOracle(vault, user)
    case 'release':
      return guidanceForRelease(vault, user)
  }
}

function stateResponse(topic: AssistantTopic, vault: VaultRecord, user: SessionUser): string {
  switch (topic) {
    case 'heirs':
      return `For ${vault.name}, the visible heir structure is: ${summarizeHeirs(vault)}. Your ${user.role} role only receives the portions Canton exposes to you through the vault contracts.`
    case 'assets':
      return `For ${vault.name}, the tokenized holdings I can see are: ${summarizeAssets(vault)} Canton keeps these registry fields scoped by party visibility rather than exposing every asset to every user.`
    case 'oracle':
      return `The oracle workflow for ${vault.name} is currently ${vault.releaseStatus ?? 'idle'}. The oracle can confirm a release only after verification is initiated; that confirmation creates settlement and audit records on Canton.`
    case 'release':
      return `Release for ${vault.name} is ${vault.releaseStatus ?? 'idle'}. When the oracle confirms release, Canton records beneficiary settlement, ledger events, and security events atomically for the parties who should observe them.`
  }
}

function clarifyingFallback(vault: VaultRecord, user: SessionUser, guidanceIntent: boolean): string {
  const examplesByRole: Record<SessionUser['role'], string> = {
    hnwi: 'how to designate heirs, how to add a tokenized RWA, how to initiate verification, or what happens on release',
    heir: 'what your allocation is, what tokenized assets you can see, or what happens on release for your payout',
    oracle: 'how to confirm a release trigger, what verification status means, or what settlement records are created',
    admin: 'how release oversight works, what the Pending Releases queue shows, or what each role can see on this vault',
  }

  const examples = examplesByRole[user.role]

  if (guidanceIntent) {
    return `I did not match that question to a specific workflow on ${vault.name} (${vault.id}). I can guide you on ${examples}. Try a more specific question, such as "How should I designate heirs?" or "What happens on release?"`
  }

  return `I found ${vault.name} (${vault.id}) for your ${user.role} role. Ask about current heirs, tokenized RWAs, oracle triggers, or release status — or ask how to change any of these. Examples: ${examples}.`
}

/** Pure deterministic provider — testable with in-memory snapshots, no Canton calls. */
export function buildAssistantAnswer(
  input: AssistantQueryInput,
  user: SessionUser,
  snapshot: LedgerVaultSnapshot | null,
): AssistantQueryResult {
  const { guidanceIntent, topic } = classifyAssistantMessage(input.message)
  const vault = selectVault(snapshot, input.vaultId)
  const citations: AssistantCitation[] = vault ? buildCitations(vault) : []

  if (!vault) {
    return {
      message:
        'I can help with heirs, tokenized assets, oracle triggers, and release settlement once a vault is visible to your role. I could not find a visible ledger vault in the current session.',
      citations,
    }
  }

  if (guidanceIntent && topic) {
    return {
      message: guidanceResponse(topic, vault, user),
      citations,
    }
  }

  if (topic) {
    return {
      message: stateResponse(topic, vault, user),
      citations,
    }
  }

  return {
    message: clarifyingFallback(vault, user, guidanceIntent),
    citations,
  }
}

/** @deprecated Use buildAssistantAnswer — kept for existing imports. */
export const answerFromContext = buildAssistantAnswer
