import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('App render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[#f5f2e9] p-8 text-center">
          <h1 className="font-headline text-xl font-bold tracking-wide text-[#2d2926]">
            Legacy Vault failed to load
          </h1>
          <p className="max-w-md text-sm text-[#6b6560]">{this.state.error.message}</p>
          <p className="max-w-md text-xs text-[#6b6560]">
            Check the browser console for details. For a UI-only demo with fixture data, set{' '}
            <code className="rounded bg-white px-1">VITE_USE_MOCK_LEDGER=true</code> in{' '}
            <code className="rounded bg-white px-1">.env.local</code> and restart the dev server.
            For live Canton, run <code className="rounded bg-white px-1">./scripts/dev-ledger.sh</code>{' '}
            and <code className="rounded bg-white px-1">./scripts/dev-api.sh</code>.
          </p>
          <button
            type="button"
            className="rounded border border-[#c49b6c] bg-[#c49b6c] px-4 py-2 font-headline text-xs tracking-wider text-white"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
