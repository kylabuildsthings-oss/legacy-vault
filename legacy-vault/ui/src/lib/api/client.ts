import { legacyVaultApiUrl } from '@/lib/ledger/config'

const TOKEN_KEY = 'legacy-vault-api-token'

export function saveApiToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function loadApiToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearApiToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = loadApiToken()
  return fetch(`${legacyVaultApiUrl}${path}`, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await apiFetch(path, init)
  if (!response.ok) {
    throw new Error(`Backend request failed (${response.status}): ${await response.text()}`)
  }
  return (await response.json()) as T
}
