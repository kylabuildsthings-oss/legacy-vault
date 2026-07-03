import { buildAssistantAnswer } from '../deterministic.js'
import type { AssistantProvider } from './types.js'

export const deterministicProvider: AssistantProvider = {
  id: 'deterministic',
  async answer({ user, input, snapshot }) {
    return buildAssistantAnswer(input, user, snapshot)
  },
}
