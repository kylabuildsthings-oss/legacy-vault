import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'
import type { FastifyInstance } from 'fastify'

import { buildServer } from '../src/server.js'
import { testConfig } from './testConfig.js'

let server: FastifyInstance

async function login(userId = 'sarah.m'): Promise<string> {
  const response = await server.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { userId, password: 'vault' },
  })
  assert.equal(response.statusCode, 200)

  const body = response.json()
  assert.equal(body.result.user.id, userId)
  return body.result.token
}

describe('api routes', () => {
  beforeEach(async () => {
    server = await buildServer(testConfig)
  })

  afterEach(async () => {
    await server.close()
  })

  it('reports health without requiring optional Postgres', async () => {
    const response = await server.inject({ method: 'GET', url: '/health' })

    assert.equal(response.statusCode, 200)
    assert.equal(response.json().status, 'ok')
    assert.deepEqual(response.json().database, { configured: false, connected: false })
  })

  it('logs in demo users and protects /me', async () => {
    const invalidRequest = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {},
    })
    assert.equal(invalidRequest.statusCode, 400)

    const invalidCredentials = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { userId: 'sarah.m', password: 'wrong' },
    })
    assert.equal(invalidCredentials.statusCode, 401)

    const token = await login()
    const me = await server.inject({
      method: 'GET',
      url: '/me',
      headers: { authorization: `Bearer ${token}` },
    })

    assert.equal(me.statusCode, 200)
    assert.equal(me.json().result.user.role, 'hnwi')
  })

  it('requires authentication for protected product routes', async () => {
    for (const route of ['/vaults', '/drafts', '/assistant/query']) {
      const response = await server.inject({
        method: route === '/assistant/query' ? 'POST' : 'GET',
        url: route,
        payload: route === '/assistant/query' ? { message: 'assets' } : undefined,
      })

      assert.equal(response.statusCode, 401, route)
    }
  })

  it('sanitizes unexpected ledger failures behind a generic 500', async () => {
    const token = await login()
    const response = await server.inject({
      method: 'GET',
      url: '/vaults',
      headers: { authorization: `Bearer ${token}` },
    })

    assert.equal(response.statusCode, 500)
    assert.deepEqual(response.json(), { error: 'Internal server error' })
  })

  it('enforces role guards before ledger or database side effects', async () => {
    const heirToken = await login('alex.h')
    const hnwiToken = await login('sarah.m')
    const oracleToken = await login('oracle@lawfirm')

    const createVaultAsHeir = await server.inject({
      method: 'POST',
      url: '/vaults',
      headers: { authorization: `Bearer ${heirToken}` },
      payload: { name: 'Blocked', heirs: [], assets: [] },
    })
    assert.equal(createVaultAsHeir.statusCode, 403)

    const initiateAsOracle = await server.inject({
      method: 'POST',
      url: '/vaults/VLT-001/initiate-verification',
      headers: { authorization: `Bearer ${oracleToken}` },
    })
    assert.equal(initiateAsOracle.statusCode, 403)

    const confirmAsHnwi = await server.inject({
      method: 'POST',
      url: '/vaults/VLT-001/confirm-release',
      headers: { authorization: `Bearer ${hnwiToken}` },
      payload: {},
    })
    assert.equal(confirmAsHnwi.statusCode, 403)

    const createDraftAsHeir = await server.inject({
      method: 'POST',
      url: '/drafts',
      headers: { authorization: `Bearer ${heirToken}` },
      payload: { name: 'Blocked', jurisdiction: 'Geneva, CH' },
    })
    assert.equal(createDraftAsHeir.statusCode, 403)
  })

  it('validates assistant queries and falls back when Canton is unavailable', async () => {
    const token = await login()

    const invalid = await server.inject({
      method: 'POST',
      url: '/assistant/query',
      headers: { authorization: `Bearer ${token}` },
      payload: { message: '' },
    })
    assert.equal(invalid.statusCode, 400)

    const response = await server.inject({
      method: 'POST',
      url: '/assistant/query',
      headers: { authorization: `Bearer ${token}` },
      payload: { message: 'What tokenized assets can I see?', vaultId: 'VLT-001' },
    })

    assert.equal(response.statusCode, 200)
    assert.match(response.json().result.message, /could not find a visible ledger vault/i)
    assert.deepEqual(response.json().result.citations, [])
  })

  it('returns unavailable for draft persistence when Postgres is not configured', async () => {
    const token = await login()
    const response = await server.inject({
      method: 'GET',
      url: '/drafts',
      headers: { authorization: `Bearer ${token}` },
    })

    assert.equal(response.statusCode, 503)
    assert.equal(response.json().error, 'Database is not configured')
  })
})
