import type { ApiConfig } from '../../config.js'
import type { AssistantProviderId } from '../providers/types.js'

export interface ProviderProfile {
  id: AssistantProviderId
  label: string
  whenToUse: string
  modelConfig: 'none' | 'local_url' | 'api_key'
  dataLeavesInfrastructure: boolean
  recommendedFor: Array<'local_dev' | 'hackathon_demo' | 'production'>
}

export const PROVIDER_PROFILES: Record<AssistantProviderId, ProviderProfile> = {
  deterministic: {
    id: 'deterministic',
    label: 'Deterministic Canton context',
    whenToUse: 'Default. No LLM. Answers from role-scoped ledger snapshot + intent rules.',
    modelConfig: 'none',
    dataLeavesInfrastructure: false,
    recommendedFor: ['local_dev', 'hackathon_demo', 'production'],
  },
  'local-rag': {
    id: 'local-rag',
    label: 'Local RAG (Ollama)',
    whenToUse:
      'Optional dev/experimentation. Retrieval + Ollama on localhost; documents and Canton context stay in your environment.',
    modelConfig: 'local_url',
    dataLeavesInfrastructure: false,
    recommendedFor: ['local_dev', 'hackathon_demo'],
  },
  'hosted-llm': {
    id: 'hosted-llm',
    label: 'Hosted LLM',
    whenToUse:
      'Production natural-language answers. Requires redaction policy, secrets management, and audit logging before enablement.',
    modelConfig: 'api_key',
    dataLeavesInfrastructure: true,
    recommendedFor: ['production'],
  },
}

export function isProviderCorrectlyConfigured(
  providerId: AssistantProviderId,
  appConfig: ApiConfig,
): boolean {
  const profile = PROVIDER_PROFILES[providerId]

  switch (profile.modelConfig) {
    case 'none':
      return true
    case 'local_url':
      return Boolean(appConfig.ASSISTANT_MODEL_URL)
    case 'api_key':
      return Boolean(appConfig.ASSISTANT_MODEL_API_KEY)
  }
}

export function recommendProvider(environment: 'local_dev' | 'hackathon_demo' | 'production'): AssistantProviderId {
  if (environment === 'production') return 'deterministic'
  return 'deterministic'
}
