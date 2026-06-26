import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  authenticate,
  clearSession,
  homePathForRole,
  loadSession,
  saveSession,
  type SessionUser,
} from '@/lib/auth'

interface AuthContextValue {
  user: SessionUser | null
  login: (userId: string, password: string) => SessionUser | null
  logout: () => void
  homePath: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => loadSession())

  const login = useCallback((userId: string, password: string) => {
    const session = authenticate(userId, password)
    if (!session) return null
    saveSession(session)
    setUser(session)
    return session
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const homePath = user ? homePathForRole(user.role) : '/login'

  const value = useMemo(
    () => ({ user, login, logout, homePath }),
    [user, login, logout, homePath],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
