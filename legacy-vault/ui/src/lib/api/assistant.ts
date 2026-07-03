import { apiJson } from '@/lib/api/client'

export interface AssistantCitation {
  label: string
  source: string
}

export interface AssistantQueryResponse {
  message: string
  citations: AssistantCitation[]
  conversationId?: string
}

export async function queryAssistant(input: {
  message: string
  conversationId?: string
  vaultId?: string
}): Promise<AssistantQueryResponse> {
  const body = await apiJson<{ result: AssistantQueryResponse }>('/assistant/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  return body.result
}
