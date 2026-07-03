import type { ApiConfig } from '../src/config.js'

export const testConfig = {
  NODE_ENV: 'test',
  PORT: 0,
  HOST: '127.0.0.1',
  UI_ORIGIN: 'http://localhost:5173',
  DAML_JSON_API: 'http://127.0.0.1:9',
  DAML_LEDGER_ID: 'sandbox-test',
  DAML_APPLICATION_ID: 'legacy-vault-api-test',
  DAML_JWT_SECRET: 'test-daml-secret',
  DAML_PACKAGE_ID: 'test-package-id',
  SESSION_JWT_SECRET: 'test-session-secret',
  SESSION_TTL_SECONDS: 8 * 60 * 60,
  ASSISTANT_PROVIDER: 'deterministic',
  ASSISTANT_MODEL_URL: undefined,
  ASSISTANT_MODEL_API_KEY: undefined,
  ASSISTANT_RAG_TOP_K: 5,
  DATABASE_URL: undefined,
} satisfies ApiConfig
