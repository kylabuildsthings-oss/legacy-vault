import cors from '@fastify/cors'
import Fastify, { type FastifyInstance } from 'fastify'

import { config, type ApiConfig } from './config.js'
import { checkDatabase } from './db/pool.js'
import { registerAssistantRoutes } from './routes/assistant.js'
import { registerAuthRoutes } from './routes/auth.js'
import { registerDraftRoutes } from './routes/drafts.js'
import { registerLedgerRoutes } from './routes/ledger.js'
import { registerVaultRoutes } from './routes/vaults.js'

export async function buildServer(appConfig: ApiConfig = config): Promise<FastifyInstance> {
  const server = Fastify({
    logger:
      appConfig.NODE_ENV === 'test'
        ? false
        : {
            level: appConfig.NODE_ENV === 'development' ? 'info' : 'warn',
          },
  })

  await server.register(cors, {
    origin: appConfig.UI_ORIGIN,
    credentials: true,
  })

  server.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, 'Unhandled API error')
    return reply.status(500).send({ error: 'Internal server error' })
  })

  server.get('/health', async () => {
    let database = { configured: false, connected: false }
    try {
      database = await checkDatabase(appConfig)
    } catch {
      database = { configured: true, connected: false }
    }

    return {
      status: 'ok',
      service: 'legacy-vault-api',
      environment: appConfig.NODE_ENV,
      ledger: {
        jsonApiUrl: appConfig.DAML_JSON_API,
        ledgerId: appConfig.DAML_LEDGER_ID,
        applicationId: appConfig.DAML_APPLICATION_ID,
      },
      database,
      timestamp: new Date().toISOString(),
    }
  })

  await registerAssistantRoutes(server, appConfig)
  await registerAuthRoutes(server, appConfig)
  await registerDraftRoutes(server, appConfig)
  await registerLedgerRoutes(server, appConfig)
  await registerVaultRoutes(server, appConfig)

  return server
}
