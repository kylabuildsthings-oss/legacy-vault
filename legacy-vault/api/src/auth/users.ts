import type { UserRole } from '../ledger/types.js'

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

export function authenticateDemoUser(userId: string, password: string): SessionUser | null {
  const entry = DEMO_USERS[userId.trim().toLowerCase()]
  if (!entry || entry.password !== password) return null
  return entry.user
}

export function getDemoUser(userId: string): SessionUser | null {
  return DEMO_USERS[userId.trim().toLowerCase()]?.user ?? null
}
