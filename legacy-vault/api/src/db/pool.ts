import { Pool } from 'pg'

import { type ApiConfig, config } from '../config.js'

let pool: Pool | null = null

export function isDatabaseConfigured(appConfig: ApiConfig = config): boolean {
  return Boolean(appConfig.DATABASE_URL)
}

export function getPool(appConfig: ApiConfig = config): Pool {
  if (!appConfig.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured')
  }

  pool ??= new Pool({
    connectionString: appConfig.DATABASE_URL,
  })

  return pool
}

export async function checkDatabase(appConfig: ApiConfig = config): Promise<{
  configured: boolean
  connected: boolean
}> {
  if (!isDatabaseConfigured(appConfig)) {
    return { configured: false, connected: false }
  }

  const result = await getPool(appConfig).query<{ ok: number }>('select 1 as ok')
  return { configured: true, connected: result.rows[0]?.ok === 1 }
}
