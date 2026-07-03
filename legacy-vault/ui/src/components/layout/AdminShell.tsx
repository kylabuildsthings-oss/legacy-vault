import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { LedgerScopeBanner } from '@/components/layout/LedgerScopeBanner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/admin', label: 'CLIENTS' },
  { to: '/admin/vaults', label: 'VAULTS' },
  { to: '/admin/security', label: 'SECURITY' },
  { to: '/admin/ledger', label: 'LEDGER' },
] as const

export function AdminShell() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!user || user.role !== 'admin') return null

  function signOut() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <span className="font-headline text-sm font-bold tracking-widest">
            LEGACY VAULT ADMIN
          </span>
          <nav className="flex gap-6">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'font-headline text-[0.65rem] tracking-widest text-muted-foreground transition-colors',
                  location.pathname === to
                    ? 'border-b-2 border-primary pb-1 text-foreground'
                    : 'hover:text-foreground',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border px-2 py-1 font-headline text-[0.6rem] tracking-wider text-[var(--lv-success)]">
              ● ADMIN SESSION: ACTIVE
            </span>
            <Bell className="size-4 text-muted-foreground" />
            <Settings className="size-4 text-muted-foreground" />
            <div className="flex size-8 items-center justify-center rounded-full bg-muted font-headline text-xs">
              TA
            </div>
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
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <LedgerScopeBanner />
        <Outlet />
      </main>

      <footer className="mx-auto flex max-w-6xl items-center border-t border-border px-6 py-4 text-xs text-muted-foreground">
        <span className="font-headline tracking-wider">LEGACY VAULT</span>
      </footer>
    </div>
  )
}
