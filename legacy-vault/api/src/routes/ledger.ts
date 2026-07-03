import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { type ApiConfig, config } from '../config.js'
import {
  fetchPartyDirectory,
  ledgerPartyForSession,
  resolveSessionLedgerParty,
} from '../ledger/parties.js'
import { createDamlAccessToken } from '../ledger/auth.js'

const sessionParamsSchema = z.object({
  sessionUserId: z.string().min(1),
})

export async function registerLedgerRoutes(
  server: FastifyInstance,
  appConfig: ApiConfig = config,
): Promise<void> {
  server.get('/ledger/parties', async () => {
    const token = createDamlAccessToken('Admin_Trust', appConfig)
    const directory = await fetchPartyDirectory(token, appConfig)

    return {
      result: Object.entries(directory.idByDisplayName).map(([displayName, partyId]) => ({
        displayName,
        partyId,
      })),
    }
  })

  server.get('/ledger/sessions/:sessionUserId/party', async (request, reply) => {
    const parsed = sessionParamsSchema.safeParse(request.params)
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid session user id',
        issues: parsed.error.flatten(),
      })
    }

    const displayName = ledgerPartyForSession(parsed.data.sessionUserId)
    if (!displayName) {
      return reply.status(404).send({
        error: `No ledger party mapped for session user ${parsed.data.sessionUserId}`,
      })
    }

    const party = await resolveSessionLedgerParty(parsed.data.sessionUserId, appConfig)
    return { result: party }
  })
}
