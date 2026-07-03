import { createHmac } from 'node:crypto'

import { type ApiConfig, config } from '../config.js'

function base64UrlEncode(value: Buffer | string): string {
  return Buffer.from(value).toString('base64url')
}

function base64UrlEncodeJson(value: unknown): string {
  return base64UrlEncode(JSON.stringify(value))
}

/** HS256 dev token for local Daml JSON API access. Keep this server-side only. */
export function createDamlAccessToken(
  ledgerParty: string,
  appConfig: ApiConfig = config,
): string {
  const header = base64UrlEncodeJson({ alg: 'HS256', typ: 'JWT' })
  const payload = base64UrlEncodeJson({
    'https://daml.com/ledger-api': {
      ledgerId: appConfig.DAML_LEDGER_ID,
      applicationId: appConfig.DAML_APPLICATION_ID,
      actAs: [ledgerParty],
      readAs: [ledgerParty],
    },
  })
  const unsigned = `${header}.${payload}`
  const signature = createHmac('sha256', appConfig.DAML_JWT_SECRET)
    .update(unsigned)
    .digest('base64url')

  return `${unsigned}.${signature}`
}
