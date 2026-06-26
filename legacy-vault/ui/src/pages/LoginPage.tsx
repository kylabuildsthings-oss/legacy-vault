import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { homePathForRole } from '@/lib/auth'
import './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const session = login(userId, password)
    if (!session) {
      setError('Invalid credentials. Try sarah.m / vault')
      return
    }
    navigate(homePathForRole(session.role))
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1 className="login-title">LEGACY VAULT</h1>
          <p className="login-subtitle">PRIVATE WEALTH MANAGEMENT</p>
          <p className="login-secure">
            <span className="login-secure-dot" aria-hidden />
            ENCRYPTED CONNECTION
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="userId">
            USER ID
          </label>
          <div className="login-input-wrap">
            <input
              id="userId"
              className="login-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="sarah.m"
              autoComplete="username"
            />
            <User className="login-input-icon" size={18} strokeWidth={1.5} />
          </div>

          <label className="login-label" htmlFor="password">
            PASSWORD
          </label>
          <div className="login-input-wrap">
            <input
              id="password"
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <Lock className="login-input-icon" size={18} strokeWidth={1.5} />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit">
            SIGN IN
          </button>
        </form>

        <footer className="login-footer">
          Authorized Personnel Only. Contact your system administrator for access.
          <br />
          <Link to="/dev/design" className="login-dev-link">
            View design system (Step 3)
          </Link>
        </footer>
      </div>
    </div>
  )
}
