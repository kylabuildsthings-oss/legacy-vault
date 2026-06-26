import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/lib/auth'

export function RoleGuard({
  allow,
  children,
  redirectTo,
}: {
  allow: UserRole[]
  children: React.ReactNode
  redirectTo?: string
}) {
  const { user, homePath } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allow.includes(user.role)) {
    return <Navigate to={redirectTo ?? homePath} replace />
  }

  return <>{children}</>
}
