import { type ApiConfig, config } from '../../config.js'
import { deterministicProvider } from './deterministicProvider.js'
import { hostedLlmProvider, localRagProvider } from './ragProvider.js'
import type { AssistantProvider, AssistantProviderId } from './types.js'

const providers: Record<AssistantProviderId, AssistantProvider> = {
  deterministic: deterministicProvider,
  'local-rag': localRagProvider,
  'hosted-llm': hostedLlmProvider,
}

export function resolveAssistantProvider(appConfig: ApiConfig = config): AssistantProvider {
  return providers[appConfig.ASSISTANT_PROVIDER] ?? deterministicProvider
}

export type { AssistantProvider, AssistantProviderContext, AssistantProviderId } from './types.js'
