# UI ↔ Daml JSON API integration

Wire the React UI to a running **Daml sandbox** (`./scripts/dev-ledger.sh`) for hackathon judging (“does it work on-ledger?”).

## Quick start

**Terminal 1** — ledger + JSON API:

```bash
export JAVA_HOME="$HOME/.jdk/jdk-17.0.19+10/Contents/Home"
export PATH="$JAVA_HOME/bin:$HOME/.daml/bin:$PATH"
./scripts/dev-ledger.sh
```

**Terminal 2** — UI against ledger:

```bash
cp legacy-vault/ui/.env.example legacy-vault/ui/.env.local
# Edit: VITE_USE_MOCK_LEDGER=false
./scripts/dev-ui.sh
```

Login with demo users (`vault` password). **VLT-001** is seeded on `daml start`; other fixture vaults exist only in mock mode.

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_USE_MOCK_LEDGER` | `true` | `false` → query JSON API |
| `VITE_DAML_JSON_API` | `http://localhost:7575` | HTTP JSON API base URL |
| `VITE_DAML_LEDGER_ID` | `sandbox` | JWT `ledgerId` claim |
| `VITE_DAML_JWT_SECRET` | `secret` | HS256 secret for dev tokens |

## Session → ledger party

| UI login | Ledger party (display name) |
|----------|----------------------------|
| `sarah.m` | `Testator_Sarah` |
| `alex.h` | `Heir_Alex` |
| `oracle@lawfirm` | `Oracle_Sterling` |
| `admin@legacyvault` | `Admin_Trust` |

Dev JWTs bootstrap with display names for `/v1/parties`, then resolve to **full party ids** for `actAs` / ledger queries (required by JSON API).

## Code layout

| Path | Role |
|------|------|
| [`ui/src/lib/ledger/`](../legacy-vault/ui/src/lib/ledger/) | Adapter: auth, queries, commands |
| [`ui/src/lib/scope/useVaultScope.ts`](../legacy-vault/ui/src/lib/scope/useVaultScope.ts) | Role-scoped vault list (mock or ledger) |
| [`ui/src/context/ReleaseWorkflowContext.tsx`](../legacy-vault/ui/src/context/ReleaseWorkflowContext.tsx) | Initiate verification / confirm release |
| [`ui/src/generated/daml.js/`](../legacy-vault/ui/src/generated/daml.js/) | `daml codegen js` output (gitignored) |

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
```

Five visibility/workflow scripts in `daml/Scripts/Tests.daml`.

## See also

- [`CONTRACT_SPEC.md`](CONTRACT_SPEC.md) — templates, choices, visibility
- [`DAML_SETUP.md`](DAML_SETUP.md) — JDK/Daml install
