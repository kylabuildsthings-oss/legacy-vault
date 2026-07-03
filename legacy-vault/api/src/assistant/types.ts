export interface AssistantCitation {
  label: string
  source: string
}

export interface AssistantQueryInput {
  message: string
  conversationId?: string
  vaultId?: string
}

export interface AssistantQueryResult {
  message: string
  citations: AssistantCitation[]
  conversationId?: string
}
