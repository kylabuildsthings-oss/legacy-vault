import { createHmac, timingSafeEqual } from 'node:crypto'

import { type ApiConfig, config } from '../config.js'
import { getDemoUser, type SessionUser } from './users.js'

interface SessionPayload {
  sub: string
  role: SessionUser['role']
  iat: number
  exp: number
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function sign(payload: string, appConfig: ApiConfig): string {
  return createHmac('sha256', appConfig.SESSION_JWT_SECRET)
    .update(payload)
    .digest('base64url')
}

export function createSessionToken(user: SessionUser, appConfig: ApiConfig = config): string {
  const issuedAt = Math.floor(Date.now() / 1000)
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const payload = encode({
    sub: user.id,
    role: user.role,
    iat: issuedAt,
    exp: issuedAt + appConfig.SESSION_TTL_SECONDS,
  } satisfies SessionPayload)
  const unsigned = `${header}.${payload}`
  return `${unsigned}.${sign(unsigned, appConfig)}`
}

export function verifySessionToken(
  token: string,
  appConfig: ApiConfig = config,
): SessionUser | null {
  const [header, payload, signature] = token.split('.')
  if (!header || !payload || !signature) return null

  const expected = sign(`${header}.${payload}`, appConfig)
  const expectedBytes = Buffer.from(expected)
  const actualBytes = Buffer.from(signature)
  if (expectedBytes.length !== actualBytes.length) return null
  if (!timingSafeEqual(expectedBytes, actualBytes)) return null

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionPayload
    if (!Number.isFinite(decoded.exp) || decoded.exp <= Math.floor(Date.now() / 1000)) return null

    const user = getDemoUser(decoded.sub)
    if (!user || user.role !== decoded.role) return null
    return user
  } catch {
    return null
  }
}

export function tokenFromAuthorizationHeader(header: string | undefined): string | null {
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return null
  return token
}
