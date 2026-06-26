# Step 4 complete — Auth, routing, dual shells

## Checklist

- [x] `AuthContext` + `useAuth()` — login, logout, session persistence
- [x] `RoleGuard` — route protection by role
- [x] `ClientShell` — OVERVIEW | VAULTS | LEDGER | SECURITY
- [x] `AdminShell` — CLIENTS | VAULTS | SECURITY | LEDGER
- [x] Mock fixtures — Sarah's 3 vaults, Alex as heir, oracle assignments
- [x] `useVaultScope` + `redactVault` — role-filtered data
- [x] `VisibilityArchitecture` on vault detail
- [x] Client + admin route trees wired

## Demo logins — what each role sees

| User ID | Password | Home | Vaults visible |
|---------|----------|------|----------------|
| `sarah.m` | `vault` | `/dashboard` | 3 (full) |
| `alex.h` | `vault` | `/dashboard` | 2 (allocation only) |
| `oracle@lawfirm` | `vault` | `/dashboard` | 2 (trigger only, no assets) |
| `admin@legacyvault` | `vault` | `/admin` | All (admin registry) |

## Try role scoping

1. Sign in as **sarah.m** → open `VLT-001` → full Visibility Architecture + assets
2. Sign out → **alex.h** → same vault → heirs redacted, own allocation only
3. Sign out → **oracle@lawfirm** → `VLT-001` → no asset table, trigger view
4. Sign out → **admin@legacyvault** → Global Vault Registry at `/admin/vaults`

## Key files

```text
src/context/AuthContext.tsx
src/components/layout/ClientShell.tsx
src/components/layout/AdminShell.tsx
src/components/layout/RoleGuard.tsx
src/lib/mock/fixtures.ts
src/lib/scope/useVaultScope.ts
src/lib/scope/redactVault.ts
src/components/legacy/VisibilityArchitecture.tsx
```

## What's next — Step 5

Polish client screens to match Stitch mockups pixel-for-pixel:
- Full HNWI overview
- Vault creation wizard (Step 1 Heirs + Archival Assistant)
- Richer vault detail, security, ledger layouts

Step 6 expands admin screens (SOC threat map, registry filters, etc.).
