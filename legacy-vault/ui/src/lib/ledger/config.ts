/** Ledger integration — see docs/legacy-vault/UI_LEDGER_INTEGRATION.md */

export const useMockLedger =
  import.meta.env.VITE_USE_MOCK_LEDGER !== 'false' &&
  import.meta.env.VITE_USE_MOCK_LEDGER !== '0'

const rawApi = import.meta.env.VITE_DAML_JSON_API?.trim()

const browserOrigin =
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'http://localhost:5173'

/** Base URL without trailing slash — for fetch() paths. Blank → Vite proxy (relative /v1/...). */
export const damlJsonApiUrl = rawApi ? rawApi.replace(/\/$/, '') : ''

/** @daml/ledger requires an absolute httpBaseUrl ending in '/'. Blank → same-origin (proxied). */
export const damlLedgerHttpUrl = rawApi ? `${damlJsonApiUrl}/` : `${browserOrigin}/`

export const damlLedgerId = import.meta.env.VITE_DAML_LEDGER_ID ?? 'sandbox'

/** Dev sandbox JWT secret (JSON API only; not for production). */
export const devJwtSecret = import.meta.env.VITE_DAML_JWT_SECRET ?? 'secret'

/** Surfaced in the ledger banner / console to debug connection issues. */
export const ledgerDiagnostics = {
  useMockLedger,
  rawApi: rawApi ?? '(unset → proxy)',
  fetchBaseUrl: damlJsonApiUrl || '(relative /v1 via Vite proxy)',
  ledgerHttpUrl: damlLedgerHttpUrl,
  browserOrigin,
  ledgerId: damlLedgerId,
}
