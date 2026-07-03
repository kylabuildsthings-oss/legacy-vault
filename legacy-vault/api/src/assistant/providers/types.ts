import type { ApiConfig } from '../../config.js'
import type { SessionUser } from '../../auth/users.js'
import type { LedgerVaultSnapshot } from '../../ledger/types.js'
import type { AssistantQueryInput, AssistantQueryResult } from '../types.js'

export type AssistantProviderId = 'deterministic' | 'local-rag' | 'hosted-llm'

/** Inputs assembled by the route/service layer after auth + Canton snapshot load. */
export interface AssistantProviderContext {
  user: SessionUser
  input: AssistantQueryInput
  snapshot: LedgerVaultSnapshot | null
  appConfig: ApiConfig
}

/**
 * Swappable answer-generation layer behind POST /assistant/query.
 * Auth, party resolution, and Canton reads stay outside providers.
 */
export interface AssistantProvider {
  readonly id: AssistantProviderId
  answer(context: AssistantProviderContext): Promise<AssistantQueryResult>
}
