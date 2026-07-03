import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { answerAssistantQuery } from '../assistant/service.js'
import { type ApiConfig, config } from '../config.js'
import { getAuthenticatedUser } from './auth.js'

const assistantQuerySchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().min(1).optional(),
  vaultId: z.string().min(1).optional(),
})

export async function registerAssistantRoutes(
  server: FastifyInstance,
  appConfig: ApiConfig = config,
): Promise<void> {
  server.post('/assistant/query', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })

    const parsed = assistantQuerySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid assistant query',
        issues: parsed.error.flatten(),
      })
    }

    const result = await answerAssistantQuery(user, parsed.data, appConfig)
    return { result }
  })
}
