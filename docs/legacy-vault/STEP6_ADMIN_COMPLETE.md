# Step 6 — Admin drill-down (Complete)

Trust Manager can navigate from Client Directory into client profiles and full read-only vault detail.

## Routes

| Route | Page |
|-------|------|
| `/admin` | Trust Manager Dashboard + Client Directory |
| `/admin/clients/:testatorId` | Client profile + assigned vaults |
| `/admin/vaults` | Global Vault Registry |
| `/admin/vaults/:id` | Admin vault detail (full visibility) |
| `/admin/security` | SOC |
| `/admin/ledger` | Global System Ledger |

## New files

```text
src/pages/admin/AdminClientDetailPage.tsx
src/pages/admin/AdminVaultDetailPage.tsx
```

## Behavior

- **Client Directory** — client names link to `/admin/clients/{id}`
- **Client detail** — vault list with links to admin vault detail; empty state for clients with no vaults (e.g. Maria Gonzalez)
- **Global Vault Registry** — vault ID and name link to `/admin/vaults/{id}`
- **Admin vault detail** — full assets, heirs, visibility architecture (admin branch); read-only; back to client or registry
- **VisibilityArchitecture** — admin role shows institutional oversight with all cards unlocked

## Verify locally

```bash
./scripts/dev-ui.sh
```

Log in as `admin@legacyvault` / `vault`:

1. Click **Sarah Mitchell** → 3 vaults → open **My Will** → full detail
2. Click **William Anderson** → VLT-004 → vault detail
3. **VAULTS** nav → click any registry row → vault detail

Build: `npm run build` in `legacy-vault/ui/`

## What's next

- Admin polish: registry filters, SOC threat map, bulk actions
- Step 2: Daml contracts
- Step 7: linkup_mcp RAG help
