export interface AssistantMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
  action?: 'initiate_verification'
  citations?: Array<{ label: string; source: string }>
}

export const ASSISTANT_OPENING_MESSAGES: AssistantMessage[] = [
  {
    id: 'open-1',
    role: 'assistant',
    text: 'I recommend designating your spouse and children as primary heirs with clear allocation percentages. This ensures immediate asset transfer upon trigger.',
  },
  {
    id: 'open-2',
    role: 'assistant',
    text: "I've analyzed your 'Family Trust' assets. Two items lack cryptographic verification. Would you like me to initiate the verification process now?",
    action: 'initiate_verification',
  },
]

export const SUGGESTED_PROMPTS = [
  'How should I designate heirs?',
  'What are tokenized RWAs?',
  'Explain the oracle trigger',
  'What happens on release?',
]

const RESPONSES: { keywords: string[]; text: string }[] = [
  {
    keywords: ['heir', 'beneficiary', 'allocation', 'designate'],
    text: 'Heirs receive allocation-only visibility until release. Designate primary and secondary heirs with explicit percentages — e.g. 60% / 40% — so Canton can route atomic settlement without exposing full vault contents to other parties.',
  },
  {
    keywords: ['token', 'tokenized', 'token id', 'nft', 'tkn'],
    text: 'Each asset links to a Canton token ID (NFT-7721, TKN-9004, etc.). Token registry sync keeps settlement status visible: registered, pending_release, or settled. Your wizard selections will register on-chain when the vault is finalized.',
  },
  {
    keywords: ['rwa', 'real-world', 'real world', 'asset class'],
    text: 'Real-world assets (RWA) and securities are tokenized on Canton Network. Legacy Vault tracks asset class, token ID, and settlement status per holding — judges and oracles see registry metadata without full testator privacy leakage.',
  },
  {
    keywords: ['oracle', 'trigger', 'verification', 'check-in', 'sterling'],
    text: 'Your assigned oracle (e.g. Sterling Law) performs trigger oversight only — no asset details until release conditions are met. Periodic check-ins confirm the testator is alive; upon death certificate verification, the oracle confirms release to queue atomic settlement.',
  },
  {
    keywords: ['release', 'settlement', 'payout', 'atomic'],
    text: 'On release trigger, Canton queues atomic settlement: tokenized holdings move to beneficiary payout status, ledger entries record the event, and heirs see pending allocation — without exposing other heirs’ shares via zero-knowledge scoping.',
  },
]

const DEFAULT_RESPONSE =
  'I can help with heir designation, tokenized RWAs, oracle triggers, and release settlement. Try asking about heirs, tokens, RWAs, oracle, or release — or use Initiate verification to start the Family Trust cryptographic check.'

export function getAssistantResponse(query: string): string {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return DEFAULT_RESPONSE

  for (const entry of RESPONSES) {
    if (entry.keywords.some((kw) => normalized.includes(kw))) {
      return entry.text
    }
  }

  return DEFAULT_RESPONSE
}

export const VERIFICATION_INITIATED_MESSAGE =
  'Verification initiated for My Will (VLT-001). Sterling Law Oracle has been notified — release status set to pending verification. They will confirm trigger conditions before atomic settlement on Canton.'

export const GET_HELP_MESSAGE =
  'Ask me about heirs, tokenized assets, RWAs, oracle triggers, or release settlement. You can also click Initiate verification to start the cryptographic check on assets flagged in Family Trust.'
