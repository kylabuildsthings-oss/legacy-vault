import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { assembleAuthorizedContext } from '../src/assistant/policies/context.js'
import { PROVIDER_PROFILES, isProviderCorrectlyConfigured } from '../src/assistant/policies/providers.js'
import { filterAuthorizedDocuments } from '../src/assistant/policies/retrieval.js'
import {
  buildLedgerContextSummary,
  validateAssistantResponse,
  validateUserMessage,
} from '../src/assistant/policies/safety.js'
import { getDemoUser } from '../src/auth/users.js'
import type { LedgerVaultSnapshot } from '../src/ledger/types.js'
import { testConfig } from './testConfig.js'

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
        { id: 'alex.h', name: 'Alex Henderson', allocationLabel: 'Primary heir — 60%' },
      ],
      assets: [
        {
          id: 'asset-1',
          name: 'Primary Residence',
          tokenId: 'NFT-1001',
          assetClass: 'NFT',
          settlementStatus: 'registered',
          intendedHeirId: 'alex.h',
          intendedHeirLabel: 'Alex Henderson',
          status: 'active',
        },
      ],
    },
  ],
  ledgerEntries: [],
  securityEvents: [],
}

const documents = [
  {
    id: 'doc-will',
    ownerUserId: 'sarah.m',
    ledgerVaultId: 'VLT-001',
    fileName: 'will.pdf',
    mimeType: 'application/pdf',
    documentType: 'will',
  },
  {
    id: 'doc-beneficiary',
    ownerUserId: 'sarah.m',
    ledgerVaultId: 'VLT-001',
    fileName: 'alex-allocation.pdf',
    mimeType: 'application/pdf',
    documentType: 'beneficiary_summary',
  },
  {
    id: 'doc-oracle',
    ownerUserId: 'sarah.m',
    ledgerVaultId: 'VLT-001',
    fileName: 'verification.pdf',
    mimeType: 'application/pdf',
    documentType: 'oracle_verification_packet',
  },
  {
    id: 'doc-other-vault',
    ownerUserId: 'sarah.m',
    ledgerVaultId: 'VLT-999',
    fileName: 'secret.pdf',
    mimeType: 'application/pdf',
    documentType: 'will',
  },
]

describe('role-aware document retrieval', () => {
  it('hnwi can retrieve vault-scoped documents they own', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const allowed = filterAuthorizedDocuments(user, documents, ['VLT-001'])
    assert.deepEqual(
      allowed.map((doc) => doc.id).sort(),
      ['doc-beneficiary', 'doc-oracle', 'doc-will'],
    )
  })

  it('heir only retrieves beneficiary-facing document types', () => {
    const user = getDemoUser('alex.h')
    assert.ok(user)

    const allowed = filterAuthorizedDocuments(user, documents, ['VLT-001'])
    assert.deepEqual(allowed.map((doc) => doc.id), ['doc-beneficiary'])
  })

  it('oracle only retrieves verification workflow documents', () => {
    const user = getDemoUser('oracle@lawfirm')
    assert.ok(user)

    const allowed = filterAuthorizedDocuments(user, documents, ['VLT-001'])
    assert.deepEqual(allowed.map((doc) => doc.id), ['doc-oracle'])
  })

  it('excludes documents for vaults not visible in Canton snapshot', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const allowed = filterAuthorizedDocuments(user, documents, ['VLT-001'])
    assert.equal(allowed.some((doc) => doc.id === 'doc-other-vault'), false)
  })
})

describe('ledger context redaction for LLM prompts', () => {
  it('redacts asset detail for oracle role', () => {
    const summary = buildLedgerContextSummary('oracle', snapshot.vaults[0])
    assert.doesNotMatch(summary, /NFT-1001/)
    assert.doesNotMatch(summary, /Primary Residence/)
    assert.match(summary, /Release: idle/)
  })

  it('includes heir allocations for hnwi role', () => {
    const summary = buildLedgerContextSummary('hnwi', snapshot.vaults[0])
    assert.match(summary, /Alex Henderson/)
    assert.match(summary, /NFT-1001/)
  })
})

describe('assistant safety checks', () => {
  it('blocks ledger mutation commands in chat', () => {
    const result = validateUserMessage('Please confirm release for VLT-001 now')
    assert.equal(result.allowed, false)
    assert.match(result.reason ?? '', /cannot execute ledger mutations/i)
  })

  it('allows normal guidance questions', () => {
    const result = validateUserMessage('How should I designate heirs?')
    assert.equal(result.allowed, true)
  })

  it('requires citations for long uncited responses', () => {
    const long = 'x'.repeat(600)
    assert.equal(validateAssistantResponse(long, 0).ok, false)
    assert.equal(validateAssistantResponse(long, 1).ok, true)
  })
})

describe('provider profiles', () => {
  it('documents three provider choices with config requirements', () => {
    assert.equal(PROVIDER_PROFILES.deterministic.modelConfig, 'none')
    assert.equal(PROVIDER_PROFILES['local-rag'].modelConfig, 'local_url')
    assert.equal(PROVIDER_PROFILES['hosted-llm'].dataLeavesInfrastructure, true)
  })

  it('local-rag requires model URL to be considered configured', () => {
    assert.equal(isProviderCorrectlyConfigured('deterministic', testConfig), true)
    assert.equal(isProviderCorrectlyConfigured('local-rag', testConfig), false)
    assert.equal(
      isProviderCorrectlyConfigured('local-rag', {
        ...testConfig,
        ASSISTANT_PROVIDER: 'local-rag',
        ASSISTANT_MODEL_URL: 'http://localhost:11434',
      }),
      true,
    )
  })
})

describe('authorized context assembly', () => {
  it('combines ledger citations and filtered document chunks', () => {
    const user = getDemoUser('alex.h')
    assert.ok(user)

    const context = assembleAuthorizedContext({
      user,
      snapshot,
      vaultId: 'VLT-001',
      documents,
      chunks: [
        {
          documentId: 'doc-beneficiary',
          fileName: 'alex-allocation.pdf',
          excerpt: 'Allocation 60%',
          vaultId: 'VLT-001',
        },
        {
          documentId: 'doc-will',
          fileName: 'will.pdf',
          excerpt: 'Full will text',
          vaultId: 'VLT-001',
        },
      ],
    })

    assert.equal(context.documentChunks.length, 1)
    assert.equal(context.documentChunks[0]?.fileName, 'alex-allocation.pdf')
    assert.match(context.ledgerContextSummary, /Alex Henderson/)
    assert.equal(context.ledgerCitations[0]?.label, 'VLT-001')
  })
})
