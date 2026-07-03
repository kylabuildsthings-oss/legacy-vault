import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { getPool } from './pool.js'

const migrationFiles = [
  '001_initial_product_schema.sql',
]

const seedFiles = [
  '001_demo_users.sql',
]

async function runSqlFiles(directory: string, files: string[]): Promise<void> {
  const pool = getPool()
  for (const file of files) {
    const sql = await readFile(join(directory, file), 'utf8')
    await pool.query(sql)
    console.log(`Applied ${file}`)
  }
}

const root = new URL('../../..', import.meta.url).pathname

await runSqlFiles(join(root, 'db/migrations'), migrationFiles)
await runSqlFiles(join(root, 'db/seeds'), seedFiles)
await getPool().end()
