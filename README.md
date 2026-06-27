# Legacy Vault

**Private on-chain will & trust management on Canton Network**

Legacy Vault is an institutional-grade vault platform for high-net-worth estate planning. Testators, heirs, and oracles each see a different view of the same vault—Canton-style selective disclosure—while tokenized real-world assets (RWAs) register on a shared ledger and an AI assistant guides setup. When release conditions are met, a trusted oracle confirms the trigger and atomic beneficiary settlement queues on Canton.

HNWI wealth transfer needs privacy, tokenized asset coordination, and trusted release—not public blockchain exposure. See [Forbes: A Digital Tightrope](https://www.forbes.com/councils/forbesbusinesscouncil/2025/02/18/a-digital-tightrope-the-hidden-risks-of-wealth-and-visibility/) for context on the visibility problem.

**Canton Network Hackathon — multi-track submission (Tracks 1, 2, and 3)**

---

## What Legacy Vault does

Four parties, one workflow:

| Role | What they do in the product |
|------|----------------------------|
| **Testator (HNWI)** | Create vaults, register tokenized assets, designate heirs |
| **Heir** | See own allocation only; payout status after release |
| **Oracle (Law firm)** | Trigger oversight; confirm release without seeing asset details |
| **Trust Administrator** | Institutional oversight, pending releases queue |

---

## Canton Network Hackathon — three tracks

| Track | Theme | Legacy Vault delivers | See in UI |
|-------|-------|----------------------|-----------|
| **1** | Private DeFi & Capital Markets | Multi-party privacy, role-scoped views | Visibility Architecture, Security Logs |
| **2** | TradeFi, RWA & Tokenized Assets | Token IDs, asset classes, settlement status | Tokenized Holdings, vault asset columns |
| **3** | Payments & Agentic Commerce | Archival Assistant, oracle release, settlement ledger | `/vaults/new`, Confirm release, Settlements tab |

*One institutional workflow—not three separate demos.*

### Key features (demo-ready UI)

- Role-scoped dashboards (HNWI, Heir, Oracle, Admin shells)
- Tokenized Holdings + Canton registry columns (Token ID, Class, Settlement)
- Visibility Architecture with heir redaction visualization
- Archival Assistant (OpenClaw) with Initiate verification
- Release workflow: oracle confirm → beneficiary payout → Settlements ledger + Security Logs
- Admin pending releases queue

### Demo-ready vs roadmap

| Layer | Status |
|-------|--------|
| React UI + mock release workflow | **Built** |
| Daml setup docs + readiness scripts | **Built** — [DAML_SETUP.md](docs/legacy-vault/DAML_SETUP.md) |
| Daml contracts on Canton | Roadmap (backend teammate) |
| Cursor MCP + local RAG (linkup_mcp 7A) | **Local dev tooling** — see [LINKUP_MCP.md](docs/legacy-vault/LINKUP_MCP.md) |
| Live RAG in Archival Assistant (7B) | Roadmap |
| Deployed URL | Submission task |

---

## Quick start

```bash
./scripts/dev-ui.sh
```

Open http://localhost:5173 — Legacy Vault login screen.

### Demo accounts

Password for all accounts: `vault`

| User ID | Role | Home route |
|---------|------|------------|
| `sarah.m` | HNWI (Testator) | `/dashboard` |
| `alex.h` | Heir (Beneficiary) | `/dashboard` |
| `oracle@lawfirm` | Oracle (Law Firm) | `/dashboard` |
| `admin@legacyvault` | Trust Administrator | `/admin` |

**Primary demo vault:** `VLT-001` — *My Will* (Sarah Mitchell · Geneva, CH)

**Suggested demo flow:**

1. `sarah.m` → Tokenized Holdings on dashboard → `/vaults/new` wizard + Archival Assistant
2. `oracle@lawfirm` → `/vaults/VLT-001` → **Confirm release trigger**
3. `alex.h` → Beneficiary payout card → Ledger **Settlements** tab

Sign out between recording takes to reset release workflow state.

**Full demo script & pitch deck outline:** [docs/legacy-vault/HACKATHON_DEMO.md](docs/legacy-vault/HACKATHON_DEMO.md)

---

## Hackathon submission

| Deliverable | Status |
|-------------|--------|
| Public repository | [github.com/kylabuildsthings-oss/legacy-vault](https://github.com/kylabuildsthings-oss/legacy-vault) |
| Presentation deck | Add link when ready |
| 3-minute demo video | Add link when ready |
| Live product URL | Add link when deployed |

---

## For developers

### Workspace layout

```text
LEGACYVAULT/
├── legacy-vault/
│   ├── daml/              # Daml contracts (Step 2 — deferred)
│   └── ui/                # React + Vite frontend
├── linkup_mcp/            # Cursor MCP + RAG (gitignored locally)
├── decentralized-will-management/  # UI reference only
├── docs/legacy-vault/     # Project docs
└── scripts/               # dev-ui.sh, setup-daml.sh, sync-rag-corpus.sh
```

### Project status

| Area | Status |
|------|--------|
| UI (Steps 1, 3–6) + hackathon tracks UI | Done |
| Hackathon demo doc | Done — [HACKATHON_DEMO.md](docs/legacy-vault/HACKATHON_DEMO.md) |
| Daml backend onboarding | Done — [DAML_SETUP.md](docs/legacy-vault/DAML_SETUP.md) · `./scripts/setup-daml.sh` |
| Daml contracts (Step 2) | Pending — backend teammate |
| linkup_mcp RAG (Step 7A) | Local setup — [LINKUP_MCP.md](docs/legacy-vault/LINKUP_MCP.md) · `./scripts/sync-rag-corpus.sh` |
| In-app live RAG (Step 7B) | Roadmap |

Step completion details: [STEP1_COMPLETE.md](docs/legacy-vault/STEP1_COMPLETE.md) · [STEP4_COMPLETE.md](docs/legacy-vault/STEP4_COMPLETE.md) · [STEP5_COMPLETE.md](docs/legacy-vault/STEP5_COMPLETE.md) · [STEP6_ADMIN_COMPLETE.md](docs/legacy-vault/STEP6_ADMIN_COMPLETE.md)

Role visibility matrix: [ROLE_VISIBILITY_MATRIX.md](docs/legacy-vault/ROLE_VISIBILITY_MATRIX.md)

### Scripts

| Script | Purpose |
|--------|---------|
| `./scripts/dev-ui.sh` | Start React UI at http://localhost:5173 |
| `./scripts/setup-daml.sh` | Check Java + Daml SDK readiness (backend) |
| `./scripts/sync-rag-corpus.sh` | Copy vault docs into local `linkup_mcp/data/` for RAG |

### Cursor MCP + RAG (optional, local only)

The UI demo uses a **scripted** Archival Assistant. For document Q&A while building, set up **linkup_mcp** locally (gitignored — not in this repo):

1. Clone or restore `linkup_mcp/` beside this project
2. `ollama pull llama3.2` · `cd linkup_mcp && uv sync --python 3.12`
3. `./scripts/sync-rag-corpus.sh`
4. Configure `~/.cursor/mcp.json` — see [PREREQUISITES.md](docs/legacy-vault/PREREQUISITES.md)

Full guide: [LINKUP_MCP.md](docs/legacy-vault/LINKUP_MCP.md)

### Prerequisites

| Tool | Required for | Status |
|------|--------------|--------|
| Node.js 18+ | UI | Installed |
| npm | UI deps | Installed |
| Daml SDK | Step 2 | Not installed yet |
| Java 11+ | Daml runtime | Not installed yet |
| uv + Ollama + `llama3.2` | Step 7A MCP RAG (local) | Optional — see [LINKUP_MCP.md](docs/legacy-vault/LINKUP_MCP.md) |

Details: [docs/legacy-vault/PREREQUISITES.md](docs/legacy-vault/PREREQUISITES.md)

**Daml backend (teammate):** [DAML_SETUP.md](docs/legacy-vault/DAML_SETUP.md) · run `./scripts/setup-daml.sh`

### Full stack (after Step 2)

```bash
# Terminal 1
cd legacy-vault && daml start

# Terminal 2
./scripts/dev-ui.sh
```
