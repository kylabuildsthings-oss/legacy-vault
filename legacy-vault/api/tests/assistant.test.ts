import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  buildAssistantAnswer,
  classifyAssistantMessage,
  detectTopic,
  hasGuidanceIntent,
} from '../src/assistant/deterministic.js'
import { getDemoUser } from '../src/auth/users.js'
import type { LedgerVaultSnapshot } from '../src/ledger/types.js'

const snapshot: LedgerVaultSnapshot = {
  vaults: [
    {
      id: 'VLT-001',
      name: 'My Will',
      jurisdiction: 'Geneva, CH',
      totalValue: '$1.24B',
      totalValueNumeric: 1_240_000_000,
      lastAccessed: '2026-07-01',
      status: 'active',
      testatorId: 'sarah.m',
      testatorName: 'Sarah Mitchell',
      oracleId: 'oracle@lawfirm',
      releaseStatus: 'idle',
      heirs: [
        { id: 'heir-1', name: 'Alex Henderson', allocationLabel: 'Primary heir — 60%' },
        { id: 'heir-2', name: 'Maya Mitchell', allocationLabel: 'Secondary heir — 40%' },
      ],
      assets: [
        {
          id: 'asset-1',
          name: 'Primary Residence',
          tokenId: 'NFT-1001',
          assetClass: 'NFT',
          settlementStatus: 'registered',
          intendedHeirId: 'heir-1',
          intendedHeirLabel: 'Alex Henderson',
          status: 'active',
        },
      ],
    },
  ],
  ledgerEntries: [],
  securityEvents: [],
}

describe('assistant intent classification', () => {
  it('detects guidance intent and topic independently of Canton', () => {
    assert.deepEqual(classifyAssistantMessage('What if I wanted to change my heirs'), {
      query: 'what if i wanted to change my heirs',
      guidanceIntent: true,
      topic: 'heirs',
    })
  })

  it('detects state-only heir questions without guidance intent', () => {
    assert.equal(hasGuidanceIntent('who are my heirs'), false)
    assert.equal(detectTopic('who are my heirs'), 'heirs')
  })

  it('detects oracle guidance from suggested prompts', () => {
    const classified = classifyAssistantMessage('Explain the oracle trigger')
    assert.equal(classified.guidanceIntent, true)
    assert.equal(classified.topic, 'oracle')
  })
})

describe('assistant intent routing', () => {
  it('routes change-heirs questions to guidance, not current-state summary', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'What if I wanted to change my heirs', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /change heirs|update allocations/i)
    assert.match(result.message, /Alex Henderson/)
    assert.doesNotMatch(result.message, /only receives the portions Canton exposes/)
  })

  it('routes designate-heirs prompts to guidance', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'How should I designate heirs?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /vault wizard|HeirAllocation/i)
  })

  it('keeps who-are-my-heirs as current-state summary', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'Who are my heirs?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /visible heir structure/i)
    assert.match(result.message, /Maya Mitchell/)
  })

  it('tells non-hnwi users they cannot change heirs', () => {
    const user = getDemoUser('alex.h')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'What if I wanted to change my heirs', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /cannot change heir/i)
  })

  it('routes asset guidance questions to asset how-to', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'How do I add a tokenized RWA?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /vault wizard|TokenizedAsset/i)
  })

  it('routes oracle guidance for hnwi to initiate verification', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'How do I start oracle verification?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /Initiate verification/i)
  })

  it('routes suggested prompt Explain the oracle trigger to oracle guidance', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'Explain the oracle trigger', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /Initiate verification/i)
    assert.doesNotMatch(result.message, /oracle can confirm a release only after verification is initiated/)
  })

  it('routes suggested prompt What happens on release to release guidance', () => {
    const user = getDemoUser('alex.h')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'What happens on release?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /beneficiary payout|Settlements/i)
    assert.doesNotMatch(result.message, /When the oracle confirms release, Canton records/)
  })

  it('routes suggested prompt What are tokenized RWAs to asset guidance', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'What are tokenized RWAs?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /vault wizard|TokenizedAsset/i)
  })

  it('gives oracle-specific confirm-release guidance to oracle role', () => {
    const user = getDemoUser('oracle@lawfirm')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'How do I confirm the release trigger?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /Confirm release trigger/i)
  })

  it('gives admin oversight guidance for release workflow', () => {
    const user = getDemoUser('admin@legacyvault')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'What happens on release?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /Pending Releases/i)
  })

  it('returns role-aware fallback for ambiguous guidance questions', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'How do I do the thing?', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /did not match that question/i)
    assert.match(result.message, /designate heirs/i)
    assert.match(result.message, /VLT-001/)
  })

  it('returns role-aware fallback for ambiguous state questions', () => {
    const user = getDemoUser('alex.h')
    assert.ok(user)

    const result = buildAssistantAnswer(
      { message: 'Tell me something', vaultId: 'VLT-001' },
      user,
      snapshot,
    )

    assert.match(result.message, /your heir role/i)
    assert.match(result.message, /allocation/i)
  })
})
