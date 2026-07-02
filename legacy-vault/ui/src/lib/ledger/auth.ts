import { damlLedgerId, devJwtSecret } from '@/lib/ledger/config'

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlEncodeJson(value: unknown): string {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(value)))
}

/** HS256 dev token for local JSON API. Use full party id in actAs for queries/commands. */
export async function createDevAccessToken(ledgerParty: string): Promise<string> {
  const header = base64UrlEncodeJson({ alg: 'HS256', typ: 'JWT' })
  const payload = base64UrlEncodeJson({
    'https://daml.com/ledger-api': {
      ledgerId: damlLedgerId,
      applicationId: 'legacy-vault-ui',
      actAs: [ledgerParty],
      readAs: [ledgerParty],
    },
  })
  const unsigned = `${header}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(devJwtSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(unsigned))
  return `${unsigned}.${base64UrlEncode(new Uint8Array(signature))}`
}
