import type { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { type ApiConfig, config } from '../config.js'
import { createSessionToken, tokenFromAuthorizationHeader, verifySessionToken } from '../auth/session.js'
import { authenticateDemoUser, type SessionUser } from '../auth/users.js'

const loginBodySchema = z.object({
  userId: z.string().min(1),
  password: z.string().min(1),
})

export function getAuthenticatedUser(
  request: FastifyRequest,
  appConfig: ApiConfig = config,
): SessionUser | null {
  const token = tokenFromAuthorizationHeader(request.headers.authorization)
  if (!token) return null
  return verifySessionToken(token, appConfig)
}

export async function requireAuthenticatedUser(
  request: FastifyRequest,
  appConfig: ApiConfig = config,
): Promise<SessionUser> {
  const user = getAuthenticatedUser(request, appConfig)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function registerAuthRoutes(
  server: FastifyInstance,
  appConfig: ApiConfig = config,
): Promise<void> {
  server.post('/auth/login', async (request, reply) => {
    const parsed = loginBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Invalid login request',
        issues: parsed.error.flatten(),
      })
    }

    const user = authenticateDemoUser(parsed.data.userId, parsed.data.password)
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    return {
      result: {
        user,
        token: createSessionToken(user, appConfig),
      },
    }
  })

  server.get('/me', async (request, reply) => {
    const user = getAuthenticatedUser(request, appConfig)
    if (!user) return reply.status(401).send({ error: 'Unauthorized' })
    return { result: { user } }
  })
}
