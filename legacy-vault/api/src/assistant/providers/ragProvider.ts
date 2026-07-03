import { deterministicProvider } from './deterministicProvider.js'
import { assembleAuthorizedContext } from '../policies/context.js'
import { isProviderCorrectlyConfigured } from '../policies/providers.js'
import type { AssistantProvider, AssistantProviderContext } from './types.js'

/**
 * Future LLM/RAG provider scaffold.
 *
 * Planned flow (see docs/legacy-vault/ASSISTANT_RAG_PLAN.md):
 * 1. Filter document_metadata + ledger snapshot by authenticated user + vault scope
 * 2. Retrieve top-k chunks from an embedding store (never raw cross-user corpus)
 * 3. Build a grounded prompt from role-scoped Canton context + authorized chunks
 * 4. Call configured model (Ollama local-rag or hosted-llm)
 * 5. Return citations for ledger fields and document sources used
 *
 * Until retrieval + model wiring land, this provider safely falls back to deterministic
 * so ASSISTANT_PROVIDER=local-rag does not bypass auth or Canton visibility.
 */
async function answerWithRag(context: AssistantProviderContext) {
  const { appConfig, user, input, snapshot } = context

  if (!isProviderCorrectlyConfigured(appConfig.ASSISTANT_PROVIDER, appConfig)) {
    return deterministicProvider.answer(context)
  }

  // Authorized context assembly — documents/chunks wired in Phase R2.
  assembleAuthorizedContext({
    user,
    snapshot,
    vaultId: input.vaultId,
    documents: [],
    chunks: [],
  })

  // Placeholder: retrieveAuthorizedChunks() + callModel(authorizedContext)
  return deterministicProvider.answer(context)
}

export const localRagProvider: AssistantProvider = {
  id: 'local-rag',
  answer: answerWithRag,
}

export const hostedLlmProvider: AssistantProvider = {
  id: 'hosted-llm',
  answer: answerWithRag,
}
