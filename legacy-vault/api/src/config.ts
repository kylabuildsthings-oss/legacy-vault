import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default('127.0.0.1'),
  UI_ORIGIN: z.string().url().default('http://localhost:5173'),
  DAML_JSON_API: z.string().url().default('http://localhost:7575'),
  DAML_LEDGER_ID: z.string().default('sandbox'),
  DAML_APPLICATION_ID: z.string().default('legacy-vault-api'),
  DAML_JWT_SECRET: z.string().min(1).default('secret'),
  DAML_PACKAGE_ID: z
    .string()
    .min(1)
    .default('715d00271ca17172ab736c63a660938e9526006da13095ea9fa6fc1a37e6a6c3'),
  SESSION_JWT_SECRET: z.string().min(1).default('legacy-vault-dev-session-secret'),
  SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(8 * 60 * 60),
  ASSISTANT_PROVIDER: z
    .enum(['deterministic', 'local-rag', 'hosted-llm'])
    .default('deterministic'),
  ASSISTANT_MODEL_URL: z.string().url().optional(),
  ASSISTANT_MODEL_API_KEY: z.string().min(1).optional(),
  ASSISTANT_RAG_TOP_K: z.coerce.number().int().positive().default(5),
  DATABASE_URL: z.string().url().optional(),
})

export const config = envSchema.parse(process.env)

export type ApiConfig = typeof config
