# Legacy Vault

Private on-chain will & trust management — Daml-first frontend with four role-scoped views.

**Step 1: complete.** See [docs/legacy-vault/STEP1_COMPLETE.md](docs/legacy-vault/STEP1_COMPLETE.md).

## Workspace layout

```text
LEGACYVAULT/
├── legacy-vault/
│   ├── daml/              # Daml contracts (Step 2 — deferred)
│   └── ui/                # React + Vite frontend
├── linkup_mcp/            # Cursor MCP + RAG (fork)
├── decentralized-will-management/  # UI reference only
├── docs/legacy-vault/     # Project docs
└── scripts/               # dev-ui.sh, setup-shadcn.sh
```

## Quick start

```bash
./scripts/dev-ui.sh
```

Open http://localhost:5173 — Legacy Vault login screen.

## Build steps (one at a time)

| Step | Status | Description |
|------|--------|-------------|
| 1 | **Done** | Workspace scaffold + UI toolchain |
| 2 | Deferred | Daml SDK + `Vault.daml` stubs |
| 3 | **Done** | shadcn + Stitch design system |
| 4 | **Done** | Auth, dual shells, four roles — see [STEP4_COMPLETE.md](docs/legacy-vault/STEP4_COMPLETE.md) |
| 5 | **Done** | Client screens (Stitch layouts) — see [STEP5_COMPLETE.md](docs/legacy-vault/STEP5_COMPLETE.md) |
| 6 | **Done** | Admin drill-down (client + vault detail) — see [STEP6_ADMIN_COMPLETE.md](docs/legacy-vault/STEP6_ADMIN_COMPLETE.md) |
| 6 polish | Later | Registry filters, SOC threat map, bulk actions |
| 7 | Pending | linkup_mcp corpus + RAG help |

## Prerequisites

| Tool | Required for | Status |
|------|--------------|--------|
| Node.js 18+ | UI | Installed |
| npm | UI deps | Installed |
| Daml SDK | Step 2 | Not installed yet |
| Java 11+ | Daml runtime | Not installed yet |
| uv + Ollama | Step 7 MCP RAG | Optional |

Details: [docs/legacy-vault/PREREQUISITES.md](docs/legacy-vault/PREREQUISITES.md)

## Demo accounts

| User ID | Password | Role |
|---------|----------|------|
| `sarah.m` | `vault` | HNWI |
| `alex.h` | `vault` | Heir |
| `oracle@lawfirm` | `vault` | Oracle |
| `admin@legacyvault` | `vault` | Trust Administrator |

## Full stack (after Step 2)

```bash
# Terminal 1
cd legacy-vault && daml start

# Terminal 2
./scripts/dev-ui.sh
```
