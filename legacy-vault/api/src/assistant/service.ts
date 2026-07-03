// Orchestrates Canton snapshot loading, provider selection, and optional persistence.
// Pure intent routing lives in deterministic.ts for unit tests without Canton.
import { type ApiConfig, config } from '../config.js'
import { isDatabaseConfigured } from '../db/pool.js'
import {
  addAssistantMessage,
  createAssistantConversation,
} from '../db/repositories.js'
import type { SessionUser } from '../auth/users.js'
import { fetchLedgerSnapshotForSession } from '../ledger/service.js'
import { validateUserMessage } from './policies/index.js'
import { resolveAssistantProvider } from './providers/index.js'
import type { AssistantQueryInput, AssistantQueryResult } from './types.js'

export type { AssistantCitation, AssistantQueryInput, AssistantQueryResult } from './types.js'
export {
  answerFromContext,
  buildAssistantAnswer,
  classifyAssistantMessage,
  detectTopic,
  hasGuidanceIntent,
  normalizeAssistantQuery,
  type AssistantIntentClassification,
  type AssistantTopic,
} from './deterministic.js'

async function persistExchange(
  user: SessionUser,
  input: AssistantQueryInput,
  result: AssistantQueryResult,
  appConfig: ApiConfig,
): Promise<string | undefined> {
  if (!isDatabaseConfigured(appConfig)) return undefined

  try {
    const conversationId =
      input.conversationId ??
      (
        await createAssistantConversation({
          userId: user.id,
          ledgerVaultId: input.vaultId ?? null,
        })
      ).id

    await addAssistantMessage({
      conversationId,
      role: 'user',
      content: input.message,
    })
    await addAssistantMessage({
      conversationId,
      role: 'assistant',
      content: result.message,
      citations: result.citations,
    })

    return conversationId
  } catch {
    return undefined
  }
}

export async function answerAssistantQuery(
  user: SessionUser,
  input: AssistantQueryInput,
  appConfig: ApiConfig = config,
): Promise<AssistantQueryResult> {
  const safety = validateUserMessage(input.message)
  if (!safety.allowed) {
    return {
      message: safety.reason ?? 'That request cannot be handled in chat.',
      citations: [],
      conversationId: input.conversationId,
    }
  }

  const snapshot = await loadRoleScopedSnapshot(user, appConfig)
  const provider = resolveAssistantProvider(appConfig)
  const result = await provider.answer({ user, input, snapshot, appConfig })
  const conversationId = await persistExchange(user, input, result, appConfig)

  return {
    ...result,
    conversationId: conversationId ?? input.conversationId,
  }
}

async function loadRoleScopedSnapshot(
  user: SessionUser,
  appConfig: ApiConfig,
) {
  try {
    return await fetchLedgerSnapshotForSession(user.role, user.id, appConfig)
  } catch {
    return null
  }
}
