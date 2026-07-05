import { loadApiToken } from '@/lib/api/client'
import { useMockLedger } from '@/lib/ledger/config'

export type AppDataMode = 'mock' | 'demo_fallback' | 'live_connecting' | 'live' | 'live_error'

export interface DataModePresentation {
  mode: AppDataMode
  label: string
  detail: string
  variant: 'success' | 'warning' | 'muted' | 'destructive'
}

export function isLiveConfigured(): boolean {
  return !useMockLedger
}

export function hasBackendAuth(): boolean {
  return loadApiToken() !== null
}

const isPublicDemo = import.meta.env.PROD && useMockLedger

export function resolveDataMode(args: {
  loading?: boolean
  error?: string | null
} = {}): DataModePresentation {
  if (useMockLedger) {
    return {
      mode: 'mock',
      label: isPublicDemo ? 'Public Demo' : 'Demo Data Mode',
      detail: isPublicDemo
        ? 'Sample vault data for judges — no install required. Live Canton ledger: clone the repo and follow README Quick start, or watch the demo video.'
        : 'Mock fixtures — for live Canton, run ./scripts/dev-ledger.sh and ./scripts/dev-api.sh, then set VITE_USE_MOCK_LEDGER=false in .env.local.',
      variant: 'warning',
    }
  }

  if (!hasBackendAuth()) {
    return {
      mode: 'demo_fallback',
      label: isPublicDemo ? 'Public Demo' : 'Demo Data Mode',
      detail: isPublicDemo
        ? 'Sample vault data for judges — no install required. Live Canton ledger: clone the repo and follow README Quick start, or watch the demo video.'
        : 'Backend not connected — start ./scripts/dev-api.sh and sign in again for live Canton data.',
      variant: 'warning',
    }
  }

  if (args.loading) {
    return {
      mode: 'live_connecting',
      label: 'Live Canton Backend',
      detail: 'Connecting to Canton ledger via backend API…',
      variant: 'muted',
    }
  }

  if (args.error) {
    return {
      mode: 'live_error',
      label: 'Live mode — Canton unavailable',
      detail: args.error,
      variant: 'destructive',
    }
  }

  return {
    mode: 'live',
    label: 'Live Canton Backend',
    detail: 'Role-scoped vault data from Canton via backend API.',
    variant: 'success',
  }
}
