import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ReleaseWorkflowProvider } from '@/context/ReleaseWorkflowContext'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { ClientShell } from '@/components/layout/ClientShell'
import { AdminShell } from '@/components/layout/AdminShell'
import { LoginPage } from '@/pages/LoginPage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { OverviewPage } from '@/pages/client/OverviewPage'
import { VaultsPage } from '@/pages/client/VaultsPage'
import { VaultDetailPage } from '@/pages/client/VaultDetailPage'
import { VaultWizardPage } from '@/pages/client/VaultWizardPage'
import { LedgerPage } from '@/pages/client/LedgerPage'
import { SecurityPage } from '@/pages/client/SecurityPage'
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage'
import { AdminVaultsPage } from '@/pages/admin/AdminVaultsPage'
import { AdminClientDetailPage } from '@/pages/admin/AdminClientDetailPage'
import { AdminVaultDetailPage } from '@/pages/admin/AdminVaultDetailPage'
import { AdminSecurityPage } from '@/pages/admin/AdminSecurityPage'
import { AdminLedgerPage } from '@/pages/admin/AdminLedgerPage'
import { homePathForRole } from '@/lib/auth'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={homePathForRole(user.role)} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dev/design" element={<DesignSystemPage />} />

      <Route
        element={
          <RoleGuard allow={['hnwi', 'heir', 'oracle']}>
            <ClientShell />
          </RoleGuard>
        }
      >
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/vaults" element={<VaultsPage />} />
        <Route path="/vaults/:id" element={<VaultDetailPage />} />
        <Route
          path="/vaults/new"
          element={
            <RoleGuard allow={['hnwi']}>
              <VaultWizardPage />
            </RoleGuard>
          }
        />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/security" element={<SecurityPage />} />
      </Route>

      <Route
        element={
          <RoleGuard allow={['admin']}>
            <AdminShell />
          </RoleGuard>
        }
      >
        <Route path="/admin" element={<AdminOverviewPage />} />
        <Route path="/admin/clients/:testatorId" element={<AdminClientDetailPage />} />
        <Route path="/admin/vaults/:id" element={<AdminVaultDetailPage />} />
        <Route path="/admin/vaults" element={<AdminVaultsPage />} />
        <Route path="/admin/security" element={<AdminSecurityPage />} />
        <Route path="/admin/ledger" element={<AdminLedgerPage />} />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ReleaseWorkflowProvider>
          <AppRoutes />
        </ReleaseWorkflowProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
