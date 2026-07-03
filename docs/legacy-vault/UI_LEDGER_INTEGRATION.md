# UI ↔ Canton integration

Wire the React UI to the **product backend API**, which talks to the **Daml JSON API** on a running Canton sandbox.

## Quick start (recommended — live Canton)

**Terminal 1** — Canton sandbox + JSON API:

```bash
./scripts/dev-ledger.sh
```

**Terminal 2** — product backend:

```bash
./scripts/dev-api.sh
```

**Terminal 3** — UI (live mode):

```bash
cp legacy-vault/ui/.env.example legacy-vault/ui/.env.local
./scripts/dev-ui.sh
```

Login with demo users (`vault` password). The UI shows a **Live Canton Backend** badge when connected. **VLT-001** is seeded on `daml start`; wizard-created vaults appear on Canton via `POST /vaults`.

## Developer fallback — mock fixtures only

For UI-only development without Canton or the backend:

```bash
# legacy-vault/ui/.env.local
VITE_USE_MOCK_LEDGER=true
./scripts/dev-ui.sh
```

The UI labels this **Demo Data Mode**.

## Environment

| Variable | Recommended | Purpose |
|----------|-------------|---------|
| `VITE_USE_MOCK_LEDGER` | `false` | `true` → mock fixtures; `false` → backend API + Canton |
| `VITE_LEGACY_VAULT_API` | `http://localhost:4000` | Product backend base URL |
| `VITE_DAML_JSON_API` | *(unset)* | Optional; Vite proxies `/v1` → `localhost:7575` |
| `VITE_DAML_LEDGER_ID` | `sandbox` | JWT `ledgerId` claim |
| `VITE_DAML_JWT_SECRET` | `secret` | HS256 secret for dev tokens |

## Data flow

```text
React UI  →  Backend API (:4000)  →  Daml JSON API (:7575)  →  Canton sandbox
```

The browser does **not** call Canton directly in live mode. `useVaultScope` fetches `/vaults` from the backend, which queries Canton with server-side JWTs.

## Session → ledger party

| UI login | Ledger party (display name) |
|----------|----------------------------|
| `sarah.m` | `Testator_Sarah` |
| `alex.h` | `Heir_Alex` |
| `oracle@lawfirm` | `Oracle_Sterling` |
| `admin@legacyvault` | `Admin_Trust` |

## Code layout

| Path | Role |
|------|------|
| [`ui/src/lib/api/`](../legacy-vault/ui/src/lib/api/) | Backend API client (auth, vaults, assistant) |
| [`ui/src/lib/ledger/`](../legacy-vault/ui/src/lib/ledger/) | Config, data-mode labels, legacy adapter |
| [`ui/src/components/layout/LedgerScopeBanner.tsx`](../legacy-vault/ui/src/components/layout/LedgerScopeBanner.tsx) | **Live Canton Backend** / **Demo Data Mode** badge |
| [`ui/src/lib/scope/useVaultScope.ts`](../legacy-vault/ui/src/lib/scope/useVaultScope.ts) | Role-scoped vault list (mock or live) |
| [`ui/src/context/ReleaseWorkflowContext.tsx`](../legacy-vault/ui/src/context/ReleaseWorkflowContext.tsx) | Initiate verification / confirm release |

Regenerate bindings after contract changes:

```bash
cd legacy-vault && daml build && daml codegen js
```

## Demo workflow (on-ledger)

1. **`sarah.m`** — Archival Assistant → **Initiate verification** → `InitiateVerification` choice
2. **`oracle@lawfirm`** — vault detail → **Confirm release** → `ConfirmRelease` choice
3. **`alex.h`** — ledger Settlements tab → `SettlementRecord` + `LedgerEvent` rows

## Tests

```bash
./scripts/run-daml-tests.sh
cd legacy-vault/api && npm test
```

## See also

- [`CONTRACT_SPEC.md`](CONTRACT_SPEC.md) — templates, choices, visibility
- [`DAML_SETUP.md`](DAML_SETUP.md) — JDK/Daml install
- [`ASSISTANT.md`](ASSISTANT.md) — Archival Assistant backend
