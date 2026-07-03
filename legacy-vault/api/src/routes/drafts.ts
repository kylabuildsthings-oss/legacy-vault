import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { type ApiConfig, config } from '../config.js'
import { isDatabaseConfigured } from '../db/pool.js'
import { createVaultDraft, listVaultDraftsForUser, recordAuditEvent } from '../db/repositories.js'
import { getAuthenticatedUser } from './auth.js'

const createDraftBodySchema = z.object({
  name: z.string().min(1),
  jurisdiction: z.string().min(1),
  draftPayload: z.record(z.string(), z.unknown()).default({}),
})

export async function registerDraftRoutes(
  server: FastifyInstance,
  appConfig: ApiConfig = config,
): Promise<void> {
  server.get('/drafts', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })
    if (!isDatabaseConfigured(appConfig)) {
      return reply.status(503).send({ error: 'Database is not configured' })
    }

    return { result: await listVaultDraftsForUser(user.id) }
  })

  server.post('/drafts', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })
    if (user.role !== 'hnwi') return reply.status(403).send({ error: 'Forbidden' })
    if (!isDatabaseConfigured(appConfig)) {
      return reply.status(503).send({ error: 'Database is not configured' })
    }

    const parsed = createDraftBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid vault draft request',
        issues: parsed.error.flatten(),
      })
    }

    const draft = await createVaultDraft({
      ownerUserId: user.id,
      name: parsed.data.name,
      jurisdiction: parsed.data.jurisdiction,
      draftPayload: parsed.data.draftPayload,
    })
    await recordAuditEvent({
      actorUserId: user.id,
      eventType: 'vault_draft.created',
      targetType: 'vault_draft',
      targetId: draft.id,
      metadata: { name: draft.name, jurisdiction: draft.jurisdiction },
    })

    return reply.status(201).send({ result: draft })
  })
}
