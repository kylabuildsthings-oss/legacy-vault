import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/dashboard', label: 'OVERVIEW' },
  { to: '/vaults', label: 'VAULTS' },
  { to: '/ledger', label: 'LEDGER' },
  { to: '/security', label: 'SECURITY' },
] as const

const roleLabels = {
  hnwi: 'HNWI (Testator)',
  heir: 'Heir (Beneficiary)',
  oracle: 'Oracle (Law Firm)',
} as const

export function ClientShell() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!user || user.role === 'admin') return null

  const roleLabel = roleLabels[user.role]

  function signOut() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <span className="font-headline text-sm font-bold tracking-widest">LEGACY VAULT</span>
          <nav className="flex gap-6">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'font-headline text-[0.65rem] tracking-widest text-muted-foreground transition-colors',
                  location.pathname === to || location.pathname.startsWith(`${to}/`)
                    ? 'border-b-2 border-primary pb-1 text-foreground'
                    : 'hover:text-foreground',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-right text-xs">
            <div>
              <p className="font-headline text-[0.65rem] text-[var(--lv-success)]">
                ● VERIFIED SESSION
              </p>
              <p className="font-medium">{user.displayName}</p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-muted font-headline text-xs">
              {user.displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <Lock className="size-4 text-muted-foreground" strokeWidth={1.5} />
            <Button
              variant="outline"
              size="sm"
              className="font-headline text-[0.65rem] tracking-wider"
              onClick={signOut}
            >
              Sign out
            </Button>
          </div>
        </div>
        <div className="border-t border-border bg-muted/40 px-6 py-2 text-center">
          <p className="font-headline text-[0.6rem] tracking-widest text-muted-foreground uppercase">
            Viewing as: {roleLabel} · {user.id}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-border px-6 py-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <Lock className="size-3" />
          Encrypted session verified via decentralized ledger
        </span>
        <span>© 2024 Legacy Vault Institutional Archives</span>
      </footer>
    </div>
  )
}
