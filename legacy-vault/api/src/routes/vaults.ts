import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { type ApiConfig, config } from '../config.js'
import { getAuthenticatedUser } from './auth.js'
import {
  confirmReleaseForSession,
  createVaultForSession,
  fetchLedgerSnapshotForSession,
  initiateVerificationForSession,
  renameVaultForSession,
} from '../ledger/service.js'

const createVaultBodySchema = z.object({
  name: z.string().min(1),
  jurisdiction: z.string().min(1).default('Geneva, CH'),
  totalValueNumeric: z.number().positive().optional(),
  oracleLedgerParty: z.string().min(1).default('Oracle_Sterling'),
  heirs: z.array(
    z.object({
      name: z.string().min(1),
      ledgerParty: z.string().min(1).optional(),
      allocationLabel: z.string().min(1).optional(),
    }),
  ).min(1),
  assets: z.array(
    z.object({
      name: z.string().min(1),
      tokenId: z.string().min(1),
      assetClass: z.enum(['RWA', 'NFT', 'Security']),
      intendedHeirIndex: z.number().int().min(0).optional(),
    }),
  ).min(1),
})

const vaultParamsSchema = z.object({
  vaultId: z.string().min(1),
})

const confirmReleaseBodySchema = z.object({
  beneficiaryLedgerParty: z.string().min(1).default('Heir_Alex'),
  beneficiaryLabel: z.string().min(1).default('Alex Henderson'),
})

const renameVaultBodySchema = z.object({
  name: z.string().min(1),
})

export async function registerVaultRoutes(
  server: FastifyInstance,
  appConfig: ApiConfig = config,
): Promise<void> {
  server.get('/vaults', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })

    const snapshot = await fetchLedgerSnapshotForSession(
      user.role,
      user.id,
      appConfig,
    )

    return { result: snapshot }
  })

  server.post('/vaults', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })
    if (user.role !== 'hnwi') return reply.status(403).send({ error: 'Forbidden' })

    const body = createVaultBodySchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({
        error: 'Invalid create vault request',
        issues: body.error.flatten(),
      })
    }

    const result = await createVaultForSession(user.id, body.data, appConfig)
    return reply.status(201).send({ result })
  })

  server.post('/vaults/:vaultId/initiate-verification', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })
    if (user.role !== 'hnwi') return reply.status(403).send({ error: 'Forbidden' })

    const params = vaultParamsSchema.safeParse(request.params)
    if (!params.success) {
      return reply.status(400).send({
        error: 'Invalid initiate verification request',
        issues: params.error.flatten(),
      })
    }

    await initiateVerificationForSession(user.id, params.data.vaultId, appConfig)
    return { result: { ok: true } }
  })

  server.post('/vaults/:vaultId/confirm-release', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })
    if (user.role !== 'oracle') return reply.status(403).send({ error: 'Forbidden' })

    const params = vaultParamsSchema.safeParse(request.params)
    const body = confirmReleaseBodySchema.safeParse(request.body)
    if (!params.success || !body.success) {
      return reply.status(400).send({
        error: 'Invalid confirm release request',
        issues: {
          params: params.success ? undefined : params.error.flatten(),
          body: body.success ? undefined : body.error.flatten(),
        },
      })
    }

    await confirmReleaseForSession(
      user.id,
      params.data.vaultId,
      body.data.beneficiaryLedgerParty,
      body.data.beneficiaryLabel,
      appConfig,
    )
    return { result: { ok: true } }
  })

  server.patch('/vaults/:vaultId', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })
    if (user.role !== 'hnwi') return reply.status(403).send({ error: 'Forbidden' })

    const params = vaultParamsSchema.safeParse(request.params)
    const body = renameVaultBodySchema.safeParse(request.body)
    if (!params.success || !body.success) {
      return reply.status(400).send({
        error: 'Invalid rename vault request',
        issues: {
          params: params.success ? undefined : params.error.flatten(),
          body: body.success ? undefined : body.error.flatten(),
        },
      })
    }

    await renameVaultForSession(user.id, params.data.vaultId, body.data.name, appConfig)
    return { result: { ok: true, name: body.data.name.trim() } }
  })
}
