import { apiJson, clearApiToken, saveApiToken } from '@/lib/api/client'

export type UserRole = 'hnwi' | 'heir' | 'oracle' | 'admin'

export interface SessionUser {
  id: string
  displayName: string
  role: UserRole
}

const DEMO_USERS: Record<string, { password: string; user: SessionUser }> = {
  'sarah.m': {
    password: 'vault',
    user: { id: 'sarah.m', displayName: 'Sarah Mitchell', role: 'hnwi' },
  },
  'alex.h': {
    password: 'vault',
    user: { id: 'alex.h', displayName: 'Alex Henderson', role: 'heir' },
  },
  'oracle@lawfirm': {
    password: 'vault',
    user: { id: 'oracle@lawfirm', displayName: 'Sterling & Co.', role: 'oracle' },
  },
  'admin@legacyvault': {
    password: 'vault',
    user: { id: 'admin@legacyvault', displayName: 'Trust Admin', role: 'admin' },
  },
}

const SESSION_KEY = 'legacy-vault-session'

export function authenticateLocalDemoUser(userId: string, password: string): SessionUser | null {
  const entry = DEMO_USERS[userId.trim().toLowerCase()]
  if (!entry || entry.password !== password) return null
  return entry.user
}

export async function authenticate(userId: string, password: string): Promise<SessionUser | null> {
  try {
    const body = await apiJson<{ result: { user: SessionUser; token: string } }>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
    })
    saveApiToken(body.result.token)
    return body.result.user
  } catch {
    // Backend unreachable — allow UI-only demo login with fixture data.
    const localUser = authenticateLocalDemoUser(userId, password)
    if (!localUser) return null
    clearApiToken()
    return localUser
  }
}

export function saveSession(user: SessionUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function loadSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
  clearApiToken()
}

export function homePathForRole(role: UserRole): string {
  return role === 'admin' ? '/admin' : '/dashboard'
}
