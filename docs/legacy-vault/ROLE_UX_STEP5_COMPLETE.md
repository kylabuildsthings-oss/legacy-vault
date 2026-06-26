# Role UX Patch — Step 5 (Complete)

Simplified demo cast and added **Client** columns to SOC and ledger tables.

## Step 5A — Mock cast cleanup

**File:** `legacy-vault/ui/src/lib/mock/fixtures.ts`

- Removed **James Mitchell** from VLT-001 (My Will) — two heirs only
- Rebalanced allocations: Alex Henderson 60%, Maya Mitchell 40%
- Renamed unrelated testator **James Anderson → William Anderson** (VLT-004 + admin client list)

### Demo cast

```text
Sarah Mitchell (HNWI — sarah.m)
  ├── Alex Henderson — primary heir (login: alex.h)
  └── Maya Mitchell — secondary heir

William Anderson (separate client)
  └── Sam Anderson — sole heir
  └── Vault: Primary Estate Will (VLT-004)
```

## Step 5B — Client column on tables

**Helpers:** `testatorNameByVaultId()`, `vaultNameByVaultId()` in `vaultDisplay.ts`

| Page | Column order |
|------|----------------|
| Admin SOC | Timestamp · **Client** · Vault · Event Type · Status |
| Admin Ledger | Timestamp · **Client** · Vault · Type · Status |
| Client Security | Timestamp · **Client** · Event Type · Target Asset · Integrity |
| Client Ledger | Timestamp · **Client** · Vault · Action · Status |

Client ledger search includes testator name.

## Verify locally

```bash
./scripts/dev-ui.sh
```

| Login | Check |
|-------|-------|
| `sarah.m` / `vault` | My Will shows Alex + Maya only (no James Mitchell) |
| `alex.h` / `vault` | Testator Sarah Mitchell; 1 other heir [redacted] |
| `oracle@lawfirm` / `vault` | Client desk: Sarah Mitchell + William Anderson |
| `admin@legacyvault` / `vault` | SOC + Ledger show **Client** column |

Build: `npm run build` in `legacy-vault/ui/`
