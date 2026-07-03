# Phase 8 Hardening

Phase 8B adds the first production-readiness guardrails around the backend API. These checks are intentionally runnable without Canton or Postgres so they can become a fast CI gate.

## Implemented in 8B

| Area | Coverage |
|------|----------|
| Auth | Demo login success/failure, `/me`, signed session token round trip, tamper rejection, expiry rejection |
| Route guards | 401 protection for product routes; 403 role guards before ledger/database side effects |
| Assistant | Request validation and backend fallback when Canton is unavailable |
| Drafts | Explicit 503 when optional Postgres is not configured |
| Error handling | Unexpected backend/ledger errors log internally and return generic `500` responses |
| Ledger client | Daml JSON API requests have a 10s timeout |
| Session security | Backend session tokens include configurable `exp` via `SESSION_TTL_SECONDS` |

Run:

```bash
cd legacy-vault/api
npm test
npm run typecheck
```

## Still needed for full production confidence

- Live Canton integration tests for `GET /vaults`, `POST /vaults`, `initiate-verification`, and `confirm-release`
- Daml privacy regression tests that compare Sarah, Alex, Oracle, and Admin snapshots
- Postgres integration tests for drafts, audit events, and assistant conversation persistence
- UI persona smoke tests for login, dashboard, vault creation, assistant query, release workflow, and heir payout view
- Secret management review for production `SESSION_JWT_SECRET`, `DAML_JWT_SECRET`, CORS origin, and database credentials
- Deployment logging/monitoring for request latency, ledger failures, auth failures, and release-command audit events

## Security notes

- The browser never receives Daml JWTs; Canton access remains server-side.
- Role checks run before ledger/database mutations on vault creation, release initiation, release confirmation, and draft creation.
- The backend now avoids returning raw internal error messages for unhandled failures.
- Session tokens are signed and expire based on `SESSION_TTL_SECONDS`; users with older local tokens should sign in again.
