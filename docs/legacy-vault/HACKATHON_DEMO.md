# Legacy Vault — Hackathon Demo & Pitch Deck

**Canton Network Hackathon · Multi-track submission (Tracks 1, 2, and 3)**

This document is your single source for:

1. Recording the **3-minute demo video**
2. Building the **presentation deck** (paste slide copy into Google Slides / Canva)
3. Proving **three-track coverage** to judges without inferring from a generic estate-planning pitch

**Repo:** [github.com/kylabuildsthings-oss/legacy-vault](https://github.com/kylabuildsthings-oss/legacy-vault)

---

## Quick reference — demo logins

| Login | Password | Role | Home route |
|-------|----------|------|------------|
| `sarah.m` | `vault` | HNWI (Testator) | `/dashboard` |
| `alex.h` | `vault` | Heir (Beneficiary) | `/dashboard` |
| `oracle@lawfirm` | `vault` | Oracle (Law Firm) | `/dashboard` |
| `admin@legacyvault` | `vault` | Trust Administrator | `/admin` |

**Primary demo vault:** `VLT-001` — *My Will* (Sarah Mitchell · Geneva, CH)

**Public demo (judges, no install):** [legacy-vault-eta.vercel.app/login](https://legacy-vault-eta.vercel.app/login) — Public Demo mode with sample data. Use the local stack below for the **3-minute live Canton video**.

---

## Part 1 — Pre-record checklist

### Environment

- [ ] **Terminal 1:** `./scripts/dev-ledger.sh` (Canton sandbox + JSON API)
- [ ] **Terminal 2:** `./scripts/dev-api.sh` (product backend)
- [ ] **Terminal 3:** `cp legacy-vault/ui/.env.example legacy-vault/ui/.env.local && ./scripts/dev-ui.sh`
- [ ] Confirm UI shows **Live Canton Backend** badge (not Demo Data Mode)
- [ ] Open http://localhost:5173
- [ ] Browser zoom **100%**; hide bookmarks bar
- [ ] Full-screen recording (1080p recommended)

### Reset demo state (before each take)

In **live Canton mode**, release state persists on the ledger. For a clean oracle/heir walkthrough, use a fresh sandbox or reset workflow contracts as needed.

In **mock mode** (`VITE_USE_MOCK_LEDGER=true`), release workflow state persists in `sessionStorage` until logout:

1. Click **Sign out** (clears session + release overrides)
2. Log in fresh as `sarah.m`
3. Confirm VLT-001 shows **pending verification** on oracle desk (unless you already completed Initiate verification in this take)

### Demo flow dependency (order matters)

```text
Archival Assistant "Initiate verification"  →  sets VLT-001 pending (optional if fixture default)
Oracle "Confirm release trigger" on VLT-001  →  required before heir payout + Settlements rows appear
```

If you skip straight to `alex.h` before oracle confirms, you will **not** see beneficiary payout or new settlement ledger rows.

---

## Part 2 — Three-minute video script

**Target length:** 2:30–3:00  
**Closing line:** *"Legacy Vault is one product on Canton that spans all three hackathon tracks—private multi-party visibility, tokenized RWAs, and agent-led settlement."*

| Time | Login | Route | Show | Say (suggested) | Track |
|------|-------|-------|------|-----------------|-------|
| 0:00–0:25 | `sarah.m` | `/dashboard` → `/vaults/VLT-001` | **Tokenized Holdings** table on overview; vault detail **Asset Allocation** with Token ID, Class, Settlement columns | "Sarah's estate holds tokenized real-world assets on Canton—each with a registry ID and settlement lifecycle." | **2** |
| 0:25–0:50 | `sarah.m` | `/vaults/new` | Tokenized asset list; privacy preview **Token registry · CANTON-SYNCED**; **Archival Assistant** chat → suggested prompt or **Initiate verification** | "The Archival Assistant guides vault setup from live Canton context and kicks off cryptographic verification—agentic workflow, not a chatbot wrapper." | **2 + 3** |
| 0:50–1:05 | `sarah.m` then `alex.h` | `/vaults/VLT-001` | **Visibility Architecture** subtitle; heir **black-bar redaction** for other heirs | "Same vault, different truth—Canton selective disclosure. Alex sees only his allocation." | **1** |
| 1:05–1:25 | `oracle@lawfirm` | `/vaults/VLT-001` | Amber **Release verification pending** banner → **Confirm release trigger** | "Sterling Law oracle confirms the release trigger—atomic settlement queues on Canton." | **3** |
| 1:25–1:45 | `alex.h` | `/dashboard` → `/ledger` (Settlements tab) | **Beneficiary payout pending** card; ledger rows: release trigger + payout pending | "Beneficiary sees payout status without seeing the full estate—settlement is role-scoped." | **3** |
| 1:45–2:05 | `sarah.m` or `alex.h` | `/security` | **Release Trigger Confirmed** and **Atomic Settlement Queued** with VERIFIED badges | "Immutable security log—privacy and settlement on one audit trail." | **1 + 3** |
| 2:05–2:30 | `alex.h` vs `oracle@lawfirm` | `/vaults/VLT-001` (split or cut) | Heir: allocation + redaction bar · Oracle: trigger-only, no asset details | "Track 1 privacy and Track 3 settlement in one institutional workflow." | **1** |

### Optional 15-second admin beat

| Login | Route | Show |
|-------|-------|------|
| `admin@legacyvault` | `/admin` | **Pending Releases** queue linking to VLT-001 |

### Judge spot-check (no deck required)

| Question | Answer in UI |
|----------|--------------|
| Where are tokenized assets? | HNWI Tokenized Holdings · wizard asset list · vault detail columns |
| Where is the agent? | Archival Assistant on `/vaults/new` |
| Where is settlement? | Oracle confirm → heir payout card → Ledger **Settlements** tab |
| Where is privacy? | Visibility Architecture · role login contrast · Security Logs |

---

## Part 3 — Three-track coverage matrix

Use this while recording **and** while presenting. Every row maps to **built UI** (Phases A–E).

| Capability | Track | Built UI anchor | Canton capability |
|------------|-------|-----------------|-------------------|
| Role-scoped vault views | **1** | Visibility Architecture; heir redaction bar; four login personas | Selective disclosure |
| Encrypted audit trail | **1** | Security Logs; Last Verified Timestamp + hash checkmark | Private ledger integrity |
| Multi-party permissions subtitle | **1** | *Verification of multi-party cryptographic permissions across the ledger.* | Privacy model |
| Token ID + asset class + settlement status | **2** | TokenizedHoldingsTable; AssetAllocationTable columns | Tokenized RWA registry |
| Wizard token registry row | **2** | Privacy preview **CANTON-SYNCED ✓** | On-chain asset registration |
| Tokenized asset list in wizard | **2** | NFT-7721, TKN-9004 on `/vaults/new` | RWA / NFT coordination |
| Archival Assistant + Initiate verification | **3** | ArchivalAssistant sidebar | Agentic workflow initiation |
| Oracle confirm release | **3** | ReleaseConfirmBanner on VLT-001 | Multi-party trigger |
| Beneficiary payout pending | **3** | BeneficiaryPayoutCard on heir dashboard / vault detail | Settlement queue |
| Settlements ledger tab | **3** | Ledger → **Settlements** filter | Atomic settlement events |
| Settlement security events | **3** | Security Logs after release confirm | Cross-party verification |

### Hackathon track hero table (deck Slide 4 — copy verbatim)

| Track | Hackathon theme | Legacy Vault delivers | UI proof (demo moment) |
|-------|-----------------|----------------------|------------------------|
| **1** | Private DeFi & Capital Markets | Multi-party privacy — testator, heir, oracle see different vault truth | Visibility Architecture; heir redaction bar; Security Logs |
| **2** | TradeFi, RWA & Tokenized Assets | Tokenized estate holdings with registry IDs and settlement lifecycle | Tokenized Holdings table; wizard asset list; Token ID / Class / Settlement columns |
| **3** | Payments, Neobanking & Agentic Commerce | Agent-guided vault setup + oracle-triggered atomic beneficiary settlement | Archival Assistant → Initiate verification; Confirm release; Settlements ledger + payout card |

**Speaker note:** *"We're not picking one track—we built one institutional workflow where privacy, tokenization, and agent-led settlement are all required."*

---

## Part 4 — Pitch deck outline

Paste each slide block into your deck tool. **Track badges** show which hackathon tracks each slide supports.

---

### Slide 1 — Legacy Vault

**Tracks:** 1 · 2 · 3

**Headline:** Legacy Vault

**Subhead:** Private on-chain will & trust management on Canton Network

**Bullets:**

- Institutional-grade vaults for HNWIs, heirs, oracles, and trust administrators
- One product spanning **privacy**, **tokenized RWAs**, and **agentic settlement**
- Canton Network Hackathon — multi-track submission

**Speaker note:** Name all three tracks in the first 30 seconds.

---

### Slide 2 — The problem

**Tracks:** — (setup)

**Headline:** Wealth transfer is a visibility and coordination problem

**Bullets:**

- HNWI estates combine illiquid RWAs, multiple heirs, and regulated oracles
- Public blockchains expose what institutions must keep confidential
- $1T+ wealth transfer market lacks atomic, privacy-preserving settlement
- Reference: [Forbes — A Digital Tightrope](https://www.forbes.com/councils/forbesbusinesscouncil/2025/02/18/a-digital-tightrope-the-hidden-risks-of-wealth-and-visibility/)

**Speaker note:** Problem is commercial and institutional—not "crypto wills" gimmick.

---

### Slide 3 — Our solution

**Tracks:** 1 · 2 · 3

**Headline:** Four parties, one Canton workflow

**Bullets:**

| Party | Role | Sees |
|-------|------|------|
| **Testator** (Sarah) | HNWI | Full vault, all assets and heirs |
| **Heir** (Alex) | Beneficiary | Own allocation only |
| **Oracle** (Sterling Law) | Trigger party | Release workflow, no asset details until trigger |
| **Admin** | Trust manager | Institutional oversight |

**Speaker note:** Point to [`ROLE_VISIBILITY_MATRIX.md`](ROLE_VISIBILITY_MATRIX.md) for detail.

---

### Slide 4 — Three tracks, one product (HERO SLIDE)

**Tracks:** 1 · 2 · 3

**Headline:** Three tracks, one product

**Body:** Use the **Hackathon track hero table** from Part 3 above as a three-column layout.

**Speaker note:** *"We're not picking one track—we built one institutional workflow where privacy, tokenization, and agent-led settlement are all required."*

---

### Slide 5 — Track 1: Private DeFi & Capital Markets

**Tracks:** 1

**Headline:** Selective disclosure by design

**Bullets:**

- Visibility Architecture visualizes who sees what on the ledger
- Heir view: allocation + **redacted** other beneficiaries (black-bar mockup fidelity)
- Oracle view: trigger-only until release conditions met
- Security Logs: VERIFIED integrity badges on immutable audit trail
- Zero-knowledge framing: testator sees full structure; others verify without exposure

**Demo moment:** `alex.h` vs `oracle@lawfirm` on `/vaults/VLT-001`

---

### Slide 6 — Track 2: Tokenized RWAs

**Tracks:** 2

**Headline:** Real-world assets with Canton registry semantics

**Bullets:**

- Token IDs on every holding (e.g. NFT-7721 Primary Residence, TKN-9004 Portfolio)
- Asset classes: RWA · NFT · Security
- Settlement lifecycle: registered → pending_release → settled
- HNWI **Tokenized Holdings** dashboard—Track 2 visible without opening a vault
- Wizard privacy row: **Token registry · CANTON-SYNCED ✓**

**Demo moment:** `sarah.m` → `/dashboard` Tokenized Holdings → `/vaults/VLT-001` asset table

**Speaker note:** Ground in commercial estate holdings—not tokenization for its own sake.

---

### Slide 7 — Track 3: Agentic settlement

**Tracks:** 3

**Headline:** Agent-guided setup, oracle-confirmed release

**Bullets:**

- **Archival Assistant** on vault wizard—heir design, RWA, and verification prompts (backend + Canton context)
- **Initiate verification** → notifies oracle, sets release to pending
- Oracle **Confirm release trigger** → atomic settlement queued
- Heir **Beneficiary payout pending** + Ledger **Settlements** tab
- Security events: Release Trigger Confirmed · Atomic Settlement Queued

**Demo moment:** `/vaults/new` → oracle confirm → `alex.h` ledger Settlements

**Speaker note:** Assistant answers from role-scoped Canton data via the backend (deterministic engine). Optional LLM/RAG is planned — see [ASSISTANT_RAG_PLAN.md](ASSISTANT_RAG_PLAN.md).

---

### Slide 8 — Live demo map

**Tracks:** 1 · 2 · 3

**Headline:** Demo walkthrough (3 minutes)

| Deck / video beat | Timestamp | Login | Screen |
|-------------------|-----------|-------|--------|
| Track 2 — RWAs | 0:00–0:25 | `sarah.m` | Tokenized Holdings + vault asset columns |
| Track 2 + 3 — Agent | 0:25–0:50 | `sarah.m` | `/vaults/new` + Archival Assistant |
| Track 1 — Privacy | 0:50–1:05 | `sarah.m` / `alex.h` | Visibility Architecture on VLT-001 |
| Track 3 — Settlement | 1:05–1:45 | `oracle@lawfirm` → `alex.h` | Confirm release → payout + Settlements |
| Track 1 + 3 — Audit | 1:45–2:30 | any | Security Logs + role contrast |

**Placeholder:** Add 2–3 screenshots from localhost recording.

---

### Slide 9 — Architecture on Canton

**Tracks:** 1 · 2 · 3

**Headline:** Canton Network fit

**Bullets:**

- **Privacy:** multi-party workflows with selective disclosure (Track 1)
- **Tokenization:** RWA registry and settlement status per asset (Track 2)
- **Atomic settlement:** single release trigger coordinates beneficiary payout (Track 3)
- **Daml smart contracts:** party-scoped visibility (testator, heir, oracle, admin) — **built on Canton sandbox**
- **Backend API:** auth, vaults, assistant, release — **built** (`legacy-vault/api`)
- References: [Canton docs](https://docs.canton.network/) · [Daml docs](https://docs.daml.com/)

**Speaker note:** Contracts and backend run on the local Canton sandbox for the product demo; Canton DevNet proof is Encode Seaport deploy + create on **5N Sandbox** (hosted UI is not wired to DevNet).

---

### Slide 10 — What's built today

**Tracks:** — (honesty)

**Headline:** Demo-ready product on Canton sandbox

| Layer | Status |
|-------|--------|
| React UI — role scoping, release workflow, Track 1–3 screens | **Built** |
| Daml contracts on Canton sandbox (`Vault.daml`) | **Built** |
| Backend API — auth, vaults, assistant, release, rename | **Built** |
| UI → backend → Canton (live mode) | **Built** |
| Archival Assistant (deterministic + Canton context) | **Built** |
| API tests (42 passing) + Daml Script tests (5) | **Built** |
| Optional LLM/RAG assistant provider | **Roadmap** |
| Canton Network DevNet (Seaport → 5N Sandbox) | **Done** — DAR deploy + `VaultAgreement` create; UI→DevNet wiring is roadmap |

**Speaker note:** Judges see a working Canton-backed product. Mock mode remains available for UI-only demos and is clearly labelled **Demo Data Mode**.

---

### Slide 11 — Why Legacy Vault wins

**Tracks:** — (judging criteria)

**Headline:** Judging criteria alignment

| Criterion | How we deliver |
|-----------|----------------|
| **Technical execution** | Daml contracts + Canton sandbox; backend API with 42 tests; role-scoped UI; **Live Canton Backend** badge in live mode |
| **Originality** | Estate planning on Canton—not another generic DeFi app |
| **UX & design** | Stitch-aligned institutional UI; persistent live/demo mode badges; privacy visualization judges can see |
| **Real-world applicability** | HNWI / trust company workflow; Forbes-cited visibility problem |

---

### Slide 12 — Ask & links

**Headline:** Legacy Vault on Canton

**Bullets:**

- **GitHub:** [github.com/kylabuildsthings-oss/legacy-vault](https://github.com/kylabuildsthings-oss/legacy-vault)
- **Demo video:** *(add link after recording — update README For judges section and submission table)*
- **Live product:** [legacy-vault-eta.vercel.app/login](https://legacy-vault-eta.vercel.app/login) (Public Demo)
- **Contact / team:** *(your details)*

**Footer line (optional):** *Secured by Private Ledger* — matches app shell footer.

---

## Part 5 — Submission checklist

From Canton Network Hackathon requirements:

| Requirement | Status | Action |
|-------------|--------|--------|
| Public repository | ✅ | [kylabuildsthings-oss/legacy-vault](https://github.com/kylabuildsthings-oss/legacy-vault) |
| Canton DevNet (not LocalNet-only) | ✅ | Seaport → 5N Sandbox — DAR + `VaultAgreement` (see README) |
| Presentation deck | 🔄 | Build from Part 4; include Slide 4 hero table |
| 3-minute video pitch w/ demo | 🔄 | Record using Part 2; hit all three tracks on screen |
| Link to live product | ✅ | [legacy-vault-eta.vercel.app/login](https://legacy-vault-eta.vercel.app/login) |

### Before you submit

- [ ] Deck Slide 4 names Tracks 1, 2, and 3 explicitly
- [ ] Video shows Track 2 (tokenized holdings) in first 30 seconds
- [ ] Video shows oracle confirm **before** heir payout
- [ ] Video mentions or shows Archival Assistant (Track 3 agent)
- [ ] Video shows Visibility Architecture / role contrast (Track 1)
- [ ] Slide 10 honesty slide included (built vs roadmap)
- [ ] Video shows **Live Canton Backend** badge (or explain Demo Data Mode if recording mock)
- [ ] `npm run build` passes in `legacy-vault/ui`

### After recording — update README

Replace the video placeholder in README **For judges** and **Hackathon submission** with your YouTube/Loom URL, then push to `main`.

---

## Part 6 — Route map (screenshot reference)

| Route | Primary tracks | Key UI |
|-------|----------------|--------|
| `/dashboard` | 1, 2, 3 | Tokenized Holdings (HNWI); payout card (heir); oracle desk |
| `/vaults` | 1, 2 | Vault cards with jurisdiction imagery |
| `/vaults/VLT-001` | 1, 2, 3 | Visibility Architecture; asset columns; release banner (oracle) |
| `/vaults/new` | 2, 3 | Tokenized assets; Archival Assistant; Initiate verification |
| `/ledger` | 3 | **Settlements** tab after release confirm |
| `/security` | 1, 3 | Release / settlement events with VERIFIED badges |
| `/admin` | 1, 3 | Pending Releases queue |

---

## Related docs

- [`ROLE_VISIBILITY_MATRIX.md`](ROLE_VISIBILITY_MATRIX.md) — role × visibility detail
- [`STEP6_ADMIN_COMPLETE.md`](STEP6_ADMIN_COMPLETE.md) — admin drill-down routes
- Hackathon context brief — local copy: `deepseek_markdown_20260627_ebbb55.md`

---

*Last updated: live-mode-first docs + UI data-mode badges for Canton Network Hackathon multi-track submission.*
