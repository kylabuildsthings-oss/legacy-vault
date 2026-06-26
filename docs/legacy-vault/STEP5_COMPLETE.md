# Step 5 — Client Screens (Complete)

Polished client-facing screens to match Stitch mockups, with role-scoped content via `useVaultScope` + `redactVault`.

## Screens

| Route | Page | Notes |
|-------|------|-------|
| `/dashboard` | `OverviewPage` | HNWI financial stats + trend; heir/oracle role-specific stat rows; vault grid |
| `/vaults` | `VaultsPage` | Full grid with jurisdiction images; create CTA for HNWI |
| `/vaults/:id` | `VaultDetailPage` | Visibility architecture, asset table, security protocol + hash timestamp |
| `/vaults/new` | `VaultWizardPage` | Step 1 Heirs wizard, privacy table, Archival Assistant sidebar |
| `/security` | `SecurityPage` | Time range toggle, event icons, architecture + access control cards |
| `/ledger` | `LedgerPage` | Stat cards, filter tabs, date select, search |

## New / updated components

```text
src/components/legacy/
  ArchivalAssistant.tsx   # Wizard sidebar (compliance tips)
  FilterTabs.tsx          # Ledger category tabs
  TimeRangeToggle.tsx     # Security log range control
  StatCard.tsx            # Optional trend line (HNWI dashboard)
  VaultCard.tsx           # Jurisdiction gradient via vaultImageFor()

src/lib/mock/vaultImages.ts   # Placeholder vault header images
```

## Role behavior

- **HNWI (`sarah.m`)** — Full totals, trend on assets, create vault, edit/revoke on detail
- **Heir (`alex.h`)** — Allocation-focused stats; redacted vault values and assets
- **Oracle (`oracle@lawfirm`)** — Verification stats; no asset detail until release

All three share the same routes; content is filtered at render time.

## Verify locally

```bash
./scripts/dev-ui.sh
```

1. Log in as `sarah.m` / `vault` — dashboard trend, wizard at `/vaults/new`, full vault detail
2. Log in as `alex.h` — allocation stats, redacted vault cards
3. Log in as `oracle@lawfirm` — verification desk copy, hidden asset rows on detail

## What's next — Step 6

Full admin Stitch layouts:

- Global Vault Registry (filters, bulk actions)
- SOC threat map + incident feed
- Global System Ledger
