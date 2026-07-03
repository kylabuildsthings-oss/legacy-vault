import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { deterministicProvider } from '../src/assistant/providers/deterministicProvider.js'
import { resolveAssistantProvider } from '../src/assistant/providers/index.js'
import { localRagProvider } from '../src/assistant/providers/ragProvider.js'
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
      heirs: [],
      assets: [],
    },
  ],
  ledgerEntries: [],
  securityEvents: [],
}

describe('assistant provider factory', () => {
  it('defaults to deterministic provider', () => {
    const provider = resolveAssistantProvider(testConfig)
    assert.equal(provider.id, 'deterministic')
  })

  it('selects local-rag provider when configured', () => {
    const provider = resolveAssistantProvider({
      ...testConfig,
      ASSISTANT_PROVIDER: 'local-rag',
    })
    assert.equal(provider.id, 'local-rag')
  })

  it('local-rag falls back to deterministic without model config', async () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const deterministic = await deterministicProvider.answer({
      user,
      input: { message: 'Who are my heirs?', vaultId: 'VLT-001' },
      snapshot,
      appConfig: testConfig,
    })

    const rag = await localRagProvider.answer({
      user,
      input: { message: 'Who are my heirs?', vaultId: 'VLT-001' },
      snapshot,
      appConfig: testConfig,
    })

    assert.equal(rag.message, deterministic.message)
  })
})
