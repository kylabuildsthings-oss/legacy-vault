import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  createSessionToken,
  tokenFromAuthorizationHeader,
  verifySessionToken,
} from '../src/auth/session.js'
import { getDemoUser } from '../src/auth/users.js'
import { testConfig } from './testConfig.js'

describe('session tokens', () => {
  it('round-trips a signed demo user token', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const token = createSessionToken(user, testConfig)
    assert.deepEqual(verifySessionToken(token, testConfig), user)
  })

  it('rejects tampered token payloads', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const token = createSessionToken(user, testConfig)
    const [header, payload, signature] = token.split('.')
    const tamperedPayload = Buffer.from(
      JSON.stringify({ sub: 'sarah.m', role: 'admin', iat: 1 }),
    ).toString('base64url')

    assert.equal(verifySessionToken(`${header}.${tamperedPayload}.${signature}`, testConfig), null)
    assert.notEqual(payload, tamperedPayload)
  })

  it('rejects expired tokens', () => {
    const user = getDemoUser('sarah.m')
    assert.ok(user)

    const expiredToken = createSessionToken(user, {
      ...testConfig,
      SESSION_TTL_SECONDS: -1,
    })

    assert.equal(verifySessionToken(expiredToken, testConfig), null)
  })

  it('extracts only bearer authorization tokens', () => {
    assert.equal(tokenFromAuthorizationHeader('Bearer abc.def'), 'abc.def')
    assert.equal(tokenFromAuthorizationHeader('Basic abc.def'), null)
    assert.equal(tokenFromAuthorizationHeader(undefined), null)
  })
})
