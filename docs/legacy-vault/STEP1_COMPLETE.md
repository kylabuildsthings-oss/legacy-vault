# Step 1 complete — workspace scaffolding

## Checklist

- [x] `linkup_mcp/` fork cloned
- [x] `decentralized-will-management/` reference cloned
- [x] `legacy-vault/ui/` — Vite + React + TypeScript
- [x] `legacy-vault/daml/` — placeholder for Step 2 (deferred)
- [x] `npm install` in `legacy-vault/ui/`
- [x] Dev server runs at http://localhost:5173
- [x] Login page (Legacy Vault branding — expanded in Steps 3–5)
- [x] `docs/legacy-vault/PREREQUISITES.md`
- [x] `docs/legacy-vault/ROLE_VISIBILITY_MATRIX.md`
- [x] `scripts/setup-shadcn.sh` (run in Step 3)
- [x] `scripts/dev-ui.sh`

## Start the UI

From anywhere (recommended on external SSD):

```bash
"/Volumes/KYE SSD 2023/LEGACYVAULT/scripts/dev-ui.sh"
```

Or manually:

```bash
cd "/Volumes/KYE SSD 2023/LEGACYVAULT/legacy-vault/ui"
npm run dev
```

If you see `ENOENT: uv_cwd`, open a **new terminal tab** and use the full path above — the shell lost track of the volume.

## Demo logins (preview auth — full role routing in Step 4)

| User ID | Password | Role |
|---------|----------|------|
| `sarah.m` | `vault` | HNWI (Testator) |
| `alex.h` | `vault` | Heir |
| `oracle@lawfirm` | `vault` | Oracle |
| `admin@legacyvault` | `vault` | Trust Administrator |

## Prerequisites not required for Step 1

| Tool | When needed |
|------|-------------|
| Daml SDK + Java 11+ | Step 2 (deferred) |
| uv + Ollama | Step 7 (linkup_mcp RAG) |

## What's next — Step 3

1. Run `scripts/setup-shadcn.sh`
2. Map Stitch design tokens (`#C49B6C`, Space Mono, Inter) onto shadcn
3. Build shared components: `StatCard`, `VaultCard`, `StatusBadge`, `DataTable`

Step 4 follows: `ClientShell`, `AdminShell`, `RoleGuard`, mock fixtures, `useVaultScope`.
